import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateRoleComponent } from './create-role/create-role.component';
import { RoleComponent } from './role/role.component';

const routes: Routes = [
  {
    path: '',
    component: RoleComponent
  },
  {
    path: 'create-role',
    component: CreateRoleComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoleRoutingModule { }
