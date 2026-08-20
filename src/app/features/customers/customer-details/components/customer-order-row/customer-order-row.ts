import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { CustomerOrder } from '../../../../../core/models/customer/customer-order.model';
import { StatusBadge } from '../../../../../shared/components/status-badge/status-badge';

@Component({
  selector: 'tr[app-customer-order-row]',
  standalone: true,
  imports: [
    DatePipe,
    CurrencyPipe,
    RouterLink,
    FontAwesomeModule,
    StatusBadge
  ],
  templateUrl: './customer-order-row.html',
  styles: ``
})
export class CustomerOrderRow {
  order = input.required<CustomerOrder>();

  faEye = faEye;
}