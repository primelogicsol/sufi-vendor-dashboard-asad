"use client"

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { InventoryClient } from '@/lib/utils/inventory-client'
import type { 
  InventorySummary, 
  InventoryDashboard, 
  StockAdjustment,
  ProductCategory,
  AdjustmentType
} from '@/types/inventory'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

const PRODUCT_CATEGORIES: ProductCategory[] = [
  "FASHION",
  "ACCESSORIES", 
  "MEDITATION",
  "HOME_LIVING",
  "DECORATION",
  "MUSIC",
  "DIGITAL_BOOK"
]

const ADJUSTMENT_TYPES: AdjustmentType[] = ["INCREASE", "DECREASE", "SET"]

export default function InventoryPage() {
  const { isAuthenticated } = useAuth()
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [summary, setSummary] = useState<InventorySummary | null>(null)
  const [dashboard, setDashboard] = useState<InventoryDashboard | null>(null)
  const [adjustmentDialogOpen, setAdjustmentDialogOpen] = useState(false)
  const [adjustment, setAdjustment] = useState<StockAdjustment>({
    productId: 0,
    productCategory: "FASHION",
    adjustmentType: "INCREASE",
    quantity: 0,
    reason: "",
    notes: ""
  })

  const fetchInventoryData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [summaryRes, dashboardRes] = await Promise.all([
        InventoryClient.getInventorySummary(),
        InventoryClient.getInventoryDashboard()
      ])
      setSummary(summaryRes.data)
      setDashboard(dashboardRes.data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load inventory data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchInventoryData()
    }
  }, [isAuthenticated])

  const handleStockAdjustment = async () => {
    if (!adjustment.productId || !adjustment.quantity || !adjustment.reason) {
      setError('Please fill in all required fields')
      return
    }

    try {
      setLoading(true)
      await InventoryClient.adjustStock(adjustment)
      setAdjustmentDialogOpen(false)
      setAdjustment({
        productId: 0,
        productCategory: "FASHION",
        adjustmentType: "INCREASE",
        quantity: 0,
        reason: "",
        notes: ""
      })
      await fetchInventoryData()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to adjust stock')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (stock: number, threshold: number) => {
    if (stock === 0) return "bg-red-100 text-red-800"
    if (stock <= threshold) return "bg-yellow-100 text-yellow-800"
    return "bg-green-100 text-green-800"
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <Link href="/">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
        <Dialog open={adjustmentDialogOpen} onOpenChange={setAdjustmentDialogOpen}>
          <DialogTrigger asChild>
            <Button>Adjust Stock</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Stock Adjustment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="productId">Product ID</Label>
                <Input
                  id="productId"
                  type="number"
                  value={adjustment.productId}
                  onChange={(e) => setAdjustment(prev => ({ ...prev, productId: Number(e.target.value) }))}
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={adjustment.productCategory} 
                  onValueChange={(value) => setAdjustment(prev => ({ ...prev, productCategory: value as ProductCategory }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRODUCT_CATEGORIES.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="adjustmentType">Adjustment Type</Label>
                <Select 
                  value={adjustment.adjustmentType} 
                  onValueChange={(value) => setAdjustment(prev => ({ ...prev, adjustmentType: value as AdjustmentType }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ADJUSTMENT_TYPES.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={adjustment.quantity}
                  onChange={(e) => setAdjustment(prev => ({ ...prev, quantity: Number(e.target.value) }))}
                />
              </div>
              <div>
                <Label htmlFor="reason">Reason *</Label>
                <Input
                  id="reason"
                  value={adjustment.reason}
                  onChange={(e) => setAdjustment(prev => ({ ...prev, reason: e.target.value }))}
                  placeholder="e.g., New shipment received"
                />
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={adjustment.notes}
                  onChange={(e) => setAdjustment(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional notes..."
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleStockAdjustment} disabled={loading}>
                  {loading ? 'Processing...' : 'Adjust Stock'}
                </Button>
                <Button variant="outline" onClick={() => setAdjustmentDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.totalProducts}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Stock</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.totalStock}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{summary.lowStockProducts}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{summary.outOfStockProducts}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Low Stock Alerts */}
      {dashboard?.lowStockAlerts && dashboard.lowStockAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Low Stock Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product ID</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead>Threshold</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dashboard.lowStockAlerts.map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell>{alert.productId}</TableCell>
                    <TableCell>{alert.productCategory}</TableCell>
                    <TableCell>{alert.currentStock}</TableCell>
                    <TableCell>{alert.threshold}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(alert.currentStock, alert.threshold)}>
                        {alert.isResolved ? 'Resolved' : 'Active'}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(alert.createdAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Recent Movements */}
      {dashboard?.recentMovements && dashboard.recentMovements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Stock Movements</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product ID</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Change</TableHead>
                  <TableHead>Previous</TableHead>
                  <TableHead>New</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dashboard.recentMovements.map((movement) => (
                  <TableRow key={movement.id}>
                    <TableCell>{movement.productId}</TableCell>
                    <TableCell>{movement.productCategory}</TableCell>
                    <TableCell>
                      <Badge variant={movement.changeType === 'SALE' ? 'destructive' : 'default'}>
                        {movement.changeType}
                      </Badge>
                    </TableCell>
                    <TableCell className={movement.quantityChange < 0 ? 'text-red-600' : 'text-green-600'}>
                      {movement.quantityChange > 0 ? '+' : ''}{movement.quantityChange}
                    </TableCell>
                    <TableCell>{movement.previousStock}</TableCell>
                    <TableCell>{movement.newStock}</TableCell>
                    <TableCell>{movement.reason}</TableCell>
                    <TableCell>{new Date(movement.createdAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Category Breakdown */}
      {summary?.categories && (
        <Card>
          <CardHeader>
            <CardTitle>Inventory by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(summary.categories).map(([category, data]) => (
                  <TableRow key={category}>
                    <TableCell>{category}</TableCell>
                    <TableCell>{data.count}</TableCell>
                    <TableCell>{data.stock}</TableCell>
                    <TableCell>${data.value.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
