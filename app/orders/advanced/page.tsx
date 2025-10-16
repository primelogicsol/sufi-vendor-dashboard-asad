"use client"

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { OrdersClient } from '@/lib/utils/orders-client'
import type { OrderItem, OrderStatus, VendorOrderListResponseAdvanced } from '@/types/orders'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'

const STATUS_OPTIONS: OrderStatus[] = [
  "PENDING",
  "COMPLETED",
  "FAILED",
  "CANCELLED",
]

const PAYMENT_STATUS_OPTIONS = ["PAID", "UNPAID", "REFUNDED"]

export default function AdvancedOrdersPage() {
  const { isAuthenticated } = useAuth()

  const [status, setStatus] = useState<OrderStatus | undefined>(undefined)
  const [paymentStatus, setPaymentStatus] = useState<string | undefined>(undefined)
  const [priority, setPriority] = useState<string>('')
  const [dateFrom, setDateFrom] = useState<string>('')
  const [dateTo, setDateTo] = useState<string>('')
  const [amountMin, setAmountMin] = useState<string>('')
  const [amountMax, setAmountMax] = useState<string>('')
  const [search, setSearch] = useState<string>('')
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<VendorOrderListResponseAdvanced['data'] | null>(null)
  const [selected, setSelected] = useState<Record<string, boolean>>({})

  const fetchOrders = async () => {
    if (!isAuthenticated) return
    setLoading(true)
    setError(null)
    try {
      const res = await OrdersClient.listVendorOrdersAdvanced({
        page,
        limit,
        status,
        paymentStatus: paymentStatus as "PAID" | "UNPAID" | "REFUNDED" | undefined,
        priority: priority || undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
        amountMin: amountMin ? Number(amountMin) : undefined,
        amountMax: amountMax ? Number(amountMax) : undefined,
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
  }, [isAuthenticated, page, limit, status, paymentStatus, priority, dateFrom, dateTo, amountMin, amountMax, search])

  const allChecked = React.useMemo(() => {
    if (!data?.orders?.length) return false
    return data.orders.every(i => selected[i.id])
  }, [data, selected])

  const toggleAll = (checked: boolean) => {
    if (!data?.orders) return
    const next: Record<string, boolean> = {}
    data.orders.forEach(i => { next[i.id] = checked })
    setSelected(next)
  }

  const toggleOne = (id: string, checked: boolean) => {
    setSelected(prev => ({ ...prev, [id]: checked }))
  }

  const selectedIds = React.useMemo(() => Object.entries(selected).filter(([, v]) => v).map(([k]) => k), [selected])

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

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <Link href="/orders">
          <Button variant="outline">Back to Orders</Button>
        </Link>
        <Link href="/orders/stats">
          <Button variant="outline">View Stats</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Advanced Order Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3">
            <div className="col-span-1">
              <Select onValueChange={(v) => setStatus(v as OrderStatus)} value={status}>
                <SelectTrigger>
                  <SelectValue placeholder="Order Status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-1">
              <Select onValueChange={(v) => setPaymentStatus(v)} value={paymentStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Payment Status" />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_STATUS_OPTIONS.map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Input 
              type="text" 
              placeholder="Priority" 
              value={priority} 
              onChange={(e) => setPriority(e.target.value)} 
            />
            <Input 
              type="text" 
              placeholder="Search orders..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3">
            <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} placeholder="From Date" />
            <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} placeholder="To Date" />
            <Input 
              type="number" 
              placeholder="Min Amount" 
              value={amountMin} 
              onChange={(e) => setAmountMin(e.target.value)} 
            />
            <Input 
              type="number" 
              placeholder="Max Amount" 
              value={amountMax} 
              onChange={(e) => setAmountMax(e.target.value)} 
            />
          </div>

          <div className="flex gap-2 mb-3">
            <Select value={String(limit)} onValueChange={(v) => { setPage(1); setLimit(Number(v)) }}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Page size" />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 50].map(n => (<SelectItem key={n} value={String(n)}>{n} / page</SelectItem>))}
              </SelectContent>
            </Select>
            <Button variant="secondary" onClick={() => { 
              setStatus(undefined); 
              setPaymentStatus(undefined);
              setPriority('');
              setDateFrom(''); 
              setDateTo(''); 
              setAmountMin('');
              setAmountMax('');
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
                  <TableHead>Payment</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && (!data?.orders?.length) && (
                  <TableRow><TableCell colSpan={9}>Loading...</TableCell></TableRow>
                )}
                {(!loading && !data?.orders?.length) && (
                  <TableRow><TableCell colSpan={9}>No orders found</TableCell></TableRow>
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
                        item.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {item.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs ${
                        item.order?.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' :
                        item.order?.paymentStatus === 'UNPAID' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.order?.paymentStatus || 'Unknown'}
                      </span>
                    </TableCell>
                    <TableCell>${item.price.toFixed(2)}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">#{item.orderId}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.order?.fullName || 'Unknown Customer'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{item.createdAt?.slice(0, 10)}</TableCell>
                    <TableCell>
                      <Button size="sm" onClick={() => { window.location.href = `/orders/item?orderItemId=${item.id}` }}>Details</Button>
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
    </div>
  )
}


