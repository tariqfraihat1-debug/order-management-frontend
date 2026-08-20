import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Customer } from '../../../core/models/customer/customer.model';
import { CustomerService } from '../../../core/services/customer.service';
import { getApiErrorMessage } from '../../../core/utils/api-error.util';
import { ContentHeader } from '../../../shared/components/content-header/content-header';
import { Loading } from '../../../shared/components/loading/loading';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { CustomerFilter } from './components/customer-filter/customer-filter';
import { CustomerTable } from './components/customer-table/customer-table';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [
    RouterLink,
    ContentHeader,
    Loading,
    CustomerFilter,
    CustomerTable,
    EmptyState

  ],
  templateUrl: './customer-list.html',
  styles: ``
})
export class CustomerList implements OnInit {
  private readonly customerService = inject(CustomerService);
private readonly router = inject(Router);
private readonly route = inject(ActivatedRoute);

  customers = signal<Customer[]>([]);
  loading = signal(true);
  loadError = signal('');
  search = signal('');
  statusFilter = signal('');

  filteredCustomers = computed(() => {
    const searchValue = this.search()
      .toLowerCase()
      .trim();
    const status = this.statusFilter();

    return this.customers().filter(customer => {
      const matchesSearch =
        !searchValue ||
        customer.customerName
          .toLowerCase()
          .includes(searchValue) ||
        customer.email
          .toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        !status ||
        (status === 'active' && customer.isActive) ||
        (status === 'inactive' && !customer.isActive);

      return matchesSearch && matchesStatus;
    });
  });

  // Loads the customers when the page opens
ngOnInit(): void {

  this.route.queryParamMap.subscribe(params => {

    this.statusFilter.set(
      params.get('status') ?? ''
    );

  });

  this.loadCustomers();

}

  // Loads all customers
  loadCustomers(): void {
    this.loading.set(true);
    this.loadError.set('');

    this.customerService
      .getCustomers()
      .subscribe({
        next: data => {
          this.customers.set(data);
          this.loading.set(false);
        },
        error: error => {
          this.loadError.set(
            getApiErrorMessage(
              error,
              'Failed to load customers.'
            )
          );
          this.loading.set(false);
        }
      });
  }

  // Updates the customer search value
  onSearch(value: string): void {
    this.search.set(value);
  }

  // Updates the customer status filter
onStatusChange(value:string):void{

  this.statusFilter.set(value);

  this.router.navigate([], {
    relativeTo:this.route,
    queryParams:{
      status:value || null
    },
    queryParamsHandling:'merge'
  });

}

  // Navigates to the customer details page
  viewCustomer(customer: Customer): void {
    this.router.navigate([
      '/customers',
      customer.customerId
    ]);
  }

  // Navigates to the customer edit page
  editCustomer(customer: Customer): void {
    this.router.navigate([
      '/customers',
      customer.customerId,
      'edit'
    ]);
  }

  // Clears the customer filters
  clearFilters(): void {
    this.search.set('');
    this.statusFilter.set('');
  }
}