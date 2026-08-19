import {Component, input, output} from '@angular/core';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {faEye, faPen} from '@fortawesome/free-solid-svg-icons';
import { Customer } from '../../../../../core/models/customer/customer.model';
import { StatusBadge } from '../../../../../shared/components/status-badge/status-badge';




@Component({
selector:'tr[app-customer-row]',
standalone:true,
imports:[
FontAwesomeModule,
StatusBadge
],
templateUrl:'./customer-row.html',
styles:``
})
export class CustomerRow {

customer=input.required<Customer>();

viewSelected=output<Customer>();
editSelected=output<Customer>();

faEye=faEye;
faPen=faPen;

}