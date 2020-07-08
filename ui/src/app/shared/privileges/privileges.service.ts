import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { SiteRoleInfo } from '../roles/role-Info';
import { SiteUserInfo, SiteLdapGroupInfo } from '../users/user-Info';
import { AppConfig } from 'src/app/app.config';

@Injectable({
  providedIn: 'root'
})
export class PrivilegesService {
  applicationPrivileges = new BehaviorSubject([]);
  sitePrivilegeRoleInfo = new BehaviorSubject < SiteRoleInfo[] > ([]);

  sitePrivilegeUserInfo = new BehaviorSubject < SiteUserInfo[] > ([]);

  sitePrivilegeLdapInfo = new BehaviorSubject < SiteLdapGroupInfo[] > ([]);

  //apiPath = "http://localhost:3001/api/v1/";
  applicationConfig = AppConfig.settings.env

  apiPath = this.applicationConfig.baseUrl+this.applicationConfig.apiVersion;

  constructor(private http: HttpClient) {
    // this.getApplicationPrivilegesList();
  }

  getApplicationPrivilegesList() {
    this.http.get(this.apiPath + "ApplicationPrivileges").toPromise().then(applicationPrivilegeList => {      
      this.applicationPrivileges.next(applicationPrivilegeList["ApplicationPrivilegeResponse"].Applications);
      //callback(true);
    }).catch(err => {
      //callback(null, err);
      //return false;
    });
  }

  getPrivilegeSiteRoleInfo(selectedPrivileges) {
    if (selectedPrivileges.length > 0) {
      this.http.post(this.apiPath + "PrivilegesRoles", this.generatePrivilegesBody(selectedPrivileges, "Roles"), {
        headers: {
          'Content-Type': 'application/xml'
        }
      }).toPromise().then(privilegeRoleInfo => {
        this.sitePrivilegeRoleInfo.next(privilegeRoleInfo["PrivilegeRolesResponse"].SiteRoles);
      }).catch(err => {});
    } else {
      this.sitePrivilegeRoleInfo.next([]);
    }
  }

  getPrivilegeSiteUserInfo(selectedPrivileges) {
    if (selectedPrivileges.length > 0) {
      this.http.post(this.apiPath + "PrivilegesUsers", this.generatePrivilegesBody(selectedPrivileges, "Users"), {
        headers: {
          'Content-Type': 'application/xml'
        }
      }).toPromise().then(privilegeUserInfo => {
        this.sitePrivilegeUserInfo.next(privilegeUserInfo["PrivilegeUsersResponse"].SiteUsers);
      }).catch(err => {});
    } else {
      this.sitePrivilegeUserInfo.next([]);
    }
  }

  getPrivilegeSiteLdapInfo(selectedPrivileges) {
    if (selectedPrivileges.length > 0) {
      this.http.post(this.apiPath + "PrivilegesLdapGroups", this.generatePrivilegesBody(selectedPrivileges, "Ldap"), {
        headers: {
          'Content-Type': 'application/xml'
        }
      }).toPromise().then(privilegeLdapInfo => {
        this.sitePrivilegeLdapInfo.next(privilegeLdapInfo["PrivilegeLdapGroupsResponse"].SiteLdapGroups);
      }).catch(err => {});
    } else {
      this.sitePrivilegeLdapInfo.next([]);
    }
  }

  generatePrivilegesBody(selectedPrivileges, requestHeader) {
    let requestRoleStartBody = `<privilegerolerequest>`;
    let requestRoleEndBody = `</privilegerolerequest>`;
    let requestUserStartBody = `<privilegeuserrequest>`;
    let requestUserEndBody = `</privilegeuserrequest>`;
    let requestLdapStartBody = `<privilegeldaprequest>`;
    let requestLdapEndBody = `</privilegeldaprequest>`;
    let privilegeBody = "";
    let request = "";

    selectedPrivileges.forEach(privilege => {
      privilegeBody += `<privilege>                       
                            <privilegeid>` + privilege + `</privilegeid>                            
                        </privilege>`;
    });
    if (requestHeader === "Roles") {
      request = requestRoleStartBody + privilegeBody + requestRoleEndBody;
    } else if (requestHeader === "Users") {
      request = requestUserStartBody + privilegeBody + requestUserEndBody;
    } else if (requestHeader === "Ldap") {
      request = requestLdapStartBody + privilegeBody + requestLdapEndBody;
    }
    return request;
    //return ((requestHeader==="Roles")?requestRoleStartBody:requestUserStartBody) + privilegeBody + ((requestHeader==="Roles")?requestRoleEndBody:requestUserEndBody);
  }

}
