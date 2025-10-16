// types/inventory.ts

export type ProductCategory = 
  | "FASHION"
  | "ACCESSORIES"
  | "MEDITATION"
  | "HOME_LIVING"
  | "DECORATION"
  | "MUSIC"
  | "DIGITAL_BOOK";

export type AdjustmentType = "INCREASE" | "DECREASE" | "SET";
export type ChangeType = "SALE" | "ADJUSTMENT" | "RETURN" | "RESTOCK";

export interface InventorySummary {
  totalProducts: number;
  totalStock: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  totalValue: number;
  categories: Record<ProductCategory, {
    count: number;
    stock: number;
    value: number;
  }>;
}

export interface InventorySummaryResponse {
  success?: boolean;
  message?: string;
  data: InventorySummary;
}

export interface LowStockAlert {
  id: number;
  productId: number;
  productCategory: ProductCategory;
  currentStock: number;
  threshold: number;
  isResolved: boolean;
  resolvedAt?: string;
  createdAt: string;
}

export interface InventoryMovement {
  id: number;
  productId: number;
  productCategory: ProductCategory;
  changeType: ChangeType;
  quantityChange: number;
  previousStock: number;
  newStock: number;
  reason: string;
  orderId?: number;
  createdAt: string;
}

export interface InventoryDashboard {
  summary: InventorySummary;
  lowStockAlerts: LowStockAlert[];
  recentMovements: InventoryMovement[];
}

export interface InventoryDashboardResponse {
  success?: boolean;
  message?: string;
  data: InventoryDashboard;
}

export interface ProductStock {
  productId: number;
  productCategory: ProductCategory;
  currentStock: number;
  threshold: number;
  isLowStock: boolean;
  lastUpdated: string;
}

export interface ProductStockResponse {
  success?: boolean;
  message?: string;
  data: ProductStock;
}

export interface InventoryLog {
  id: number;
  productId: number;
  productCategory: ProductCategory;
  changeType: ChangeType;
  quantityChange: number;
  previousStock: number;
  newStock: number;
  reason: string;
  orderId?: number;
  createdAt: string;
}

export interface InventoryLogsResponse {
  success?: boolean;
  message?: string;
  data: InventoryLog[];
}

export interface StockAdjustment {
  productId: number;
  productCategory: ProductCategory;
  adjustmentType: AdjustmentType;
  quantity: number;
  reason: string;
  notes?: string;
}

export interface StockAdjustmentResponse {
  success?: boolean;
  message?: string;
  data: {
    productId: number;
    productCategory: ProductCategory;
    previousStock: number;
    newStock: number;
    adjustmentType: AdjustmentType;
    quantity: number;
    reason: string;
    createdAt: string;
  };
}

export interface StockAdjustmentHistory {
  id: number;
  productId: number;
  productCategory: ProductCategory;
  adjustmentType: AdjustmentType;
  quantity: number;
  reason: string;
  notes?: string;
  createdAt: string;
}

export interface StockAdjustmentHistoryResponse {
  success?: boolean;
  message?: string;
  data: StockAdjustmentHistory[];
}

export interface StockValidationItem {
  productId: number;
  productCategory: ProductCategory;
  quantity: number;
}

export interface StockValidationRequest {
  items: StockValidationItem[];
}

export interface StockValidationResult {
  productId: number;
  productCategory: ProductCategory;
  requestedQuantity: number;
  availableStock: number;
  sufficient: boolean;
}

export interface StockValidationResponse {
  success?: boolean;
  message?: string;
  data: {
    valid: boolean;
    errors: string[];
    items: StockValidationResult[];
  };
}

export interface LowStockAlertsResponse {
  success?: boolean;
  message?: string;
  data: LowStockAlert[];
}
