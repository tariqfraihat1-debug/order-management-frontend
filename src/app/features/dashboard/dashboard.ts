import { DatePipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { DashboardSummary } from '../../core/models/dashboard/dashboard-summary.model';
import { DashboardService } from '../../core/services/dashboard.service';
import { ContentHeader } from '../../shared/components/content-header/content-header';
import { Loading } from '../../shared/components/loading/loading';
import { DashboardKpi, KpiCard } from './components/kpi-card/kpi-card';
import { OrderStatusDistributionBar } from './components/order-status-distribution-bar/order-status-distribution-bar';
import { QuickActions } from './components/quick-actions/quick-actions';
import { RecentOrderRow } from './components/recent-order-row/recent-order-row';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DatePipe, RouterLink, ContentHeader, Loading, KpiCard, OrderStatusDistributionBar, QuickActions, RecentOrderRow],
  templateUrl: './dashboard.html'
})
export class Dashboard implements OnInit {
  private readonly dashboardService = inject(DashboardService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  dashboard = signal<DashboardSummary | null>(null);
  loading = signal(true);
  error = signal('');
  today = new Date();

  username = computed(() => this.authService.username() || 'Admin User');

  kpis = computed<DashboardKpi[]>(() => {
    const data = this.dashboard();

    if (!data) {
      return [];
    }

    return [
      { label: 'Total Orders', value: data.totalOrders, clickable: true },
      { label: 'Active Customers', value: data.activeCustomers, clickable: true },
      { label: 'Pending Review', value: data.pendingReview, clickable: true, highlight: true },
      { label: 'Month Revenue', value: data.monthRevenue }
    ];
  });

  inactiveCustomers = computed(() => {
    const data = this.dashboard();
    return data ? data.totalCustomers - data.activeCustomers : 0;
  });

  ngOnInit(): void {
    this.loadDashboard();
  }

  onKpiClick(kpi: DashboardKpi): void {
    if (kpi.label === 'Total Orders') {
      this.router.navigate(['/orders']);
      return;
    }

    if (kpi.label === 'Active Customers') {
      this.router.navigate(['/customers'], { queryParams: { status: 'active' } });
      return;
    }

    if (kpi.label === 'Pending Review') {
      this.router.navigate(['/orders'], { queryParams: { status: 'Pending' } });
    }
  }

  onStatusSelected(status: string): void {
    this.router.navigate(['/orders'], { queryParams: { status } });
  }

  private loadDashboard(): void {
    this.loading.set(true);
    this.error.set('');

    this.dashboardService.getDashboard().subscribe({
      next: response => {
        this.dashboard.set(response);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load dashboard.');
        this.loading.set(false);
      }
    });
  }
}