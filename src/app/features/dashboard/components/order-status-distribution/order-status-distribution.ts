import { Component, input, output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ContentHeader } from '../../../../shared/components/content-header/content-header';
import { OrderStatusDistribution } from '../../../../core/models/dashboard/order-status-distribution.model';

@Component({
  selector: 'app-order-status-distribution',
  standalone: true,
  imports: [
    DecimalPipe,
    ContentHeader
  ],
  templateUrl: './order-status-distribution.html',
  styles: ``
})
export class OrderStatusDistributionComponent {
  segments = input<OrderStatusDistribution[]>([]);
  totalOrders = input<number>(0);

  statusSelected = output<string>();
}