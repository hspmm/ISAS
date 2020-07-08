import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { LdapGroupService } from 'src/app/shared/ldapgroup/ldapgroup.service';
import {  LdapInfo } from 'src/app/shared/ldapgroup/ldap-info';
import { LdapGroupList, LdapGroupUserList } from 'src/app/shared/roles/role-Info';
import { NgxSpinnerService } from 'ngx-spinner';

// interface LDAP{
//   domainName:string;
//   domainId:number;
// }

export interface UserData { 
  name: string;
  domain: string;
  group: string;
  principalname: string;
}

// const userDetails:UserData[]=[
//   {name:'abc',domain:'icuinnov.corp',group:'test'},
//   {name:'abc1',domain:'icuinnov.corp',group:'test'},
//   {name:'abc2',domain:'icuinnov.corp',group:'test'},
//   {name:'abc3',domain:'icuinnov.corp',group:'test'},
//   {name:'abc4',domain:'icuinnov.corp',group:'test'},
//   {name:'abc5',domain:'icuinnov.corp',group:'test'},
//   {name:'123',domain:'1icuinnov.corp',group:'1test'},
// ];

@Component({
  selector: 'app-ldapgroup',
  templateUrl: './ldapgroup.component.html',
  styleUrls: ['./ldapgroup.component.scss']
})
export class LdapgroupComponent implements OnInit {

  userSearchForm:FormGroup;

  availableDomain:LdapInfo[]=[];

  availableDomainGroups:LdapGroupList;

  availableGroupUsers:LdapGroupUserList;

  showMessagePopup: any;

  //selectedGroup:any;

  displayedColumns: string[] = ['name', 'principalname','domain', 'group' ];
  dataSource: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  
  constructor(private fb: FormBuilder, private ldapService:LdapGroupService, private spinner: NgxSpinnerService) {
    this.userSearchForm = this.fb.group({
      DomainName: new FormControl('', Validators.required),
      GroupName: new FormControl('', Validators.required),
      Filter: new FormControl('') 
    });
   // this.dataSource = new MatTableDataSource(userDetails);   
   }

  ngOnInit() {
    this.GetLdapList();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;

    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  GetLdapList(){
    this.ldapService.getLdapList((res:LdapInfo[],err)=>{
      if(err){
      }
      else{       
        this.availableDomain= res;         
      }
    });
  }

  onLdapDomainChange(domain)
  {
    this.spinner.show();
    this.availableDomainGroups=new LdapGroupList();
    this.ldapService.getLdapGroupList(domain.value,(res:LdapGroupList,err)=>{
      if(err){
        this.availableDomainGroups=new LdapGroupList();
        this.spinner.hide();
       // alert("Not able to Get LDAP Groups!");
        this.showMessagePopup={show:true,
          message:(err.error.Error)?err.error.Error.Message:"Not able to Get LDAP Groups!!", status:false};
        this.userSearchForm.controls.GroupName.setValue("");
        this.DismissMessagePopup();
      }
      else{ 
        this.availableDomainGroups= res;
        this.spinner.hide();
      }
    });
  }

  SearchLdapUserClick()
  {
    let ldapConfigId= this.userSearchForm.controls.DomainName.value;
    let groupName= this.userSearchForm.controls.GroupName.value.GroupPath;
   
    let filter=this.userSearchForm.controls.Filter.value;
    this.spinner.show();
    this.ldapService.getLdapGroupUserList(ldapConfigId,groupName,filter,(res:LdapGroupUserList,err)=>{
      if(err){
        this.availableGroupUsers=new LdapGroupUserList();
        this.spinner.hide();
        this.showMessagePopup={show:true,message:(err.error.Error)?err.error.Error.Message:"Not able to Get LDAP Group Users!", status:false};
        this.dataSource=new MatTableDataSource();
        this.DismissMessagePopup();
      }
      else{      
        this.availableGroupUsers= res;
        //console.log("Users-",this.availableGroupUsers.Ldap.Users);
        this.dataSource=new MatTableDataSource(this.availableGroupUsers.Ldap.Users.map(user=> {return {name:user.UserName,domain:this.availableGroupUsers.Ldap.DomainName,group:this.userSearchForm.controls.GroupName.value.GroupName, principalname:user.PrincipalName}}));
        this.dataSource.paginator=this.paginator;
        this.dataSource.sort=this.sort;
        
        this.spinner.hide();
      }
    });
  }

  DismissMessagePopup() {
    setTimeout(() => {
      this.showMessagePopup.show = false;
    }, 2000);
  }

}
