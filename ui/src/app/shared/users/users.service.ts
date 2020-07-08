import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserList, UserFullDetails, RoleDetails, RolePrivilegeDetails } from './user-Info';
import { BehaviorSubject } from 'rxjs';
import { AppConfig } from 'src/app/app.config';
import { AppServerUrl } from '../config/app-serverurl';


@Injectable({
  providedIn: 'root'
})
export class UsersService {
  serverUrl = AppServerUrl();
  selectedSecurityModel= new BehaviorSubject(0);
  selectedUserId= new BehaviorSubject(0);
  userInfoList=new BehaviorSubject<UserList[]>([]);
  userInfo:UserFullDetails;
  roleInfoList:RoleDetails[];
  rolePrivilegeInfo= new BehaviorSubject<RolePrivilegeDetails[]>([]);
  
  //apiPath = "http://localhost:3001/api/v1/";

  applicationConfig = AppConfig.settings.env

  apiPath = this.applicationConfig.baseUrl+this.applicationConfig.apiVersion;

  constructor(private http: HttpClient) {}

  getUserList(callback) {
    this.http.get(this.apiPath+this.serverUrl.users).toPromise().then(userList => {
      this.userInfoList.next(userList["UserDetailsResponse"].Users);
      callback(this.userInfoList);
    }).catch(err => {
      callback(null, err);
    });
  }

  getRolesList(callback) {
    this.http.get(this.apiPath+"Roles").toPromise().then(roleList => {
      this.roleInfoList=roleList["RoleDetailsResponse"].Roles;
      callback(this.roleInfoList);
    }).catch(err => {
      callback(null, err);
    });
  }

  getUserInfo(callback) {
    this.http.post(this.apiPath+"userinfo",{"Userinforequest":{"userid":this.selectedUserId.value.toString()}}, {
      headers : {
          'Content-Type' : 'application/json'
      }}).toPromise().then(userInfo => {
      this.userInfo=userInfo["UserInformationResponse"].UserInfo;
      callback(this.userInfo);
    }).catch(err => {
      callback(null, err);
    });
  }

  setUserId(userId)
  {    
    this.selectedUserId.next(userId);
  }
  
  
  getRolesPrivilegesList(arrayRoleRequest,callback) {
       this.http.post(this.apiPath+"RolesPrivileges",this.generateRolesPrivilegeBody(arrayRoleRequest), {
        headers : {
            'Content-Type' : 'application/xml'
        }}).toPromise().then(rolePrivilegeInfo => {
        this.rolePrivilegeInfo.next(rolePrivilegeInfo["RolePrivilegesResponse"].RolePrivileges);
        callback(this.rolePrivilegeInfo.value);
      }).catch(err => {
        callback(null, err);
      });
  }

  saveUserDetails(userDetails,callback) {
     this.http.post(this.apiPath+"user/Registration",this.generateUserAndRolesBody(userDetails,true), {
      headers : {
          'Content-Type' : 'application/xml'
      }}).toPromise().then(userInfo => { 
      callback(userInfo['RegistrationResponse'].UserInformation);
    }).catch(err => {
      callback(null, err);
    });
}

deleteUserInfo(callback){
  this.http.post(this.apiPath + "user/Delete", {
    "UserDeleterequest": {
      "userid": this.selectedUserId.value.toString()
    }
  }, {
    headers: {
      'Content-Type': 'application/json'
    }
  }).toPromise().then(roleInfo => {
    callback(roleInfo["UserDeleteResponse"].UserId);
  }).catch(err => {
    callback(null, err);
  });
}


searchUserDetails(username,callback) {
  this.http.post(this.apiPath+"user/FindLdapUser",this.generateUserSearchBody(username), {
   headers : {
       'Content-Type' : 'application/xml'
   }}).toPromise().then(userInfo => { 
   callback(userInfo);
 }).catch(err => {
   callback(null, err);
 });
}

updateUserDetails(userDetails,callback) {
   this.http.post(this.apiPath+"user/Update",this.generateUserAndRolesBody(userDetails,false), {
    headers : {
        'Content-Type' : 'application/xml'
    }}).toPromise().then(userInfo => {     
    callback(userInfo['UserUpdateResponse'].UserInformation);
  }).catch(err => {
    callback(null, err);
  });
}


resetUserPassword(passwordDetails,callback) {
  this.http.post(this.apiPath+"user/PasswordReset",this.generatePasswordResetBody(passwordDetails), {
   headers : {
       'Content-Type' : 'application/xml'
   }}).toPromise().then(passwordInfo => { 
   callback(passwordInfo['PasswordResetResponse'].Status);
 }).catch(err => {
   callback(null, err);
 });
}

generateRolesPrivilegeBody(arrayRoleRequest){
        let requestStartBody=`<roleprivilegerequest>`;
        let requestEndBody=`</roleprivilegerequest>`;
        let roleBody="";
        arrayRoleRequest.forEach(role => {
            roleBody+=`<role><roleid>`+role.Role.RoleId+`</roleid></role>`;
        });
        
  return (roleBody.length>0)?requestStartBody+roleBody+requestEndBody:roleBody;
 }

 generateUserAndRolesBody(userDetails,isInsert){
    let requestInsertStartBody=`<userregistration>`;
    let requestInsertEndBody=`</userregistration>`;
    let requestUpdateStartBody=`<userupdate>`;
    let requestUpdateEndBody=`</userupdate>`;
    let roleDetailsStartTag='<roledetails>';
    let roleDetailsEndTag='</roledetails>';
    let userBody="";
    let roleBody="";
    userDetails.UserRolesDetails.forEach(role => {
        roleBody+=`<role><roleid>`+role.Role.RoleId+`</roleid></role>`;
    });
   
    let middleName= (userDetails.UserBasicDetails.middlename!=null && userDetails.UserBasicDetails.middlename.trim().length>0)?userDetails.UserBasicDetails.middlename:"";
    
    userBody=`<userdetails>
              <firstname>`+userDetails.UserBasicDetails.firstname+`</firstname>
              <middlename>`+middleName+`</middlename>
              <lastname>`+userDetails.UserBasicDetails.lastname+`</lastname>
              <mobilenumber>`+userDetails.UserBasicDetails.mobilenumber+`</mobilenumber>
              <emailid>`+userDetails.UserBasicDetails.emailid+`</emailid>
              <isemailselected>`+userDetails.UserBasicDetails.isemailselected+`</isemailselected>
              <loginid>`+((userDetails.UserBasicDetails.isemailselected===true)?userDetails.UserBasicDetails.emailid:userDetails.UserBasicDetails.loginid)+`</loginid>
              <password>`+userDetails.UserBasicDetails.password+`</password>
              <isaccountlocked>`+userDetails.UserBasicDetails.isaccountlocked+`</isaccountlocked>
              <isaccountdisabled>`+userDetails.UserBasicDetails.isaccountdisabled+`</isaccountdisabled>
              </userdetails>`;
              if(isInsert)
              {
                // userBody=`<userdetails>
                // <firstname>`+userDetails.UserBasicDetails.firstname+`</firstname>
                // <middlename>`+userDetails.UserBasicDetails.middlename+`</middlename>
                // <lastname>`+userDetails.UserBasicDetails.lastname+`</lastname>
                // <mobilenumber>`+userDetails.UserBasicDetails.mobilenumber+`</mobilenumber>
                // <emailid>`+userDetails.UserBasicDetails.emailid+`</emailid>
                // <isemailselected>`+userDetails.UserBasicDetails.isemailselected+`</isemailselected>
                // <loginid>`+userDetails.UserBasicDetails.loginid+`</loginid>
                // <password>`+userDetails.UserBasicDetails.password+`</password>
                // <isaccountlocked>`+userDetails.UserBasicDetails.isaccountlocked+`</isaccountlocked>
                // <isaccountdisabled>`+userDetails.UserBasicDetails.isaccountdisabled+`</isaccountdisabled>
                // </userdetails>`;
                return (roleBody.length>0)?requestInsertStartBody+userBody+roleDetailsStartTag+roleBody+roleDetailsEndTag+requestInsertEndBody:requestInsertStartBody+userBody+requestInsertEndBody;
              }
              else{
                userBody=`<userdetails>
                <userid>`+userDetails.UserBasicDetails.userid+`</userid>
                <firstname>`+userDetails.UserBasicDetails.firstname+`</firstname>
                <middlename>`+middleName+`</middlename>
                <lastname>`+userDetails.UserBasicDetails.lastname+`</lastname>
                <mobilenumber>`+userDetails.UserBasicDetails.mobilenumber+`</mobilenumber>
                <emailid>`+userDetails.UserBasicDetails.emailid+`</emailid>
                <isemailselected>`+userDetails.UserBasicDetails.isemailselected+`</isemailselected>
                <loginid>`+((userDetails.UserBasicDetails.isemailselected===true)?userDetails.UserBasicDetails.emailid:userDetails.UserBasicDetails.loginid)+`</loginid>
                <password>`+userDetails.UserBasicDetails.password+`</password>
                <isaccountlocked>`+userDetails.UserBasicDetails.isaccountlocked+`</isaccountlocked>
                <isaccountdisabled>`+userDetails.UserBasicDetails.isaccountdisabled+`</isaccountdisabled>
                </userdetails>`;
                return (roleBody.length>0)?requestUpdateStartBody+userBody+roleDetailsStartTag+roleBody+roleDetailsEndTag+requestUpdateEndBody:requestUpdateStartBody+userBody+requestUpdateEndBody;
              }

}

generateUserSearchBody(username){
  let requestUserInfoStartBody=`<ldapuserinforequest>`;
  let requestUserInfoEndBody=`</ldapuserinforequest>`;  
  let userBody="";

  userBody=`<username>`+username+`</username>`;
  return requestUserInfoStartBody+userBody+requestUserInfoEndBody;
}

generatePasswordResetBody(passwordDetails){
  let passwordResetStartBody=`<passwordresetrequest>`;
  let passwordResetEndBody=`</passwordresetrequest>`;  
  let passwordBody="";

  passwordBody=`<userid>`+this.selectedUserId.value+`</userid>
                <currentpassword>`+passwordDetails.currentPassword+`</currentpassword>
                <newpassword>`+passwordDetails.newPassword+`</newpassword>`;
  return passwordResetStartBody+passwordBody+passwordResetEndBody;
}


// tempData={
//     "data":[
//       {
//         "NodeID": 1,
//         "NodeName": "Kaiser Permanente",
//         "NodeShortName": "Kaiser Permanente",
//         "ParentID": null,
//         "NodeType": "enterprise-hierarchy",
//         "TypeOf": "enterprise-configurartor",
//         "PluginID": null,
//         "CreatedDate": "2019-10-21T09:28:48.037Z",
//         "LastModifiedDate": "2019-10-21T09:28:48.037Z",
//         "CreatedBy": "midhun_sai",
//         "Data": null,
//         "ModifiedBy": "midhun_sai",
//         "IsActive": 1,
//         "createdAt": "2019-10-21T09:28:48.399Z",
//         "updatedAt": "2019-10-21T09:28:48.399Z",
//         "ApplicationID":0,
//         "children": [
//             {
//                 "NodeID": 2,
//                 "NodeName": "North Cal",
//                 "NodeShortName": "North Cal",
//                 "ParentID": 1,
//                 "NodeType": "enterprise-hierarchy",
//                 "TypeOf": "Sample Service",
//                 "PluginID": 4,
//                 "CreatedDate": "2019-10-21T09:35:36.010Z",
//                 "LastModifiedDate": "2019-10-21T09:35:36.010Z",
//                 "CreatedBy": "midhun",
//                 "Data": "{\"description\":\"Test device Assignments\",\"locationName\":\"test location\",\"address\":\"7th floor, ICU Medical, Prestige Palladium Bayan,, Greams Road, Nungumbakam\",\"name\":\"Sample service\"}",
//                 "ModifiedBy": "midhun",
//                 "IsActive": 1,
//                 "createdAt": "2019-10-21T09:35:36.147Z",
//                 "updatedAt": "2019-10-21T09:35:36.147Z",
//                 "ApplicationID":1,
//                 "children": [
//                     {
//                         "NodeID": 5,
//                         "NodeName": "Campus 1",
//                         "NodeShortName": "Campus 1",
//                         "ParentID": 2,
//                         "NodeType": "enterprise-hierarchy",
//                         "TypeOf": "Sample Service",
//                         "PluginID": 4,
//                         "CreatedDate": "2019-10-21T09:35:36.010Z",
//                         "LastModifiedDate": "2019-10-21T09:35:36.010Z",
//                         "CreatedBy": "midhun",
//                         "Data": "{\"description\":\"Test device Assignments\",\"locationName\":\"test location\",\"address\":\"7th floor, ICU Medical, Prestige Palladium Bayan,, Greams Road, Nungumbakam\",\"name\":\"Sample service\"}",
//                         "ModifiedBy": "midhun",
//                         "IsActive": 1,
//                         "createdAt": "2019-10-21T09:35:36.147Z",
//                         "updatedAt": "2019-10-21T09:35:36.147Z",
//                         "ApplicationID":1,
//                         "children": [
//                             {
//                                 "NodeID": 8,
//                                 "NodeName": "Facility 1",
//                                 "NodeShortName": "Facility 1",
//                                 "ParentID": 5,
//                                 "NodeType": "enterprise-hierarchy",
//                                 "TypeOf": "Sample Service",
//                                 "PluginID": 4,
//                                 "CreatedDate": "2019-10-21T09:35:36.010Z",
//                                 "LastModifiedDate": "2019-10-21T09:35:36.010Z",
//                                 "CreatedBy": "midhun",
//                                 "Data": "{\"description\":\"Test device Assignments\",\"locationName\":\"test location\",\"address\":\"7th floor, ICU Medical, Prestige Palladium Bayan,, Greams Road, Nungumbakam\",\"name\":\"Sample service\"}",
//                                 "ModifiedBy": "midhun",
//                                 "IsActive": 1,
//                                 "createdAt": "2019-10-21T09:35:36.147Z",
//                                 "updatedAt": "2019-10-21T09:35:36.147Z",
//                                 "ApplicationID":1,
//                                 "children": [
//                                     {
//                                         "NodeID": 1004,
//                                         "NodeName": "MedNet 1",
//                                         "NodeShortName": "MedNet 1",
//                                         "ParentID": 5,
//                                         "NodeType": "application",
//                                         "TypeOf": "Sample Service",
//                                         "PluginID": 4,
//                                         "CreatedDate": "2019-10-21T09:35:36.010Z",
//                                         "LastModifiedDate": "2019-10-21T09:35:36.010Z",
//                                         "CreatedBy": "midhun",
//                                         "Data": "{\"description\":\"Test device Assignments\",\"locationName\":\"test location\",\"address\":\"7th floor, ICU Medical, Prestige Palladium Bayan,, Greams Road, Nungumbakam\",\"name\":\"Sample service\"}",
//                                         "ModifiedBy": "midhun",
//                                         "IsActive": 1,
//                                         "createdAt": "2019-10-21T09:35:36.147Z",
//                                         "updatedAt": "2019-10-21T09:35:36.147Z",
//                                         "ApplicationID":1004,
//                                         "children": []
//                                     }
//                                 ]
//                             }
//                         ]
//                     }
//                 ]
//             },
//             {
//                 "NodeID": 4,
//                 "NodeName": "South Cal",
//                 "NodeShortName": "South Cal",
//                 "ParentID": 1,
//                 "NodeType": "enterprise-hierarchy",
//                 "TypeOf": "Sample Service",
//                 "PluginID": 4,
//                 "CreatedDate": "2019-10-21T09:43:54.058Z",
//                 "LastModifiedDate": "2019-10-21T09:43:54.058Z",
//                 "CreatedBy": "midhun",
//                 "Data": "{\"description\":\"Test DWH12\",\"locationName\":\"test location\",\"address\":\"6-62,Karanala street,, gudur.\",\"name\":\"Sample service12\"}",
//                 "ModifiedBy": "midhun",
//                 "IsActive": 1,
//                 "createdAt": "2019-10-21T09:43:54.620Z",
//                 "updatedAt": "2019-10-21T09:43:54.620Z",
//                 "ApplicationID":2,
//                 "children": [
//                     {
//                         "NodeID": 6,
//                         "NodeName": "Campus 2",
//                         "NodeShortName": "Campus 2",
//                         "ParentID": 4,
//                         "NodeType": "enterprise-hierarchy",
//                         "TypeOf": "Sample Service",
//                         "PluginID": 4,
//                         "CreatedDate": "2019-10-21T09:35:36.010Z",
//                         "LastModifiedDate": "2019-10-21T09:35:36.010Z",
//                         "CreatedBy": "midhun",
//                         "Data": "{\"description\":\"Test device Assignments\",\"locationName\":\"test location\",\"address\":\"7th floor, ICU Medical, Prestige Palladium Bayan,, Greams Road, Nungumbakam\",\"name\":\"Sample service\"}",
//                         "ModifiedBy": "midhun",
//                         "IsActive": 1,
//                         "createdAt": "2019-10-21T09:35:36.147Z",
//                         "updatedAt": "2019-10-21T09:35:36.147Z",
//                         "ApplicationID":1,
//                         "children": [
//                             {
//                                 "NodeID": 9,
//                                 "NodeName": "Facility 2",
//                                 "NodeShortName": "Facility 2",
//                                 "ParentID": 6,
//                                 "NodeType": "enterprise-hierarchy",
//                                 "TypeOf": "Sample Service",
//                                 "PluginID": 4,
//                                 "CreatedDate": "2019-10-21T09:35:36.010Z",
//                                 "LastModifiedDate": "2019-10-21T09:35:36.010Z",
//                                 "CreatedBy": "midhun",
//                                 "Data": "{\"description\":\"Test device Assignments\",\"locationName\":\"test location\",\"address\":\"7th floor, ICU Medical, Prestige Palladium Bayan,, Greams Road, Nungumbakam\",\"name\":\"Sample service\"}",
//                                 "ModifiedBy": "midhun",
//                                 "IsActive": 1,
//                                 "createdAt": "2019-10-21T09:35:36.147Z",
//                                 "updatedAt": "2019-10-21T09:35:36.147Z",
//                                 "ApplicationID":1,
//                                 "children": [
//                                     {
//                                         "NodeID": 1005,
//                                         "NodeName": "MedNet 2",
//                                         "NodeShortName": "MedNet 2",
//                                         "ParentID": 6,
//                                         "NodeType": "application",
//                                         "TypeOf": "Sample Service",
//                                         "PluginID": 4,
//                                         "CreatedDate": "2019-10-21T09:35:36.010Z",
//                                         "LastModifiedDate": "2019-10-21T09:35:36.010Z",
//                                         "CreatedBy": "midhun",
//                                         "Data": "{\"description\":\"Test device Assignments\",\"locationName\":\"test location\",\"address\":\"7th floor, ICU Medical, Prestige Palladium Bayan,, Greams Road, Nungumbakam\",\"name\":\"Sample service\"}",
//                                         "ModifiedBy": "midhun",
//                                         "IsActive": 1,
//                                         "createdAt": "2019-10-21T09:35:36.147Z",
//                                         "updatedAt": "2019-10-21T09:35:36.147Z",
//                                         "ApplicationID":1005,
//                                         "children": []
//                                     },
//                                     {
//                                         "NodeID": 1006,
//                                         "NodeName": "Meds 1",
//                                         "NodeShortName": "Meds 2",
//                                         "ParentID": 6,
//                                         "NodeType": "application",
//                                         "TypeOf": "Sample Service",
//                                         "PluginID": 4,
//                                         "CreatedDate": "2019-10-21T09:35:36.010Z",
//                                         "LastModifiedDate": "2019-10-21T09:35:36.010Z",
//                                         "CreatedBy": "midhun",
//                                         "Data": "{\"description\":\"Test device Assignments\",\"locationName\":\"test location\",\"address\":\"7th floor, ICU Medical, Prestige Palladium Bayan,, Greams Road, Nungumbakam\",\"name\":\"Sample service\"}",
//                                         "ModifiedBy": "midhun",
//                                         "IsActive": 1,
//                                         "createdAt": "2019-10-21T09:35:36.147Z",
//                                         "updatedAt": "2019-10-21T09:35:36.147Z",
//                                         "ApplicationID":1006,
//                                         "children": []
//                                     }
//                                 ]
//                             }
//                         ]
//                     }
//                 ]
//             }           
//         ]
//     }
//     ]
//  };

//   tempData={
// "data":[
//   {
//     "NodeID": 1,
//     "NodeName": "Kaiser Permanente",
//     "NodeShortName": "Kaiser Permanente",
//     "ParentID": null,
//     "NodeType": "enterprise-hierarchy",
//     "TypeOf": "enterprise-configurartor",
//     "PluginID": null,
//     "CreatedDate": "2019-10-21T09:28:48.037Z",
//     "LastModifiedDate": "2019-10-21T09:28:48.037Z",
//     "CreatedBy": "midhun_sai",
//     "Data": null,
//     "ModifiedBy": "midhun_sai",
//     "IsActive": 1,
//     "createdAt": "2019-10-21T09:28:48.399Z",
//     "updatedAt": "2019-10-21T09:28:48.399Z",
//     "ApplicationID":0,
//     "children": [
//         {
//             "NodeID": 2,
//             "NodeName": "Sample service",
//             "NodeShortName": "Sample service",
//             "ParentID": 1,
//             "NodeType": "application",
//             "TypeOf": "Sample Service",
//             "PluginID": 4,
//             "CreatedDate": "2019-10-21T09:35:36.010Z",
//             "LastModifiedDate": "2019-10-21T09:35:36.010Z",
//             "CreatedBy": "midhun",
//             "Data": "{\"description\":\"Test device Assignments\",\"locationName\":\"test location\",\"address\":\"7th floor, ICU Medical, Prestige Palladium Bayan,, Greams Road, Nungumbakam\",\"name\":\"Sample service\"}",
//             "ModifiedBy": "midhun",
//             "IsActive": 1,
//             "createdAt": "2019-10-21T09:35:36.147Z",
//             "updatedAt": "2019-10-21T09:35:36.147Z",
//             "ApplicationID":1,
//             "children": []
//         },
//         {
//             "NodeID": 5,
//             "NodeName": "Sample service12",
//             "NodeShortName": "Sample service12",
//             "ParentID": 1,
//             "NodeType": "application",
//             "TypeOf": "Sample Service",
//             "PluginID": 4,
//             "CreatedDate": "2019-10-21T09:43:54.058Z",
//             "LastModifiedDate": "2019-10-21T09:43:54.058Z",
//             "CreatedBy": "midhun",
//             "Data": "{\"description\":\"Test DWH12\",\"locationName\":\"test location\",\"address\":\"6-62,Karanala street,, gudur.\",\"name\":\"Sample service12\"}",
//             "ModifiedBy": "midhun",
//             "IsActive": 1,
//             "createdAt": "2019-10-21T09:43:54.620Z",
//             "updatedAt": "2019-10-21T09:43:54.620Z",
//             "ApplicationID":2,
//             "children": []
//         },
//         {
//             "NodeID": 3,
//             "NodeName": "North col",
//             "NodeShortName": "North col",
//             "ParentID": 1,
//             "NodeType": "enterprise-hierarchy",
//             "TypeOf": "Region",
//             "PluginID": null,
//             "CreatedDate": "2019-10-21T09:36:18.047Z",
//             "LastModifiedDate": "2019-10-21T09:36:18.047Z",
//             "CreatedBy": "midhun_sai",
//             "Data": "North Col",
//             "ModifiedBy": "midhun_sai",
//             "IsActive": 1,
//             "createdAt": "2019-10-21T09:36:18.511Z",
//             "updatedAt": "2019-10-21T09:36:18.511Z",
//             "ApplicationID":0,
//             "children": [
//                 {
//                     "NodeID": 6,
//                     "NodeName": "MSAS APP12",
//                     "NodeShortName": "MSAS APP12",
//                     "ParentID": 3,
//                     "NodeType": "application",
//                     "TypeOf": "Sample Service",
//                     "PluginID": 4,
//                     "CreatedDate": "2019-10-21T10:18:14.004Z",
//                     "LastModifiedDate": "2019-10-21T10:18:14.004Z",
//                     "CreatedBy": "midhun",
//                     "Data": "{\"description\":\"fedsf\",\"locationName\":\"test location\",\"address\":\"Big Mosque street, Gudur\",\"name\":\"MSAS APP12\"}",
//                     "ModifiedBy": "midhun",
//                     "IsActive": 1,
//                     "createdAt": "2019-10-21T10:18:14.089Z",
//                     "updatedAt": "2019-10-21T10:18:14.089Z",
//                     "ApplicationID":3,
//                     "children": []
//                 },
//                 {
//                     "NodeID": 7,
//                     "NodeName": "ABCD",
//                     "NodeShortName": "ABCD",
//                     "ParentID": 3,
//                     "NodeType": "application",
//                     "TypeOf": "Sample Service",
//                     "PluginID": 4,
//                     "CreatedDate": "2019-10-21T10:18:35.007Z",
//                     "LastModifiedDate": "2019-10-21T10:18:35.007Z",
//                     "CreatedBy": "midhun",
//                     "Data": "{\"description\":\"Test DWH\",\"locationName\":\"test location\",\"address\":\"6-62,Karanala street,, gudur.\",\"name\":\"ABCD\"}",
//                     "ModifiedBy": "midhun",
//                     "IsActive": 1,
//                     "createdAt": "2019-10-21T10:18:35.119Z",
//                     "updatedAt": "2019-10-21T10:18:35.119Z",
//                     "ApplicationID":4,
//                     "children": []
//                 },
//                 {
//                     "NodeID": 4,
//                     "NodeName": "campus",
//                     "NodeShortName": "campus",
//                     "ParentID": 3,
//                     "NodeType": "enterprise-hierarchy",
//                     "TypeOf": "Campus",
//                     "PluginID": null,
//                     "CreatedDate": "2019-10-21T09:43:25.042Z",
//                     "LastModifiedDate": "2019-10-21T09:43:25.042Z",
//                     "CreatedBy": "midhun_sai",
//                     "Data": "campus Note",
//                     "ModifiedBy": "midhun_sai",
//                     "IsActive": 1,
//                     "createdAt": "2019-10-21T09:43:25.434Z",
//                     "updatedAt": "2019-10-21T09:43:25.434Z",
//                     "ApplicationID":0,
//                     "children": []
//                 }
//             ]
//         },
//         {
//             "NodeID": 8,
//             "NodeName": "South col",
//             "NodeShortName": "South col",
//             "ParentID": 1,
//             "NodeType": "enterprise-hierarchy",
//             "TypeOf": "Region",
//             "PluginID": null,
//             "CreatedDate": "2019-10-21T11:42:58.046Z",
//             "LastModifiedDate": "2019-10-21T11:42:58.046Z",
//             "CreatedBy": "midhun_sai",
//             "Data": "South col",
//             "ModifiedBy": "midhun_sai",
//             "IsActive": 1,
//             "createdAt": "2019-10-21T11:42:58.481Z",
//             "updatedAt": "2019-10-21T11:42:58.481Z",
//             "ApplicationID":0,
//             "children": [
//                 {
//                     "NodeID": 9,
//                     "NodeName": "Device Assesment",
//                     "NodeShortName": "Device Assesment",
//                     "ParentID": 8,
//                     "NodeType": "application",
//                     "TypeOf": "Sample Service",
//                     "PluginID": 4,
//                     "CreatedDate": "2019-10-21T11:49:15.096Z",
//                     "LastModifiedDate": "2019-10-21T11:49:15.096Z",
//                     "CreatedBy": "midhun",
//                     "Data": "{\"description\":\"Test DWH\",\"locationName\":\"test location\",\"address\":\"6-62,Karanala street,, gudur.\",\"name\":\"Device Assesment\"}",
//                     "ModifiedBy": "midhun",
//                     "IsActive": 1,
//                     "createdAt": "2019-10-21T11:49:15.986Z",
//                     "updatedAt": "2019-10-21T11:49:15.986Z",
//                     "ApplicationID":6,
//                     "children": []
//                 },
//                 {
//                     "NodeID": 10,
//                     "NodeName": "Sample service123",
//                     "NodeShortName": "Sample service123",
//                     "ParentID": 8,
//                     "NodeType": "application",
//                     "TypeOf": "Sample Service",
//                     "PluginID": 4,
//                     "CreatedDate": "2019-10-21T11:49:44.099Z",
//                     "LastModifiedDate": "2019-10-21T11:49:44.099Z",
//                     "CreatedBy": "midhun",
//                     "Data": "{\"description\":\"fedsf\",\"locationName\":\"fsf\",\"address\":\"6-62,Karanala street,, gudur.\",\"name\":\"Sample service123\"}",
//                     "ModifiedBy": "midhun",
//                     "IsActive": 1,
//                     "createdAt": "2019-10-21T11:49:45.034Z",
//                     "updatedAt": "2019-10-21T11:49:45.034Z",
//                     "ApplicationID":7,
//                     "children": []
//                 },
//                 {
//                     "NodeID": 11,
//                     "NodeName": "MSAS APP12",
//                     "NodeShortName": "MSAS APP12",
//                     "ParentID": 8,
//                     "NodeType": "application",
//                     "TypeOf": "Sample Service",
//                     "PluginID": 4,
//                     "CreatedDate": "2019-10-21T12:05:18.053Z",
//                     "LastModifiedDate": "2019-10-21T12:05:18.053Z",
//                     "CreatedBy": "midhun",
//                     "Data": "{\"description\":\"Test DWH\",\"locationName\":\"test location\",\"address\":\"6-62,Karanala street,, gudur.\",\"name\":\"MSAS APP12\"}",
//                     "ModifiedBy": "midhun",
//                     "IsActive": 1,
//                     "createdAt": "2019-10-21T12:05:18.546Z",
//                     "updatedAt": "2019-10-21T12:05:18.546Z",
//                     "ApplicationID":8,
//                     "children": []
//                 }
//             ]
//         },
//         {
//             "NodeID": 12,
//             "NodeName": "West col",
//             "NodeShortName": "West col",
//             "ParentID": 1,
//             "NodeType": "enterprise-hierarchy",
//             "TypeOf": "Region",
//             "PluginID": null,
//             "CreatedDate": "2019-10-22T09:09:53.056Z",
//             "LastModifiedDate": "2019-10-22T09:09:53.056Z",
//             "CreatedBy": "midhun_sai",
//             "Data": "west col",
//             "ModifiedBy": "midhun_sai",
//             "IsActive": 1,
//             "createdAt": "2019-10-22T09:09:53.636Z",
//             "updatedAt": "2019-10-22T09:09:53.636Z",
//             "ApplicationID":0,
//             "children": [
//                 {
//                     "NodeID": 13,
//                     "NodeName": "campus",
//                     "NodeShortName": "campus",
//                     "ParentID": 12,
//                     "NodeType": "enterprise-hierarchy",
//                     "TypeOf": "Campus",
//                     "PluginID": null,
//                     "CreatedDate": "2019-10-22T09:10:28.036Z",
//                     "LastModifiedDate": "2019-10-22T09:10:28.036Z",
//                     "CreatedBy": "midhun_sai",
//                     "Data": "campus",
//                     "ModifiedBy": "midhun_sai",
//                     "IsActive": 1,
//                     "createdAt": "2019-10-22T09:10:28.380Z",
//                     "updatedAt": "2019-10-22T09:10:28.380Z",
//                     "ApplicationID":0,
//                     "children": [
//                         {
//                             "NodeID": 14,
//                             "NodeName": "MN1",
//                             "NodeShortName": "MN1",
//                             "ParentID": 13,
//                             "NodeType": "application",
//                             "TypeOf": "Mednet",
//                             "PluginID": 2,
//                             "CreatedDate": "2019-10-22T09:14:02.055Z",
//                             "LastModifiedDate": "2019-10-22T09:14:02.055Z",
//                             "CreatedBy": "midhun",
//                             "Data": "{\"Description\":\"campus mednet1\",\"ServiceAddress\":\"http://localhost:4001\",\"Name\":\"MN1\"}",
//                             "ModifiedBy": "midhun",
//                             "IsActive": 1,
//                             "createdAt": "2019-10-22T09:14:02.675Z",
//                             "updatedAt": "2019-10-22T09:14:02.675Z",
//                             "ApplicationID":9,
//                             "children": []
//                         }
//                     ]
//                 }
//             ]
//         }
//     ]
// }
// ]
//   };

//   data=`{ "data": [
//     {
//         "NodeID": 1,
//         "NodeName": "Kaiser Permanente",
//         "NodeShortName": "Kaiser Permanente",
//         "ParentID": null,
//         "NodeType": "enterprise-hierarchy",
//         "TypeOf": "enterprise-configurartor",
//         "PluginID": null,
//         "CreatedDate": "2019-10-21T09:28:48.037Z",
//         "LastModifiedDate": "2019-10-21T09:28:48.037Z",
//         "CreatedBy": "midhun_sai",
//         "Data": null,
//         "ModifiedBy": "midhun_sai",
//         "IsActive": 1,
//         "createdAt": "2019-10-21T09:28:48.399Z",
//         "updatedAt": "2019-10-21T09:28:48.399Z",
//         "applicationID":0,
//         "children": [
//             {
//                 "NodeID": 2,
//                 "NodeName": "Sample service",
//                 "NodeShortName": "Sample service",
//                 "ParentID": 1,
//                 "NodeType": "application",
//                 "TypeOf": "Sample Service",
//                 "PluginID": 4,
//                 "CreatedDate": "2019-10-21T09:35:36.010Z",
//                 "LastModifiedDate": "2019-10-21T09:35:36.010Z",
//                 "CreatedBy": "midhun",
//                 "Data": "{\"description\":\"Test device Assignments\",\"locationName\":\"test location\",\"address\":\"7th floor, ICU Medical, Prestige Palladium Bayan,, Greams Road, Nungumbakam\",\"name\":\"Sample service\"}",
//                 "ModifiedBy": "midhun",
//                 "IsActive": 1,
//                 "createdAt": "2019-10-21T09:35:36.147Z",
//                 "updatedAt": "2019-10-21T09:35:36.147Z",
//                 "applicationID":1,
//                 "children": []
//             },
//             {
//                 "NodeID": 5,
//                 "NodeName": "Sample service12",
//                 "NodeShortName": "Sample service12",
//                 "ParentID": 1,
//                 "NodeType": "application",
//                 "TypeOf": "Sample Service",
//                 "PluginID": 4,
//                 "CreatedDate": "2019-10-21T09:43:54.058Z",
//                 "LastModifiedDate": "2019-10-21T09:43:54.058Z",
//                 "CreatedBy": "midhun",
//                 "Data": "{\"description\":\"Test DWH12\",\"locationName\":\"test location\",\"address\":\"6-62,Karanala street,, gudur.\",\"name\":\"Sample service12\"}",
//                 "ModifiedBy": "midhun",
//                 "IsActive": 1,
//                 "createdAt": "2019-10-21T09:43:54.620Z",
//                 "updatedAt": "2019-10-21T09:43:54.620Z",
//                 "applicationID":2,
//                 "children": []
//             },
//             {
//                 "NodeID": 3,
//                 "NodeName": "North col",
//                 "NodeShortName": "North col",
//                 "ParentID": 1,
//                 "NodeType": "enterprise-hierarchy",
//                 "TypeOf": "Region",
//                 "PluginID": null,
//                 "CreatedDate": "2019-10-21T09:36:18.047Z",
//                 "LastModifiedDate": "2019-10-21T09:36:18.047Z",
//                 "CreatedBy": "midhun_sai",
//                 "Data": "North Col",
//                 "ModifiedBy": "midhun_sai",
//                 "IsActive": 1,
//                 "createdAt": "2019-10-21T09:36:18.511Z",
//                 "updatedAt": "2019-10-21T09:36:18.511Z",
//                 "applicationID":0,
//                 "children": [
//                     {
//                         "NodeID": 6,
//                         "NodeName": "MSAS APP12",
//                         "NodeShortName": "MSAS APP12",
//                         "ParentID": 3,
//                         "NodeType": "application",
//                         "TypeOf": "Sample Service",
//                         "PluginID": 4,
//                         "CreatedDate": "2019-10-21T10:18:14.004Z",
//                         "LastModifiedDate": "2019-10-21T10:18:14.004Z",
//                         "CreatedBy": "midhun",
//                         "Data": "{\"description\":\"fedsf\",\"locationName\":\"test location\",\"address\":\"Big Mosque street, Gudur\",\"name\":\"MSAS APP12\"}",
//                         "ModifiedBy": "midhun",
//                         "IsActive": 1,
//                         "createdAt": "2019-10-21T10:18:14.089Z",
//                         "updatedAt": "2019-10-21T10:18:14.089Z",
//                         "applicationID":3,
//                         "children": []
//                     },
//                     {
//                         "NodeID": 7,
//                         "NodeName": "ABCD",
//                         "NodeShortName": "ABCD",
//                         "ParentID": 3,
//                         "NodeType": "application",
//                         "TypeOf": "Sample Service",
//                         "PluginID": 4,
//                         "CreatedDate": "2019-10-21T10:18:35.007Z",
//                         "LastModifiedDate": "2019-10-21T10:18:35.007Z",
//                         "CreatedBy": "midhun",
//                         "Data": "{\"description\":\"Test DWH\",\"locationName\":\"test location\",\"address\":\"6-62,Karanala street,, gudur.\",\"name\":\"ABCD\"}",
//                         "ModifiedBy": "midhun",
//                         "IsActive": 1,
//                         "createdAt": "2019-10-21T10:18:35.119Z",
//                         "updatedAt": "2019-10-21T10:18:35.119Z",
//                         "applicationID":4,
//                         "children": []
//                     },
//                     {
//                         "NodeID": 4,
//                         "NodeName": "campus",
//                         "NodeShortName": "campus",
//                         "ParentID": 3,
//                         "NodeType": "enterprise-hierarchy",
//                         "TypeOf": "Campus",
//                         "PluginID": null,
//                         "CreatedDate": "2019-10-21T09:43:25.042Z",
//                         "LastModifiedDate": "2019-10-21T09:43:25.042Z",
//                         "CreatedBy": "midhun_sai",
//                         "Data": "campus Note",
//                         "ModifiedBy": "midhun_sai",
//                         "IsActive": 1,
//                         "createdAt": "2019-10-21T09:43:25.434Z",
//                         "updatedAt": "2019-10-21T09:43:25.434Z",
//                         "applicationID":0,
//                         "children": []
//                     }
//                 ]
//             },
//             {
//                 "NodeID": 8,
//                 "NodeName": "South col",
//                 "NodeShortName": "South col",
//                 "ParentID": 1,
//                 "NodeType": "enterprise-hierarchy",
//                 "TypeOf": "Region",
//                 "PluginID": null,
//                 "CreatedDate": "2019-10-21T11:42:58.046Z",
//                 "LastModifiedDate": "2019-10-21T11:42:58.046Z",
//                 "CreatedBy": "midhun_sai",
//                 "Data": "South col",
//                 "ModifiedBy": "midhun_sai",
//                 "IsActive": 1,
//                 "createdAt": "2019-10-21T11:42:58.481Z",
//                 "updatedAt": "2019-10-21T11:42:58.481Z",
//                 "applicationID":0,
//                 "children": [
//                     {
//                         "NodeID": 9,
//                         "NodeName": "Device Assesment",
//                         "NodeShortName": "Device Assesment",
//                         "ParentID": 8,
//                         "NodeType": "application",
//                         "TypeOf": "Sample Service",
//                         "PluginID": 4,
//                         "CreatedDate": "2019-10-21T11:49:15.096Z",
//                         "LastModifiedDate": "2019-10-21T11:49:15.096Z",
//                         "CreatedBy": "midhun",
//                         "Data": "{\"description\":\"Test DWH\",\"locationName\":\"test location\",\"address\":\"6-62,Karanala street,, gudur.\",\"name\":\"Device Assesment\"}",
//                         "ModifiedBy": "midhun",
//                         "IsActive": 1,
//                         "createdAt": "2019-10-21T11:49:15.986Z",
//                         "updatedAt": "2019-10-21T11:49:15.986Z",
//                         "applicationID":5,
//                         "children": []
//                     },
//                     {
//                         "NodeID": 10,
//                         "NodeName": "Sample service123",
//                         "NodeShortName": "Sample service123",
//                         "ParentID": 8,
//                         "NodeType": "application",
//                         "TypeOf": "Sample Service",
//                         "PluginID": 4,
//                         "CreatedDate": "2019-10-21T11:49:44.099Z",
//                         "LastModifiedDate": "2019-10-21T11:49:44.099Z",
//                         "CreatedBy": "midhun",
//                         "Data": "{\"description\":\"fedsf\",\"locationName\":\"fsf\",\"address\":\"6-62,Karanala street,, gudur.\",\"name\":\"Sample service123\"}",
//                         "ModifiedBy": "midhun",
//                         "IsActive": 1,
//                         "createdAt": "2019-10-21T11:49:45.034Z",
//                         "updatedAt": "2019-10-21T11:49:45.034Z",
//                         "applicationID":6,
//                         "children": []
//                     },
//                     {
//                         "NodeID": 11,
//                         "NodeName": "MSAS APP12",
//                         "NodeShortName": "MSAS APP12",
//                         "ParentID": 8,
//                         "NodeType": "application",
//                         "TypeOf": "Sample Service",
//                         "PluginID": 4,
//                         "CreatedDate": "2019-10-21T12:05:18.053Z",
//                         "LastModifiedDate": "2019-10-21T12:05:18.053Z",
//                         "CreatedBy": "midhun",
//                         "Data": "{\"description\":\"Test DWH\",\"locationName\":\"test location\",\"address\":\"6-62,Karanala street,, gudur.\",\"name\":\"MSAS APP12\"}",
//                         "ModifiedBy": "midhun",
//                         "IsActive": 1,
//                         "createdAt": "2019-10-21T12:05:18.546Z",
//                         "updatedAt": "2019-10-21T12:05:18.546Z",
//                         "applicationID":7,
//                         "children": []
//                     }
//                 ]
//             },
//             {
//                 "NodeID": 12,
//                 "NodeName": "West col",
//                 "NodeShortName": "West col",
//                 "ParentID": 1,
//                 "NodeType": "enterprise-hierarchy",
//                 "TypeOf": "Region",
//                 "PluginID": null,
//                 "CreatedDate": "2019-10-22T09:09:53.056Z",
//                 "LastModifiedDate": "2019-10-22T09:09:53.056Z",
//                 "CreatedBy": "midhun_sai",
//                 "Data": "west col",
//                 "ModifiedBy": "midhun_sai",
//                 "IsActive": 1,
//                 "createdAt": "2019-10-22T09:09:53.636Z",
//                 "updatedAt": "2019-10-22T09:09:53.636Z",
//                 "applicationID":0,
//                 "children": [
//                     {
//                         "NodeID": 13,
//                         "NodeName": "campus",
//                         "NodeShortName": "campus",
//                         "ParentID": 12,
//                         "NodeType": "enterprise-hierarchy",
//                         "TypeOf": "Campus",
//                         "PluginID": null,
//                         "CreatedDate": "2019-10-22T09:10:28.036Z",
//                         "LastModifiedDate": "2019-10-22T09:10:28.036Z",
//                         "CreatedBy": "midhun_sai",
//                         "Data": "campus",
//                         "ModifiedBy": "midhun_sai",
//                         "IsActive": 1,
//                         "createdAt": "2019-10-22T09:10:28.380Z",
//                         "updatedAt": "2019-10-22T09:10:28.380Z",
//                         "applicationID":0,
//                         "children": [
//                             {
//                                 "NodeID": 14,
//                                 "NodeName": "MN1",
//                                 "NodeShortName": "MN1",
//                                 "ParentID": 13,
//                                 "NodeType": "application",
//                                 "TypeOf": "Mednet",
//                                 "PluginID": 2,
//                                 "CreatedDate": "2019-10-22T09:14:02.055Z",
//                                 "LastModifiedDate": "2019-10-22T09:14:02.055Z",
//                                 "CreatedBy": "midhun",
//                                 "Data": "{\"Description\":\"campus mednet1\",\"ServiceAddress\":\"http://localhost:4001\",\"Name\":\"MN1\"}",
//                                 "ModifiedBy": "midhun",
//                                 "IsActive": 1,
//                                 "createdAt": "2019-10-22T09:14:02.675Z",
//                                 "updatedAt": "2019-10-22T09:14:02.675Z",
//                                 "applicationID":8,
//                                 "children": []
//                             }
//                         ]
//                     }
//                 ]
//             }
//         ]
//     }
// ]}`;
// }

}
