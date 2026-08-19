import { OrderItem } from './order-item.model';

export interface OrderDetails {
  orderId: number;
  orderNumber: number;
  customerId: number;
  customerName: string;
  currencyCode: string;
  shippingCity: string;
  shippingStreet: string;
  shippingBuildingNumber: string;
  orderStateId: number;
  orderStateName: 'Pending' | 'Confirmed' | 'Cancelled' | 'Shipped';
  totalAmount: number;
  createdDate: string;
  updatedDate: string;
  orderItems: OrderItem[];
}