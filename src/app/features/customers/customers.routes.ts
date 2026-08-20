import { authGuard } from '../../core/guards/auth-guard';

export const CUSTOMER_ROUTES = [

  {
    path: '',
    canActivate: [authGuard],

    loadComponent: () =>
      import('./customers')
        .then(m => m.Customers),

    children: [

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
        path: ':customerId',
        loadComponent: () =>
          import('./customer-details/customer-details')
            .then(m => m.CustomerDetails)
      },

      {
        path: ':customerId/edit',
        loadComponent: () =>
          import('./customer-edit/customer-edit')
            .then(m => m.CustomerEdit)
      }

    ]

  }

];