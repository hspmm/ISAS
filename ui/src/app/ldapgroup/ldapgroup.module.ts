import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LdapgroupRoutingModule } from './ldapgroup-routing.module';
import { LdapgroupComponent } from './ldapgroup/ldapgroup.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MaterialModule } from '../material/material.module';
import {MatSortModule} from '@angular/material/sort';
import {MatPaginatorModule} from '@angular/material/paginator';



@NgModule({
  declarations: [LdapgroupComponent],
  imports: [
    CommonModule,
    LdapgroupRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    NgxSpinnerModule,
    MatSortModule,
    MatPaginatorModule
  ]
})
export class LdapgroupModule { }
