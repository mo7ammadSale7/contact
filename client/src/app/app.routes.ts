import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ContactsComponent } from './components/contacts/contacts/contacts.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'contacts', component: ContactsComponent, canActivate: [authGuard] },
  { path: '', redirectTo: '/contacts', pathMatch: 'full' }
];
