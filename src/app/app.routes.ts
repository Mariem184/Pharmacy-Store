import { Routes } from '@angular/router';
import { HomeComponent } from './features/Pages/home/home';
import { Cart } from './shared/Components/cart/cart';
import { AboutUs } from './features/Pages/about-us/about-us';
import { AdminLayout } from './features/Layout/admin-layout/admin-layout';
import { CustomerList } from './shared/Components/customer-list/customer-list';
import { ContactMe } from './features/Pages/contact-me/contact-me';
import { AuthLayout } from './features/Layout/auth-layout/auth-layout';
import { Login } from './features/Auth/login/login';
import { Register } from './features/Auth/register/register';
export const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'cart',
    component: Cart
  },
  {
    path: 'about-us',
    component: AboutUs
  },
  {
    path:'contact-me',
    component:ContactMe
  },
  {
     path: 'admin',
    component: AdminLayout,
    children:[
      { path: 'customers', component: CustomerList},
    ]
  },
  {
    path: 'auth',
    component: AuthLayout,
    children: [
      {
        path: 'login',
        component: Login
      },
      {
        path: 'register',
        component: Register
      }
    ]
  }
];