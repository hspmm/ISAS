import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders, HttpInterceptor,  HttpEvent, HttpHandler, HttpRequest} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() {}
  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
      if(sessionStorage.getItem('sessionid')){
        const sessionId = sessionStorage.getItem('sessionid');
        req = req.clone({
            setHeaders: {
                sessionid : sessionId             
            }
        });
      }
     // req = req.clone({ body: undefined });
    return next.handle(req);
  }
}