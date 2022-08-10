import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { EmployeeComponent } from './pages/employee/employee.component';
import { PermissionComponent } from './pages/permission/permission.component';
import { TasksComponent } from './pages/tasks/tasks.component';
import { WrapperComponent } from './pages/wrapper/wrapper.component';

const routes: Routes = [
  {
    path: '',
    component:LoginComponent
  },
  {
    path: 'login',
    component:LoginComponent
  },
  {
    path:'wrapper',
    component:WrapperComponent,
    children: [
      {
        path: 'employee',
        component: EmployeeComponent
      },
      {
        path: 'permission',
        component: PermissionComponent
      },
      {
        path: 'role',
        loadChildren: () => import('./pages/role/role.module').then(m => m.RoleModule)
      },
      {
        path: 'projects',
        loadChildren: () => import('./pages/projects/projects.module').then(m => m.ProjectsModule)
      },
      {
        path: 'tasks',
        component: TasksComponent
      },
      
    ]
  },
  {
    path:'**',
    redirectTo: '/dashboard',
    pathMatch:'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
