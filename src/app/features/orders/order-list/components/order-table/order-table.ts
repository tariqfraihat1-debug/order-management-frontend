import { Component, input, output } from '@angular/core';
import { OrderRow } from '../order-row/order-row';
import { OrderListItem } from '../../../../../core/models/order/order-list-item.model';
import { OrderSortField } from '../../order-list';

@Component({
  selector: 'app-order-table',
  standalone: true,
  imports: [
    OrderRow
  ],
  templateUrl: './order-table.html'
})
export class OrderTable {
  orders = input<OrderListItem[]>([]);

  actionSelected = output<OrderListItem>();
  deleteSelected = output<OrderListItem>();
  sortSelected = output<OrderSortField>();
}