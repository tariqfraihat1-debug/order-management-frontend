import { Component, input } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RecentOrder } from '../../../../core/models/dashboard/recent-order.model';
import { StatusBadge } from '../../../../shared/components/status-badge/status-badge';

@Component({
  selector: 'tr[app-recent-order-row]',
  standalone: true,
  imports: [DatePipe, DecimalPipe, RouterLink, StatusBadge],
  templateUrl: './recent-order-row.html'
})
export class RecentOrderRow {
  order = input.required<RecentOrder>();
}