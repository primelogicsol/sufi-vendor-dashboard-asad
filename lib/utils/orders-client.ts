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
  UpdateOrderItemStatusBody,
  UpdateOrderItemStatusResponse,
  VendorOrderStatsResponse,
  OrderItem,
} from '@/types/orders'

export class OrdersClient {
  static async listVendorOrderItems(
    vendorId: string,
    query: VendorOrderListQuery = {}
  ): Promise<VendorOrderListResponse> {
    const params = new URLSearchParams()
    if (query.page) params.set('page', String(query.page))
    if (query.limit) params.set('limit', String(query.limit))
    if (query.status) params.set('status', query.status)
    if (query.startDate) params.set('startDate', query.startDate)
    if (query.endDate) params.set('endDate', query.endDate)
    if (query.search) params.set('search', query.search)

    const finalUrl = `/vendor-orders/${vendorId}?${params.toString()}`
    console.log('[OrdersClient] listVendorOrderItems → URL:', finalUrl)
    console.log('[OrdersClient] listVendorOrderItems → Query Params:', query)

    try {
      const response = await ApiClient.postJson<VendorOrderListResponse>(finalUrl, {})
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
      const response = await ApiClient.getJson<OrderItem>(url)
      console.log('[OrdersClient] getOrderItemDetail → Response:', response)
      return response
    } catch (error) {
      console.error('[OrdersClient] getOrderItemDetail → Error:', error)
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
}
