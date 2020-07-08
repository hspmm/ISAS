import { Component, OnInit, ViewChild } from '@angular/core';
import { UsersService } from 'src/app/shared/users/users.service';
import {  UserList } from 'src/app/shared/users/user-Info';
import { Router } from '@angular/router';
import { PrivilegesService } from 'src/app/shared/privileges/privileges.service';
import { ApplicationPrivilege } from 'src/app/shared/privileges/privilege-Info';
import { ConfirmDialogModel,ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';

import { NgxSpinnerService } from 'ngx-spinner';
import { SettingsService } from 'src/app/shared/settings/settings.service';


export interface LdapUsers {
  username: string;
  domain: string;
  principalname:string;
  assignedroles:string[];
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  providers:[]
})
export class UsersComponent implements OnInit { 

  displayedColumns: string[] = ['username', 'domain', 'principalname', 'assignedroles'];

  dataSource: MatTableDataSource<LdapUsers>=new MatTableDataSource<LdapUsers>();
  
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  searchText:string="";
  searchResult:any =[];

  showMessagePopup: any;

  usersList:UserList[];
  statusMessage: string;
  errorStatus: boolean;
  responseMessage:string;
  selectedUserInfo:UserList;

  userSearchForm:FormGroup;
  resultsLength:number=0;

  applicationPrivilegesList:ApplicationPrivilege[];


  constructor(public usersService:UsersService,private router: Router, private privilegeService:PrivilegesService,private fb: FormBuilder,public dialog: MatDialog,  private spinner: NgxSpinnerService,private settingsService: SettingsService) {    
    this.usersService.setUserId(0);

    this.userSearchForm = this.fb.group({
      UserName: new FormControl()    
    });
   }
 

  ngOnInit() {
    this.spinner.show();    
    this.GetUsersList();  
    this.usersService.userInfoList.subscribe((userInfoList)=>{
      this.usersList=userInfoList;
  });  
  this.spinner.hide(); 
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;

    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  
  
  GetUsersList(){
    this.usersService.getUserList((res:UserList[],err)=>{
      if(err){
      }
      else{
        if(res.length==0)
        {
          this.statusMessage="No users Available. Please create new user.";
        }        
      }
    });
  }  
  
  OnUserClick(userId){   
    if(this.usersService.selectedUserId.value!=userId){
      this.usersService.setUserId(userId);
    }   
  }

  OnNewUserCreationClick()
  {   
    this.usersService.setUserId(0);
  }

  
  OnUserDeleteClick(userId, userName){
    let dialogResponse:boolean;
    const message = `Do you want to delete `+userName+`?`;

    const dialogData = new ConfirmDialogModel("Confirm Action", message);

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      dialogResponse = dialogResult;
      if(dialogResponse===true)
      {
        this.usersService.deleteUserInfo((res, err) => {
          if (err) {            
            this.showMessagePopup = {
              show: true,
              message: (err.error.UserDeleteResponse)?err.error.UserDeleteResponse.ErrorText:err.error.Error.Message,
              status: false
            };
            this.DismissMessagePopup();
            this.usersService.setUserId(userId);
          } else {
            this.GetUsersList();
            this.usersService.setUserId(0);
           
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
      }
    });
    
  }

  DismissMessagePopup() {
    setTimeout(() => {
      this.showMessagePopup.show = false;
    }, 2000);
  }

  SearchLdapUserClick(){
    this.spinner.show();
    let username=this.userSearchForm.controls.UserName.value;
    
    this.usersService.searchUserDetails(username,(response, err) => {
      if (err) {
        this.showMessagePopup={show:true,message:"No Result Found.", status:false};
        this.DismissMessagePopup();
        this.dataSource=new MatTableDataSource();
        this.spinner.hide();
      } else { 
//        this.dataSource=new MatTableDataSource(response.LdapUsersDetailsResponse.map(value=>value.element));                
        this.dataSource=new MatTableDataSource<LdapUsers>(response.LdapUsersDetailsResponse.map(value=>{return {username:value.element.username,domain:value.element.domain,principalname:value.element.principalname,assignedroles:value.element.assignedroles}})); 
        this.dataSource.paginator=this.paginator;
        this.dataSource.sort=this.sort;
        
        this.spinner.hide();
      }
    });
  }

  onSearchUserEvent(){    
    if(this.searchText.trim().length>0){
    this.searchResult=[];
    let users=this.usersList.filter((user)=> {  
          return user.User.UserName.toLocaleLowerCase().indexOf(this.searchText.trim().toLocaleLowerCase())>=0;         
      }).map((user)=>{         
           return user;
      });        
    this.searchResult=this.searchResult.concat(users);  
    }
  }

}
