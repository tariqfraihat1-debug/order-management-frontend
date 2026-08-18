import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StatusBadge } from '../../../../shared/components/status-badge/status-badge';

@Component({
  selector: 'app-quick-actions',
  standalone: true,
  imports: [RouterLink, StatusBadge],
  templateUrl: './quick-actions.html'
})
export class QuickActions {
  pendingOrders = input.required<number>();
  inactiveCustomers = input.required<number>();
}