import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrivilegesRoutingModule } from './privileges-routing.module';
import { PrivilegesComponent } from './privileges/privileges.component';
import { MaterialModule } from '../material/material.module';
// import { PrivilegedetailsComponent } from './privilegedetails/privilegedetails.component';


@NgModule({
  declarations: [PrivilegesComponent],
  imports: [
    CommonModule,
    PrivilegesRoutingModule,
    MaterialModule
  ]
})
export class PrivilegesModule { }
