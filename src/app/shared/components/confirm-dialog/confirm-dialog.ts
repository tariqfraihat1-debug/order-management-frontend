import { Component, input, output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faTriangleExclamation,
  faXmark
} from '@fortawesome/free-solid-svg-icons';

import { Button } from '../button/button';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [
    FontAwesomeModule,
    Button
  ],
  templateUrl: './confirm-dialog.html'
})
export class ConfirmDialog {

  open = input(false);

  title = input.required<string>();

  message = input.required<string>();

  confirmText = input('Confirm');

  cancelText = input('Cancel');

  danger = input(true);

  confirmed = output<void>();

  cancelled = output<void>();

  faTriangleExclamation = faTriangleExclamation;
  faXmark = faXmark;
}