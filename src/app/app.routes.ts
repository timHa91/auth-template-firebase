import { Routes } from '@angular/router';
import { AUHT_ROUTES } from './auth/auth.routes';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  { path: 'auth', children: AUHT_ROUTES },
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];
