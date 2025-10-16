"use client"

import React, { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { OrdersClient } from '@/lib/utils/orders-client'
import type { VendorOrderStatsResponse, OrderStatus } from '@/types/orders'
import { useAuth } from '@/components/auth/auth-provider'
import { TokenManager } from '@/lib/auth/token-manager'
import { DollarSign, Package, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

export function VendorKpis() {
  const { user, isAuthenticated } = useAuth()
  const vendorId = user?.id || TokenManager.getUserId() || ''
  const [stats, setStats] = useState<VendorOrderStatsResponse['data'] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const byStatusMap = new Map<OrderStatus, number>(
    (stats?.ordersByStatus?.map(s => [s.status as OrderStatus, s._count.status]) as [OrderStatus, number][]) || []
  )

  useEffect(() => {
    const run = async () => {
      if (!isAuthenticated || !vendorId) return
      setIsLoading(true)
      try {
        const res = await OrdersClient.getVendorOrderStats(vendorId)
        setStats(res.data)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load stats')
      } finally {
        setIsLoading(false)
      }
    }
    run()
  }, [isAuthenticated, vendorId])

  const statusCards: { key: OrderStatus; label: string; icon: React.ReactNode; color: string }[] = [
    { key: "PENDING", label: "Pending", icon: <Clock className="w-5 h-5" />, color: "text-yellow-600" },
    { key: "COMPLETED", label: "Completed", icon: <CheckCircle className="w-5 h-5" />, color: "text-green-600" },
    { key: "CANCELLED", label: "Cancelled", icon: <XCircle className="w-5 h-5" />, color: "text-red-600" },
    { key: "FAILED", label: "Failed", icon: <AlertCircle className="w-5 h-5" />, color: "text-gray-600" },
  ]

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="space-y-6">
          {/* Revenue Skeleton */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl shadow-lg p-8 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="h-4 bg-white/20 rounded w-32 mb-4"></div>
                <div className="h-12 bg-white/30 rounded w-48 mb-3"></div>
                <div className="h-4 bg-white/20 rounded w-24"></div>
              </div>
              <div className="bg-white/20 p-4 rounded-full w-20 h-20"></div>
            </div>
          </div>

          {/* Cards Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-5 h-5 bg-gray-200 rounded"></div>
                    <div className="h-8 bg-gray-200 rounded w-12"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Total Revenue - Prominent Display */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl shadow-lg p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-indigo-100 uppercase tracking-wide mb-2">
                  Total Revenue
                </p>
                <h2 className="text-5xl font-bold">
                  ${stats?.totalRevenue != null ? stats.totalRevenue.toFixed(2) : '0.00'}
                </h2>
                <p className="text-indigo-100 mt-2">
                  From {stats?.totalOrders ?? 0} orders
                </p>
              </div>
              <div className="bg-white/20 p-4 rounded-full">
                <DollarSign className="w-12 h-12" />
              </div>
            </div>
          </div>

      {/* Order Status Grid - 5 Cards Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statusCards.map((card) => (
          <Card key={card.key} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={card.color}>
                  {card.icon}
                </div>
                <span className={`text-3xl font-bold ${card.color}`}>
                  {byStatusMap.get(card.key) ?? 0}
                </span>
              </div>
              <p className="text-sm font-medium text-gray-600">{card.label}</p>
            </CardContent>
          </Card>
        ))}

        {/* Total Orders Card */}
        <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-indigo-50 to-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-indigo-600">
                <Package className="w-5 h-5" />
              </div>
              <span className="text-3xl font-bold text-indigo-600">
                {stats?.totalOrders ?? 0}
              </span>
            </div>
            <p className="text-sm font-medium text-gray-600">Total Orders</p>
          </CardContent>
        </Card>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
        </>
      )}
    </div>
  )
}

