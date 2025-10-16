// lib/utils/analytics-client.ts

import { ApiClient } from '@/lib/utils/api-client'
import type {
  SalesAnalyticsResponse,
  InventoryAnalyticsResponse,
  VendorAnalyticsResponse,
  AnalyticsOverviewResponse,
  TimePeriod,
  GroupBy,
} from '@/types/analytics'

export class AnalyticsClient {
  // Get sales analytics
  static async getSalesAnalytics(
    period: TimePeriod = '30d',
    groupBy: GroupBy = 'day'
  ): Promise<SalesAnalyticsResponse> {
    const params = new URLSearchParams()
    params.set('period', period)
    params.set('groupBy', groupBy)

    const url = `/analytics/sales?${params.toString()}`
    console.log('[AnalyticsClient] getSalesAnalytics → URL:', url)

    try {
      const response = await ApiClient.getJson<SalesAnalyticsResponse>(url)
      console.log('[AnalyticsClient] getSalesAnalytics → Response:', response)
      return response
    } catch (error) {
      console.error('[AnalyticsClient] getSalesAnalytics → Error:', error)
      throw error
    }
  }

  // Get inventory analytics
  static async getInventoryAnalytics(): Promise<InventoryAnalyticsResponse> {
    const url = '/analytics/inventory'
    console.log('[AnalyticsClient] getInventoryAnalytics → URL:', url)

    try {
      const response = await ApiClient.getJson<InventoryAnalyticsResponse>(url)
      console.log('[AnalyticsClient] getInventoryAnalytics → Response:', response)
      return response
    } catch (error) {
      console.error('[AnalyticsClient] getInventoryAnalytics → Error:', error)
      throw error
    }
  }

  // Get vendor analytics
  static async getVendorAnalytics(): Promise<VendorAnalyticsResponse> {
    const url = '/analytics/vendors'
    console.log('[AnalyticsClient] getVendorAnalytics → URL:', url)

    try {
      const response = await ApiClient.getJson<VendorAnalyticsResponse>(url)
      console.log('[AnalyticsClient] getVendorAnalytics → Response:', response)
      return response
    } catch (error) {
      console.error('[AnalyticsClient] getVendorAnalytics → Error:', error)
      throw error
    }
  }

  // Get analytics overview
  static async getAnalyticsOverview(): Promise<AnalyticsOverviewResponse> {
    const url = '/analytics/overview'
    console.log('[AnalyticsClient] getAnalyticsOverview → URL:', url)

    try {
      const response = await ApiClient.getJson<AnalyticsOverviewResponse>(url)
      console.log('[AnalyticsClient] getAnalyticsOverview → Response:', response)
      return response
    } catch (error) {
      console.error('[AnalyticsClient] getAnalyticsOverview → Error:', error)
      throw error
    }
  }
}
