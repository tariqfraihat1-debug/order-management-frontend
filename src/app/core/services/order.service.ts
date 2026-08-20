import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { CreateOrderRequest } from '../models/order/create-order-request.model';
import { OrderDetails } from '../models/order/order-details.model';
import { OrderListItem } from '../models/order/order-list-item.model';
import { CreateOrderItemRequest } from '../models/order/create-order-item-request.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/orders`;

  // Gets all orders
  getOrders(): Observable<OrderListItem[]> {
    return this.http
      .get<ApiResponse<OrderListItem[]>>(this.apiUrl)
      .pipe(
        map(response => response.data)
      );
  }

  // Gets an order by id
  getOrderById(orderId: number): Observable<OrderDetails> {
    return this.http
      .get<ApiResponse<OrderDetails>>(
        `${this.apiUrl}/${orderId}`
      )
      .pipe(
        map(response => response.data)
      );
  }

  // Creates a new order
  createOrder(request: CreateOrderRequest): Observable<number> {
    return this.http
      .post<ApiResponse<number>>(
        this.apiUrl,
        request
      )
      .pipe(
        map(response => response.data)
      );
  }

  // Confirms an order
  confirmOrder(orderId: number): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/${orderId}/confirm`,
      {}
    );
  }

  // Cancels an order
  cancelOrder(orderId: number): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/${orderId}/cancel`,
      {}
    );
  }

  // Ships an order
  shipOrder(orderId: number): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/${orderId}/ship`,
      {}
    );
  }

  // Deletes an order
  deleteOrder(orderId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${orderId}`
    );
  }

  // Removes an item from an order
  removeOrderItem(
    orderId: number,
    itemId: number
  ): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${orderId}/items/${itemId}`
    );
  }

  // Updates the quantity of an order item
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

  // Adds a new item to an order
addOrderItem(
  orderId: number,
  item: CreateOrderItemRequest
): Observable<void> {
  return this.http.post<void>(
    `${this.apiUrl}/${orderId}/items`,
    item
  );
}
}