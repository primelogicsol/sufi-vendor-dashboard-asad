import { DashboardLayout } from "@/components/dashboard-layout"
import { ProductsManagement } from "@/components/products-management"

export default function ProductsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Products</h1>
          <p className="text-muted-foreground mt-2">
            Manage your product inventory, update details, and track performance.
          </p>
        </div>

        <ProductsManagement />
      </div>
    </DashboardLayout>
  )
}
