import { Component, input } from '@angular/core';
import { NgClass } from '@angular/common';

export type StatusBadgeType =
  | 'Pending'
  | 'Confirmed'
  | 'Shipped'
  | 'Cancelled'
  | 'Active'
  | 'Inactive';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [NgClass],
  templateUrl: './status-badge.html'
})
export class StatusBadge {
  status = input.required<StatusBadgeType>();
  text = input<string>();
}