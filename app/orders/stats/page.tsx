// "use client"

// import React from 'react'
// import { VendorKpis } from '@/components/orders/vendor-kpis'

// export default function OrdersStatsPage() {
//   return (
//     <div className="p-4 space-y-4">
//       <VendorKpis />
//     </div>
//   )
// }


"use client"

import React from 'react'
import { VendorKpis } from '@/components/orders/vendor-kpis'
import { Button } from '@/components/ui/button'
import { ArrowLeft} from 'lucide-react'

export default function OrdersStatsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fadeIn">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => history.back()}
              className="hover:bg-white/80  transition-all hover:shadow-md border-slate-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            {/* <div className='items-center'>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                  Order Statistics
                </h1>
              </div>
              <p className="text-slate-600 text-sm sm:text-base ">
                Track your performance and insights
              </p>
            </div> */}
          </div>
        </div>

        {/* KPIs Section */}
        <div className="animate-slideUp">
          <VendorKpis />
        </div>
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
          animation: slideUp 0.6s ease-out 0.2s;
          animation-fill-mode: both;
        }
      `}</style>
    </div>
  )
}