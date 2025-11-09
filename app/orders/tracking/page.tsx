"use client"

import React, { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { ShippingClient } from '@/lib/utils/shipping-client'
import type { DetailedShipmentTrackingResponse } from '@/types/orders'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Package, 
  ArrowLeft, 
  Truck, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Ruler, 
  Weight, 
  FileText, 
  ExternalLink,
  User,
  Mail,
  Phone,
  Hash,
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
  ShoppingBag
} from 'lucide-react'
import Link from 'next/link'

function TrackingContent() {
  const searchParams = useSearchParams()
  const trackingNumber = searchParams.get('trackingNumber') || ''
  
  const [data, setData] = useState<DetailedShipmentTrackingResponse['data'] | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [updateDialogOpen, setUpdateDialogOpen] = useState<boolean>(false)
  const [updateForm, setUpdateForm] = useState<{ status: string; location: string; notes: string }>({
    status: 'PICKED_UP',
    location: '',
    notes: ''
  })
  const [updating, setUpdating] = useState<boolean>(false)

  const fetchTracking = async () => {
    if (!trackingNumber) return
    setLoading(true)
    setError(null)
    try {
      const res = await ShippingClient.getDetailedShipmentTracking(trackingNumber)
      setData(res.data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load tracking information')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTracking()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackingNumber])

  const handleUpdateStatus = async () => {
    if (!trackingNumber) return
    setUpdating(true)
    setError(null)
    try {
      await ShippingClient.updateShipmentStatus(trackingNumber, {
        status: updateForm.status as 'PICKED_UP',
        location: updateForm.location || undefined,
        notes: updateForm.notes || undefined
      })
      setUpdateDialogOpen(false)
      setUpdateForm({ status: 'PICKED_UP', location: '', notes: '' })
      await fetchTracking()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update shipment status')
    } finally {
      setUpdating(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string; icon: React.ComponentType<{ className?: string }> }> = {
      LABEL_CREATED: { bg: 'bg-blue-100', text: 'text-blue-800', icon: FileText },
      PICKED_UP: { bg: 'bg-purple-100', text: 'text-purple-800', icon: Package },
      IN_TRANSIT: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Truck },
      OUT_FOR_DELIVERY: { bg: 'bg-orange-100', text: 'text-orange-800', icon: Truck },
      DELIVERED: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
      EXCEPTION: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle },
      RETURNED: { bg: 'bg-gray-100', text: 'text-gray-800', icon: ArrowLeft },
      PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
      PAID: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
      SHIPPED: { bg: 'bg-blue-100', text: 'text-blue-800', icon: Truck },
    }
    const config = statusConfig[status] || statusConfig.PENDING
    const Icon = config.icon
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
        <Icon className="w-4 h-4" />
        {status}
      </span>
    )
  }

  if (!trackingNumber) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 flex items-center justify-center">
        <Card className="max-w-md w-full shadow-lg">
          <CardContent className="pt-6">
            <div className="text-center">
              <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">Please provide a tracking number in the URL query.</p>
              <Link href="/orders">
                <Button variant="outline" className="mt-4">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Orders
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 flex items-center justify-center">
        <Card className="max-w-md w-full shadow-lg">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-600">Loading tracking information...</p>
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
              <div className="flex gap-2 justify-center">
                <Button variant="outline" onClick={() => window.history.back()}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go Back
                </Button>
                <Button onClick={fetchTracking}>Retry</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Shipment Tracking
            </h1>
            <p className="text-gray-600">Tracking Number: <span className="font-mono font-semibold">{data.trackingNumber}</span></p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="default" 
              onClick={() => setUpdateDialogOpen(true)}
              className="w-full sm:w-auto hover:bg-blue-700 transition-colors"
            >
              <Package className="w-4 h-4 mr-2" />
              Update Status
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.history.back()}
              className="w-full sm:w-auto hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Shipment Details */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 animate-slideUp">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Shipment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <InfoRow icon={Hash} label="Tracking Number" value={data.trackingNumber} highlight />
              <InfoRow icon={Truck} label="Carrier" value={data.carrier} />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Status</span>
                {getStatusBadge(data.status)}
              </div>
              <InfoRow icon={Truck} label="Shipping Method" value={data.shippingMethod} />
              <InfoRow icon={Weight} label="Weight" value={`${data.weight} oz`} />
              <InfoRow 
                icon={Ruler} 
                label="Dimensions" 
                value={`${data.dimensions.length}" × ${data.dimensions.width}" × ${data.dimensions.height}"`} 
              />
              <InfoRow icon={DollarSign} label="Cost" value={`$${data.cost.toFixed(2)}`} highlight />
              <InfoRow 
                icon={Calendar} 
                label="Estimated Delivery" 
                value={data.estimatedDelivery ? new Date(data.estimatedDelivery).toLocaleDateString() : 'Not available'} 
              />
              <InfoRow 
                icon={CheckCircle} 
                label="Actual Delivery" 
                value={data.actualDelivery ? new Date(data.actualDelivery).toLocaleDateString() : 'Not delivered'} 
              />
              {data.notes && (
                <div className="pt-4 border-t">
                  <InfoRow icon={FileText} label="Notes" value={data.notes} />
                </div>
              )}
              <div className="pt-4 border-t flex gap-2">
                {data.labelUrl && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => window.open(data.labelUrl!, '_blank')}
                    className="flex-1"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    View Label
                    <ExternalLink className="w-3 h-3 ml-2" />
                  </Button>
                )}
                {data.trackingUrl && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => window.open(data.trackingUrl!, '_blank')}
                    className="flex-1"
                  >
                    <Truck className="w-4 h-4 mr-2" />
                    Track on Carrier
                    <ExternalLink className="w-3 h-3 ml-2" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Order Information */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 animate-slideUp" style={{animationDelay: '100ms'}}>
            <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                Order Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <InfoRow icon={Hash} label="Order ID" value={`#${data.order.id}`} highlight />
              <InfoRow icon={CreditCard} label="Total Amount" value={`$${data.order.amount.toFixed(2)}`} highlight />
              <InfoRow icon={DollarSign} label="Shipping Cost" value={`$${data.order.shippingCost.toFixed(2)}`} />
              <div className="pt-4 border-t space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Order Status</span>
                  {getStatusBadge(data.order.status)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Payment Status</span>
                  {getStatusBadge(data.order.paymentStatus)}
                </div>
              </div>
              <InfoRow 
                icon={Calendar} 
                label="Order Date" 
                value={new Date(data.order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} 
              />
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
              <InfoRow icon={User} label="Name" value={data.order.fullName} />
              <InfoRow icon={Mail} label="Email" value={data.order.user?.email || 'N/A'} />
              <InfoRow icon={Phone} label="Phone" value={data.order.phone || 'N/A'} />
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 animate-slideUp" style={{animationDelay: '300ms'}}>
            <CardHeader className="bg-gradient-to-r from-orange-600 to-orange-700 text-white">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <MapPin className="w-5 h-5 text-orange-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Delivery Address</p>
                  <p className="text-gray-900 leading-relaxed mb-2">
                    {data.order.shippingAddress}
                  </p>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>ZIP: {data.order.zip}</p>
                    <p>Country: {data.order.country}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Items */}
        {data.order.items && data.order.items.length > 0 && (
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 animate-slideUp">
            <CardHeader className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white">
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                Order Items
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {data.order.items.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Item ID</p>
                        <p className="text-gray-900 font-semibold">#{item.id}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Category</p>
                        <p className="text-gray-900">{item.category}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Quantity</p>
                        <p className="text-gray-900">{item.quantity}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Price</p>
                        <p className="text-gray-900 font-semibold">${item.price.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Status</p>
                        {getStatusBadge(item.status)}
                      </div>
                      {item.trackingNumber && (
                        <div>
                          <p className="text-sm font-medium text-gray-600">Tracking</p>
                          <p className="text-gray-900 font-mono text-xs">{item.trackingNumber}</p>
                        </div>
                      )}
                      {item.shippedAt && (
                        <div>
                          <p className="text-sm font-medium text-gray-600">Shipped At</p>
                          <p className="text-gray-900 text-xs">{new Date(item.shippedAt).toLocaleString()}</p>
                        </div>
                      )}
                      {item.deliveredAt && (
                        <div>
                          <p className="text-sm font-medium text-gray-600">Delivered At</p>
                          <p className="text-gray-900 text-xs">{new Date(item.deliveredAt).toLocaleString()}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Timestamps */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-lg">Timestamps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoRow 
                icon={Calendar} 
                label="Created At" 
                value={new Date(data.createdAt).toLocaleString()} 
              />
              <InfoRow 
                icon={Calendar} 
                label="Updated At" 
                value={new Date(data.updatedAt).toLocaleString()} 
              />
            </div>
          </CardContent>
        </Card>

        {/* Update Status Dialog */}
        <Dialog open={updateDialogOpen} onOpenChange={(open) => { 
          if (!open) {
            setUpdateDialogOpen(false)
            setUpdateForm({ status: 'PICKED_UP', location: '', notes: '' })
          }
        }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Shipment Status</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={updateForm.status} 
                  onValueChange={(v) => setUpdateForm(prev => ({ ...prev, status: v }))}
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PICKED_UP">PICKED_UP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  type="text"
                  placeholder="e.g., USPS Post Office - Main Branch"
                  value={updateForm.location}
                  onChange={(e) => setUpdateForm(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  type="text"
                  placeholder="e.g., Package dropped off"
                  value={updateForm.notes}
                  onChange={(e) => setUpdateForm(prev => ({ ...prev, notes: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  setUpdateDialogOpen(false)
                  setUpdateForm({ status: 'PICKED_UP', location: '', notes: '' })
                }}
                disabled={updating}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleUpdateStatus} 
                disabled={updating}
              >
                {updating ? 'Updating...' : 'Update'}
              </Button>
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

export default function TrackingPage() {
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
      <TrackingContent />
    </Suspense>
  )
}

