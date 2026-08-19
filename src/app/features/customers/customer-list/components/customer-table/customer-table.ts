import {Component,input,output} from '@angular/core';
import {RouterLink} from '@angular/router';


import {Customer} from '../../../../../core/models/customer/customer.model';
import {StatusBadge} from '../../../../../shared/components/status-badge/status-badge';
import { CustomerRow } from "../customer-row/customer-row";

@Component({
selector:'app-customer-table',
standalone:true,
imports: [
    CustomerRow
],
templateUrl:'./customer-table.html',
styles:``
})
export class CustomerTable{

customers=input<Customer[]>([]);

viewSelected=output<Customer>();
editSelected=output<Customer>();



}