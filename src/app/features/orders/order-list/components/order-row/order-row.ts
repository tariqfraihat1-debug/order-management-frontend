import { DatePipe, CurrencyPipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { OrderListItem } from '../../../../../core/models/order/order-list-item.model';
import { StatusBadge } from '../../../../../shared/components/status-badge/status-badge';

@Component({
  selector: 'tr[app-order-row]',
  standalone: true,
  imports: [DatePipe, CurrencyPipe, RouterLink, FontAwesomeModule, StatusBadge],
  templateUrl: './order-row.html'
})
export class OrderRow {
  order = input.required<OrderListItem>();

  actionSelected = output<OrderListItem>();
  deleteSelected = output<OrderListItem>();

  faEye = faEye;
  faPen = faPen;
  faTrash = faTrash;

  onAction(): void {
    this.actionSelected.emit(this.order());
  }

  onDelete(): void {
    this.deleteSelected.emit(this.order());
  }
}