import { Component, input, output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './search-input.html'
})
export class SearchInput {
  placeholder = input('Search...');
  value = input('');

  valueChange = output<string>();

  faSearch = faSearch;

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.valueChange.emit(input.value);
  }
}