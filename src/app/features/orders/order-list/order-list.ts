import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { OrderListItem } from '../../../core/models/order/order-list-item.model';
import { OrderService } from '../../../core/services/order.service';
import { ConfirmDialog } from '../../../shared/components/confirm-dialog/confirm-dialog';
import { ContentHeader } from '../../../shared/components/content-header/content-header';
import { Loading } from '../../../shared/components/loading/loading';
import { SearchInput } from '../../../shared/components/search-input/search-input';
import { OrderRow } from './components/order-row/order-row';

export type OrderSortField = 'orderNumber' | 'customerName' | 'orderStateName' | 'totalAmount' | 'createdDate';
export type SortDirection = 'asc' | 'desc';
export type OrderAction = 'confirm' | 'ship' | 'cancel' | 'delete';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [RouterLink, ContentHeader, Loading, SearchInput, OrderRow, ConfirmDialog],
  templateUrl: './order-list.html'
})
export class OrderList implements OnInit {
  private readonly orderService = inject(OrderService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  orders = signal<OrderListItem[]>([]);
  loading = signal(true);
  error = signal('');

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
    const dateFilter = this.dateFilter();

    if (search) {
      result = result.filter(order =>
        order.orderNumber.toString().includes(search) ||
        order.customerName.toLowerCase().includes(search)
      );
    }

    if (status) {
      result = result.filter(order => order.orderStateName === status);
    }

    if (customer) {
      result = result.filter(order => order.customerName === customer);
    }

    if (dateFilter) {
      const now = new Date();

      result = result.filter(order => {
        const createdDate = new Date(order.createdDate);

        if (dateFilter === 'today') {
          return createdDate.toDateString() === now.toDateString();
        }

        if (dateFilter === '7days') {
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(now.getDate() - 7);
          return createdDate >= sevenDaysAgo;
        }

        if (dateFilter === '30days') {
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(now.getDate() - 30);
          return createdDate >= thirtyDaysAgo;
        }

        return true;
      });
    }

    const field = this.sortField();
    const direction = this.sortDirection();

    result.sort((a, b) => {
      let comparison = 0;

      if (field === 'orderNumber') comparison = a.orderNumber - b.orderNumber;
      if (field === 'customerName') comparison = a.customerName.localeCompare(b.customerName);
      if (field === 'orderStateName') comparison = a.orderStateName.localeCompare(b.orderStateName);
      if (field === 'totalAmount') comparison = a.totalAmount - b.totalAmount;
      if (field === 'createdDate') comparison = new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime();

      return direction === 'asc' ? comparison : -comparison;
    });

    return result;
  });

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.statusFilter.set(params.get('status') ?? '');
      this.search.set(params.get('search') ?? '');
    });

    this.loadOrders();
  }

  onSearch(value: string): void {
    this.search.set(value);
  }

  onStatusChange(value: string): void {
    this.statusFilter.set(value);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { status: value || null },
      queryParamsHandling: 'merge'
    });
  }

  onCustomerChange(value: string): void {
    this.customerFilter.set(value);
  }

  onDateChange(value: string): void {
    this.dateFilter.set(value);
  }

  sortBy(field: OrderSortField): void {
    if (this.sortField() === field) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
      return;
    }

    this.sortField.set(field);
    this.sortDirection.set(field === 'createdDate' ? 'desc' : 'asc');
  }

  onActionSelected(order: OrderListItem): void {
    this.selectedOrder.set(order);
    this.showActionMenu.set(true);
  }

  onDeleteSelected(order: OrderListItem): void {
    this.selectedOrder.set(order);
    this.selectedAction.set('delete');
    this.showConfirmDialog.set(true);
  }

  chooseAction(action: 'confirm' | 'ship' | 'cancel'): void {
    this.selectedAction.set(action);
    this.showActionMenu.set(false);
    this.showConfirmDialog.set(true);
  }

  cancelDialog(): void {
    this.selectedOrder.set(null);
    this.selectedAction.set(null);
    this.showActionMenu.set(false);
    this.showConfirmDialog.set(false);
  }

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
        this.loadOrders();
      },
      error: () => {
        this.error.set('Failed to update order.');
        this.cancelDialog();
      }
    });
  }

  private loadOrders(): void {
    this.loading.set(true);
    this.error.set('');

    this.orderService.getOrders().subscribe({
      next: orders => {
        this.orders.set(orders);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load orders.');
        this.loading.set(false);
      }
    });
  }
}