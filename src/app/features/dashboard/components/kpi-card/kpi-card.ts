import { Component, input, output } from '@angular/core';

export interface DashboardKpi {
  label: string;
  value: number | string;
  clickable?: boolean;
  highlight?: boolean;
}

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  templateUrl: './kpi-card.html'
})
export class KpiCard {
  kpi = input.required<DashboardKpi>();
  selected = output<void>();
}