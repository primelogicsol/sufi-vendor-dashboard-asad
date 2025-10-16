// lib/utils/inventory-client.ts

import { ApiClient } from '@/lib/utils/api-client'
import type {
  InventorySummaryResponse,
  InventoryDashboardResponse,
  ProductStockResponse,
  InventoryLogsResponse,
  StockAdjustment,
  StockAdjustmentResponse,
  StockAdjustmentHistoryResponse,
  StockValidationRequest,
  StockValidationResponse,
  LowStockAlertsResponse,
  ProductCategory,
} from '@/types/inventory'

export class InventoryClient {
  // Get inventory summary
  static async getInventorySummary(): Promise<InventorySummaryResponse> {
    const url = '/inventory/summary'
    console.log('[InventoryClient] getInventorySummary → URL:', url)

    try {
      const response = await ApiClient.getJson<InventorySummaryResponse>(url)
      console.log('[InventoryClient] getInventorySummary → Response:', response)
      return response
    } catch (error) {
      console.error('[InventoryClient] getInventorySummary → Error:', error)
      throw error
    }
  }

  // Get inventory dashboard
  static async getInventoryDashboard(): Promise<InventoryDashboardResponse> {
    const url = '/inventory/dashboard'
    console.log('[InventoryClient] getInventoryDashboard → URL:', url)

    try {
      const response = await ApiClient.getJson<InventoryDashboardResponse>(url)
      console.log('[InventoryClient] getInventoryDashboard → Response:', response)
      return response
    } catch (error) {
      console.error('[InventoryClient] getInventoryDashboard → Error:', error)
      throw error
    }
  }

  // Get product stock
  static async getProductStock(
    productId: number,
    category: ProductCategory
  ): Promise<ProductStockResponse> {
    const url = `/inventory/product/${productId}/${category}/stock`
    console.log('[InventoryClient] getProductStock → URL:', url)

    try {
      const response = await ApiClient.getJson<ProductStockResponse>(url)
      console.log('[InventoryClient] getProductStock → Response:', response)
      return response
    } catch (error) {
      console.error('[InventoryClient] getProductStock → Error:', error)
      throw error
    }
  }

  // Get product inventory logs
  static async getProductInventoryLogs(
    productId: number,
    category: ProductCategory,
    limit: number = 50
  ): Promise<InventoryLogsResponse> {
    const params = new URLSearchParams()
    if (limit) params.set('limit', String(limit))

    const url = `/inventory/product/${productId}/${category}/logs?${params.toString()}`
    console.log('[InventoryClient] getProductInventoryLogs → URL:', url)

    try {
      const response = await ApiClient.getJson<InventoryLogsResponse>(url)
      console.log('[InventoryClient] getProductInventoryLogs → Response:', response)
      return response
    } catch (error) {
      console.error('[InventoryClient] getProductInventoryLogs → Error:', error)
      throw error
    }
  }

  // Manual stock adjustment
  static async adjustStock(adjustment: StockAdjustment): Promise<StockAdjustmentResponse> {
    const url = '/inventory/adjust'
    console.log('[InventoryClient] adjustStock → URL:', url)
    console.log('[InventoryClient] adjustStock → Body:', adjustment)

    try {
      const response = await ApiClient.postJson<StockAdjustmentResponse>(url, adjustment)
      console.log('[InventoryClient] adjustStock → Response:', response)
      return response
    } catch (error) {
      console.error('[InventoryClient] adjustStock → Error:', error)
      throw error
    }
  }

  // Get stock adjustment history
  static async getStockAdjustmentHistory(
    limit: number = 50,
    productId?: number,
    category?: ProductCategory
  ): Promise<StockAdjustmentHistoryResponse> {
    const params = new URLSearchParams()
    if (limit) params.set('limit', String(limit))
    if (productId) params.set('productId', String(productId))
    if (category) params.set('category', category)

    const url = `/inventory/adjustments?${params.toString()}`
    console.log('[InventoryClient] getStockAdjustmentHistory → URL:', url)

    try {
      const response = await ApiClient.getJson<StockAdjustmentHistoryResponse>(url)
      console.log('[InventoryClient] getStockAdjustmentHistory → Response:', response)
      return response
    } catch (error) {
      console.error('[InventoryClient] getStockAdjustmentHistory → Error:', error)
      throw error
    }
  }

  // Get low stock alerts
  static async getLowStockAlerts(resolved?: boolean): Promise<LowStockAlertsResponse> {
    const params = new URLSearchParams()
    if (resolved !== undefined) params.set('resolved', String(resolved))

    const url = `/inventory/alerts?${params.toString()}`
    console.log('[InventoryClient] getLowStockAlerts → URL:', url)

    try {
      const response = await ApiClient.getJson<LowStockAlertsResponse>(url)
      console.log('[InventoryClient] getLowStockAlerts → Response:', response)
      return response
    } catch (error) {
      console.error('[InventoryClient] getLowStockAlerts → Error:', error)
      throw error
    }
  }

  // Validate stock availability
  static async validateStock(request: StockValidationRequest): Promise<StockValidationResponse> {
    const url = '/inventory/validate'
    console.log('[InventoryClient] validateStock → URL:', url)
    console.log('[InventoryClient] validateStock → Body:', request)

    try {
      const response = await ApiClient.postJson<StockValidationResponse>(url, request)
      console.log('[InventoryClient] validateStock → Response:', response)
      return response
    } catch (error) {
      console.error('[InventoryClient] validateStock → Error:', error)
      throw error
    }
  }
}
