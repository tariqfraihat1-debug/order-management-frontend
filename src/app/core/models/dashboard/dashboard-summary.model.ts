import { OrderStatusDistribution } from './order-status-distribution.model';
import { RecentOrder } from './recent-order.model';

export interface DashboardSummary {
  totalCustomers: number;
  activeCustomers: number;
  totalOrders: number;
  activeOrders: number;
  pendingReview: number;
  monthRevenue: number;
  orderStatusDistribution: OrderStatusDistribution[];
  recentOrders: RecentOrder[];
}