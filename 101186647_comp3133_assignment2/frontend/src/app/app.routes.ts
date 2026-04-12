import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Signup } from './components/signup/signup';
import { EmployeeList } from './components/employee-list/employee-list';
import { EmployeeForm } from './components/employee-form/employee-form';
import { EmployeeDetails } from './components/employee-details/employee-details';
import { tokenGuard } from './guards/token-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },

  {
    path: 'employees',
    component: EmployeeList,
    canActivate: [tokenGuard],
  },
  {
    path: 'employees/add',
    component: EmployeeForm,
    canActivate: [tokenGuard],
  },
  {
    path: 'employees/edit/:id',
    component: EmployeeForm,
    canActivate: [tokenGuard],
  },
  {
    path: 'employees/:id',
    component: EmployeeDetails,
    canActivate: [tokenGuard],
  },

  { path: '**', redirectTo: 'login' },
];