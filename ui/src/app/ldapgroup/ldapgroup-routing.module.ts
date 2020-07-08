import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { LdapgroupModule } from './ldapgroup.module';
import { LdapgroupComponent } from './ldapgroup/ldapgroup.component';


const routes: Routes = [
  { 
    path: '', 
    component: LdapgroupComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LdapgroupRoutingModule { }
