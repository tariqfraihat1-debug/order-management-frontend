import { Component, computed, input } from '@angular/core';
import { CustomerDetails } from '../../../../../core/models/customer/customer-details.model';
import { DetailField } from '../../../../../shared/components/detail-field/detail-field';


@Component({
  selector: 'app-customer-summary',
  standalone: true,
  imports: [
    DetailField
  ],
  templateUrl: './customer-summary.html',
  styles: ``
})
export class CustomerSummary {
  customer = input.required<CustomerDetails>();

  fields = computed(() => [
    {
      label: 'FULL NAME',
      value: this.customer().customerName
    },
    {
      label: 'EMAIL',
      value: this.customer().email
    },
    {
      label: 'PHONE',
      value: this.customer().phone
    }
  ]);
}