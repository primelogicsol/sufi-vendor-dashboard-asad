// types/analytics.ts

export type TimePeriod = "7d" | "30d" | "90d" | "1y";
export type GroupBy = "day" | "week" | "month";

export interface TimeSeriesData {
  date: string;
  revenue: number;
  orders: number;
}

export interface TopProduct {
  productId: number;
  title: string;
  category: string;
  revenue: number;
  orders: number;
}

export interface SalesAnalytics {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  conversionRate: number;
  timeSeriesData: TimeSeriesData[];
  topProducts: TopProduct[];
}

export interface SalesAnalyticsResponse {
  success?: boolean;
  message?: string;
  data: SalesAnalytics;
}

export interface InventoryAnalytics {
  totalProducts: number;
  totalStock: number;
  totalValue: number;
  turnoverRate: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  categories: Record<string, {
    count: number;
    stock: number;
    value: number;
    turnoverRate: number;
  }>;
}

export interface InventoryAnalyticsResponse {
  success?: boolean;
  message?: string;
  data: InventoryAnalytics;
}

export interface VendorPerformance {
  fulfillmentRate: number;
  onTimeDelivery: number;
  returnRate: number;
}

export interface VendorAnalytics {
  vendorId: string;
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  customerCount: number;
  productCount: number;
  rating: number;
  performance: VendorPerformance;
}

export interface VendorAnalyticsResponse {
  success?: boolean;
  message?: string;
  data: VendorAnalytics;
}

export interface AnalyticsOverview {
  sales: {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
  };
  inventory: {
    totalProducts: number;
    totalStock: number;
    lowStockProducts: number;
  };
  customers: {
    totalCustomers: number;
    newCustomers: number;
    returningCustomers: number;
  };
  performance: VendorPerformance;
}

export interface AnalyticsOverviewResponse {
  success?: boolean;
  message?: string;
  data: AnalyticsOverview;
}
