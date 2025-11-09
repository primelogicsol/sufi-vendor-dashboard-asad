import { ApiClient } from '@/lib/utils/api-client'
import type {
  CreateShippingLabelRequest,
  CreateShippingLabelResponse,
  UpdateShipmentStatusRequest,
  UpdateShipmentStatusResponse,
  ShipmentTrackingResponse,
  DetailedShipmentTrackingResponse,
} from '@/types/orders'

export class ShippingClient {
  static async createUspsLabel(orderId: string | number, body: CreateShippingLabelRequest): Promise<CreateShippingLabelResponse> {
    const url = `/shipping/orders/${orderId}/usps/label`
    return ApiClient.postJson<CreateShippingLabelResponse>(url, body)
  }

  static async updateShipmentStatus(trackingNumber: string, body: UpdateShipmentStatusRequest): Promise<UpdateShipmentStatusResponse> {
    const url = `/shipping/shipments/${encodeURIComponent(trackingNumber)}/status`
    const res = await ApiClient.put(url, body)
    return res.json()
  }

  static async getShipmentTracking(trackingNumber: string): Promise<ShipmentTrackingResponse> {
    const url = `/shipping/shipments/${encodeURIComponent(trackingNumber)}/tracking`
    return ApiClient.getJson<ShipmentTrackingResponse>(url)
  }

  static async getDetailedShipmentTracking(trackingNumber: string): Promise<DetailedShipmentTrackingResponse> {
    const url = `/shipping/shipments/${encodeURIComponent(trackingNumber)}/tracking`
    return ApiClient.getJson<DetailedShipmentTrackingResponse>(url)
  }
}


