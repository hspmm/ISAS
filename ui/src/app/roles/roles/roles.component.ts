import { Component, OnInit } from '@angular/core';
import { RolesService } from 'src/app/shared/roles/roles.service';
import { RoleList, LdapGroupList } from 'src/app/shared/roles/role-Info';
import { ConfirmDialogModel, ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material';
import { UsersService } from 'src/app/shared/users/users.service';
import { UserList } from 'src/app/shared/users/user-Info';

import { NgxSpinnerService } from 'ngx-spinner';
import { SettingsService } from 'src/app/shared/settings/settings.service';


@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {
  showMessagePopup: any;

  searchText:string="";
  searchResult:any =[];

  siteTreeErrorMessage="";

  statusMessage: string;
  errorStatus: boolean;
  responseMessage:string;
  
  rolesList:RoleList[];

  /* Load Service Data */
  roleListStatus:boolean=false;
  siteTreeStatus:boolean=false;
  ldapGroupStatus:boolean=false;
  userStatus:boolean=false;
  securityModelStatus:boolean=false;

  constructor(private rolesService:RolesService,public dialog: MatDialog, private userService:UsersService, private spinner: NgxSpinnerService,private settingsService: SettingsService) {
    this.rolesService.setRoleId(0);
   }

   ngOnInit() {
    //this.spinner.show();
    this.GetRolesList();  
    this.GetLdapGroupList(); 
    this.userService.getUserList((res:UserList[],err)=>{
      if(err){      
      }
      else{
        if(res.length==0)
        {
          //this.statusMessage="No users Available. Please create new user.";
        }        
      }
    });  

    this.rolesService.roleInfoList.subscribe((roleInfoList)=>{
      this.rolesList=roleInfoList;
     });   
    //  this.rolesService.getSiteInfo((res, err) => {
    //   if (err) {
    //     this.siteTreeStatus=true;
    //   } else {   
    //     this.siteTreeStatus=true;     
    //   }
    // });

    this.rolesService.getSiteInfoFromEC((res,err)=>{
      if(err){
        this.siteTreeErrorMessage=err.error.SiteResponse.ErrorText;
      }
      else{
        this.siteTreeErrorMessage=="";
      }
    });

    this.settingsService.getSecurityModelInfo((response,err)=>{
      if (err) {
        this.securityModelStatus=true;
        
      } else {
        this.securityModelStatus=true;
        this.settingsService.selectedSecurityModel.next(response);
      }
    });
    
    //  if(this.roleListStatus && this.siteTreeStatus && this.ldapGroupStatus && this.userStatus && this.securityModelStatus){
  
    //   this.spinner.hide();
    //  }
  }

  GetRolesList(){
    // this.spinner.show();
    this.rolesService.getRoleList((res:RoleList[],err)=>{
      if(err){ 
        this.statusMessage=err; 
        this.roleListStatus=true; 
        // this.spinner.hide(); 
      }
      else{
        this.roleListStatus=true;
        // this.spinner.hide();
        if(res.length==0)
        {
          this.statusMessage="No Roles Available. Please create new Role.";         
        }        
      }
    });
  }

  GetLdapGroupList(){
    // this.spinner.show();
    this.ldapGroupStatus=true;
    this.rolesService.getLdapGroups((res:LdapGroupList[],err)=>{
      if(err){ 
        this.ldapGroupStatus=true;
        // this.spinner.hide(); 
      }
      else{
        this.ldapGroupStatus=true;
        // this.spinner.hide();              
      }
    }); 
  }

  OnRoleClick(roleId){
    this.rolesService.setRoleId(roleId);
  }
  
  OnNewRoleCreationClick(){
    this.rolesService.setRoleId(0);
  }

  OnRoleDeleteClick(roleId, roleName){
    let dialogResponse:boolean;
    const message = `Do you want to delete `+roleName+`?`;

    const dialogData = new ConfirmDialogModel("Confirm Action", message);

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      dialogResponse = dialogResult;
      if(dialogResponse===true)
      {
       // alert("true");
        this.rolesService.deleteRoleInfo((res, err) => {
          if (err) {            
            this.showMessagePopup = {
              show: true,
              message: (err.error.RoleDeleteResponse)?err.error.RoleDeleteResponse.ErrorText:err.error.Error.Message,
              status: false
            };
            this.DismissMessagePopup();
            this.rolesService.setRoleId(roleId);
          } else {
            this.GetRolesList();
            this.rolesService.setRoleId(0);
           
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

  DismissMessagePopup() {
    setTimeout(() => {
      this.showMessagePopup.show = false;
    }, 2000);
  }

  onSearchRoleEvent(){    
    if(this.searchText.trim().length>0){
    
    this.searchResult=[];
    let roles=this.rolesList.filter((role)=> {        
          return role.Role.RoleName.toLocaleLowerCase().indexOf(this.searchText.trim().toLocaleLowerCase())>=0;         
      }).map((role)=>{         
           return role;
      });        
    this.searchResult=this.searchResult.concat(roles);   
    }
  }

}
