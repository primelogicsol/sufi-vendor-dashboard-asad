"use client"

import React, { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { AnalyticsClient } from '@/lib/utils/analytics-client'
import { OrdersClient } from '@/lib/utils/orders-client'
import type { VendorOrderStatsResponse } from '@/types/orders'
import { TokenManager } from '@/lib/auth/token-manager'
import type { 
  SalesAnalytics, 
  InventoryAnalytics, 
  VendorAnalytics, 
  AnalyticsOverview,
  TimePeriod,
  GroupBy
} from '@/types/analytics'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

const TIME_PERIODS: { value: TimePeriod; label: string }[] = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
  { value: '1y', label: 'Last year' }
]

const GROUP_BY_OPTIONS: { value: GroupBy; label: string }[] = [
  { value: 'day', label: 'Daily' },
  { value: 'week', label: 'Weekly' },
  { value: 'month', label: 'Monthly' }
]

export default function AnalyticsPage() {
  const { user, isAuthenticated } = useAuth()
  const vendorId = user?.id || TokenManager.getUserId() || ''
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [period, setPeriod] = useState<TimePeriod>('30d')
  const [groupBy, setGroupBy] = useState<GroupBy>('day')
  const [salesData, setSalesData] = useState<SalesAnalytics | null>(null)
  const [inventoryData, setInventoryData] = useState<InventoryAnalytics | null>(null)
  const [vendorData, setVendorData] = useState<VendorAnalytics | null>(null)
  const [overviewData, setOverviewData] = useState<AnalyticsOverview | null>(null)
  const [fallbackOrderStats, setFallbackOrderStats] = useState<VendorOrderStatsResponse['data'] | null>(null)
  const fetchAnalyticsData = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    // Try to fetch each API individually to handle partial failures
    try {
      // Try to get overview data first
      try {
        const overviewRes = await AnalyticsClient.getAnalyticsOverview()
        setOverviewData(overviewRes.data)
      } catch {
        console.warn('Overview API failed, trying fallback order stats')
        // Try to get order stats as fallback
        try {
          if (vendorId) {
            const orderStatsRes = await OrdersClient.getVendorOrderStats(vendorId)
            setFallbackOrderStats(orderStatsRes.data)
            // Create overview data from order stats
            setOverviewData({
              sales: {
                totalRevenue: orderStatsRes.data.totalRevenue,
                totalOrders: orderStatsRes.data.totalOrders,
                averageOrderValue: orderStatsRes.data.totalOrders > 0 ? orderStatsRes.data.totalRevenue / orderStatsRes.data.totalOrders : 0
              },
              inventory: {
                totalProducts: 0,
                totalStock: 0,
                lowStockProducts: 0
              },
              customers: {
                totalCustomers: 0,
                newCustomers: 0,
                returningCustomers: 0
              },
              performance: {
                fulfillmentRate: 0,
                onTimeDelivery: 0,
                returnRate: 0
              }
            })
          } else {
            throw new Error('No vendor ID available')
          }
        } catch {
          console.warn('Fallback order stats also failed, using empty data')
          // Set fallback overview data
          setOverviewData({
            sales: {
              totalRevenue: 0,
              totalOrders: 0,
              averageOrderValue: 0
            },
            inventory: {
              totalProducts: 0,
              totalStock: 0,
              lowStockProducts: 0
            },
            customers: {
              totalCustomers: 0,
              newCustomers: 0,
              returningCustomers: 0
            },
            performance: {
              fulfillmentRate: 0,
              onTimeDelivery: 0,
              returnRate: 0
            }
          })
        }
      }

      // Try to get sales analytics
      try {
        const salesRes = await AnalyticsClient.getSalesAnalytics(period, groupBy)
        setSalesData(salesRes.data)
      } catch {
        console.warn('Sales analytics API failed, using fallback data')
        setSalesData({
          totalRevenue: 0,
          totalOrders: 0,
          averageOrderValue: 0,
          conversionRate: 0,
          timeSeriesData: [],
          topProducts: []
        })
      }

      // Try to get inventory analytics
      try {
        const inventoryRes = await AnalyticsClient.getInventoryAnalytics()
        setInventoryData(inventoryRes.data)
      } catch {
        console.warn('Inventory analytics API failed, using fallback data')
        setInventoryData({
          totalProducts: 0,
          totalStock: 0,
          totalValue: 0,
          turnoverRate: 0,
          lowStockProducts: 0,
          outOfStockProducts: 0,
          categories: {}
        })
      }

      // Try to get vendor analytics
      try {
        const vendorRes = await AnalyticsClient.getVendorAnalytics()
        setVendorData(vendorRes.data)
      } catch {
        console.warn('Vendor analytics API failed, using fallback data')
        setVendorData({
          vendorId: 'unknown',
          totalRevenue: 0,
          totalOrders: 0,
          averageOrderValue: 0,
          customerCount: 0,
          productCount: 0,
          rating: 0,
          performance: {
            fulfillmentRate: 0,
            onTimeDelivery: 0,
            returnRate: 0
          }
        })
      }

    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load analytics data')
    } finally {
      setLoading(false)
    }
  }, [groupBy, period, vendorId])

  useEffect(() => {
    if (isAuthenticated) {
      fetchAnalyticsData()
    }
  }, [isAuthenticated, fetchAnalyticsData])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <Link href="/">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
        <div className="flex gap-2">
          <Select value={period} onValueChange={(value) => setPeriod(value as TimePeriod)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TIME_PERIODS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={groupBy} onValueChange={(value) => setGroupBy(value as GroupBy)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {GROUP_BY_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            onClick={fetchAnalyticsData}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Refresh'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Debug Info */}
      {process.env.NODE_ENV === 'development' && (
        <Card className="bg-gray-50">
          <CardHeader>
            <CardTitle className="text-sm">Debug Info</CardTitle>
          </CardHeader>
          <CardContent className="text-xs">
            <div className="space-y-1">
              <div>Loading: {loading ? 'Yes' : 'No'}</div>
              <div>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</div>
              <div>Vendor ID: {vendorId || 'None'}</div>
              <div>Overview Data: {overviewData ? 'Loaded' : 'Not loaded'}</div>
              <div>Sales Data: {salesData ? 'Loaded' : 'Not loaded'}</div>
              <div>Inventory Data: {inventoryData ? 'Loaded' : 'Not loaded'}</div>
              <div>Vendor Data: {vendorData ? 'Loaded' : 'Not loaded'}</div>
              <div>Fallback Stats: {fallbackOrderStats ? 'Loaded' : 'Not loaded'}</div>
            </div>
          </CardContent>
        </Card>
      )}

      {loading && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="pb-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-gray-200 rounded w-20"></div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-2 text-gray-600">Loading analytics data...</p>
          </div>
        </div>
      )}

      {/* Overview Cards */}
      {overviewData && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(overviewData.sales.totalRevenue)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overviewData.sales.totalOrders}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(overviewData.sales.averageOrderValue)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overviewData.customers.totalCustomers}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Performance Metrics */}
      {overviewData && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Fulfillment Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatPercentage(overviewData.performance.fulfillmentRate)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">On-Time Delivery</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {formatPercentage(overviewData.performance.onTimeDelivery)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Return Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {formatPercentage(overviewData.performance.returnRate)}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Sales Analytics */}
      {salesData && !loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Total Revenue:</span>
                  <span className="font-semibold">{formatCurrency(salesData.totalRevenue)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Orders:</span>
                  <span className="font-semibold">{salesData.totalOrders}</span>
                </div>
                <div className="flex justify-between">
                  <span>Average Order Value:</span>
                  <span className="font-semibold">{formatCurrency(salesData.averageOrderValue)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Conversion Rate:</span>
                  <span className="font-semibold">{formatPercentage(salesData.conversionRate)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Products</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Orders</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
              {salesData.topProducts.slice(0, 5).map((product) => (
                    <TableRow key={product.productId}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{product.title}</div>
                          <div className="text-sm text-muted-foreground">ID: {product.productId}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{product.category}</Badge>
                      </TableCell>
                      <TableCell>{formatCurrency(product.revenue)}</TableCell>
                      <TableCell>{product.orders}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Inventory Analytics */}
      {inventoryData && !loading && (
        <Card>
          <CardHeader>
            <CardTitle>Inventory Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{inventoryData.totalProducts}</div>
                <div className="text-sm text-muted-foreground">Total Products</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{inventoryData.totalStock}</div>
                <div className="text-sm text-muted-foreground">Total Stock</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{inventoryData.lowStockProducts}</div>
                <div className="text-sm text-muted-foreground">Low Stock</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{inventoryData.turnoverRate.toFixed(1)}x</div>
                <div className="text-sm text-muted-foreground">Turnover Rate</div>
              </div>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Turnover</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(inventoryData.categories).map(([category, data]) => (
                  <TableRow key={category}>
                    <TableCell>{category}</TableCell>
                    <TableCell>{data.count}</TableCell>
                    <TableCell>{data.stock}</TableCell>
                    <TableCell>{formatCurrency(data.value)}</TableCell>
                    <TableCell>{data.turnoverRate.toFixed(1)}x</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Vendor Performance */}
      {vendorData && !loading && (
        <Card>
          <CardHeader>
            <CardTitle>Vendor Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Total Revenue:</span>
                  <span className="font-semibold">{formatCurrency(vendorData.totalRevenue)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Orders:</span>
                  <span className="font-semibold">{vendorData.totalOrders}</span>
                </div>
                <div className="flex justify-between">
                  <span>Average Order Value:</span>
                  <span className="font-semibold">{formatCurrency(vendorData.averageOrderValue)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Customer Count:</span>
                  <span className="font-semibold">{vendorData.customerCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Product Count:</span>
                  <span className="font-semibold">{vendorData.productCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Rating:</span>
                  <span className="font-semibold">{vendorData.rating.toFixed(1)} ⭐</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Fulfillment Rate:</span>
                  <span className="font-semibold text-green-600">
                    {formatPercentage(vendorData.performance.fulfillmentRate)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>On-Time Delivery:</span>
                  <span className="font-semibold text-blue-600">
                    {formatPercentage(vendorData.performance.onTimeDelivery)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Return Rate:</span>
                  <span className="font-semibold text-orange-600">
                    {formatPercentage(vendorData.performance.returnRate)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Time Series Data */}
      {salesData?.timeSeriesData && salesData.timeSeriesData.length > 0 && !loading && (
        <Card>
          <CardHeader>
            <CardTitle>Sales Trend ({period})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salesData.timeSeriesData.slice(0, 10).map((data, index) => (
                  <TableRow key={index}>
                    <TableCell>{new Date(data.date).toLocaleDateString()}</TableCell>
                    <TableCell>{data.orders}</TableCell>
                    <TableCell>{formatCurrency(data.revenue)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Fallback Order Stats */}
      {fallbackOrderStats && !loading && (
        <Card>
          <CardHeader>
            <CardTitle>Order Statistics (Fallback Data)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{fallbackOrderStats.totalOrders}</div>
                <div className="text-sm text-muted-foreground">Total Orders</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{formatCurrency(fallbackOrderStats.totalRevenue)}</div>
                <div className="text-sm text-muted-foreground">Total Revenue</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {fallbackOrderStats.totalOrders > 0 ? formatCurrency(fallbackOrderStats.totalRevenue / fallbackOrderStats.totalOrders) : '$0.00'}
                </div>
                <div className="text-sm text-muted-foreground">Average Order Value</div>
              </div>
            </div>
            
            {fallbackOrderStats.ordersByStatus && fallbackOrderStats.ordersByStatus.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Orders by Status</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {fallbackOrderStats.ordersByStatus.map((status) => (
                    <div key={status.status} className="text-center p-2 bg-gray-50 rounded">
                      <div className="font-semibold">{status._count.status}</div>
                      <div className="text-sm text-muted-foreground">{status.status}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* No Data Message */}
      {!loading && !overviewData && !salesData && !inventoryData && !vendorData && !fallbackOrderStats && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Analytics Data Available</h3>
          <p className="text-gray-500 mb-4">
            Analytics data will appear here once you have orders and inventory data.
          </p>
          <div className="flex justify-center gap-2">
            <Link href="/orders">
              <Button variant="outline">View Orders</Button>
            </Link>
            <Link href="/inventory">
              <Button variant="outline">View Inventory</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
