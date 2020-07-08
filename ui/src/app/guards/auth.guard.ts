import { Injectable } from '@angular/core';
import {CanLoad } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {
  constructor() {}

  canLoad(): boolean {
    console.log("Canload-",sessionStorage.getItem('sessionid'));
    if (sessionStorage.getItem('sessionid')&& sessionStorage.getItem('sessionid')!="") {
      return true;
    }
    else{
      return false;
    }
  }
}
