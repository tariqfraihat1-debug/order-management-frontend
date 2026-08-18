import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-toggle-switch',
  standalone: true,
  templateUrl: './toggle-switch.html'
})
export class ToggleSwitch {
  checked = input(false);
  disabled = input(false);
  label = input<string>();

  checkedChange = output<boolean>();

  onChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;

    this.checkedChange.emit(inputElement.checked);
  }
}