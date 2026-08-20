import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBox, faMagnifyingGlass, faUsers } from '@fortawesome/free-solid-svg-icons';
import { Button } from "../button/button";

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [
    RouterLink,
    FontAwesomeModule,
    Button
],
  templateUrl: './empty-state.html',
  styles: ``
})
export class EmptyState {
  icon = input<'orders' | 'customers' | 'search'>('search');
  title = input<string>('');
  message = input<string>('');
  primaryText = input<string>('');
  primaryLink = input<string>('');
  secondaryText = input<string>('');

  primaryAction = output<void>();

  faUsers = faUsers;
  faBox = faBox;
  faMagnifyingGlass = faMagnifyingGlass;
}