import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { CreateOrderRequest } from '../models/order/create-order-request.model';
import { OrderDetails } from '../models/order/order-details.model';
import { OrderListItem } from '../models/order/order-list-item.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/orders`;

  getOrders(): Observable<OrderListItem[]> {
    return this.http
      .get<ApiResponse<OrderListItem[]>>(this.apiUrl)
      .pipe(map(response => response.data));
  }

  getOrderById(orderId: number): Observable<OrderDetails> {
    return this.http
      .get<ApiResponse<OrderDetails>>(`${this.apiUrl}/${orderId}`)
      .pipe(map(response => response.data));
  }

  createOrder(request: CreateOrderRequest): Observable<number> {
    return this.http
      .post<ApiResponse<number>>(this.apiUrl, request)
      .pipe(map(response => response.data));
  }

  confirmOrder(orderId: number): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/${orderId}/confirm`,
      {}
    );
  }

  cancelOrder(orderId: number): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/${orderId}/cancel`,
      {}
    );
  }

  shipOrder(orderId: number): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/${orderId}/ship`,
      {}
    );
  }

  deleteOrder(orderId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${orderId}`
    );
  }

  removeOrderItem(
    orderId: number,
    itemId: number
  ): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${orderId}/items/${itemId}`
    );
  }

  updateOrderItemQuantity(
    orderId: number,
    itemId: number,
    quantity: number
  ): Observable<void> {
    return this.http.put<void>(
      `${this.apiUrl}/${orderId}/items/${itemId}/quantity`,
      { quantity }
    );
  }

  addOrderItem(
    orderId: number,
    item: {
      itemName: string;
      itemNameAlternate?: string | null;
      quantity: number;
      price: number;
    }
  ): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/${orderId}/items`,
      item
    );
  }
}