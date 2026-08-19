import {Component,input} from '@angular/core';

import {CustomerOrder}
from '../../../../../core/models/customer/customer-order.model';

import {CustomerOrderRow}
from '../customer-order-row/customer-order-row';


@Component({
selector:'app-customer-orders',
standalone:true,
imports:[
CustomerOrderRow
],
templateUrl:'./customer-orders.html',
styles:``
})
export class CustomerOrders{

orders=input<CustomerOrder[]>([]);

}