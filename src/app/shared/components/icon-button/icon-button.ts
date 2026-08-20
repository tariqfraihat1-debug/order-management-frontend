import { Component, input, output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'app-icon-button',
  standalone: true,
  imports: [
    FontAwesomeModule
  ],
  templateUrl: './icon-button.html',
  styles: ``
})
export class IconButton {
  icon = input.required<IconDefinition>();

  title = input<string>('');

  disabled = input(false);

  clicked = output<void>();

  // Handles button click
  onClick(): void {
    if (!this.disabled()) {
      this.clicked.emit();
    }
  }
}