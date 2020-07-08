import { Injectable } from '@angular/core';
import { HttpClient , HttpBackend} from '@angular/common/http';
import { environment } from '../environments/environment';
import { IAppConfig } from '../../src/app/shared/config/config';
@Injectable()
export class AppConfig {
    static settings: IAppConfig;
    private http: HttpClient;
    constructor( handler: HttpBackend) {
        this.http = new HttpClient(handler);
    }
    load() {
        const jsonFile = `assets/config/config.${environment.nameOfFile}.json`;
        return new Promise<void>((resolve, reject) => {
            this.http.get(jsonFile).toPromise().then((response : IAppConfig) => {
               AppConfig.settings = <IAppConfig>response;
               resolve();
            }).catch((response: any) => {
               reject(`Could not load file '${jsonFile}': ${JSON.stringify(response)}`);
            });
        });
    }
}