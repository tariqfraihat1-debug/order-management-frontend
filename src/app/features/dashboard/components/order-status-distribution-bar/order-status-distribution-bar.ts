import { DecimalPipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { OrderStatusDistribution } from '../../../../core/models/dashboard/order-status-distribution.model';

@Component({
  selector: 'app-order-status-distribution-bar',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './order-status-distribution-bar.html'
})
export class OrderStatusDistributionBar {
  segments = input.required<OrderStatusDistribution[]>();
  statusSelected = output<string>();
}