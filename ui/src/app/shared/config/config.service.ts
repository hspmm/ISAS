import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfig } from 'src/app/app.config';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  applicationConfig = AppConfig.settings.env

  apiPath = this.applicationConfig.baseUrl+this.applicationConfig.apiVersion;

  constructor(private http: HttpClient) { }

   
  checkSessionToken(sessionId,callback) {
    let headerOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'sessionid': sessionId
        })
    };

    this.http.get(this.apiPath+"ValidateSession",headerOptions).toPromise().then(sessionInformation => {  
        callback(sessionInformation,null);
    }).catch(err => {
      callback(null, err);
    });
  } 
}
