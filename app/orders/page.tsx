"use client"

import React, { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { TokenManager } from '@/lib/auth/token-manager'
import { OrdersClient } from '@/lib/utils/orders-client'
import type { OrderItem, OrderStatus, VendorOrderListResponse } from '@/types/orders'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { ShippingClient } from '@/lib/utils/shipping-client'
import type { CreateShippingLabelRequest, ShipmentTrackingResponse, ShipmentPublicStatus } from '@/types/orders'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { AuthService } from '@/lib/auth/auth-service'

const STATUS_OPTIONS: OrderStatus[] = [
  "PENDING",
  "COMPLETED",
  "FAILED",
  "CANCELLED",
]

export default function OrdersPage() {
  const { user, isAuthenticated } = useAuth()
  const vendorId = user?.id || TokenManager.getUserId() || ''

  const [status, setStatus] = useState<OrderStatus | undefined>(undefined)
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [search, setSearch] = useState<string>('')
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<VendorOrderListResponse['data'] | null>(null)
  const [selected, setSelected] = useState<Record<string, boolean>>({})
  const [createLabelFor, setCreateLabelFor] = useState<OrderItem | null>(null)
  const [labelForm, setLabelForm] = useState<CreateShippingLabelRequest>({
    weight: 1,
    dimensions: { length: 10, width: 8, height: 6 },
    serviceType: 'PRIORITY'
  })
  const [trackingFor, setTrackingFor] = useState<string | null>(null)
  const [trackingData, setTrackingData] = useState<ShipmentTrackingResponse['data'] | null>(null)
  const [updatingFor, setUpdatingFor] = useState<string | null>(null)
  const [updateForm, setUpdateForm] = useState<{ status: ShipmentPublicStatus; location: string; notes: string }>({
    status: 'PICKED_UP',
    location: '',
    notes: ''
  })

  const fetchOrders = async () => {
    if (!vendorId) return
    setLoading(true)
    setError(null)
    try {
      const res = await OrdersClient.listVendorOrderItems({
        page,
        limit,
        status,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        search: search || undefined,
      })
      setData(res.data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, page, limit, status, startDate, endDate, search])

  const allChecked = useMemo(() => {
    if (!data?.orders?.length) return false
    return data.orders.every(i => selected[String(i.id)])
  }, [data, selected])

  const toggleAll = (checked: boolean) => {
    if (!data?.orders) return
    const next: Record<string, boolean> = {}
    data.orders.forEach(i => { next[String(i.id)] = checked })
    setSelected(next)
  }

  const toggleOne = (id: string, checked: boolean) => {
    setSelected(prev => ({ ...prev, [id]: checked }))
  }

  const selectedIds = useMemo(() => Object.entries(selected).filter(([, v]) => v).map(([k]) => k), [selected])

  const bulkUpdate = async (nextStatus: OrderStatus) => {
    if (!selectedIds.length) return
    try {
      setLoading(true)
      await OrdersClient.bulkUpdateOrderItemStatus(selectedIds, { status: nextStatus })
      setSelected({})
      await fetchOrders()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update status')
    } finally {
      setLoading(false)
    }
  }

  const submitCreateLabel = async () => {
    if (!createLabelFor) return
    try {
      setLoading(true)
      // Ensure we have a valid access token before making the request
      const hasValid = await AuthService.ensureValidToken()
      if (!hasValid) {
        throw new Error('Authentication required. Please sign in again.')
      }
      const res = await ShippingClient.createUspsLabel(createLabelFor.orderId, labelForm)
      console.log('Create Label API Response:', res)
      // Refresh list to reflect tracking number if backend persists to order item
      await fetchOrders()
      setCreateLabelFor(null)
      // If label URL provided, open in new tab
      if (res.data?.labelUrl) window.open(res.data.labelUrl, '_blank')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create shipping label')
    } finally {
      setLoading(false)
    }
  }

  const openTracking = async (trackingNumber: string) => {
    try {
      setTrackingFor(trackingNumber)
      setTrackingData(null)
      const res = await ShippingClient.getShipmentTracking(trackingNumber)
      setTrackingData(res.data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch tracking info')
    }
  }

  const submitUpdateStatus = async () => {
    if (!updatingFor) return
    try {
      setLoading(true)
      await ShippingClient.updateShipmentStatus(updatingFor, updateForm)
      setUpdatingFor(null)
      await fetchOrders()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update shipment status')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <Link href="/">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
        <div className="flex gap-2">
          {/* <Link href="/orders/advanced">
            <Button variant="outline">Advanced Orders</Button>
          </Link> */}
          <Link href="/orders/stats">
            <Button variant="outline">View Stats</Button>
          </Link>
          <Link href="/analytics">
            <Button variant="outline">Analytics</Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {/* <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Filter Options:</strong> Use the filters below to find specific orders. 
              Date format: YYYY-MM-DD (e.g., 2025-01-01). 
              Leave dates empty to show all orders regardless of date.
            </p>
          </div> */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-2 mb-3">
            <div className="col-span-1">
              <Select onValueChange={(v) => setStatus(v as OrderStatus)} value={status}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Input 
              type="text" 
              placeholder="Search orders..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
            />
            <div className="relative">
              <Input 
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)}
                className="pr-8"
              />
              <label className="absolute -top-6 left-0 text-xs text-muted-foreground font-medium">
                From Date
              </label>
            </div>
            <div className="relative">
              <Input 
                type="date" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)}
                className="pr-8"
              />
              <label className="absolute -top-6 left-0 text-xs text-muted-foreground font-medium">
                To Date
              </label>
            </div>
            <Select value={String(limit)} onValueChange={(v) => { setPage(1); setLimit(Number(v)) }}>
              <SelectTrigger>
                <SelectValue placeholder="Page size" />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 50].map(n => (<SelectItem key={n} value={String(n)}>{n} / page</SelectItem>))}
              </SelectContent>
            </Select>
            <Button variant="secondary" onClick={() => { 
              setStatus(undefined); 
              setStartDate(''); 
              setEndDate(''); 
              setSearch('');
              setPage(1) 
            }}>Reset</Button>
          </div>
          <Separator className="my-2" />

          <div className="flex items-center gap-2 mb-2">
            <Select onValueChange={(v) => bulkUpdate(v as OrderStatus)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Bulk update status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map(s => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">{selectedIds.length} selected</span>
          </div>

          {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <Checkbox checked={allChecked} onCheckedChange={(v) => toggleAll(Boolean(v))} />
                  </TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && (!data?.orders?.length) && (
                  <TableRow><TableCell colSpan={8}>Loading...</TableCell></TableRow>
                )}
                {(!loading && !data?.orders?.length) && (
                  <TableRow><TableCell colSpan={8}>No orders found</TableCell></TableRow>
                )}
                {data?.orders?.map((item: OrderItem) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Checkbox checked={!!selected[String(item.id)]} onCheckedChange={(v) => toggleOne(String(item.id), Boolean(v))} />
                    </TableCell>
                    <TableCell className="max-w-[240px] truncate">
                      <div>
                        <div className="font-medium">{item.product?.title || item.title || `Product ${item.productId}`}</div>
                        <div className="text-sm text-muted-foreground">{item.product?.sku || item.category}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs ${
                        item.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        item.status === 'FAILED' ? 'bg-red-100 text-red-500' :
                        item.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                        item.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {item.status}
                      </span>
                    </TableCell>
                    <TableCell>${item.price.toFixed(2)}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">#{item.orderId}</div>
                        {/* 'orderid {item.orderId} and id is {item.id}' */}
                        <div className="text-sm text-muted-foreground">
                          {item.order?.paymentStatus === 'PAID' ? '✅ Paid' : '⏳ Pending'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{item.createdAt?.slice(0, 10)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => { window.location.href = `/orders/item?ItemId=${String(item.id)}` }}>Details</Button>
                        {item.trackingNumber ? (
                          <>
                            <Button size="sm" variant="outline" onClick={() => openTracking(String(item.trackingNumber))}>Track</Button>
                            <Button size="sm" variant="secondary" onClick={() => setUpdatingFor(String(item.trackingNumber))}>Update Status</Button>
                          </>
                        ) : (
                          <Button size="sm" variant="outline" onClick={() => { setCreateLabelFor(item); setLabelForm({ weight: 1, dimensions: { length: 10, width: 8, height: 6 }, serviceType: 'PRIORITY' }) }}>Create Label</Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between mt-3">
            <Button variant="outline" disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Prev</Button>
            <div className="text-sm text-muted-foreground">
              Page {data?.pagination.page || page} of {data?.pagination.totalPages || 1}
            </div>
            <Button variant="outline" disabled={!!data && data.pagination.page >= data.pagination.totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
          </div>
        </CardContent>
      </Card>

      {/* Create Label Dialog */}
      <Dialog open={!!createLabelFor} onOpenChange={(open) => { if (!open) setCreateLabelFor(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create USPS Label {createLabelFor ? `for Order #${createLabelFor.orderId}` : ''}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Label>Weight (oz)</Label>
              <Input type="number" min={0} step={0.1} value={labelForm.weight}
                onChange={(e) => setLabelForm(v => ({ ...v, weight: Number(e.target.value) }))} />
            </div>
            <div>
              <Label>Length (in)</Label>
              <Input type="number" min={0} value={labelForm.dimensions.length}
                onChange={(e) => setLabelForm(v => ({ ...v, dimensions: { ...v.dimensions, length: Number(e.target.value) } }))} />
            </div>
            <div>
              <Label>Width (in)</Label>
              <Input type="number" min={0} value={labelForm.dimensions.width}
                onChange={(e) => setLabelForm(v => ({ ...v, dimensions: { ...v.dimensions, width: Number(e.target.value) } }))} />
            </div>
            <div>
              <Label>Height (in)</Label>
              <Input type="number" min={0} value={labelForm.dimensions.height}
                onChange={(e) => setLabelForm(v => ({ ...v, dimensions: { ...v.dimensions, height: Number(e.target.value) } }))} />
            </div>
            <div className="col-span-2">
              <Label>Service Type</Label>
              <Select value={labelForm.serviceType} onValueChange={(v) => setLabelForm(prev => ({ ...prev, serviceType: v as 'PRIORITY' | 'PRIORITY_EXPRESS' | 'FIRST_CLASS' | 'GROUND_ADVANTAGE' | 'MEDIA_MAIL' | 'RETAIL_GROUND' }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {['PRIORITY', 'PRIORITY_EXPRESS', 'FIRST_CLASS', 'GROUND_ADVANTAGE', 'MEDIA_MAIL', 'RETAIL_GROUND'].map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateLabelFor(null)}>Cancel</Button>
            <Button onClick={submitCreateLabel} disabled={loading}>Create Label</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Tracking Dialog */}
      <Dialog open={!!trackingFor} onOpenChange={(open) => { if (!open) setTrackingFor(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tracking {trackingFor}</DialogTitle>
          </DialogHeader>
          {!trackingData ? (
            <div>Loading tracking...</div>
          ) : (
            <div className="space-y-3">
              <div className="font-medium">Current Status: {trackingData.currentStatus}</div>
              <div className="max-h-64 overflow-auto border rounded">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trackingData.events.map((ev, i) => (
                      <TableRow key={i}>
                        <TableCell>{new Date(ev.timestamp).toLocaleString()}</TableCell>
                        <TableCell>{ev.status}</TableCell>
                        <TableCell>{ev.location || '-'}</TableCell>
                        <TableCell>{ev.notes || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={!!updatingFor} onOpenChange={(open) => { if (!open) setUpdatingFor(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Shipment Status {updatingFor ? `(${updatingFor})` : ''}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Label>Status</Label>
              <Select value={updateForm.status} onValueChange={(v) => setUpdateForm(prev => ({ ...prev, status: v as "PICKED_UP" | "IN_TRANSIT" | "OUT_FOR_DELIVERY" | "DELIVERED" | "EXCEPTION" | "RETURNED" }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {['PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'EXCEPTION', 'RETURNED'].map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <Label>Location</Label>
              <Input value={updateForm.location} onChange={(e) => setUpdateForm(v => ({ ...v, location: e.target.value }))} />
            </div>
            <div className="col-span-2">
              <Label>Notes</Label>
              <Input value={updateForm.notes} onChange={(e) => setUpdateForm(v => ({ ...v, notes: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUpdatingFor(null)}>Cancel</Button>
            <Button onClick={submitUpdateStatus} disabled={loading}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}


