export type OrderStatusName =
  | 'Pending'
  | 'Confirmed'
  | 'Cancelled'
  | 'Shipped';

export interface OrderListItem {
  orderId: number;
  orderNumber: number;
  customerName: string;
  orderStateId: number;
  orderStateName: OrderStatusName;
  totalAmount: number;
  currencyCode: string;
  orderItemsCount: number;
  orderItemNames: string[];
  createdDate: string;
}