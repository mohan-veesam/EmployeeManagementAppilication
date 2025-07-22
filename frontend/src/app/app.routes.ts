// app.routes.ts
import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';
import { EmployeeComponent } from './components/employee/employee.component';
import { UserComponent } from './components/user/user.component';
import { LoginComponent } from './components/login/login.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'components/employee',  // Optional default route
    pathMatch: 'full'
  },
  {
    path: 'components',
    children: [
      { path: 'employee', component: EmployeeComponent,},
      { path: 'user', component: UserComponent,},
      { path: 'login', component: LoginComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'reset-password', component: ResetPasswordComponent }
    ]
  }
];

export const appRouterProviders = [provideRouter(routes)];
