import { Component, input, output } from '@angular/core';
import { SearchInput } from '../../../../../shared/components/search-input/search-input';

@Component({
  selector: 'app-order-filter',
  standalone: true,
  imports: [
    SearchInput
  ],
  templateUrl: './order-filter.html'
})
export class OrderFilter {
  customers = input<string[]>([]);
  search = input('');
  status = input('');
  customer = input('');
  date = input('');

  searchChanged = output<string>();
  statusChanged = output<string>();
  customerChanged = output<string>();
  dateChanged = output<string>();
}