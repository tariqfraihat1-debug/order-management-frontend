import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { OrderListItem } from '../../../core/models/order/order-list-item.model';
import { OrderService } from '../../../core/services/order.service';
import { getApiErrorMessage } from '../../../core/utils/api-error.util';
import { ContentHeader } from '../../../shared/components/content-header/content-header';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { Loading } from '../../../shared/components/loading/loading';
import { OrderActionDialog } from './components/order-action-dialog/order-action-dialog';
import { OrderFilter } from './components/order-filter/order-filter';
import { OrderTable } from './components/order-table/order-table';

export type OrderSortField = 'orderNumber' | 'customerName' | 'orderStateName' | 'totalAmount' | 'createdDate';

export type SortDirection = 'asc' | 'desc';

export type OrderAction = 'confirm' | 'ship' | 'cancel' | 'delete';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [
    RouterLink,
    ContentHeader,
    Loading,
    EmptyState,
    OrderFilter,
    OrderTable,
    OrderActionDialog
  ],
  templateUrl: './order-list.html'
})
export class OrderList implements OnInit {
  private readonly orderService = inject(OrderService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  orders = signal<OrderListItem[]>([]);
  loading = signal(true);
  loadError = signal('');
  actionError = signal('');

  search = signal('');
  statusFilter = signal('');
  customerFilter = signal('');
  dateFilter = signal('');

  sortField = signal<OrderSortField>('createdDate');
  sortDirection = signal<SortDirection>('desc');

  selectedOrder = signal<OrderListItem | null>(null);
  selectedAction = signal<OrderAction | null>(null);

  showActionMenu = signal(false);
  showConfirmDialog = signal(false);

  customers = computed(() =>
    [...new Set(this.orders().map(order => order.customerName))]
      .sort((a, b) => a.localeCompare(b))
  );

  filteredOrders = computed(() => {
    let result = [...this.orders()];

    const search = this.search().trim().toLowerCase();
    const status = this.statusFilter();
    const customer = this.customerFilter();
    const date = this.dateFilter();

    if (search) {
      result = result.filter(order =>
        order.orderNumber.toString().includes(search)
        || order.customerName.toLowerCase().includes(search)
      );
    }

    if (status) {
      result = result.filter(order => order.orderStateName === status);
    }

    if (customer) {
      result = result.filter(order => order.customerName === customer);
    }

    if (date) {
      const now = new Date();

      result = result.filter(order => {
        const created = new Date(order.createdDate);

        if (date === 'today') {
          return created.toDateString() === now.toDateString();
        }

        if (date === '7days') {
          const lastWeek = new Date();
          lastWeek.setDate(now.getDate() - 7);
          return created >= lastWeek;
        }

        if (date === '30days') {
          const lastMonth = new Date();
          lastMonth.setDate(now.getDate() - 30);
          return created >= lastMonth;
        }

        return true;
      });
    }

    const field = this.sortField();
    const direction = this.sortDirection();

    result.sort((a, b) => {
      let comparison = 0;

      if (field === 'orderNumber') {
        comparison = a.orderNumber - b.orderNumber;
      }

      if (field === 'customerName') {
        comparison = a.customerName.localeCompare(b.customerName);
      }

      if (field === 'orderStateName') {
        comparison = a.orderStateName.localeCompare(b.orderStateName);
      }

      if (field === 'totalAmount') {
        comparison = a.totalAmount - b.totalAmount;
      }

      if (field === 'createdDate') {
        comparison = new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime();
      }

      return direction === 'asc' ? comparison : -comparison;
    });

    return result;
  });

  ngOnInit(): void {
    this.route.queryParamMap
      .subscribe(params => {
        this.statusFilter.set(params.get('status') ?? '');
        this.search.set(params.get('search') ?? '');
      });

    this.loadOrders();
  }

  // Updates the search term
  onSearch(value: string): void {
    this.search.set(value);
  }

  // Updates the status filter and syncs it to the URL
  onStatusChange(value: string): void {
    this.statusFilter.set(value);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        status: value || null
      },
      queryParamsHandling: 'merge'
    });
  }

  // Updates the customer filter
  onCustomerChange(value: string): void {
    this.customerFilter.set(value);
  }

  // Updates the date filter
  onDateChange(value: string): void {
    this.dateFilter.set(value);
  }

  // Sorts orders by field, toggling direction if already sorted
  sortBy(field: OrderSortField): void {
    if (this.sortField() === field) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
      return;
    }

    this.sortField.set(field);
    this.sortDirection.set(field === 'createdDate' ? 'desc' : 'asc');
  }

  // Opens the action menu for an order
  onActionSelected(order: OrderListItem): void {
    this.actionError.set('');
    this.selectedOrder.set(order);
    this.showActionMenu.set(true);
  }

  // Opens the confirmation dialog to delete an order
  onDeleteSelected(order: OrderListItem): void {
    this.actionError.set('');
    this.selectedOrder.set(order);
    this.selectedAction.set('delete');
    this.showConfirmDialog.set(true);
  }

  // Chooses an action from the action menu
  chooseAction(action: OrderAction): void {
    this.selectedAction.set(action);
    this.showActionMenu.set(false);
    this.showConfirmDialog.set(true);
  }

  // Cancels the action menu and confirmation dialog
  cancelDialog(): void {
    this.selectedOrder.set(null);
    this.selectedAction.set(null);
    this.showActionMenu.set(false);
    this.showConfirmDialog.set(false);
  }

  // Confirms the selected action
  confirmSelectedAction(): void {
    const order = this.selectedOrder();
    const action = this.selectedAction();

    if (!order || !action) {
      return;
    }

    let request;

    if (action === 'confirm') {
      request = this.orderService.confirmOrder(order.orderId);
    } else if (action === 'ship') {
      request = this.orderService.shipOrder(order.orderId);
    } else if (action === 'cancel') {
      request = this.orderService.cancelOrder(order.orderId);
    } else {
      request = this.orderService.deleteOrder(order.orderId);
    }

    request.subscribe({
      next: () => {
        this.cancelDialog();
        this.actionError.set('');
        this.loadOrders();
      },
      error: error => {
        this.actionError.set(
          getApiErrorMessage(
            error,
            'Failed to update order.'
          )
        );

        this.cancelDialog();
      }
    });
  }

  // Loads the list of orders
  private loadOrders(): void {
    this.loading.set(true);
    this.loadError.set('');

    this.orderService
      .getOrders()
      .subscribe({
        next: orders => {
          this.orders.set(orders);
          this.loading.set(false);
        },
        error: error => {
          this.loadError.set(
            getApiErrorMessage(
              error,
              'Failed to load orders.'
            )
          );

          this.loading.set(false);
        }
      });
  }

  // Resets all filters
  clearFilters(): void {
    this.search.set('');
    this.statusFilter.set('');
    this.customerFilter.set('');
    this.dateFilter.set('');
  }
}