import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { DashboardSummary } from '../models/dashboard/dashboard-summary.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/dashboard`;

  // Gets the dashboard APIs
  getDashboard(): Observable<DashboardSummary> {
    return this.http
      .get<ApiResponse<DashboardSummary>>(this.apiUrl)
      .pipe(
        map(response => response.data)
      );
  }
}