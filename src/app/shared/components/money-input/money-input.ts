import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-money-input',
  standalone: true,
  templateUrl: './money-input.html'
})
export class MoneyInput {
  value = input<number | null>(null);

  currencyCode = input('');

  decimals = input(2);

  disabled = input(false);

  valueChange = output<number | null>();

  onInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;

    if (inputElement.value === '') {
      this.valueChange.emit(null);
      return;
    }

    this.valueChange.emit(Number(inputElement.value));
  }

  getStep(): number {
    return 1 / Math.pow(10, this.decimals());
  }
}