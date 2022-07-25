import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeComponent } from './dashboard/pages/employee/employee.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {
    path:'',
    loadChildren:() => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path:'**',
    redirectTo:'',
    pathMatch:'full'
  }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
