import { Component, input, output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  IconDefinition,
  faInbox
} from '@fortawesome/free-solid-svg-icons';

import { Button } from '../button/button';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [
    FontAwesomeModule,
    Button
  ],
  templateUrl: './empty-state.html'
})
export class EmptyState {
  icon = input<IconDefinition>(faInbox);

  headline = input.required<string>();

  description = input<string>();

  actionLabel = input<string>();

  actionIcon = input<IconDefinition | null>(null);

  action = output<void>();
}