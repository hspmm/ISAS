import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users/users.component';
import { MaterialModule } from '../material/material.module';
import { UserdetailsComponent } from './userdetails/userdetails.component';

import {DragDropModule} from '@angular/cdk/drag-drop';
import { ReactiveFormsModule } from '@angular/forms';
import { PrivilegesService } from '../shared/privileges/privileges.service';

import { FormsModule } from '@angular/forms';

import { NgxSpinnerModule } from 'ngx-spinner';

import {MatSortModule} from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
  declarations: [UsersComponent, UserdetailsComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    MaterialModule,
    DragDropModule,
    ReactiveFormsModule,
    FormsModule,
    NgxSpinnerModule
  ],
  providers: [PrivilegesService],
})
export class UsersModule { }
