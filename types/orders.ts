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

// New vendor orders analytics shape (GET /vendor/orders/analytics)
export interface VendorOrdersAnalyticsResponse {
  success?: boolean
  status?: number
  message?: string
  data: {
    summary: {
      totalItems: number
      totalRevenue: number
      averageItemValue: number
    }
    itemsByStatus: Array<{
      status: string
      count: number
    }>
    recentItems: Array<{
      id: number
      orderId: number
      category: string
      productId: number
      vendorId: string
      quantity: number
      price: number
      status: string
      trackingNumber: string | null
      shippedAt: string | null
      deliveredAt: string | null
      createdAt: string
      updatedAt: string
      order: {
        id: number
        userId: string
        amount: number
        fullName: string
        email: string | null
        phone?: string | null
        shippingAddress?: string | null
        status: string
        paymentStatus: string
        createdAt: string
        updatedAt: string
        user?: {
          id: string
          fullName: string
          email: string
        }
      }
    }>
  }
}


// Shipping types
export interface CreateShippingLabelRequest {
  weight: number
  dimensions: { length: number; width: number; height: number }
  serviceType: 'PRIORITY' | 'FIRST_CLASS' | 'EXPRESS' | 'GROUND' | string
}

export interface CreateShippingLabelResponse {
  success?: boolean
  message?: string
  data: {
    trackingNumber: string
    labelUrl?: string
    carrier?: string
    serviceType?: string
  }
}

export type ShipmentPublicStatus =
  | 'CREATED'
  | 'PICKED_UP'
  | 'IN_TRANSIT'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'EXCEPTION'
  | 'RETURNED'

export interface UpdateShipmentStatusRequest {
  status: ShipmentPublicStatus
  location?: string
  notes?: string
}

export interface UpdateShipmentStatusResponse {
  success?: boolean
  message?: string
  data: {
    trackingNumber: string
    status: ShipmentPublicStatus
    updatedAt: string
  }
}

export interface ShipmentTrackingEvent {
  status: ShipmentPublicStatus
  timestamp: string
  location?: string
  notes?: string
}

export interface ShipmentTrackingResponse {
  success?: boolean
  message?: string
  data: {
    trackingNumber: string
    currentStatus: ShipmentPublicStatus
    events: ShipmentTrackingEvent[]
  }
}

export interface DetailedShipmentTrackingResponse {
  success?: boolean
  status?: number
  message?: string
  data: {
    trackingNumber: string
    carrier: string
    status: string
    shippingMethod: string
    estimatedDelivery: string | null
    actualDelivery: string | null
    weight: number
    dimensions: {
      length: number
      width: number
      height: number
    }
    cost: number
    labelUrl: string | null
    trackingUrl: string | null
    notes: string | null
    order: {
      id: number
      userId: string
      amount: number
      status: string
      paymentStatus: string
      fullName: string
      shippingAddress: string
      zip: string
      phone: string
      country: string
      trackingNumber: string | null
      carrier: string | null
      shippingCost: number
      estimatedDelivery: string | null
      actualDelivery: string | null
      createdAt: string
      updatedAt: string
      user: {
        id: string
        fullName: string
        email: string
      }
      items: Array<{
        id: number
        orderId: number
        category: string
        productId: number
        vendorId: string
        quantity: number
        price: number
        status: string
        trackingNumber: string | null
        shippedAt: string | null
        deliveredAt: string | null
        createdAt: string
        updatedAt: string
      }>
    }
    createdAt: string
    updatedAt: string
  }
}


