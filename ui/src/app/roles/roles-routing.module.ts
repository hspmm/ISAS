import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RolesComponent } from './roles/roles.component';
import { RoledetailsComponent } from './roledetails/roledetails.component';


const routes: Routes = [
  { 
    path: '', 
    component: RolesComponent,
    children:[      
      {
        path:':id',
        redirectTo:''
      },
      {
        path:'',
        component:RoledetailsComponent
      }          
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolesRoutingModule { }
