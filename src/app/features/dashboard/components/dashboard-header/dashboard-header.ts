import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-dashboard-header',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './dashboard-header.html'
})
export class DashboardHeader {
  username = input.required<string>();
  date = input.required<Date>();
}