import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';


const routes: Routes = [
  {
  path: 'users',
  canLoad:[AuthGuard],
  loadChildren: () => import('./users/users.module').then(m => m.UsersModule)  
  },
  {
    path: 'roles',
    canLoad:[AuthGuard],
    loadChildren: () => import('./roles/roles.module').then(m => m.RolesModule)
  },
  {
    path: 'sites',
    canLoad:[AuthGuard],
    loadChildren: () => import('./sites/sites.module').then(m => m.SitesModule)
  },
  {
    path: 'privileges',
    canLoad:[AuthGuard],
    loadChildren: () => import('./privileges/privileges.module').then(m => m.PrivilegesModule)
  },
  {
    path:'', redirectTo:'/roles', pathMatch:'full'
  },
  {
    path: 'ldapgroup',
    canLoad:[AuthGuard],
    loadChildren: () => import('./ldapgroup/ldapgroup.module').then(m => m.LdapgroupModule)  
  },
  {
    path: 'settings',
    canLoad:[AuthGuard],
    loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule)  
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
