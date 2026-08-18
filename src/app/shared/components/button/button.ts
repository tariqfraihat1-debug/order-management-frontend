import { Component, input, output } from '@angular/core';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'danger'
  | 'success';

@Component({
  selector: 'app-button',
  standalone: true,
  templateUrl: './button.html'
})
export class Button {
  type = input<'button' | 'submit' | 'reset'>('button');
  variant = input<ButtonVariant>('primary');
  disabled = input(false);

  clicked = output<void>();

  onClick(): void {
    if (!this.disabled()) {
      this.clicked.emit();
    }
  }
}