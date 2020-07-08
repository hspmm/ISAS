import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SitedetailsComponent } from './sitedetails/sitedetails.component';

const routes: Routes = [
  { 
    path: '', 
    component: SitedetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SitesRoutingModule { }
