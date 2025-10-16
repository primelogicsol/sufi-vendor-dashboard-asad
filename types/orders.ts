// types/orders.ts

// export type OrderStatus =
//   | "PENDING"
//   | "CONFIRMED"
//   | "PROCESSING"
//   | "SHIPPED"
//   | "IN_TRANSIT"
//   | "DELIVERED"
//   | "COMPLETED"
//   | "FAILED"
//   | "CANCELLED"
//   | "RETURNED"
//   | "REFUNDED";

  export type OrderStatus =
  | "PENDING"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED";


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

export interface VendorOrderListQueryAdvanced {
  status?: OrderStatus;
  paymentStatus?: "PAID" | "UNPAID" | "REFUNDED";
  priority?: string;
  dateFrom?: string;
  dateTo?: string;
  amountMin?: number;
  amountMax?: number;
  search?: string;
  page?: number;
  limit?: number;
}

export interface OrderSummary {
  id: string;
  paymentStatus?: "PAID" | "UNPAID" | "REFUNDED";
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderItem {
  id: string | number;
  orderId: string | number;
  category: string;
  productId: string | number;
  title?: string;
  price: number;
  quantity: number;
  status: OrderStatus;
  trackingNumber?: string;
  shippedAt?: string;
  deliveredAt?: string;
  product?: {
    title: string;
    sku: string;
  };
  order?: {
    id: string | number;
    userId: string;
    amount: number;
    status: OrderStatus;
    paymentStatus: "PAID" | "UNPAID" | "REFUNDED";
    fullName: string;
    email: string;
    phone: string | null;
    shippingAddress: string;
    createdAt: string;
    user?: {
      id: string;
      fullName: string;
      email: string;
      phone: string | null;
    };
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface VendorOrderListResponse {
  success?: boolean;
  message?: string;
  data: {
    orders: OrderItem[];
    pagination: PaginationMeta;
  };
}

export interface VendorOrderListResponseAdvanced {
  success?: boolean;
  message?: string;
  data: {
    orders: OrderItem[];
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

export interface VendorAnalyticsResponse {
  success?: boolean;
  message?: string;
  data: {
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    statusDistribution: Record<OrderStatus, number>;
    paymentStatusDistribution: Record<string, number>;
    timeSeriesData: Array<{
      date: string;
      orders: number;
      revenue: number;
    }>;
    topProducts: Array<{
      productId: number;
      category: string;
      quantity: number;
      revenue: number;
    }>;
  };
}


