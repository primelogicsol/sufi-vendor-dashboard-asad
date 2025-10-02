"use client"

import React, { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { TokenManager } from '@/lib/auth/token-manager'
import { OrdersClient } from '@/lib/utils/orders-client'
import type { OrderItem, OrderStatus, VendorOrderListResponse } from '@/types/orders'
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
  "PROCESSING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "RETURN_REQUESTED",
  "RETURNED",
]

export default function OrdersPage() {
  const { user, isAuthenticated } = useAuth()
  const vendorId = user?.id || TokenManager.getUserId() || ''

  const [status, setStatus] = useState<OrderStatus | undefined>(undefined)
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<VendorOrderListResponse['data'] | null>(null)
  const [selected, setSelected] = useState<Record<string, boolean>>({})

  const fetchOrders = async () => {
    if (!vendorId) return
    setLoading(true)
    setError(null)
    try {
      const res = await OrdersClient.listVendorOrderItems(vendorId, {
        page,
        limit,
        status,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
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
  }, [isAuthenticated, page, limit, status, startDate, endDate])

  const allChecked = useMemo(() => {
    if (!data?.orderItems?.length) return false
    return data.orderItems.every(i => selected[i.id])
  }, [data, selected])

  const toggleAll = (checked: boolean) => {
    if (!data?.orderItems) return
    const next: Record<string, boolean> = {}
    data.orderItems.forEach(i => { next[i.id] = checked })
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

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <Link href="/">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
        <Link href="/orders/stats">
          <Button variant="outline">View Stats</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-3">
            <div className="col-span-1">
              <Select onValueChange={(v) => setStatus(v as OrderStatus)} value={status}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            <Select value={String(limit)} onValueChange={(v) => { setPage(1); setLimit(Number(v)) }}>
              <SelectTrigger>
                <SelectValue placeholder="Page size" />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 50].map(n => (<SelectItem key={n} value={String(n)}>{n} / page</SelectItem>))}
              </SelectContent>
            </Select>
            <Button variant="secondary" onClick={() => { setStatus(undefined); setStartDate(''); setEndDate(''); setPage(1) }}>Reset</Button>
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
                {loading && (!data?.orderItems?.length) && (
                  <TableRow><TableCell colSpan={8}>Loading...</TableCell></TableRow>
                )}
                {(!loading && !data?.orderItems?.length) && (
                  <TableRow><TableCell colSpan={8}>No orders found</TableCell></TableRow>
                )}
                {data?.orderItems?.map((item: OrderItem) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Checkbox checked={!!selected[item.id]} onCheckedChange={(v) => toggleOne(item.id, Boolean(v))} />
                    </TableCell>
                    <TableCell className="max-w-[240px] truncate">{item.title || item.productId}</TableCell>
                    <TableCell>{item.status}</TableCell>
                    <TableCell>{item.price}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>#{item.orderId}</TableCell>
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


