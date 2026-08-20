import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderDetails as OrderDetailsModel } from '../../../core/models/order/order-details.model';
import { OrderItem } from '../../../core/models/order/order-item.model';
import { OrderService } from '../../../core/services/order.service';
import { getApiErrorMessage } from '../../../core/utils/api-error.util';
import { Breadcrumb } from '../../../shared/components/breadcrumb/breadcrumb';
import { ConfirmDialog } from '../../../shared/components/confirm-dialog/confirm-dialog';
import { ContentHeader } from '../../../shared/components/content-header/content-header';
import { Loading } from '../../../shared/components/loading/loading';
import { OrderItemDialog, OrderItemFormValue } from '../../../shared/components/order-item-dialog/order-item-dialog';
import { OrderItems } from '../../../shared/components/order-items/order-items';
import { StatusBadge } from '../../../shared/components/status-badge/status-badge';
import { OrderActions, OrderDetailsAction } from './components/order-actions/order-actions';
import { OrderSummary } from './components/order-summary/order-summary';

export type OrderAction = 'confirm' | 'ship' | 'cancel' | 'delete' | 'removeItem';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [
    DatePipe,
    ContentHeader,
    Loading,
    StatusBadge,
    ConfirmDialog,
    OrderSummary,
    OrderActions,
    OrderItems,
    OrderItemDialog,
    Breadcrumb
  ],
  templateUrl: './order-details.html'
})
export class OrderDetails implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly orderService = inject(OrderService);

  order = signal<OrderDetailsModel | null>(null);
  loading = signal(true);
  loadError = signal('');
  actionError = signal('');
  itemError = signal('');
  selectedAction = signal<OrderAction | null>(null);
  selectedItem = signal<OrderItem | null>(null);
  showConfirmDialog = signal(false);
  showItemDialog = signal(false);

  itemDialogMode =signal<'add' | 'editQuantity'>('add');

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('orderId')
    );

    if (!id) {
      this.loadError.set('Invalid order id.');
      this.loading.set(false);
      return;
    }

    this.loadOrder(id);
  }

  // Loads order details
  loadOrder(id: number): void {
    this.loading.set(true);
    this.loadError.set('');

    this.orderService
      .getOrderById(id)
      .subscribe({
        next: order => {
          this.order.set(order);
          this.loading.set(false);
        },
        error: error => {
          this.loadError.set(
            getApiErrorMessage(
              error,
              'Failed to load order details.'
            )
          );

          this.loading.set(false);
        }
      });
  }

  // Checks if order can be edited
  isEditable(): boolean {
    const state = this.order()?.orderStateName;

    return state === 'Pending'
      || state === 'Confirmed';
  }

  // Handles selected order action
  onActionSelected(
    action: OrderDetailsAction
  ): void {
    this.actionError.set('');
    this.selectedAction.set(action);
    this.showConfirmDialog.set(true);
  }

  // Confirms selected action
  confirmSelectedAction(): void {
    const order = this.order();
    const action = this.selectedAction();

    if (!order || !action) {
      return;
    }

    if (action === 'confirm') {
      this.orderService
        .confirmOrder(order.orderId)
        .subscribe({
          next: () => this.afterAction(),
          error: error =>
            this.actionFailed(
              error,
              'Failed to confirm order.'
            )
        });

      return;
    }

    if (action === 'ship') {
      this.orderService
        .shipOrder(order.orderId)
        .subscribe({
          next: () => this.afterAction(),
          error: error =>
            this.actionFailed(
              error,
              'Failed to ship order.'
            )
        });

      return;
    }

    if (action === 'cancel') {
      this.orderService
        .cancelOrder(order.orderId)
        .subscribe({
          next: () => this.afterAction(),
          error: error =>
            this.actionFailed(
              error,
              'Failed to cancel order.'
            )
        });

      return;
    }

    if (action === 'delete') {
      this.orderService
        .deleteOrder(order.orderId)
        .subscribe({
          next: () =>
            this.router.navigate([
              '/orders'
            ]),
          error: error =>
            this.actionFailed(
              error,
              'Failed to delete order.'
            )
        });

      return;
    }

    const item = this.selectedItem();

    if (action === 'removeItem' && item) {
      this.orderService
        .removeOrderItem(
          order.orderId,
          item.itemId
        )
        .subscribe({
          next: () => this.afterAction(),
          error: error =>
            this.actionFailed(
              error,
              'Failed to remove item.'
            )
        });
    }
  }

  // Opens add item dialog
  openAddItem(): void {
    this.itemError.set('');
    this.selectedItem.set(null);
    this.itemDialogMode.set('add');
    this.showItemDialog.set(true);
  }

  // Opens edit item dialog
  editItem(
    item: OrderItem
  ): void {
    this.itemError.set('');
    this.selectedItem.set(item);
    this.itemDialogMode.set('editQuantity');
    this.showItemDialog.set(true);
  }

  // Removes item from order
  removeItem(
    item: OrderItem
  ): void {
    this.actionError.set('');
    this.selectedItem.set(item);
    this.selectedAction.set('removeItem');
    this.showConfirmDialog.set(true);
  }

  // Adds item to order
  // Adds item to order
addItem(
  value: OrderItemFormValue
): void {
  const order = this.order();
  
  if (!order) {
    return;
  }

  const exists = order.orderItems
    .some(
      item =>
        item.itemName
          .trim()
          .toLowerCase()
          ===
        value.itemName
          .trim()
          .toLowerCase()
    );

  if(exists){

    this.itemError.set(
      'This item already exists in the order.'
    );

    return;
  }

  this.itemError.set('');

  this.orderService
    .addOrderItem(
      order.orderId,
      value
    )
    .subscribe({

      next: () => {

        this.closeItemDialog();

        this.loadOrder(
          order.orderId
        );

      },

      error: error => {

        this.itemError.set(
          getApiErrorMessage(
            error,
            'Failed to add item.'
          )
        );

      }

    });

}

  // Updates item quantity
  updateItemQuantity(
    quantity: number
  ): void {
    const order = this.order();
    const item = this.selectedItem();

    if (!order || !item) {
      return;
    }

    this.itemError.set('');

    this.orderService
      .updateOrderItemQuantity(
        order.orderId,
        item.itemId,
        quantity
      )
      .subscribe({
        next: () => {
          this.closeItemDialog();
          this.loadOrder(order.orderId);
        },
        error: error => {
          this.itemError.set(
            getApiErrorMessage(
              error,
              'Failed to update quantity.'
            )
          );
        }
      });
  }

  // Closes item dialog
  closeItemDialog(): void {
    this.showItemDialog.set(false);
    this.selectedItem.set(null);
    this.itemError.set('');
  }

  // Cancels confirmation dialog
  cancelDialog(): void {
    this.showConfirmDialog.set(false);
    this.selectedAction.set(null);
    this.selectedItem.set(null);
  }

  confirmationTitle(): string {
    const titles: Record<string, string> = {
      confirm: 'Confirm Order',
      ship: 'Ship Order',
      cancel: 'Cancel Order',
      delete: 'Delete Order',
      removeItem: 'Remove Item'
    };

    return titles[this.selectedAction() ?? '']
      ?? 'Confirmation';
  }

  confirmationMessage(): string {
    const messages: Record<string, string> = {
      confirm: 'Are you sure you want to confirm this order?',
      ship: 'Are you sure you want to ship this order?',
      cancel: 'Are you sure you want to cancel this order?',
      delete: 'Are you sure you want to delete this order?'
    };

    return messages[this.selectedAction() ?? '']
      ?? `Are you sure you want to remove ${this.selectedItem()?.itemName}?`;
  }

  confirmationText(): string {
    const buttons: Record<string, string> = {
      confirm: 'Confirm',
      ship: 'Ship',
      cancel: 'Cancel',
      delete: 'Delete',
      removeItem: 'Remove'
    };

    return buttons[this.selectedAction() ?? '']
      ?? 'Confirm';
  }

  isDangerAction(): boolean {
    return [
      'cancel',
      'delete',
      'removeItem'
    ].includes(
      this.selectedAction() ?? ''
    );
  }

  private afterAction(): void {
    const id = this.order()?.orderId;
    this.cancelDialog();
    this.actionError.set('');
    if (id) {
      this.loadOrder(id);
    }
  }

  private actionFailed(error: unknown,fallback: string ): void {
    this.actionError.set(
      getApiErrorMessage(
        error,
        fallback
      )
    );

    this.cancelDialog();
  }
}