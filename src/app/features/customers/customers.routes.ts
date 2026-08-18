import { Routes } from '@angular/router';

export const CUSTOMER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./customer-list/customer-list')
        .then(m => m.CustomerList)
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./customer-create/customer-create')
        .then(m => m.CustomerCreate)
  },
  {
    path: ':customerId/edit',
    loadComponent: () =>
      import('./customer-edit/customer-edit')
        .then(m => m.CustomerEdit)
  },
  {
    path: ':customerId',
    loadComponent: () =>
      import('./customer-details/customer-details')
        .then(m => m.CustomerDetails)
  }
];