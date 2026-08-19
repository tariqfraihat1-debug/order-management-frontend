import { CurrencyPipe,DecimalPipe } from '@angular/common';
import { Component,input,output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPen,faXmark } from '@fortawesome/free-solid-svg-icons';
import { OrderItem } from '../../../core/models/order/order-item.model';

@Component({
  selector:'tr[app-order-item-row]',
  standalone:true,
  imports:[CurrencyPipe,DecimalPipe,FontAwesomeModule],
  templateUrl:'./order-item-row.html'
})
export class OrderItemRow{
  item=input.required<OrderItem>();
  editable=input(false);
  editSelected=output<OrderItem>();
  removeSelected=output<OrderItem>();
  faPen=faPen;
  faXmark=faXmark;

  formattedItemId(){
    return `ITEM-${this.item().itemId}`;
  }
}