import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SettingsService } from '../settings/settings.service';
import { BehaviorSubject } from 'rxjs';
import { ImprivataInfo } from './imprivata-info';
import { AppConfig } from 'src/app/app.config';

@Injectable({
  providedIn: 'root'
})
export class ImprivataService {

  applicationConfig = AppConfig.settings.env

  apiPath = this.applicationConfig.baseUrl+this.applicationConfig.apiVersion;

  imprivataInfo= new BehaviorSubject<ImprivataInfo[]>([]);


  constructor(private http: HttpClient, private settingsService:SettingsService) { }

   
  getImprivataList(callback) {
    this.http.get(this.apiPath+"ImprivataInfo").toPromise().then(imprivataList => {      
      this.imprivataInfo.next(imprivataList["ImprivataDetailsResponse"].ImprivataDetails.map((imprivata)=> imprivata.Imprivata));
      callback(imprivataList["ImprivataDetailsResponse"].ImprivataDetails.map((imprivata)=> imprivata.Imprivata));
    }).catch(err => {
      callback(null, err);
    });
  }

  saveImprivataInfo(imprivataDetails, callback) {
    this.http.post(this.apiPath + "imprivata/registration", this.generateImprivataRegistrationBody(imprivataDetails), {
      headers: {
        'Content-Type': 'application/xml'
      }
    }).toPromise().then(imprivataInfo => {
      callback(imprivataInfo["ImprivataRegistrationResponse"].ImprivataDetails);
    }).catch(err => {
      callback(null, err);
    });
  }

  updateImprivataInfo(imprivataDetails, callback) {
    
    this.http.post(this.apiPath + "imprivata/update", this.generateImprivataUpdateBody(imprivataDetails), {
      headers: {
        'Content-Type': 'application/xml'
      }
    }).toPromise().then(imprivataInfo => {
      callback(imprivataInfo["ImprivataUpdateResponse"].ImprivataDetails);
    }).catch(err => {
      callback(null, err);
    });
  }

  deleteImprivataInfo(callback) {
    this.http.post(this.apiPath + "imprivata/delete", {
      "imprivatadelete": {
        "imprivataconfigid": this.settingsService.selectedImprivataId.value.toString()
      }
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).toPromise().then(imprivataInfo => {
      callback(imprivataInfo["ImprivataDeleteResponse"]);
    }).catch(err => {
      callback(null, err);
    });
  }
  
  generateImprivataRegistrationBody(imprivataDetails){
    let requestStartBody=`<imprivataregistration>`;
    let requestEndBody=`</imprivataregistration>`;
    let imprivataBody =`<configname>`+imprivataDetails.ImprivataConfigName+`</configname>
                   <serverhostname>`+imprivataDetails.ServerHostName+`</serverhostname>
                   <serverport>`+imprivataDetails.ServerPort+`</serverport>
                   <apipath>`+imprivataDetails.ApiPath+`</apipath>
                   <apiversion>`+imprivataDetails.ApiVersion+`</apiversion>
                   <productcode>`+imprivataDetails.ProductCode+`</productcode>
                   <issslselected>`+imprivataDetails.IsSslSelected+`</issslselected>`;
    return requestStartBody+imprivataBody+requestEndBody;
  }

  generateImprivataUpdateBody(imprivataDetails){
    let requestStartBody=`<imprivataupdate>`;
    let requestEndBody=`</imprivataupdate>`;
    let imprivataBody =`<imprivataconfigid>`+imprivataDetails.ImprivataConfigId+`</imprivataconfigid>
                   <configname>`+imprivataDetails.ImprivataConfigName+`</configname>
                   <serverhostname>`+imprivataDetails.ServerHostName+`</serverhostname>
                   <serverport>`+imprivataDetails.ServerPort+`</serverport>
                   <apipath>`+imprivataDetails.ApiPath+`</apipath>
                   <apiversion>`+imprivataDetails.ApiVersion+`</apiversion>
                   <productcode>`+imprivataDetails.ProductCode+`</productcode>
                   <issslselected>`+imprivataDetails.IsSslSelected+`</issslselected>`;
    return requestStartBody+imprivataBody+requestEndBody;
  }

}
