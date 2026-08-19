export interface CreateOrderRequest {
  orderNumber:number;
  customerId:number;
  city:string;
  street:string;
  buildingNumber:string;
  currencyCode:string;
  orderItems:CreateOrderItemRequest[];
}

export interface CreateOrderItemRequest {
  itemName:string;
  itemNameAlternate:string|null;
  quantity:number;
  price:number;
}