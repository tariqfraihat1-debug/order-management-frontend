import { Routes } from '@angular/router';
import { Orders } from './orders';

export const ORDERS_ROUTES: Routes = [
  {
    path: '',
    component: Orders,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./order-list/order-list').then(m => m.OrderList)
      },
      {
        path: 'create',
        loadComponent: () =>
          import('./order-create/order-create').then(m => m.OrderCreate)
      },
      {
        path: ':orderId',
        loadComponent: () =>
          import('./order-details/order-details').then(m => m.OrderDetails)
      }
    ]
  }
];