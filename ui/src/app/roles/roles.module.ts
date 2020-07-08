import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RolesRoutingModule } from './roles-routing.module';
import { RolesComponent } from './roles/roles.component';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RoledetailsComponent } from './roledetails/roledetails.component';


import { FormsModule } from '@angular/forms';

import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [RolesComponent, RoledetailsComponent],
  imports: [
    CommonModule,
    RolesRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    NgxSpinnerModule
  ]
})
export class RolesModule { }
