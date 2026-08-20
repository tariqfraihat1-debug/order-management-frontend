import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { Customer } from '../models/customer/customer.model';
import { CustomerDetails } from '../models/customer/customer-details.model';
import { CustomerOrder } from '../models/customer/customer-order.model';
import { CreateCustomerRequest } from '../models/customer/create-customer-request.model';
import { UpdateCustomerRequest } from '../models/customer/update-customer-request.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/customers`;

  // Gets all customers
  getCustomers(): Observable<Customer[]> {
    return this.http
      .get<ApiResponse<Customer[]>>(this.apiUrl)
      .pipe(
        map(response => response.data)
      );
  }

  // Gets a customer by id
  getCustomerById(id: number): Observable<CustomerDetails> {
    return this.http
      .get<ApiResponse<CustomerDetails>>(
        `${this.apiUrl}/${id}`
      )
      .pipe(
        map(response => response.data)
      );
  }

  // Gets all orders for a customer
  getCustomerOrders(id: number): Observable<CustomerOrder[]> {
    return this.http
      .get<ApiResponse<CustomerOrder[]>>(
        `${this.apiUrl}/${id}/orders`
      )
      .pipe(
        map(response => response.data)
      );
  }

  // Creates a new customer
  createCustomer(customer: CreateCustomerRequest): Observable<number> {
    return this.http
      .post<ApiResponse<number>>(
        this.apiUrl,
        customer
      )
      .pipe(
        map(response => response.data)
      );
  }

  // Updates an existing customer
  updateCustomer(
    id: number,
    customer: UpdateCustomerRequest
  ): Observable<void> {
    return this.http.put<void>(
      `${this.apiUrl}/${id}`,
      customer
    );
  }

  // Activates a customer
  activateCustomer(id: number): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(
      `${this.apiUrl}/${id}/activate`,
      {}
    );
  }

  // Deactivates a customer
  deactivateCustomer(id: number): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(
      `${this.apiUrl}/${id}/deactivate`,
      {}
    );
  }
}