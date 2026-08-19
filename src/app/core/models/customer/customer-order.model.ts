export interface CustomerOrder {

orderId:number;

orderNumber:number;

orderStateName:
'Pending'
|'Confirmed'
|'Shipped'
|'Cancelled';

totalAmount:number;

currencyCode:string;

createdDate:string;

orderItemsCount:number;

}