import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from './shared/users/users.service';
import { SettingsService } from './shared/settings/settings.service';
import { ConfigService } from 'src/app/shared/config/config.service';
import {Location} from '@angular/common'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent implements OnInit {
  constructor(private router: Router, private userService: UsersService, private settingsService: SettingsService, private configService: ConfigService, private location:Location) {
    this.navLinks = [{
        label: 'Roles',
        link: 'roles',
        index: 0,
        id:'mainTabRoles'
      },
      {
        label: 'Users',
        link: 'users',
        index: 1,
        id:'mainTabUsers'
      },
      {
        label: 'Sites',
        link: 'sites',
        index: 2,
        id:'mainTabSites'
      },
      {
        label: 'Privileges',
        link: 'privileges',
        index: 3,
        id:'mainTabPrivileges'
      },
      {
        label: 'LDAP Group',
        link: 'ldapgroup',
        index: 4,
        id:'mainTabLdapGroup'
      }
    ];
  }

  ngOnInit() {
    this.router.events.subscribe((res) => {
      this.activeLinkIndex = this.navLinks.indexOf(this.navLinks.find(tab => tab.link === this.router.url));
    });
    this.settingsService.getSecurityModelInfo((response, err) => {
      if (err) {

      } else {
        this.settingsService.selectedSecurityModel.next(response);
      }
    });
  }

  sessionId : string;
  navLinks: any[];
  activeLinkIndex = -1;
  // backgroundColor='#036bc0';

  // SecurityModelSelection(selectedItem){
  // if(selectedItem==="LDAP"){
  //   this.userService.selectedSecurityModel.next(0);
  // }
  // else if(selectedItem==="Standalone"){
  //   this.userService.selectedSecurityModel.next(1);
  // }
  // }



  /* EC Integration */

  @HostListener('window:message', ['$event'])
  onMessage(eventFromParent) {
    if (eventFromParent.data.accesstoken) { //Whenever EC Shares the accesstoken plugin should have to call their server API and from there plugin server should have to call the EC API to validate the token    
      this.sessionId = eventFromParent.data.accesstoken;
      console.log("HostListener Empty");
      //localStorage.setItem('sessionid',this.sessionId);
      sessionStorage.setItem('sessionid',this.sessionId);
      this.configService.checkSessionToken(this.sessionId,(sessionInformation,error)=>{
        if(error){
          sessionStorage.setItem('sessionid','');
          console.log("HostListener Error Empty");
        }
        else{        
          console.log("sessionInformation-",sessionInformation);
          sessionStorage.setItem('sessionid',this.sessionId);
          console.log("HostListener Id",this.sessionId);
          //this.router.navigate(['/roles']);
          this.router.navigateByUrl('/users',{skipLocationChange:true}).then(()=>{
            this.router.navigate([decodeURI(this.location.path())]);
          });
         
        }
      });
      
    }

  }
}
