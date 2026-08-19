import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {map, Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {ApiResponse} from '../models/api-response.model';
import {Customer} from '../models/customer/customer.model';

@Injectable({
providedIn:'root'
})
export class CustomerService{

private readonly http=inject(HttpClient);
private readonly apiUrl=`${environment.apiUrl}/customers`;

getCustomers():Observable<Customer[]>{
return this.http
.get<ApiResponse<Customer[]>>(this.apiUrl)
.pipe(map(response=>response.data));
}

}