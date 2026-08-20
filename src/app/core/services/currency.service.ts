import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Currency } from '../models/currency/currency.model';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/currencies`;

  // Gets all available currencies
  getCurrencies(): Observable<Currency[]> {
    return this.http
      .get<ApiResponse<Currency[]>>(this.apiUrl)
      .pipe(
        map(response => response.data)
      );
  }
}