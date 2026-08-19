import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OrderDetails } from '../../../../../core/models/order/order-details.model';

@Component({
  selector: 'app-order-summary',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './order-summary.html'
})
export class OrderSummary {
  order = input.required<OrderDetails>();
}