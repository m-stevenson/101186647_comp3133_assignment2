import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { SignupComponent } from './components/signup/signup';
import { EmployeeListComponent } from './components/employee-list/employee-list';
import { EmployeeFormComponent } from './components/employee-form/employee-form';
import { EmployeeDetailsComponent } from './components/employee-details/employee-details';
import { tokenGuard } from './guards/token-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },

  {
    path: 'employees',
    component: EmployeeListComponent,
    canActivate: [tokenGuard],
  },
  {
    path: 'employees/add',
    component: EmployeeFormComponent,
    canActivate: [tokenGuard],
  },
  {
    path: 'employees/edit/:id',
    component: EmployeeFormComponent,
    canActivate: [tokenGuard],
  },
  {
    path: 'employees/:id',
    component: EmployeeDetailsComponent,
    canActivate: [tokenGuard],
  },

  { path: '**', redirectTo: 'login' },
];