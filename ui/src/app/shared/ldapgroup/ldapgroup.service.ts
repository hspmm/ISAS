import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {  LdapInfo } from './ldap-info';
import { BehaviorSubject } from 'rxjs';
import { SettingsService } from '../settings/settings.service';
import { AppConfig } from 'src/app/app.config';

@Injectable({
  providedIn: 'root'
})
export class LdapGroupService {

  applicationConfig = AppConfig.settings.env

  apiPath = this.applicationConfig.baseUrl+this.applicationConfig.apiVersion;
  //apiPath = "http://localhost:3001/api/v1/";

  domainInfo= new BehaviorSubject<LdapInfo[]>([]);

  constructor(private http: HttpClient, private settingsService:SettingsService) { }

  getLdapList(callback) {
    this.http.get(this.apiPath+"ldapinfo").toPromise().then(ldapList => {    
      this.domainInfo.next(ldapList["LdapDetailsResponse"].LdapDetails.map((ldap)=>ldap.Ldap));
      callback(ldapList["LdapDetailsResponse"].LdapDetails.map((ldap)=>ldap.Ldap));
    }).catch(err => {
      callback(null, err);
    });
  }

  getLdapGroupList(ldapConfigId,callback) {
   
    this.http.post(this.apiPath + "ldapgroupinfo", {
      "ldapgrouprequest": {
        "ldapconfigid": ldapConfigId.toString()
      }
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).toPromise().then(ldapGroupList => {
      
      callback( ldapGroupList["LdapGroupDetailsResponse"].LdapDetails[0]);
    }).catch(err => {
      callback(null, err);
    });
  }

  getLdapGroupUserList(ldapConfigId,groupName,filter,callback) {
    this.http.post(this.apiPath + "ldapgroupuserinfo", {
      "ldapgroupuserrequest": {
        "ldapconfigid": ldapConfigId.toString(),
        "groupname": groupName.toString(),
        "filter":filter.toString()
      }
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).toPromise().then(ldapGroupList => {
      callback( ldapGroupList["LdapGroupUsersDetailsResponse"].LdapDetails[0]);
    }).catch(err => {
      callback(null, err);
    });
  }

 
  saveLdapInfo(ldapDetails, callback) {
    this.http.post(this.apiPath + "ldap/registration", this.generateLdapRegistrationBody(ldapDetails), {
      headers: {
        'Content-Type': 'application/xml'
      }
    }).toPromise().then(ldapInfo => {
      callback(ldapInfo["LdapRegistrationResponse"].LdapDetails);
    }).catch(err => {
      callback(null, err);
    });
  }

  updateLdapInfo(ldapDetails, callback) {
    
    this.http.post(this.apiPath + "ldap/update", this.generateLdapUpdateBody(ldapDetails), {
      headers: {
        'Content-Type': 'application/xml'
      }
    }).toPromise().then(ldapInfo => {
      callback(ldapInfo["LdapUpdateResponse"].LdapDetails);
    }).catch(err => {
      callback(null, err);
    });
  }

  deleteLdapInfo( callback) {
    this.http.post(this.apiPath + "ldap/Delete", {
      "ldapdelete": {
        "ldapconfigid": this.settingsService.selectedLdapId.value.toString()
      }
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).toPromise().then(ldapInfo => {
      callback(ldapInfo["LdapDeleteResponse"]);
    }).catch(err => {
      callback(null, err);
    });
  }

  generateLdapRegistrationBody(ldapDetails){
    let requestStartBody=`<ldapregistration>`;
    let requestEndBody=`</ldapregistration>`;
    let ldapBody =`<serverhostname>`+ldapDetails.ServerHostName+`</serverhostname>
                   <serverport>`+ldapDetails.ServerPort+`</serverport>
                   <domain>`+ldapDetails.Domain+`</domain>
                   <adminusername>`+ldapDetails.AdminUserName+`</adminusername>
                   <adminpassword>`+ldapDetails.AdminPassword+`</adminpassword>
                   <issslselected>`+ldapDetails.IsSslSelected+`</issslselected>`
    
    return requestStartBody+ldapBody+requestEndBody;
  }

  generateLdapUpdateBody(ldapDetails){
    let requestStartBody=`<ldapupdate>`;
    let requestEndBody=`</ldapupdate>`;

    let ldapBody =`<ldapconfigid>`+ldapDetails.LdapConfigId+`</ldapconfigid>
                   <serverhostname>`+ldapDetails.ServerHostName+`</serverhostname>
                   <serverport>`+ldapDetails.ServerPort+`</serverport>
                   <domain>`+ldapDetails.Domain+`</domain>
                   <adminusername>`+ldapDetails.AdminUserName+`</adminusername>
                   <adminpassword>`+ldapDetails.AdminPassword+`</adminpassword>
                   <issslselected>`+ldapDetails.IsSslSelected+`</issslselected>`
    
    return requestStartBody+ldapBody+requestEndBody;
  }

}
