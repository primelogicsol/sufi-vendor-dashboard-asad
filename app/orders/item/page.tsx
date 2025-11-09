"use client"

import React, { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { OrdersClient } from '@/lib/utils/orders-client'
import type { OrderItem } from '@/types/orders'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Package, CreditCard, User, MapPin, Phone, Mail, Calendar, Hash, ShoppingBag, ArrowLeft, CheckCircle, Clock, XCircle,  Barcode } from 'lucide-react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ShippingClient } from '@/lib/utils/shipping-client'
import type { ShipmentPublicStatus, ShipmentTrackingResponse } from '@/types/orders'

function OrderItemContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('ItemId') || ''
  
  const [item, setItem] = useState<OrderItem | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  // const [creatingLabel, setCreatingLabel] = useState(false)
  // const [labelForm, setLabelForm] = useState<CreateShippingLabelRequest>({ weight: 1, dimensions: { length: 10, width: 8, height: 6 }, serviceType: 'PRIORITY' })
  const [trackingDialog, setTrackingDialog] = useState(false)
  const [trackingData, setTrackingData] = useState<ShipmentTrackingResponse['data'] | null>(null)
  const [updateDialog, setUpdateDialog] = useState(false)
  const [updateForm, setUpdateForm] = useState<{ status: ShipmentPublicStatus; location: string; notes: string }>({ status: 'PICKED_UP', location: '', notes: '' })
  // const openTrackingDialog = async () => {
  //   if (!item?.trackingNumber) return
  //   setTrackingDialog(true)
  //   setTrackingData(null)
  //   try {
  //     const res = await ShippingClient.getShipmentTracking(String(item.trackingNumber))
  //     setTrackingData(res.data)
  //   } catch (e) {
  //     setError(e instanceof Error ? e.message : 'Failed to load tracking')
  //   }
  // }
  // const openUpdateDialog = () => {
  //   const fallbackLocation = item?.order?.shippingAddress || ''
  //   setUpdateForm(prev => ({ ...prev, location: prev.location || fallbackLocation }))
  //   setUpdateDialog(true)
  // }

  // useEffect(() => {
  //   const run = async () => {
  //     if (!orderItemId) return
  //     setLoading(true)
  //     setError(null)
  //     try {
  //       const detail = await OrdersClient.getOrderItemDetail(orderItemId)
  //       setItem(detail)
  //     } catch (e) {
  //       setError(e instanceof Error ? e.message : 'Failed to load order item')
  //     } finally {
  //       setLoading(false)
  //     }
  //   }
  //   run()
  // }, [orderItemId])
  useEffect(() => {
    const run = async () => {
      if (!orderId) return
      setLoading(true)
      setError(null)
      try {
        const detail = await OrdersClient.getOrderItemByOrderId(orderId)
        setItem(detail)
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'Failed to load order item'
        setError(errorMessage)
        console.error('Order item fetch error:', e)
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [orderId])

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
      PAID: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
      DELIVERED: { bg: 'bg-blue-100', text: 'text-blue-800', icon: CheckCircle },
      CANCELLED: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle },
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING
    const Icon = config.icon
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
        <Icon className="w-4 h-4" />
        {status}
      </span>
    )
  }

  if (!orderId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 flex items-center justify-center">
        <Card className="max-w-md w-full shadow-lg">
          <CardContent className="pt-6">
            <div className="text-center">
              <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">Please provide an orderId in the URL query.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 flex items-center justify-center">
        <Card className="max-w-md w-full shadow-lg">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-600">Loading order details...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 flex items-center justify-center">
        <Card className="max-w-md w-full shadow-lg border-red-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <XCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
              <p className="text-red-600 font-medium mb-4">{error}</p>
              <Button variant="outline" onClick={() => history.back()}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!item) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Order #{orderId}
            </h1>
            <p className="text-gray-600">View detailed information about this order item</p>
          </div>
          <div className="flex gap-2">
            {item.trackingNumber && (
              <Button 
                variant="default" 
                onClick={() => window.location.href = `/orders/tracking?trackingNumber=${encodeURIComponent(item.trackingNumber!)}`}
                className="w-full sm:w-auto hover:bg-blue-700 transition-colors"
              >
                <Barcode className="w-4 h-4 mr-2" />
                Show Tracking
              </Button>
            )}
            <Button 
              variant="outline" 
              onClick={() => history.back()}
              className="w-full sm:w-auto hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Product Information */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 animate-slideUp">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                Product Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-3">
                <InfoRow icon={Package} label="Product" value={item.title || `Product #${item.productId}`} />
                <InfoRow icon={Hash} label="Product ID" value={item.productId} />
                <InfoRow icon={ShoppingBag} label="Category" value={item.category} />
                <InfoRow icon={Package} label="Quantity" value={item.quantity} />
                <InfoRow 
                  icon={CreditCard} 
                  label="Price" 
                  value={`$${item.price}`}
                  highlight
                />
              </div>
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Item Status</span>
                  {getStatusBadge(item.status)}
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600 flex items-center gap-2"><Barcode className="w-4 h-4" /> Tracking</span>
                    <span className="text-sm">{item.trackingNumber || '—'}</span>
                  </div>
                  
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Information */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 animate-slideUp" style={{animationDelay: '100ms'}}>
            <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Order Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <InfoRow icon={Hash} label="Order ID" value={item.orderId} />
              <InfoRow icon={CreditCard} label="Total Amount" value={`$${item.order?.amount}`} highlight />
              <InfoRow icon={Calendar} label="Order Date" value={new Date(item.createdAt || '').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} />
              <div className="pt-4 border-t space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Order Status</span>
                  {getStatusBadge(item.order?.status || 'PENDING')}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Payment Status</span>
                  {getStatusBadge(item.order?.paymentStatus || 'PENDING')}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 animate-slideUp" style={{animationDelay: '200ms'}}>
            <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white">
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <InfoRow 
                icon={User} 
                label="Name" 
                value={item.order?.fullName || item.order?.user?.fullName || 'N/A'} 
              />
              <InfoRow 
                icon={Mail} 
                label="Email" 
                value={item.order?.email || item.order?.user?.email || 'N/A'} 
              />
              <InfoRow 
                icon={Phone} 
                label="Phone" 
                value={item.order?.phone || item.order?.user?.phone || 'N/A'} 
              />
            </CardContent>
          </Card>

          {/* Shipping Information */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 animate-slideUp" style={{animationDelay: '300ms'}}>
            <CardHeader className="bg-gradient-to-r from-orange-600 to-orange-700 text-white">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Shipping Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <MapPin className="w-5 h-5 text-orange-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Delivery Address</p>
                  <p className="text-gray-900 leading-relaxed">
                    {item.order?.shippingAddress || 'No shipping address provided'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Tracking Dialog */}
        <Dialog open={trackingDialog} onOpenChange={(open) => { if (!open) { setTrackingDialog(false); setTrackingData(null) } }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tracking {item.trackingNumber}</DialogTitle>
            </DialogHeader>
            {!trackingData ? (
              <div>Loading tracking...</div>
            ) : (
              <div className="space-y-3">
                <div className="font-medium">Current Status: {trackingData.currentStatus}</div>
                <div className="max-h-64 overflow-auto border rounded">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left">
                        <th className="p-2">Time</th>
                        <th className="p-2">Status</th>
                        <th className="p-2">Location</th>
                        <th className="p-2">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trackingData.events.map((ev, i) => (
                        <tr key={i} className="border-t">
                          <td className="p-2">{new Date(ev.timestamp).toLocaleString()}</td>
                          <td className="p-2">{ev.status}</td>
                          <td className="p-2">{ev.location || '-'}</td>
                          <td className="p-2">{ev.notes || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Update Status Dialog */}
        <Dialog open={updateDialog} onOpenChange={(open) => { if (!open) setUpdateDialog(false) }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Shipment Status {item.trackingNumber ? `(${item.trackingNumber})` : ''}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <Label>Status</Label>
                <Select value={updateForm.status} onValueChange={(v) => setUpdateForm(prev => ({ ...prev, status: v as ShipmentPublicStatus }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {['PICKED_UP','IN_TRANSIT','OUT_FOR_DELIVERY','DELIVERED','EXCEPTION','RETURNED'].map(s => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label>Location</Label>
                <Input value={updateForm.location} onChange={(e) => setUpdateForm(v => ({ ...v, location: e.target.value }))} />
                <p className="text-xs text-muted-foreground mt-1">Prefilled from order shipping address if available.</p>
              </div>
              <div className="col-span-2">
                <Label>Notes</Label>
                <Input value={updateForm.notes} onChange={(e) => setUpdateForm(v => ({ ...v, notes: e.target.value }))} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setUpdateDialog(false)}>Cancel</Button>
              <Button onClick={async () => { if (!item?.trackingNumber) return; try { await ShippingClient.updateShipmentStatus(String(item.trackingNumber), updateForm); setUpdateDialog(false) } catch (e) { setError(e instanceof Error ? e.message : 'Failed to update shipment status') } }}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.6s ease-out;
          animation-fill-mode: both;
        }
      `}</style>
    </div>
  )
}

function InfoRow({
  icon: Icon,
  label,
  value,
  highlight = false,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string | number | React.ReactNode
  highlight?: boolean
}) {
  return (
    <div className="flex items-start gap-3 group">
      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 transition-colors ${highlight ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-600'}`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className={`font-medium break-words ${highlight ? 'text-blue-600 text-lg' : 'text-gray-900'}`}>
          {value}
        </p>
      </div>
    </div>
  )
}

export default function OrderItemDetailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 flex items-center justify-center">
        <Card className="max-w-md w-full shadow-lg">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    }>
      <OrderItemContent />
    </Suspense>
  )
}

// Dialogs
// function CreateLabelDialog({ open, onOpenChange, orderId, onCreated }: { open: boolean; onOpenChange: (v: boolean) => void; orderId: string | number; onCreated: () => void }) {
//   const [form, setForm] = useState<CreateShippingLabelRequest>({ weight: 1, dimensions: { length: 10, width: 8, height: 6 }, serviceType: 'PRIORITY' })
//   const [submitting, setSubmitting] = useState(false)
//   const submit = async () => {
//     try {
//       setSubmitting(true)
//       const res = await ShippingClient.createUspsLabel(orderId, form)
//       if (res.data?.labelUrl) window.open(res.data.labelUrl, '_blank')
//       onCreated()
//       onOpenChange(false)
//     } catch {
//       // surface by consumer if needed
//     } finally {
//       setSubmitting(false)
//     }
//   }
//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Create USPS Label</DialogTitle>
//         </DialogHeader>
//         <div className="grid grid-cols-2 gap-3">
//           <div className="col-span-2">
//             <Label>Weight (oz)</Label>
//             <Input type="number" min={0} step={0.1} value={form.weight} onChange={(e) => setForm(v => ({ ...v, weight: Number(e.target.value) }))} />
//           </div>
//           <div>
//             <Label>Length (in)</Label>
//             <Input type="number" min={0} value={form.dimensions.length} onChange={(e) => setForm(v => ({ ...v, dimensions: { ...v.dimensions, length: Number(e.target.value) } }))} />
//           </div>
//           <div>
//             <Label>Width (in)</Label>
//             <Input type="number" min={0} value={form.dimensions.width} onChange={(e) => setForm(v => ({ ...v, dimensions: { ...v.dimensions, width: Number(e.target.value) } }))} />
//           </div>
//           <div>
//             <Label>Height (in)</Label>
//             <Input type="number" min={0} value={form.dimensions.height} onChange={(e) => setForm(v => ({ ...v, dimensions: { ...v.dimensions, height: Number(e.target.value) } }))} />
//           </div>
//           <div className="col-span-2">
//             <Label>Service Type</Label>
//             <Select value={form.serviceType} onValueChange={(v) => setForm(prev => ({ ...prev, serviceType: v as 'PRIORITY' | 'FIRST_CLASS' | 'EXPRESS' | 'GROUND' }))}>
//               <SelectTrigger>
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 {['PRIORITY', 'FIRST_CLASS', 'EXPRESS', 'GROUND'].map(s => (
//                   <SelectItem key={s} value={s}>{s}</SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//         </div>
//         <DialogFooter>
//           <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
//           <Button onClick={submit} disabled={submitting}>Create</Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   )
// }
