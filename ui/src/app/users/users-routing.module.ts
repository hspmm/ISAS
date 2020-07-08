import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/* Dependent Component */
import { UsersComponent } from './users/users.component';
import { UserdetailsComponent } from './userdetails/userdetails.component';


// const routes: Routes = [
//   { 
//     path: '', 
//     component: UsersComponent,
//     children:[
//       {
//         path:'',
//         component:UserdetailsComponent,
//         children:[                 
//           {
//             path:'roles',
//             component:UserrolesComponent                                   
//           },
//           {
//             path:'privileges',
//             component:UserprivilegesComponent
//           },
//           {
//             path:'logs',
//             component:UserlogsComponent
//           },
//           {
//             path:'',  
//             component:UserrolesComponent      
//             // redirectTo:"roles",
//             // pathMatch:'full'
//           }          
//         ]
//       }      
//     ]
//   }
// ];

const routes: Routes = [
  { 
    path: '', 
    component: UsersComponent,
    children:[      
      {
        path:':id',
        redirectTo:''
      },
      {
        path:'',
        component:UserdetailsComponent
      }          
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
