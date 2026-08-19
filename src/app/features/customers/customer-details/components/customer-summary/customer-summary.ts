import {Component,input} from '@angular/core';

import {CustomerDetails} 
from '../../../../../core/models/customer/customer-details.model';




@Component({
selector:'app-customer-summary',
standalone:true,
imports:[

],
templateUrl:'./customer-summary.html',
styles:``
})
export class CustomerSummary{

customer=input.required<CustomerDetails>();

}