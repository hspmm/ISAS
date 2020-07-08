import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PrivilegesComponent } from './privileges/privileges.component';
// import { PrivilegedetailsComponent } from './privilegedetails/privilegedetails.component';


const routes: Routes = [
  { 
    path: '', 
    component: PrivilegesComponent,
    // children:[      
    //   {
    //     path:':id',
    //     redirectTo:''
    //   },
    //   {
    //     path:'',
    //     component:PrivilegedetailsComponent
    //   }          
    // ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrivilegesRoutingModule { }
