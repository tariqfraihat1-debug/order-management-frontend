import { CurrencyPipe } from '@angular/common';
import { Component,input,output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { ContentHeader } from '../content-header/content-header';
import { OrderItem } from '../../../core/models/order/order-item.model';
import { OrderItemRow } from '../order-item-row/order-item-row';


@Component({
  selector:'app-order-items',
  standalone:true,
  imports:[CurrencyPipe,FontAwesomeModule,ContentHeader,OrderItemRow],
  templateUrl:'./order-items.html'
})
export class OrderItems{
  items=input<OrderItem[]>([]);
  totalAmount=input<number>(0);
  editable=input(false);

  addSelected=output<void>();
  editSelected=output<OrderItem>();
  removeSelected=output<OrderItem>();

  faPlus=faPlus;
}