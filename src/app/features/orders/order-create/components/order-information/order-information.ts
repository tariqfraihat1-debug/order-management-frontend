import { Component, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Customer } from '../../../../../core/models/customer/customer.model';
import { Currency } from '../../../../../core/models/currency/currency.model';

@Component({
  selector: 'app-order-information',
  standalone: true,
  imports: [
    FormsModule,
    CurrencyPipe
  ],
  templateUrl: './order-information.html'
})
export class OrderInformation {
  customers = input<Customer[]>([]);
  currencies = input<Currency[]>([]);
  totalAmount = input(0);

  orderNumberChanged = output<number>();
  customerChanged = output<number>();
  currencyChanged = output<string>();

  orderNumber = 0;

  // Emits order number changes
  onOrderNumberChange(
    value: string
  ): void {
    this.orderNumberChanged.emit(
      Number(value)
    );
  }

  // Emits customer changes
  onCustomerChange(value: string): void {
    this.customerChanged.emit(
      Number(value)
    );
  }

  // Emits currency changes
  onCurrencyChange(
    value: string
  ): void {
    this.currencyChanged.emit(value);
  }
}