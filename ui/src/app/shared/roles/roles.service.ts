import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { RoleList, RoleFullDetails, LdapGroupList, SiteRoleInfo, SiteRolePrivilegeInfo } from './role-Info';
import { SiteUserInfo, SiteLdapGroupInfo, SiteLdapPrivilegeInfo, SiteUserPrivilegeInfo } from '../users/user-Info';
import { SettingsService } from '../settings/settings.service';
import { AppConfig } from 'src/app/app.config';

import {AppServerUrl} from 'src/app/shared/config/app-serverurl';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  serverUrl = AppServerUrl();
  selectedRoleId = new BehaviorSubject(0);
  roleInfoList = new BehaviorSubject < RoleList[] > ([]);
  roleInfo: RoleFullDetails;

  siteRoleInfo = new BehaviorSubject<SiteRoleInfo[]>([]);
  siteRolePrivilegeInfo = new BehaviorSubject<SiteRolePrivilegeInfo[]>([]);

  siteUserInfo = new BehaviorSubject<SiteUserInfo[]>([]);

  siteUserPrivilegeInfo = new BehaviorSubject<SiteUserPrivilegeInfo[]>([]);

  siteLdapGroupInfo = new BehaviorSubject<SiteLdapGroupInfo[]>([]);

  siteLdapPrivilgeInfo = new BehaviorSubject<SiteLdapPrivilegeInfo[]>([]);

  ldapInfoList = new BehaviorSubject < LdapGroupList[] > ([]);

  ldapTreeData = new BehaviorSubject <any[] > ([]);

  siteInfo = new BehaviorSubject<[]> ([]);

  //apiPath = "http://localhost:3001/api/v1/";
  applicationConfig = AppConfig.settings.env

  apiPath = this.applicationConfig.baseUrl+this.applicationConfig.apiVersion;

  siteTreeErrorMessage = new BehaviorSubject<string>("");


  constructor(private http: HttpClient, private settingsService: SettingsService) {}

  getSiteInfo(callback) {
    this.http.get(this.apiPath + "siteinfo").toPromise().then(siteInfo => {
      this.siteInfo.next(siteInfo["SiteResponse"].Sites);
      callback(this.siteInfo);
    }).catch(err => {
      callback(null, err);
    });
  }

  getSiteInfoFromEC(callback) {
    this.http.post(this.apiPath + "siteinfo",{
      "siteinforequest": {
        "accesstoken": sessionStorage.getItem("sessionid")
      }
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).toPromise().then(siteInfo => {
      this.siteInfo.next(siteInfo["SiteResponse"].Sites);
      this.siteTreeErrorMessage.next("");
      callback(this.siteInfo);
    }).catch(err => {
      this.siteTreeErrorMessage.next(err.error.SiteResponse.ErrorText);
      callback(null, err);
    });
  }
  
  getRoleList(callback) {
    this.http.get(this.apiPath + this.serverUrl.roles).toPromise().then(roleList => {
      this.roleInfoList.next(roleList["RoleDetailsResponse"].Roles);
      callback(this.roleInfoList);
    }).catch(err => {
      callback(null, err);
    });
  }

  setRoleId(roleId) {
    // if (roleId === 0 || roleId != this.selectedRoleId.value) {
      this.selectedRoleId.next(roleId);
    // }
  }

  getRoleInfo(callback) {
    this.http.post(this.apiPath + "roleinfo", {
      "Roleinforequest": {
        "roleid": this.selectedRoleId.value.toString()
      }
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).toPromise().then(roleInfo => {
      this.roleInfo = roleInfo["RoleInformationResponse"].Role;
      callback(this.roleInfo);
    }).catch(err => {
      callback(null, err);
    });
  }

  getSiteRoleInfo(){
    this.http.get(this.apiPath + "siteroleinfo").toPromise().then(siteRole => {
      this.siteRoleInfo.next(siteRole["SiteRolesResponse"].SiteRoles);     
      this.siteRolePrivilegeInfo.next(siteRole["SiteRolesResponse"].SiteRolePrivileges);      
    }).catch(err => {
    });
  }

  getSiteUserInfo(){
    this.http.get(this.apiPath + "siteuserinfo").toPromise().then(siteUser => {
      this.siteUserInfo.next(siteUser["SiteUsersResponse"].SiteUsers);     
      this.siteUserPrivilegeInfo.next(siteUser["SiteUsersResponse"].SiteUserPrivileges);      
    }).catch(err => {
    });
  }

  getSiteLdapGroupInfo(){
    this.http.get(this.apiPath + "siteldapgroupinfo").toPromise().then(siteUser => {
      this.siteLdapGroupInfo.next(siteUser["SiteLdapGroupsResponse"].SiteLdapGroups);      
      this.siteLdapPrivilgeInfo.next(siteUser["SiteLdapGroupsResponse"].SiteLdapPrivileges);      
    }).catch(err => {
    });
  }

  saveRoleInfo(roleDetails, callback) {
    this.http.post(this.apiPath + "role/InfoRegistration", this.generateRoleAndPrivilegesBody(roleDetails, true), {
      headers: {
        'Content-Type': 'application/xml'
      }
    }).toPromise().then(roleInfo => {
      this.roleInfo = roleInfo["RoleRegistrationResponse"].RoleDetails;
      callback(this.roleInfo);
    }).catch(err => {
      callback(null, err);
    });
  }

  deleteRoleInfo(callback){
    this.http.post(this.apiPath + "role/Delete", {
      "RoleDeleterequest": {
        "roleid": this.selectedRoleId.value.toString()
      }
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).toPromise().then(roleInfo => {
      callback(roleInfo["RoleDeleteResponse"].RoleId);
    }).catch(err => {
      callback(null, err);
    });
  }

  updateRoleInfo(roleDetails, callback) {
    this.http.post(this.apiPath + "role/update", this.generateRoleAndPrivilegesBody(roleDetails, false), {
      headers: {
        'Content-Type': 'application/xml'
      }
    }).toPromise().then(roleInfo => {
      
      this.roleInfo = roleInfo["RoleUpdateResponse"].RoleDetails;
      callback(this.roleInfo);
    }).catch(err => {
      callback(null, err);
    });
  }

  // generateRoleAndPrivilegesBody(roleDetails, isInsert) {
  //   let requestInsertStartBody = `<roleregistration>`;
  //   let requestInsertEndBody = `</roleregistration>`;
  //   let requestUpdateStartBody = `<roleupdate>`;
  //   let requestUpdateEndBody = `</roleupdate>`;
  //   let privilegeDetailsStartTag = '<privilegedetails>';
  //   let privilegeDetailsEndTag = '</privilegedetails>';
  //   let groupDetailsStartBody="<groupdetails>";
  //   let groupDetailsEndBody="</groupdetails>";
  //   let userDetailsStartBody="<userdetails>";
  //   let userDetailsEndBody="</userdetails>";
  //   let privilegeBody = "";
  //   let roleBody = "";
  //   let groupBody = "";
  //   let userBody = "";

  //   roleDetails.MappedPrivileges.forEach(privilege => {
  //     roleDetails.MappedSites.forEach(site =>{
  //                 privilegeBody += `<privilege>
  //                 <siteid>` + site.SiteId + `</siteid>
  //                 <privilegeid>` + privilege.PrivilegeId + `</privilegeid>
  //                 <privilegename>` + privilege.PrivilegeName + `</privilegename>
  //             </privilege>`;
  //     });    
  //   });

  //   roleDetails.MappedGroups.forEach(group => {
  //     groupBody += `<group>
  //                           <groupid>` + group.GroupId + `</groupid>                           
  //                   </group>`;
  //   });

  //   roleDetails.MappedUsers.forEach(user => {
  //     userBody += `<user>
  //                           <userid>` + user.User.UserId + `</userid>                           
  //                   </user>`;
  //   });

  //   roleBody = `<role>
  //             <name>` + roleDetails.RoleDetails.RoleName + `</name>
  //             <roledescription>` + roleDetails.RoleDetails.RoleDescription + `</roledescription>              
  //             </role>`;
  //   if (isInsert) {
  //     //return (privilegeBody.length > 0) ? requestInsertStartBody + roleBody + privilegeDetailsStartTag + privilegeBody + privilegeDetailsEndTag + requestInsertEndBody : requestInsertStartBody + roleBody + requestInsertEndBody;
  //     return  requestInsertStartBody + roleBody + ((privilegeBody.length > 0)? privilegeDetailsStartTag + privilegeBody + privilegeDetailsEndTag:"")+ ((groupBody.length >0)? groupDetailsStartBody+groupBody+groupDetailsEndBody:"") + ((userBody.length >0)? userDetailsStartBody+userBody+userDetailsEndBody:"")+ requestInsertEndBody;
  //   } else {
  //     roleBody = `<role>
  //               <id>` + roleDetails.RoleDetails.RoleId + `</id>
  //               <name>` + roleDetails.RoleDetails.RoleName + `</name>
  //               <roledescription>` + roleDetails.RoleDetails.RoleDescription + `</roledescription>              
  //              </role>`;
  //     //return (privilegeBody.length > 0) ? requestUpdateStartBody + roleBody + privilegeDetailsStartTag + privilegeBody + privilegeDetailsEndTag + requestUpdateEndBody : requestUpdateStartBody + roleBody + requestUpdateEndBody;
  //     return requestUpdateStartBody + roleBody +((privilegeBody.length > 0) ? privilegeDetailsStartTag + privilegeBody + privilegeDetailsEndTag:"")  + ((groupBody.length > 0) ? groupDetailsStartBody+groupBody+groupDetailsEndBody:"") + ((userBody.length >0)? userDetailsStartBody+userBody+userDetailsEndBody:"")+ requestUpdateEndBody;
  //   }
  // }

  generateRoleAndPrivilegesBody(roleDetails, isInsert) {
    let requestInsertStartBody = `<roleregistration>`;
    let requestInsertEndBody = `</roleregistration>`;
    let requestUpdateStartBody = `<roleupdate>`;
    let requestUpdateEndBody = `</roleupdate>`;
    let privilegeDetailsStartTag = '<privilegedetails>';
    let privilegeDetailsEndTag = '</privilegedetails>';
    let siteDetailsStartTag = '<sitedetails>';
    let siteDetailsEndTag = '</sitedetails>';
    let groupDetailsStartBody="<groupdetails>";
    let groupDetailsEndBody="</groupdetails>";
    let userDetailsStartBody="<userdetails>";
    let userDetailsEndBody="</userdetails>";

    let siteBody = "";
    let privilegeBody = "";
    let roleBody = "";
    let groupBody = "";
    let userBody = "";
    let selectedModelBody="";

    //let selectedSecurityModel=this.usersService.selectedSecurityModel.value;
    let selectedSecurityModel=this.settingsService.selectedSecurityModel.value;
    
  
    roleDetails.MappedGroups.forEach(group => {
        groupBody += `<group>
                              <groupid>` + group.GroupId + `</groupid>                           
                      </group>`;
      });
     
      roleDetails.MappedUsers.forEach(user => {
        userBody += `<user>
                              <userid>` + user.User.UserId + `</userid>                           
                      </user>`;
      });    

     // LDAP Model Selected
    if(selectedSecurityModel==="LDAP")
    {
      selectedModelBody+=`<securitymodel>LDAP</securitymodel>`;
    }
     // LDAP Model Selected
     else if(selectedSecurityModel==="Imprivata")
     {
       selectedModelBody+=`<securitymodel>Imprivata</securitymodel>`;
     }
    // Standalone Model Selected
    else{
      selectedModelBody+=`<securitymodel>ISAS</securitymodel>`;
    }

    roleDetails.MappedSites.forEach(site =>{
      siteBody += `<site>
        <siteid>` + site.SiteId + `</siteid>
      </site>`;
    });

    roleDetails.MappedPrivileges.forEach(privilege => {    
                  privilegeBody += `<privilege>
                  <privilegeid>` + privilege.PrivilegeId + `</privilegeid>
                  <privilegename>` + privilege.PrivilegeName + `</privilegename>
              </privilege>`;
    }); 

    roleBody = `<role>
              <name>` + roleDetails.RoleDetails.RoleName + `</name>
              <roledescription>` + roleDetails.RoleDetails.RoleDescription + `</roledescription>              
              </role>`;
    if (isInsert) {
   //return  requestInsertStartBody + roleBody + ((privilegeBody.length > 0)? privilegeDetailsStartTag + privilegeBody + privilegeDetailsEndTag:"")+ ((groupBody.length >0)? groupDetailsStartBody+groupBody+groupDetailsEndBody:"") + ((userBody.length >0)? userDetailsStartBody+userBody+userDetailsEndBody:"")+ requestInsertEndBody;     
      return  requestInsertStartBody +selectedModelBody+ roleBody +((siteBody.length > 0) ? siteDetailsStartTag + siteBody + siteDetailsEndTag :"") +((privilegeBody.length > 0)? privilegeDetailsStartTag + privilegeBody + privilegeDetailsEndTag:"")+ ((groupBody.length >0)? groupDetailsStartBody+groupBody+groupDetailsEndBody:"") + ((userBody.length >0)? userDetailsStartBody+userBody+userDetailsEndBody:"")+ requestInsertEndBody;     
    } else {
      roleBody = `<role>
                <id>` + roleDetails.RoleDetails.RoleId + `</id>
                <name>` + roleDetails.RoleDetails.RoleName + `</name>
                <roledescription>` + roleDetails.RoleDetails.RoleDescription + `</roledescription>              
               </role>`;
        return requestUpdateStartBody +selectedModelBody+ roleBody +((siteBody.length > 0) ? siteDetailsStartTag + siteBody + siteDetailsEndTag :"") +((privilegeBody.length > 0) ? privilegeDetailsStartTag + privilegeBody + privilegeDetailsEndTag:"")  + ((groupBody.length > 0) ? groupDetailsStartBody+groupBody+groupDetailsEndBody:"") + ((userBody.length >0)? userDetailsStartBody+userBody+userDetailsEndBody:"")+ requestUpdateEndBody;
    }
  }

  getLdapGroups(callback) {
    this.http.get(this.apiPath + "LdapGroups").toPromise().then(ldapGroups => {  
      this.ldapInfoList.next(ldapGroups["LdapGroupDetailsResponse"].LdapDetails.map((ldap)=>{
        return {
          Ldap:{
            LdapId:ldap.Ldap.LdapId,
            DomainName:ldap.Ldap.DomainName,
            LdapGroups: ldap.Ldap.LdapGroups.map((group)=>{
              return group.Group;
            })
          }
        }
      }));
      this.GenerateLdapTreeData();
      callback(this.ldapInfoList);
    }).catch(err => {
      callback(null, err);
    });
  }

  GenerateLdapTreeData()
  {
    // let ldapData={
      let ldapData=[];
    // };
    
    if(this.ldapInfoList.value.length>0)
    {
      this.ldapInfoList.value.forEach(element=>{
        let ldapId=element.Ldap.LdapId;
        let nodeName=element.Ldap.DomainName;
        let ldapConfigId=element.Ldap.LdapId;
        let nodeType="Domain";
        let selected=false;
        let domainNode=this.GenerateLdapNodeData(ldapId,nodeName,ldapConfigId,nodeType,selected);
        if(element.Ldap.LdapGroups.length>0)
        {
          let groupHeader=this.GenerateLdapNodeData(ldapId,"Groups",ldapConfigId,"GroupHeader",false);
          element.Ldap.LdapGroups.forEach(group =>{
           let groupDetails=this.GenerateLdapNodeData(group.GroupId,group.GroupName,ldapConfigId,"Group",false);
           groupHeader.Children.push(groupDetails);
          });
          domainNode.Children.push(groupHeader);         
        } 
        else{
          let groupHeader=this.GenerateLdapNodeData(ldapId,"Groups",ldapConfigId,"GroupHeader",false);          
          domainNode.Children.push(groupHeader);   
        }    
        ldapData.push(domainNode);   
      });
    }
    this.ldapTreeData.next(ldapData);
  }
  
  GenerateLdapNodeData(nodeId,nodeName,ldapConfigId,nodeType,selected)
  {
    let nodeObject={
      NodeId:nodeId,
      NodeName:nodeName,
      NodeType:nodeType,
      LdapConfigId:ldapConfigId,
      Selected:selected,
      Children:[]
    };
    return nodeObject;
  }
 
}
