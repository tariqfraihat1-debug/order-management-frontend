import { Component, input } from '@angular/core';

@Component({
  selector: 'app-detail-field',
  standalone: true,
  templateUrl: './detail-field.html',
  styles: ``
})
export class DetailField {
  label = input.required<string>();
  value = input.required<string | number>();
}