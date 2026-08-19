import { CreateOrderItemRequest } from "./create-order-item-request.model";


export interface CreateOrderRequest{
orderNumber:number;
customerId:number;
city:string;
street:string;
buildingNumber:string;
currencyCode:string;
orderItems:CreateOrderItemRequest[];
}