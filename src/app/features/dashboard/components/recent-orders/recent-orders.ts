import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ContentHeader } from '../../../../shared/components/content-header/content-header';
import { RecentOrderRow } from '../recent-order-row/recent-order-row';
import { RecentOrder } from '../../../../core/models/dashboard/recent-order.model';

@Component({
  selector: 'app-recent-orders',
  standalone: true,
  imports: [
    RouterLink,
    ContentHeader,
    RecentOrderRow
],
  templateUrl: './recent-orders.html',
  styles: ``
})
export class RecentOrders {
  orders = input.required<RecentOrder[]>();
}