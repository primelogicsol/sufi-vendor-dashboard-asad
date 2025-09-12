import { DashboardLayout } from "@/components/dashboard-layout"
import  SingleProductUpload  from "@/components/single-product-upload"
import  BulkProductUploader  from "@/components/csv-bulk-upload"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, FileSpreadsheet } from "lucide-react"

export default function UploadPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Upload Products</h1>
          <p className="text-muted-foreground mt-2">Add new products to your store inventory.</p>
        </div>

        {/* Upload Options */}
        <Tabs defaultValue="single" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="single" className="flex items-center space-x-2">
              <Upload className="h-4 w-4" />
              <span>Single Product</span>
            </TabsTrigger>
            <TabsTrigger value="bulk" className="flex items-center space-x-2">
              <FileSpreadsheet className="h-4 w-4" />
              <span>Bulk Upload</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="single" className="mt-6">
            <Card className="bg-gradient-to-br from-card to-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="h-5 w-5 text-primary" />
                  <span>Single Product Upload</span>
                </CardTitle>
                <CardDescription>Add a single product with detailed information and specifications.</CardDescription>
              </CardHeader>
              <CardContent>
                <SingleProductUpload />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bulk" className="mt-6">
            <Card className="bg-gradient-to-br from-card to-secondary/5">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileSpreadsheet className="h-5 w-5 text-secondary" />
                  <span>Bulk Upload (CSV)</span>
                </CardTitle>
                <CardDescription>
                  Upload multiple products at once using a CSV file. Download the template to get started.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BulkProductUploader />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
