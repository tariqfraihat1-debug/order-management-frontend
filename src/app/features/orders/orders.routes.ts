import {authGuard} from '../../core/guards/auth-guard';

export const ORDERS_ROUTES=[
{
path:'',
canActivate:[authGuard],
children:[
{
path:'',
loadComponent:()=>import('./order-list/order-list').then(m=>m.OrderList)
},
{
path:'create',
loadComponent:()=>import('./order-create/order-create').then(m=>m.OrderCreate)
},
{
path:':orderId',
loadComponent:()=>import('./order-details/order-details').then(m=>m.OrderDetails)
}
]
}
];