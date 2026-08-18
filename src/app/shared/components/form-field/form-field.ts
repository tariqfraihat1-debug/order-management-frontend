import { Component, input } from '@angular/core';

@Component({
  selector: 'app-form-field',
  standalone: true,
  templateUrl: './form-field.html'
})
export class FormField {
  label = input.required<string>();

  required = input(false);

  error = input<string | null>(null);

  hint = input<string>();
}