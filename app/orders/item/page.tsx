// "use client"

// import React, { useEffect, useState } from 'react'
// import { OrdersClient } from '@/lib/utils/orders-client'
// import type { OrderItem } from '@/types/orders'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'

// export default function OrderItemDetailPage({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined } }) {
//   const orderItemId = typeof searchParams?.orderItemId === 'string' ? searchParams?.orderItemId : ''
//   const [item, setItem] = useState<OrderItem | null>(null)
//   const [loading, setLoading] = useState<boolean>(false)
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     const run = async () => {
//       if (!orderItemId) return
//       setLoading(true)
//       setError(null)
//       try {
//         const detail = await OrdersClient.getOrderItemDetail(orderItemId)
//         setItem(detail)
//       } catch (e) {
//         setError(e instanceof Error ? e.message : 'Failed to load order item')
//       } finally {
//         setLoading(false)
//       }
//     }
//     run()
//   }, [orderItemId])

//   return (
//     <div className="p-4">
//       <Card>
//         <CardHeader>
//           <CardTitle>Order Item {orderItemId ? `#${orderItemId}` : ''}</CardTitle>
//         </CardHeader>
//         <CardContent>
//           {!orderItemId && <div className="text-sm text-muted-foreground">Provide an orderItemId in the URL query.</div>}
//           {loading && <div>Loading...</div>}
//           {error && <div className="text-red-600 text-sm">{error}</div>}
//           {item && (
//             <div className="space-y-2">
//               <div><span className="font-medium">Title:</span> {item.title || item.productId}</div>
//               <div><span className="font-medium">Status:</span> {item.status}</div>
//               <div><span className="font-medium">Price:</span> {item.price}</div>
//               <div><span className="font-medium">Quantity:</span> {item.quantity}</div>
//               <div><span className="font-medium">Order Id:</span> {item.orderId}</div>
//               <div><span className="font-medium">Payment:</span> {item.order?.paymentStatus}</div>
//               <div><span className="font-medium">Created:</span> {item.createdAt?.slice(0,10)}</div>
//               <div className="pt-2">
//                 <Button variant="outline" onClick={() => history.back()}>Back</Button>
//               </div>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   )
// }


"use client"

import React, { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { OrdersClient } from '@/lib/utils/orders-client'
import type { OrderItem } from '@/types/orders'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

function OrderItemContent() {
  const searchParams = useSearchParams()
  const orderItemId = searchParams.get('orderItemId') || ''
  
  const [item, setItem] = useState<OrderItem | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const run = async () => {
      if (!orderItemId) return
      setLoading(true)
      setError(null)
      try {
        const detail = await OrdersClient.getOrderItemDetail(orderItemId)
        setItem(detail)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load order item')
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [orderItemId])

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Order Item {orderItemId ? `#${orderItemId}` : ''}</CardTitle>
        </CardHeader>
        <CardContent>
          {!orderItemId && <div className="text-sm text-muted-foreground">Provide an orderItemId in the URL query.</div>}
          {loading && <div>Loading...</div>}
          {error && <div className="text-red-600 text-sm">{error}</div>}
          {item && (
            <div className="space-y-2">
              <div><span className="font-medium">Title:</span> {item.title || item.productId}</div>
              <div><span className="font-medium">Status:</span> {item.status}</div>
              <div><span className="font-medium">Price:</span> {item.price}</div>
              <div><span className="font-medium">Quantity:</span> {item.quantity}</div>
              <div><span className="font-medium">Order Id:</span> {item.orderId}</div>
              <div><span className="font-medium">Payment:</span> {item.order?.paymentStatus}</div>
              <div><span className="font-medium">Created:</span> {item.createdAt?.slice(0,10)}</div>
              <div className="pt-2">
                <Button variant="outline" onClick={() => history.back()}>Back</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function OrderItemDetailPage() {
  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      <OrderItemContent />
    </Suspense>
  )
}