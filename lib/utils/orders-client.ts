// // lib/utils/orders-client.ts

// import { ApiClient } from '@/lib/utils/api-client'
// import type {
//   VendorOrderListQuery,
//   VendorOrderListResponse,
//   UpdateOrderItemStatusBody,
//   UpdateOrderItemStatusResponse,
//   VendorOrderStatsResponse,
//   OrderItem,
// } from '@/types/orders'
// export class OrdersClient {
//   static async listVendorOrderItems(vendorId: string, query: VendorOrderListQuery = {}): Promise<VendorOrderListResponse> {
//     const params = new URLSearchParams()
//     if (query.page) params.set('page', String(query.page))
//     if (query.limit) params.set('limit', String(query.limit))
//     if (query.status) params.set('status', query.status)
//     if (query.startDate) params.set('startDate', query.startDate)
//     if (query.endDate) params.set('endDate', query.endDate)
//     if (query.search) params.set('search', query.search)

//     return ApiClient.postJson<VendorOrderListResponse>(`/vendor-orders/${vendorId}?${params.toString()}`, {})
//   }

//   static async getOrderItemDetail(orderItemId: string): Promise<OrderItem> {
//     return ApiClient.getJson<OrderItem>(`/vendor-orders/item/${orderItemId}`)
//   }

//   static async bulkUpdateOrderItemStatus(ids: string[], body: UpdateOrderItemStatusBody): Promise<UpdateOrderItemStatusResponse> {
//     const idParam = ids.join(',')
//     return ApiClient.patch(`/vendor-orders/status/${idParam}`, body).then(r => r.json())
//   }

//   static async getVendorOrderStats(vendorId: string): Promise<VendorOrderStatsResponse> {
//     return ApiClient.getJson<VendorOrderStatsResponse>(`/vendor-orders/stats/${vendorId}`)
//   }
// }




// lib/utils/orders-client.ts

import { ApiClient } from '@/lib/utils/api-client'
import type {
  VendorOrderListQuery,
  VendorOrderListResponse,
  VendorOrderListQueryAdvanced,
  VendorOrderListResponseAdvanced,
  UpdateOrderItemStatusBody,
  UpdateOrderItemStatusResponse,
  VendorOrderStatsResponse,
  VendorAnalyticsResponse,
  OrderItem,
} from '@/types/orders'

export class OrdersClient {
  static async listVendorOrderItems(
    query: VendorOrderListQuery = {}
  ): Promise<VendorOrderListResponse> {
    const params = new URLSearchParams()
    if (query.page) params.set('page', String(query.page))
    if (query.limit) params.set('limit', String(query.limit))
    if (query.status) params.set('status', query.status)
    if (query.startDate) params.set('startDate', query.startDate)
    if (query.endDate) params.set('endDate', query.endDate)
    if (query.search) params.set('search', query.search)

    const finalUrl = `/vendor/orders?${params.toString()}`
    console.log('[OrdersClient] listVendorOrderItems → URL:', finalUrl)
    console.log('[OrdersClient] listVendorOrderItems → Query Params:', query)

    try {
      const response = await ApiClient.getJson<VendorOrderListResponse>(finalUrl)
      console.log('[OrdersClient] listVendorOrderItems → Response:', response)
      return response
    } catch (error) {
      console.error('[OrdersClient] listVendorOrderItems → Error:', error)
      throw error
    }
  }

  static async getOrderItemDetail(orderItemId: string): Promise<OrderItem> {
    const url = `/vendor-orders/item/${orderItemId}`
    console.log('[OrdersClient] getOrderItemDetail → URL:', url)

    try {
      const response = await ApiClient.getJson<{ success: boolean; data: OrderItem; message?: string }>(url)
      console.log('[OrdersClient] getOrderItemDetail → Response:', response)
      return response.data
    } catch (error) {
      console.error('[OrdersClient] getOrderItemDetail → Error:', error)
      throw error
    }
  }

  static async getOrderItemByOrderId(orderId: string | number): Promise<OrderItem> {
    const url = `/vendor/orders/${orderId}`
    console.log('[OrdersClient] getOrderItemByOrderId → URL:', url)
    try {
      const response = await ApiClient.getJson<{ success: boolean; data: OrderItem; message?: string }>(url)
      console.log('[OrdersClient] getOrderItemByOrderId → Response:', response)
      return response.data
    } catch (error) {
      console.error('[OrdersClient] getOrderItemByOrderId → Error:', error)
      throw error
    }
  }

  static async bulkUpdateOrderItemStatus(
    ids: string[],
    body: UpdateOrderItemStatusBody
  ): Promise<UpdateOrderItemStatusResponse> {
    const idParam = ids.join(',')
    const url = `/vendor-orders/status/${idParam}`
    console.log('[OrdersClient] bulkUpdateOrderItemStatus → URL:', url)
    console.log('[OrdersClient] bulkUpdateOrderItemStatus → Body:', body)

    try {
      const response = await ApiClient.patch(url, body).then(r => r.json())
      console.log('[OrdersClient] bulkUpdateOrderItemStatus → Response:', response)
      return response
    } catch (error) {
      console.error('[OrdersClient] bulkUpdateOrderItemStatus → Error:', error)
      throw error
    }
  }

  static async getVendorOrderStats(vendorId: string): Promise<VendorOrderStatsResponse> {
    const url = `/vendor-orders/stats/${vendorId}`
    console.log('[OrdersClient] getVendorOrderStats → URL:', url)

    try {
      const response = await ApiClient.getJson<VendorOrderStatsResponse>(url)
      console.log('[OrdersClient] getVendorOrderStats → Response:', response)
      return response
    } catch (error) {
      console.error('[OrdersClient] getVendorOrderStats → Error:', error)
      throw error
    }
  }

  // Advanced order management APIs
  static async listVendorOrdersAdvanced(
    query: VendorOrderListQueryAdvanced = {}
  ): Promise<VendorOrderListResponseAdvanced> {
    const params = new URLSearchParams()
    if (query.status) params.set('status', query.status)
    if (query.paymentStatus) params.set('paymentStatus', query.paymentStatus)
    if (query.priority) params.set('priority', query.priority)
    if (query.dateFrom) params.set('dateFrom', query.dateFrom)
    if (query.dateTo) params.set('dateTo', query.dateTo)
    if (query.amountMin) params.set('amountMin', String(query.amountMin))
    if (query.amountMax) params.set('amountMax', String(query.amountMax))
    if (query.search) params.set('search', query.search)
    if (query.page) params.set('page', String(query.page))
    if (query.limit) params.set('limit', String(query.limit))

    const url = `/vendor/orders?${params.toString()}`
    console.log('[OrdersClient] listVendorOrdersAdvanced → URL:', url)
    console.log('[OrdersClient] listVendorOrdersAdvanced → Query Params:', query)

    try {
      const response = await ApiClient.getJson<VendorOrderListResponseAdvanced>(url)
      console.log('[OrdersClient] listVendorOrdersAdvanced → Response:', response)
      return response
    } catch (error) {
      console.error('[OrdersClient] listVendorOrdersAdvanced → Error:', error)
      throw error
    }
  }

  static async getVendorAnalytics(
    period: string = '30d',
    groupBy: string = 'day'
  ): Promise<VendorAnalyticsResponse> {
    const params = new URLSearchParams()
    params.set('period', period)
    params.set('groupBy', groupBy)

    const url = `/user/orders/vendor/analytics?${params.toString()}`
    console.log('[OrdersClient] getVendorAnalytics → URL:', url)

    try {
      const response = await ApiClient.getJson<VendorAnalyticsResponse>(url)
      console.log('[OrdersClient] getVendorAnalytics → Response:', response)
      return response
    } catch (error) {
      console.error('[OrdersClient] getVendorAnalytics → Error:', error)
      throw error
    }
  }

  // Vendor orders analytics (new backend endpoint)
  static async getVendorOrdersAnalytics(period: '7d' | '30d' | '90d' | '1y' = '30d'):
    Promise<import('@/types/orders').VendorOrdersAnalyticsResponse> {
    const params = new URLSearchParams()
    params.set('period', period)
    const url = `/vendor/orders/analytics?${params.toString()}`
    console.log('[OrdersClient] getVendorOrdersAnalytics → URL:', url)
    try {
      const response = await ApiClient.getJson<import('@/types/orders').VendorOrdersAnalyticsResponse>(url)
      console.log('[OrdersClient] getVendorOrdersAnalytics → Response:', response)
      return response
    } catch (error) {
      console.error('[OrdersClient] getVendorOrdersAnalytics → Error:', error)
      throw error
    }
  }
}
