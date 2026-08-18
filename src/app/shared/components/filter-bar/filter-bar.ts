import { Component, output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFilter, faXmark } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './filter-bar.html'
})
export class FilterBar {

  clear = output<void>();

  faFilter = faFilter;
  faXmark = faXmark;
}