import { Component, input, output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBox, faCheck, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';
import { OrderDetails } from '../../../../../core/models/order/order-details.model';
import { Button } from "../../../../../shared/components/button/button";

export type OrderDetailsAction =
  | 'confirm'
  | 'ship'
  | 'cancel'
  | 'delete';

@Component({
  selector: 'app-order-actions',
  standalone: true,
  imports: [FontAwesomeModule, Button],
  templateUrl: './order-actions.html'
})
export class OrderActions {
  order = input.required<OrderDetails>();
  actionSelected = output<OrderDetailsAction>();

  faCheck = faCheck;
  faBox = faBox;
  faXmark = faXmark;
  faTrash = faTrash;
}