import { NgTemplateOutlet } from '@angular/common';
import { Component, input, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-content-header',
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: './content-header.html'
})
export class ContentHeader {
  leftTemplate = input.required<TemplateRef<unknown>>();
  rightTemplate = input<TemplateRef<unknown>>();
}