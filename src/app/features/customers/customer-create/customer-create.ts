import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerService } from '../../../core/services/customer.service';
import { getApiErrorMessage } from '../../../core/utils/api-error.util';
import { ContentHeader } from '../../../shared/components/content-header/content-header';
import { Breadcrumb } from '../../../shared/components/breadcrumb/breadcrumb';
import { CreateCustomerRequest } from '../../../core/models/customer/create-customer-request.model';
import { CustomerForm } from '../../../shared/components/customer-form/customer-form';

@Component({
  selector: 'app-customer-create',
  standalone: true,
  imports: [
    ContentHeader,
    Breadcrumb,
    CustomerForm
  ],
  templateUrl: './customer-create.html',
  styles: ``
})
export class CustomerCreate {
  private readonly customerService = inject(CustomerService);
  private readonly router = inject(Router);

  error = signal('');

  // Creates a new customer
  createCustomer(customer: CreateCustomerRequest): void {
    this.customerService
      .createCustomer(customer)
      .subscribe({
        next: customerId => {
          this.router.navigate([
            '/customers',
            customerId
          ]);
        },
        error: error => {
          this.error.set(
            getApiErrorMessage(
              error,
              'Failed to create customer.'
            )
          );
        }
      });
  }

  // Cancels customer creation and returns to the customer list
  cancel(): void {
    this.router.navigate([
      '/customers'
    ]);
  }
}