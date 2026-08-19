import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { Customer } from '../../../../../core/models/customer/customer.model';
import { Currency } from '../../../../../core/models/currency/currency.model';


@Component({
  selector: 'app-order-information',
  standalone: true,
  imports: [FormsModule, CurrencyPipe],
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

  onOrderNumberChange(value: string): void {
    this.orderNumberChanged.emit(Number(value));
  }

  onCustomerChange(value: string): void {
    this.customerChanged.emit(Number(value));
  }

  onCurrencyChange(value: string): void {
    this.currencyChanged.emit(value);
  }
}