import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { AppConfig } from 'src/app/app.config';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  selectedSecurityModel= new BehaviorSubject("");

  selectedLdapId = new BehaviorSubject(0);

  selectedImprivataId = new BehaviorSubject(0);

  applications = new BehaviorSubject([]);

  //apiPath = "http://localhost:3001/api/v1/";

  applicationConfig = AppConfig.settings.env

  apiPath = this.applicationConfig.baseUrl+this.applicationConfig.apiVersion;

  constructor(private http: HttpClient) { }

  updateSecurityModelDetails(securityModelDetails,callback) {
    this.http.post(this.apiPath+"UpdateSecurityModelInfo",this.generateSecurityModelUpdateBody(securityModelDetails), {
     headers : {
         'Content-Type' : 'application/xml'
     }}).toPromise().then(securityModelInfo => {        
     callback(securityModelInfo["SecurityModelDetailsResponse"].SecurityModel);
   }).catch(err => {
     callback(null, err);
   });
  }

  getSecurityModelInfo(callback){
    this.http.get(this.apiPath + "SecurityModelInfo").toPromise().then(securityModelInfo => {
      callback(securityModelInfo['SecurityModelDetailsResponse'].SecurityModel);     
    }).catch(err => {
      callback(null, err);
    });
  }


  generateSecurityModelUpdateBody(securityModelDetails){
      let requestStartBody=`<securitymodelupdaterequest>`;
      let requestEndBody=`</securitymodelupdaterequest>`;
      let securityModelBody="";
      
      securityModelBody=`<securitymodel>`+securityModelDetails+`</securitymodel>`; 
      
      return requestStartBody+securityModelBody+requestEndBody;
  }

  getApplicationsList() {
    this.http.get(this.apiPath + "Applications").toPromise().then(applicationsList => {
      this.applications.next(applicationsList["ApplicationDetailsResponse"].Applications);
      //callback(true);
    }).catch(err => {
      //callback(null, err);
      //return false;
    });
  }

  setLdapId(ldapId) {
    if (ldapId === 0 || ldapId != this.selectedLdapId.value) {
      this.selectedLdapId.next(ldapId);
    }
  }

  setImprivataId(imprivataId) {
    if (imprivataId === 0 || imprivataId != this.selectedImprivataId.value) {
      this.selectedImprivataId.next(imprivataId);
    }
  }

  getLockoutInfo(callback){
    this.http.get(this.apiPath + "LockoutInfo").toPromise().then(lockoutInfo => {
      callback(lockoutInfo['LockoutDetailsResponse'].LockoutDetails);     
    }).catch(err => {
      callback(null, err);
    });
  }

  getGeneralConfig(callback){
    this.http.get(this.apiPath + "GeneralConfig").toPromise().then(generalConfig => {
      callback(generalConfig['GeneralConfigResponse'].GeneralConfig);     
    }).catch(err => {
      callback(null, err);
    });
  }

  saveGeneralConfig(generalConfig, callback) {
    this.http.post(this.apiPath + "UpdateGeneralConfig", this.generateUpdateGeneralConfigBody(generalConfig), {
      headers: {
        'Content-Type': 'application/xml'
      }
    }).toPromise().then(generalConfig => {
      callback(generalConfig["GeneralConfigUpdateResponse"].GeneralConfig);
    }).catch(err => {
      callback(null, err);
    });
  }

  generateUpdateGeneralConfigBody(generalConfig){
    let requestStartBody=`<generalconfigupdaterequest>`;
    let requestEndBody=`</generalconfigupdaterequest>`;
    let updateBody =`<lockoutperiod>`+generalConfig.LockoutPeriod+`</lockoutperiod>
                   <maxretires>`+generalConfig.MaxRetires+`</maxretires>
                   <maxloginattempts>`+generalConfig.MaxLoginAttempts+`</maxloginattempts>`
    
    return requestStartBody+updateBody+requestEndBody;
  }

  getKeyInfo(password,callback){
    // this.http.get(this.apiPath + "keyinfo").toPromise().then(keyFile => {
    //   console.log("KeyFile-",keyFile['KeyInformationResponse'].Key);
    //   this.saveFileAs(keyFile['KeyInformationResponse'].Key);
    // }).catch(err => {
    //  console.log(err);
    // });
    this.http.post(this.apiPath + "keyinfo", this.generateKeyInfoRequest(password), {
      headers: {
        'Content-Type': 'application/xml'
      }
    }).toPromise().then(keyInfo => {
      callback(keyInfo["KeyInformationResponse"].Key);
    }).catch(err => {
      callback(null, err);
    });
  }

  generateKeyInfoRequest(password){
    let requestStartBody=`<keyinforequest>`;
    let requestEndBody=`</keyinforequest>`;
    let requestBody =`<password>`+password+`</password>`
    
    return requestStartBody+requestBody+requestEndBody;
  }

  getNotificationInfo(callback) {
    this.http.get(this.apiPath + "NotificationInfo").toPromise().then(notificationInfo => {      
      callback(notificationInfo["NotificationInfoResponse"].NotificationUrl);
    }).catch(err => {
      callback(null, err);
    });
  }
  
}
 