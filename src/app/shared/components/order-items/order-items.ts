import {Component,input,output} from '@angular/core';
import {CurrencyPipe} from '@angular/common';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {faPlus} from '@fortawesome/free-solid-svg-icons';
import {ContentHeader} from '../content-header/content-header';
import {OrderItemRow} from '../order-item-row/order-item-row';
import {OrderItem} from '../../../core/models/order/order-item.model';

@Component({
selector:'app-order-items',
standalone:true,
imports:[CurrencyPipe,FontAwesomeModule,ContentHeader,OrderItemRow],
templateUrl:'./order-items.html'
})
export class OrderItems{
items=input<OrderItem[]>([]);
totalAmount=input(0);
editable=input(false);

addSelected=output<void>();
editSelected=output<OrderItem>();
removeSelected=output<OrderItem>();

faPlus=faPlus;
}