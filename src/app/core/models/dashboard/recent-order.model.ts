export type OrderStatusName =
  | 'Pending'
  | 'Confirmed'
  | 'Cancelled'
  | 'Shipped';

export interface RecentOrder {
  orderId: number;
  orderNumber: number;
  customerId: number;
  customerName: string;
  orderStateName: OrderStatusName;
  totalAmount: number;
  currencyCode: string;
  createdDate: string;
}