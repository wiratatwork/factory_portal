import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { authGuard } from './auth/auth.guard';
import { ShellComponent } from './layout/shell.component';
import { PortalComponent } from './portal/portal.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [{ path: '', component: PortalComponent }],
  },
  { path: '**', redirectTo: '' },
];
