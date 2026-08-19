import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login')
        .then(m => m.Login)
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard')
        .then(m => m.Dashboard)
  },
  {
    path: 'customers',
    loadChildren: () =>
      import('./features/customers/customers.routes')
        .then(m => m.CUSTOMER_ROUTES)
  },
  {
    path: 'orders',
    loadChildren: () =>
      import('./features/orders/orders.routes')
        .then(m => m.ORDERS_ROUTES)
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];