import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../../../core/services/customer.service';
import { CustomerDetails as CustomerDetailsModel } from '../../../core/models/customer/customer-details.model';
import { CustomerOrder } from '../../../core/models/customer/customer-order.model';
import { getApiErrorMessage } from '../../../core/utils/api-error.util';
import { Breadcrumb } from '../../../shared/components/breadcrumb/breadcrumb';
import { ContentHeader } from '../../../shared/components/content-header/content-header';
import { Loading } from '../../../shared/components/loading/loading';
import { StatusBadge } from '../../../shared/components/status-badge/status-badge';
import { ConfirmDialog } from '../../../shared/components/confirm-dialog/confirm-dialog';
import { CustomerSummary } from './components/customer-summary/customer-summary';
import { CustomerOrders } from './components/customer-orders/customer-orders';
import { Button } from "../../../shared/components/button/button";

@Component({
  selector: 'app-customer-details',
  standalone: true,
  imports: [
    Breadcrumb,
    ContentHeader,
    Loading,
    StatusBadge,
    ConfirmDialog,
    CustomerSummary,
    CustomerOrders,
    Button
],
  templateUrl: './customer-details.html',
  styles: ``
})
export class CustomerDetails implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly customerService = inject(CustomerService);

  customer = signal<CustomerDetailsModel | null>(null);
  orders = signal<CustomerOrder[]>([]);
  loading = signal(true);
  loadError = signal('');
  showConfirmDialog = signal(false);
  selectedStatusAction = signal<'activate' | 'deactivate' | null>(null);

  // Gets the customer id and loads the customer
  ngOnInit(): void {
    const id = Number(
      this.route.snapshot.paramMap.get('customerId')
    );

    if (!id) {
      this.loadError.set('Invalid customer id.');
      this.loading.set(false);
      return;
    }

    this.loadCustomer(id);
  }

  // Loads the customer details
  loadCustomer(id: number): void {
    this.loading.set(true);
    this.loadError.set('');

    this.customerService
      .getCustomerById(id)
      .subscribe({
        next: customer => {
          this.customer.set(customer);
          this.loadOrders(id);
        },
        error: error => {
          this.loadError.set(
            getApiErrorMessage(
              error,
              'Failed to load customer details.'
            )
          );
          this.loading.set(false);
        }
      });
  }

  // Loads the customer's orders
  loadOrders(id: number): void {
    this.customerService
      .getCustomerOrders(id)
      .subscribe({
        next: orders => {
          this.orders.set(orders);
          this.loading.set(false);
        },
        error: error => {
          this.loadError.set(
            getApiErrorMessage(
              error,
              'Failed to load customer orders.'
            )
          );
          this.loading.set(false);
        }
      });
  }

  // Navigates to the customer edit page
  editCustomer(): void {
    const id = this.customer()?.customerId;

    if (id) {
      this.router.navigate([
        '/customers',
        id,
        'edit'
      ]);
    }
  }

  // Opens the confirmation dialog for changing customer status
  toggleStatus(): void {
    const customer = this.customer();

    if (!customer) {
      return;
    }

    this.selectedStatusAction.set(
      customer.isActive
        ? 'deactivate'
        : 'activate'
    );

    this.showConfirmDialog.set(true);
  }

  // Activates or deactivates the customer
  confirmStatusChange(): void {
    const customer = this.customer();
    const action = this.selectedStatusAction();

    if (!customer || !action) {
      return;
    }

    const request = action === 'activate'
      ? this.customerService.activateCustomer(customer.customerId)
      : this.customerService.deactivateCustomer(customer.customerId);

    request.subscribe({
      next: () => {
        this.cancelStatusDialog();
        this.loadCustomer(customer.customerId);
      },
      error: error => {
        this.loadError.set(
          getApiErrorMessage(
            error,
            'Failed to update customer status.'
          )
        );
        this.cancelStatusDialog();
      }
    });
  }

  // Closes the customer status confirmation dialog
  cancelStatusDialog(): void {
    this.showConfirmDialog.set(false);
    this.selectedStatusAction.set(null);
  }

  // Gets the confirmation dialog title
  confirmationTitle(): string {
    return this.selectedStatusAction() === 'activate'
      ? 'Activate Customer'
      : 'Deactivate Customer';
  }

  // Gets the confirmation dialog message
  confirmationMessage(): string {
    return this.selectedStatusAction() === 'activate'
      ? 'Are you sure you want to activate this customer?'
      : 'Are you sure you want to deactivate this customer?';
  }

  // Gets the confirmation button text
  confirmationText(): string {
    return this.selectedStatusAction() === 'activate'
      ? 'Activate'
      : 'Deactivate';
  }

  // Checks if the selected status action is dangerous
  isDangerAction(): boolean {
    return this.selectedStatusAction() === 'deactivate';
  }
}