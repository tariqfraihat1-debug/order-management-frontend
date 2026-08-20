import { Component, input, output } from '@angular/core';
import { Button } from '../../../../../shared/components/button/button';
import { ConfirmDialog } from '../../../../../shared/components/confirm-dialog/confirm-dialog';
import { OrderListItem } from '../../../../../core/models/order/order-list-item.model';
import { OrderAction } from '../../order-list';

@Component({
  selector: 'app-order-action-dialog',
  standalone: true,
  imports: [
    Button,
    ConfirmDialog
  ],
  templateUrl: './order-action-dialog.html'
})
export class OrderActionDialog {
  order = input<OrderListItem | null>(null);
  showMenu = input(false);
  showConfirm = input(false);
  selectedAction = input<OrderAction | null>(null);

  actionSelected = output<OrderAction>();
  confirmed = output<void>();
  cancelled = output<void>();

  // Emits the chosen action
  chooseAction(action: OrderAction): void {
    this.actionSelected.emit(action);
  }

  confirmationTitle(): string {
    const titles: Record<OrderAction, string> = {
      confirm: 'Confirm Order',
      ship: 'Ship Order',
      cancel: 'Cancel Order',
      delete: 'Delete Order'
    };

    return titles[this.selectedAction() ?? 'delete'];
  }

  confirmationMessage(): string {
    const messages: Record<OrderAction, string> = {
      confirm: 'Are you sure you want to confirm this order?',
      ship: 'Are you sure you want to ship this order?',
      cancel: 'Are you sure you want to cancel this order?',
      delete: 'Are you sure you want to permanently delete this cancelled order?'
    };

    return messages[this.selectedAction() ?? 'delete'];
  }

  confirmationText(): string {
    const buttons: Record<OrderAction, string> = {
      confirm: 'Confirm',
      ship: 'Ship',
      cancel: 'Cancel',
      delete: 'Delete'
    };

    return buttons[this.selectedAction() ?? 'delete'];
  }

  isDangerAction(): boolean {
    return [
      'cancel',
      'delete'
    ].includes(
      this.selectedAction() ?? ''
    );
  }
}