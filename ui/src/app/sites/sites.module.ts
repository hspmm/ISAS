import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SitesRoutingModule } from './sites-routing.module';
import { SitedetailsComponent } from './sitedetails/sitedetails.component';
import { MaterialModule } from '../material/material.module';

import { NgxSpinnerModule } from 'ngx-spinner';


@NgModule({
  declarations: [SitedetailsComponent],
  imports: [
    CommonModule,
    SitesRoutingModule,
    MaterialModule,
    NgxSpinnerModule
  ]
})
export class SitesModule { }
