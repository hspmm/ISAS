import { Component, OnInit, ɵConsole, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SettingsService } from 'src/app/shared/settings/settings.service';
import { MatDialog, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';
import { PrivilegesService } from 'src/app/shared/privileges/privileges.service';
import { LdapInfo } from 'src/app/shared/ldapgroup/ldap-info';
import { ImprivataInfo } from 'src/app/shared/imprivata/imprivata-info';
import { LdapGroupService } from 'src/app/shared/ldapgroup/ldapgroup.service';
import { ImprivataService } from 'src/app/shared/imprivata/imprivata.service';
import { ConfirmDialogModel, ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';
import { LockoutInfo, GeneralConfig } from 'src/app/shared/settings/settings-info';
import { DownloadDialogComponent } from 'src/app/download-dialog/download-dialog.component';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  notificationUrl: string="";
  notificationPluginUrl: any;

  showMessagePopup: any;

  selectedTabIndex:number=0;

  generalSettingsForm: FormGroup;

  imprivataInfoForm:FormGroup;

  ldapInfoForm:FormGroup;

  securityModel: string;

  applicationList: any[];

  selectedApplicationVersion: any[];

  selectedApplicationPrivileges: any[];

  availableDomain:LdapInfo[]=[];

  availableImprivata: ImprivataInfo[]

  selectedApplicationId:number=0;
  selectedVersionId:number=0;
  selectedPrivilegeId:number=0;

  generalConfig:GeneralConfig=new GeneralConfig();
 
  labelFile: string ='Choose file';
  fileToUpload: File = null;
  
  displayedColumns: string[] = [ 'ipaddress','datetime'];
  tableDataSource: MatTableDataSource<LockoutInfo>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  lockoutList:LockoutInfo[] = [];

  sslValidator = function(formControl:FormControl) {
    const isSSL: boolean = formControl.get('IsSSL').value; 
    if(isSSL !=false){
      
    }
    formControl.get('ConfirmPassword').setErrors({ 'mismatch': true });    
  }

  constructor(private fb: FormBuilder,private settingsService: SettingsService,public dialog: MatDialog,private spinner: NgxSpinnerService, private privilegeService:PrivilegesService,private ldapService:LdapGroupService, private imprivataService:ImprivataService,private sanitizer : DomSanitizer) {
   
    this.settingsService.getNotificationInfo((res:any,err)=>{
      if(err){
      }
      else{    
        //this.notificationUrl= "http://localhost:4205/notificationmanager/notificationviewer?hide_sidebar=true&msg_app_key=ISAS";
        //console.log("Notification Response- ", res);
        this.notificationUrl=res+"/notificationmanager/notificationviewer?hide_sidebar=true&msg_app_key=ISAS";
        this.sanitizer.bypassSecurityTrustResourceUrl(this.notificationUrl);
        this.notificationPluginUrl =  this.sanitizer.bypassSecurityTrustResourceUrl(this.notificationUrl);
      }
    });

    this.generalSettingsForm = this.fb.group({
      DefaultLockout: new FormControl(''),
      MaxRetries: new FormControl(''),
      MaxLoginAttempts: new FormControl('')
    });    

    this.imprivataInfoForm = this.fb.group({
      ConfigName: new FormControl('', Validators.required),
      HostName: new FormControl('', Validators.required),
      PortNumber: new FormControl('',Validators.compose([Validators.required,Validators.pattern('[0-9]+')])),
      APIPath: new FormControl('', Validators.required),
      APIVersion: new FormControl('', Validators.required),
      ProductCode: new FormControl('', Validators.required),
      SslSelected:new FormControl('') 
    }); 

    
    this.ldapInfoForm = this.fb.group({
      HostName: new FormControl('', Validators.required),
      PortNumber: new FormControl('',Validators.compose([Validators.required,Validators.pattern('[0-9]+')])),
      Domain: new FormControl('', Validators.required),
      AdminUsername: new FormControl('', Validators.required),
      AdminPassword: new FormControl('', Validators.required),
      //ImportCertificate: new FormControl(''),
      SslSelected:new FormControl('') 
    }); 
    this.GetLdapList();
    this.GetImprivataList();
    this.GetLockoutInfo();
    this.GetGeneralConfig();
   }

  ngOnInit() {
    this.settingsService.getSecurityModelInfo((response,err)=>{
      if (err) {
        
      } else {
        this.settingsService.selectedSecurityModel.next(response);
      }
    });

    this.settingsService.selectedSecurityModel.subscribe((selectedSecurityModel)=>{
      this.securityModel=selectedSecurityModel;
     });

    this.privilegeService.getApplicationPrivilegesList();    

    this.settingsService.getApplicationsList();

    this.settingsService.applications.subscribe((applicationList) => {
      this.applicationList = Array.from(new Set(this.settingsService.applications.value.map(application => application.Application.ApplicationId))).map( applicationId => {
         return {
                ApplicationId: applicationId,
                ApplicationName: this.settingsService.applications.value.find(application => application.Application.ApplicationId===applicationId).Application.ApplicationName
              };      
      });
      this.applicationList.sort((application1,application2)=>{
        if(application1.ApplicationName.toLocaleLowerCase() > application2.ApplicationName.toLocaleLowerCase()){
          return 1;
        }
        else{
          return -1;
        }
       });
      if(this.applicationList.length>0){
        this.GetVersionList(this.applicationList[0].ApplicationId);
      }
    });
    
    this.selectedTabIndex=0;  
     
    this.ldapService.domainInfo.subscribe((domainList)=>{
       this.availableDomain=domainList;
    });

    this.settingsService.selectedLdapId.subscribe((ldapId)=>{
     if(ldapId!=0)
     {
      this.OnLdapClick(ldapId);
     } 
   });

   this.imprivataService.imprivataInfo.subscribe((imprivataList)=>{
      this.availableImprivata=imprivataList;
   });

  this.settingsService.selectedImprivataId.subscribe((imprivataId)=>{
    if(imprivataId!=0)
    {
    this.OnImprivataClick(imprivataId);
    } 
  });

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;

    this.tableDataSource.filter = filterValue.trim().toLowerCase();

    if (this.tableDataSource.paginator) {
      this.tableDataSource.paginator.firstPage();
    }
  }
 
  onFileChange(files: FileList) {
    //this.labelImport=file.name;
    let file = files[0];
    this.labelFile= file.name;
    let fileReader: FileReader = new FileReader();
    let fileContent;
    fileReader.onloadend = function(x) {
      fileContent = fileReader.result;
    }
    fileReader.readAsText(file);
    
  }

  securityModelChange(){
    this.selectedTabIndex=0;
    if(this.applicationList.length>0){
      this.GetVersionList(this.applicationList[0].ApplicationId);
    }
  }

  OnSaveClick(){
      this.settingsService.updateSecurityModelDetails(this.securityModel, (response, err) => {
            if (err) {
              this.showMessagePopup = {
                show: true,
                message:(err.error.SecurityModelDetailsResponse)?err.error.SecurityModelDetailsResponse.ErrorText:err.error.Error.Message,
                status: false
              };
              this.DismissMessagePopup();
            } else {
              this.showMessagePopup = {
                show: true,
                message: "Saved Successfully!!.",
                status: true
              };
              this.DismissMessagePopup();
              this.settingsService.selectedSecurityModel.next(response);
            }
          });
  }

  OnCancelClick(){
    this.securityModel=this.settingsService.selectedSecurityModel.value;
    this.selectedTabIndex=0;
  }

  GetVersionList(applicationId){  
    this.selectedApplicationId=applicationId;
    this.selectedVersionId=0;
    this.selectedApplicationPrivileges=[];
    this.selectedApplicationVersion= this.settingsService.applications.value.filter(
      filteredData => filteredData.Application.ApplicationId===applicationId
      ).map(function(filteredData) {
        return {
          ApplicationId: applicationId,
          VersionId:filteredData.Application.ApplicationVersionId,
          VersionName:filteredData.Application.VersionNumber
        }
      });  
    if(this.selectedApplicationVersion.length>0)
    {
      this.GetVersionPrivilegeList(this.selectedApplicationVersion[0].VersionId);
    } 
  }

  GetVersionPrivilegeList(versionId){ 
    this.selectedVersionId=versionId;
    this.selectedApplicationPrivileges= this.privilegeService.applicationPrivileges.value.filter(
      filteredData => ((filteredData.ApplicationPrivileges.Application.ApplicationId===this.selectedApplicationId) && (filteredData.ApplicationPrivileges.Application.ApplicationVersionId===versionId))
      ).map(function(filteredData) {
        return {
          VersionId:versionId,
          Privileges:filteredData.ApplicationPrivileges.Privileges
        }
      });       
  }

  DismissMessagePopup() {
    setTimeout(() => {
      this.showMessagePopup.show = false;
    }, 2000);
  }

  GetLdapList(){
    this.ldapService.getLdapList((res:LdapInfo[],err)=>{
      if(err){
      }
      else{       
        //this.availableDomain= res;
      }
    });
  }

  OnLdapClick(ldapId){    
    let selectedLdapInfo=this.availableDomain.find(ldap => ldap.LdapConfigId===ldapId);
    this.ldapInfoForm.reset();   
    this.ldapInfoForm.patchValue({
      HostName:selectedLdapInfo.ServerHostName,
      PortNumber:selectedLdapInfo.ServerPort,
      Domain:selectedLdapInfo.Domain,
      AdminUsername:selectedLdapInfo.AdminUserName,
      AdminPassword:"",
      SslSelected:selectedLdapInfo.IsSslSelected
    }); 
    this.settingsService.setLdapId(ldapId);
  }

  OnLdapSaveClick(){   
    this.spinner.show(); 
    let ldapDetails:LdapInfo=new LdapInfo();
    
    ldapDetails.ServerHostName= this.ldapInfoForm.controls.HostName.value;
    ldapDetails.ServerPort=this.ldapInfoForm.controls.PortNumber.value;
    ldapDetails.Domain=this.ldapInfoForm.controls.Domain.value;
    ldapDetails.AdminUserName=this.ldapInfoForm.controls.AdminUsername.value;
    ldapDetails.AdminPassword=this.ldapInfoForm.controls.AdminPassword.value;
    ldapDetails.IsSslSelected=(this.ldapInfoForm.controls.SslSelected.value===null|| this.ldapInfoForm.controls.SslSelected.value===undefined || this.ldapInfoForm.controls.SslSelected.value==="")?false:this.ldapInfoForm.controls.SslSelected.value;
   
    this.ldapService.saveLdapInfo(ldapDetails,(res:LdapInfo,err)=>{     
      if(err){
        this.showMessagePopup = {
          show: true,
          message: (err.error.LdapRegistrationResponse)?err.error.LdapRegistrationResponse.ErrorText:err.error.Error.Message,
          status: false
        };
        this.DismissMessagePopup();
        this.spinner.hide();
      }
      else{
        this.showMessagePopup = {
          show: true,
          message: "Saved Successfully!!.",
          status: true
        };
        this.DismissMessagePopup(); 
       
        //this.GetLdapList();
     
        //this.OnLdapClick(res.LdapConfigId);        
        //this.settingsService.setLdapId(res.LdapConfigId);

        this.ldapService.getLdapList((response:LdapInfo[],err)=>{
          if(err){
          }
          else{       
            this.settingsService.setLdapId(res.LdapConfigId);                  
          }
        });
        this.spinner.hide(); 
      }
    });
  }

  OnLdapUpdateClick(){   
    this.spinner.show(); 
    let ldapDetails:LdapInfo=new LdapInfo();

    ldapDetails.LdapConfigId=this.settingsService.selectedLdapId.value;    
    ldapDetails.ServerHostName= this.ldapInfoForm.controls.HostName.value;
    ldapDetails.ServerPort=this.ldapInfoForm.controls.PortNumber.value;
    ldapDetails.Domain=this.ldapInfoForm.controls.Domain.value;
    ldapDetails.AdminUserName=this.ldapInfoForm.controls.AdminUsername.value;
    ldapDetails.AdminPassword=this.ldapInfoForm.controls.AdminPassword.value;
    ldapDetails.IsSslSelected=(this.ldapInfoForm.controls.SslSelected.value===null|| this.ldapInfoForm.controls.SslSelected.value===undefined || this.ldapInfoForm.controls.SslSelected.value==="")?false:this.ldapInfoForm.controls.SslSelected.value;

    this.ldapService.updateLdapInfo(ldapDetails,(res:LdapInfo,err)=>{     
      if(err){
        this.showMessagePopup = {
          show: true,
          message: (err.error.LdapUpdateResponse)?err.error.LdapUpdateResponse.ErrorText:err.error.Error.Message,
          status: false
        };
        this.DismissMessagePopup();
        this.spinner.hide();
      }
      else{
        this.showMessagePopup = {
          show: true,
          message: "Updated Successfully!!.",
          status: true
        };
        this.DismissMessagePopup(); 
       
        //this.GetLdapList();
        //this.OnLdapClick(res.LdapConfigId);        
        //this.settingsService.setLdapId(res.LdapConfigId);

        this.ldapService.getLdapList((response:LdapInfo[],err)=>{
          if(err){
          }
          else{
            this.settingsService.setLdapId(0);     
            this.settingsService.setLdapId(res.LdapConfigId);                  
          }
        });
        this.spinner.hide(); 
      }
    });
  }

  OnLdapDeleteClick(domain){
    let dialogResponse:boolean;
    const message = `Do you want to delete `+domain+`?`;

    const dialogData = new ConfirmDialogModel("Confirm Action", message);

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      dialogResponse = dialogResult;
      if(dialogResponse===true)
      {
        this.ldapService.deleteLdapInfo((res, err) => {
          if (err) {            
            this.showMessagePopup = {
              show: true,
              message:(err.error.LdapDeleteResponse)?err.error.LdapDeleteResponse.ErrorText:err.error.Error.Message,
              status: false
            };
            this.DismissMessagePopup();
          } else {
            this.spinner.show(); 
            this.ldapService.getLdapList((response:LdapInfo[],err)=>{
              if(err){
              }
              else{
                this.settingsService.setLdapId(0); 
                this.ldapInfoForm.reset();               
              }
            });
            this.spinner.hide(); 
           
            this.showMessagePopup = {
              show: true,
              message: "Deleted Successfully!!.",
              status: true
            };
            this.DismissMessagePopup();
           
          }
        });
      }
      else
      {
        //alert("false");
      }
    });
  }

  OnNewLdapClick(){
    this.settingsService.setLdapId(0);
    this.ldapInfoForm.reset();
  }
  
  GetImprivataList(){
    this.imprivataService.getImprivataList((res:ImprivataInfo[],err)=>{
      if(err){
      }
      else{       
       // this.availableImprivata= res; 
      }
    });
  }

  OnImprivataClick(imprivataId){
    let selectedImprivataInfo=this.availableImprivata.find(imprivata => imprivata.ImprivataConfigId===imprivataId);  

    this.imprivataInfoForm.patchValue({
      ConfigName:selectedImprivataInfo.ImprivataConfigName,
      HostName:selectedImprivataInfo.ServerHostName,
      PortNumber:selectedImprivataInfo.ServerPort,
      APIPath:selectedImprivataInfo.ApiPath,
      APIVersion:selectedImprivataInfo.ApiVersion,
      ProductCode:selectedImprivataInfo.ProductCode,
      SslSelected:selectedImprivataInfo.IsSslSelected
    });
    this.settingsService.setImprivataId(imprivataId);
  }

  OnImprivataSaveClick(){   
    this.spinner.show(); 
    let imprivataDetails:ImprivataInfo=new ImprivataInfo();

    imprivataDetails.ImprivataConfigName= this.imprivataInfoForm.controls.ConfigName.value;
    imprivataDetails.ServerHostName= this.imprivataInfoForm.controls.HostName.value;
    imprivataDetails.ServerPort=this.imprivataInfoForm.controls.PortNumber.value;
    imprivataDetails.ApiPath=this.imprivataInfoForm.controls.APIPath.value;
    imprivataDetails.ApiVersion=this.imprivataInfoForm.controls.APIVersion.value;
    imprivataDetails.ProductCode=this.imprivataInfoForm.controls.ProductCode.value;
    imprivataDetails.IsSslSelected=(this.imprivataInfoForm.controls.SslSelected.value===null|| this.imprivataInfoForm.controls.SslSelected.value===undefined || this.imprivataInfoForm.controls.SslSelected.value==="")?false:this.imprivataInfoForm.controls.SslSelected.value;

    this.imprivataService.saveImprivataInfo(imprivataDetails,(res:ImprivataInfo,err)=>{     
      if(err){
        this.showMessagePopup = {
          show: true,
          // message: "Not Saved Successfully.",
          message: (err.error.ImprivataRegistrationResponse)?err.error.ImprivataRegistrationResponse.ErrorText:err.error.Error.Message,
          status: false
        };
        this.DismissMessagePopup();
        this.spinner.hide();
      }
      else{
        this.showMessagePopup = {
          show: true,
          message: "Saved Successfully!!.",
          status: true
        };
        this.DismissMessagePopup(); 
       
        //this.GetLdapList();
        //this.OnLdapClick(res.LdapConfigId);        
        //this.settingsService.setLdapId(res.LdapConfigId);

        this.imprivataService.getImprivataList((response:ImprivataInfo[],err)=>{
          if(err){
          }
          else{       
            this.settingsService.setImprivataId(res.ImprivataConfigId);                  
          }
        });
        this.spinner.hide(); 
      }
    });
  }

  OnImprivataUpdateClick(){   
    this.spinner.show(); 
    let imprivataDetails:ImprivataInfo=new ImprivataInfo();

    imprivataDetails.ImprivataConfigId= this.settingsService.selectedImprivataId.value; 
    imprivataDetails.ImprivataConfigName= this.imprivataInfoForm.controls.ConfigName.value;
    imprivataDetails.ServerHostName= this.imprivataInfoForm.controls.HostName.value;
    imprivataDetails.ServerPort=this.imprivataInfoForm.controls.PortNumber.value;
    imprivataDetails.ApiPath=this.imprivataInfoForm.controls.APIPath.value;
    imprivataDetails.ApiVersion=this.imprivataInfoForm.controls.APIVersion.value;
    imprivataDetails.ProductCode=this.imprivataInfoForm.controls.ProductCode.value;
    imprivataDetails.IsSslSelected=(this.imprivataInfoForm.controls.SslSelected.value===null|| this.imprivataInfoForm.controls.SslSelected.value===undefined || this.imprivataInfoForm.controls.SslSelected.value==="")?false:this.imprivataInfoForm.controls.SslSelected.value;

    this.imprivataService.updateImprivataInfo(imprivataDetails,(res:ImprivataInfo,err)=>{     
      if(err){
        this.showMessagePopup = {
          show: true,
          message: (err.error.ImprivataUpdateResponse)?err.error.ImprivataUpdateResponse.ErrorText:err.error.Error.Message,
          status: false
        };
        this.DismissMessagePopup();
        this.spinner.hide();
      }
      else{ 
        this.showMessagePopup = {
          show: true,
          message: "Updated Successfully!!.",
          status: true
        };
        this.DismissMessagePopup(); 
       
        //this.GetLdapList();
        //this.OnLdapClick(res.LdapConfigId);        
        //this.settingsService.setLdapId(res.LdapConfigId);

        this.imprivataService.getImprivataList((response:ImprivataInfo[],err)=>{
          if(err){
          }
          else{       
            this.settingsService.setImprivataId(res.ImprivataConfigId);                  
          }
        });
        this.spinner.hide(); 
      }
    });
  }

  
  OnImprivataDeleteClick(configName){
    let dialogResponse:boolean;
    const message = `Do you want to delete `+configName+`?`;

    const dialogData = new ConfirmDialogModel("Confirm Action", message);

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      dialogResponse = dialogResult;
      if(dialogResponse===true)
      {
        this.imprivataService.deleteImprivataInfo((res, err) => {
          if (err) {            
            this.showMessagePopup = {
              show: true,
              message: (err.error.ImprivataDeleteResponse)?err.error.ImprivataDeleteResponse.ErrorText:err.error.Error.Message,
              status: false
            };
            this.DismissMessagePopup();
          } else {
            this.spinner.show(); 
            this.imprivataService.getImprivataList((response:ImprivataInfo[],err)=>{
              if(err){
              }
              else{
                this.settingsService.setImprivataId(0); 
                this.imprivataInfoForm.reset();               
              }
            });
            this.spinner.hide(); 
           
            this.showMessagePopup = {
              show: true,
              message: "Deleted Successfully!!.",
              status: true
            };
            this.DismissMessagePopup();
           
          }
        });
      }
      else
      {
        //alert("false");
      }
    });
  }

  OnNewImprivataClick(){
    this.settingsService.setImprivataId(0);
    this.imprivataInfoForm.reset();
  }

  GetLockoutInfo(){
    this.settingsService.getLockoutInfo((res:LockoutInfo[],err)=>{
      if(err){
        this.tableDataSource=new MatTableDataSource();
      }
      else{       
        this.lockoutList=res; 
        this.tableDataSource=new MatTableDataSource(this.lockoutList);
        this.tableDataSource.paginator=this.paginator;
        this.tableDataSource.sort=this.sort;
      }
    });
  }

  GetGeneralConfig(){
    this.settingsService.getGeneralConfig((res:GeneralConfig,err)=>{
      if(err){
      }
      else{    
        this.generalConfig = res;
        this.generalSettingsForm.patchValue({
          DefaultLockout:res.LockoutPeriod,
          MaxRetries:res.MaxRetires,
          MaxLoginAttempts:res.MaxLoginAttempts
        });
      }
    });
  }

  OnGeneralConfigSaveClick(){
    let lockoutPeriod = this.generalSettingsForm.controls.DefaultLockout.value;
    lockoutPeriod = (lockoutPeriod ===null || lockoutPeriod ==="")?0:lockoutPeriod;

    let maxRetries = this.generalSettingsForm.controls.MaxRetries.value;
    maxRetries = (maxRetries ===null || maxRetries ==="" )?0:maxRetries;

    let maxLoginAttempts = this.generalSettingsForm.controls.MaxLoginAttempts.value;
    maxLoginAttempts = (maxLoginAttempts ===null || this.securityModel!="ISAS" ||maxLoginAttempts ==="")?0:maxLoginAttempts;

    let generalConfigDetails:GeneralConfig=new GeneralConfig();

    generalConfigDetails.LockoutPeriod= lockoutPeriod;
    generalConfigDetails.MaxRetires= maxRetries;
    generalConfigDetails.MaxLoginAttempts = maxLoginAttempts;

    this.settingsService.saveGeneralConfig(generalConfigDetails,(res:GeneralConfig,err)=>{     
      if(err){
        this.showMessagePopup = {
          show: true,
          message: (err.error.GeneralConfigUpdateResponse)?err.error.GeneralConfigUpdateResponse.ErrorText:err.error.Error.Message,
          status: false
        };
        this.DismissMessagePopup();
        this.spinner.hide();
      }
      else{
        this.showMessagePopup = {
          show: true,
          message: "Saved Successfully!!.",
          status: true
        };
        this.DismissMessagePopup(); 
        this.generalConfig = res;
        this.generalSettingsForm.patchValue({
          DefaultLockout:res.LockoutPeriod,
          MaxRetries:res.MaxRetires,
          MaxLoginAttempts:res.MaxLoginAttempts
        });
        this.spinner.hide(); 
      }
    });

  }

  OnGeneralConfigCancelClick(){
    this.generalSettingsForm.patchValue({
      DefaultLockout:this.generalConfig.LockoutPeriod,
      MaxRetries:this.generalConfig.MaxRetires,
      MaxLoginAttempts:this.generalConfig.MaxLoginAttempts
    });
  }

  OnKeyDownloadClick(){
    let dialogResponse:boolean;

    const dialogRef = this.dialog.open(DownloadDialogComponent);

    dialogRef.afterClosed().subscribe(dialogResult => {
      dialogResponse = dialogResult;
      if(dialogResponse===true)
      {
       //alert("Reset Password True");
       this.showMessagePopup={show:true,message:"Key Downloaded Successfully!!.", status:true};     
       this.DismissMessagePopup();
      }
      else
      {
        //alert("Reset Password False");
      }
    });
  }

  onLoadSuccess(notificationUrl,event){
    //console.log("Notification Url:",notificationUrl)
    let url = notificationUrl.changingThisBreaksApplicationSecurity;
      var iframe = document.getElementById('notificationIframe');
      //this.loadedPlugin = false
     // console.log("Onload url:",url);
      if (iframe == null) return;
      var iWindow = (<HTMLIFrameElement>iframe).contentWindow;
      setTimeout(()=>{
          iWindow.postMessage({accesstoken:sessionStorage.getItem('sessionid')}, url);
      },1000)      
  }

  onIframeLoadError(event){
    console.log("Error of loading Notification")
  }

}

