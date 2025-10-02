// types/orders.ts

export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "CONFIRMED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURN_REQUESTED"
  | "RETURNED"
  | "FAILED";

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface VendorOrderListQuery {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  startDate?: string; // ISO date
  endDate?: string; // ISO date
  search?: string; // admin only
}

export interface OrderSummary {
  id: string;
  paymentStatus?: "PAID" | "UNPAID" | "REFUNDED";
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  title?: string;
  price: number;
  quantity: number;
  status: OrderStatus;
  order?: OrderSummary;
  createdAt?: string;
  updatedAt?: string;
}

export interface VendorOrderListResponse {
  success?: boolean;
  message?: string;
  data: {
    orderItems: OrderItem[];
    pagination: PaginationMeta;
  };
}

export interface UpdateOrderItemStatusBody {
  status: OrderStatus;
}

export interface UpdateOrderItemStatusResponse {
  success?: boolean;
  message?: string;
  data: {
    updatedCount: number;
    ids: string[];
    newStatus: OrderStatus;
  };
}

export interface VendorOrderStatsResponse {
  success?: boolean;
  message?: string;
  data: {
    totalOrders: number;
    totalRevenue: number;
    ordersByStatus: Array<{
      status: OrderStatus;
      _count: { status: number };
    }>;
  };
}


