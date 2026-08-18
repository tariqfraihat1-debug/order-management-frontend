import { Component, input, output } from '@angular/core';

export interface SelectOption {
  label: string;
  value: string | number;
}

@Component({
  selector: 'app-select-dropdown',
  standalone: true,
  templateUrl: './select-dropdown.html'
})
export class SelectDropdown {
  options = input.required<SelectOption[]>();
  placeholder = input('Select');
  value = input<string | number | null>(null);
  disabled = input(false);

  valueChange = output<string | number>();

  onChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.valueChange.emit(selectElement.value);
  }
}