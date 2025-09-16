import { DashboardLayout } from "@/components/dashboard-layout";
import SingleProductUpload from "@/components/single-product-upload";
import BulkProductUploader from "@/components/csv-bulk-upload";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, FileSpreadsheet } from "lucide-react";

export default function UploadPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-[#8a5d95] mb-4 tracking-tight">
            Upload Products
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-[#8a5d95] to-[#644c6a] rounded-full mx-auto mb-4"></div>
          <p className="text-[#644c6a] text-xl font-medium leading-relaxed max-w-2xl mx-auto">
            Add new products to your store inventory with ease and precision.
          </p>
        </div>

        {/* Upload Options */}
        <Tabs defaultValue="single" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="grid w-full grid-cols-2 max-w-md bg-white/10 backdrop-blur-sm border border-[#8a5d95]/30">
              <TabsTrigger
                value="single"
                className="flex items-center space-x-2 text-[#644c6a] data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#8a5d95] data-[state=active]:to-[#644c6a] data-[state=active]:text-white font-medium transition-all duration-300"
              >
                <Upload className="h-4 w-4" />
                <span>Single Product</span>
              </TabsTrigger>
              <TabsTrigger
                value="bulk"
                className="flex items-center space-x-2 text-[#644c6a] data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#8a5d95] data-[state=active]:to-[#644c6a] data-[state=active]:text-white font-medium transition-all duration-300"
              >
                <FileSpreadsheet className="h-4 w-4" />
                <span>Bulk Upload</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="single" className="mt-6">
            <Card className="bg-[#684670]/10">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="h-5 w-5 text-[#511d5e]" />
                  <span className="text-lg text-[#511d5e] font-bold">
                    Single Product Upload
                  </span>
                </CardTitle>
                <CardDescription className="text-lg text-[#644c6a]">
                  Add a single product with detailed information and
                  specifications.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SingleProductUpload />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bulk" className="mt-6">
            <Card className="bg-[#684670]/10">
              {/* <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileSpreadsheet className="h-5 w-5 text-secondary" />
                  <span className="text-lg text-[#511d5e] font-bold">
                    Bulk Upload (CSV)
                  </span>
                </CardTitle>
                <CardDescription className="text-lg text-[#644c6a]">
                  Upload multiple products at once using a CSV file. Download
                  the template to get started.
                </CardDescription>
              </CardHeader> */}
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
  {/* Left Side (Heading + Description) */}
  <div>
    <CardTitle className="flex items-center space-x-2">
      <FileSpreadsheet className="h-5 w-5 text-secondary" />
      <span className="text-lg text-[#511d5e] font-bold">
        Bulk Upload (CSV)
      </span>
    </CardTitle>
    <CardDescription className="text-lg text-[#644c6a]">
      Upload multiple products at once using a CSV file. Download
      the template to get started.
    </CardDescription>
  </div>

  {/* Right Side (Download Template Button) */}
  <a
    href="/templates/sample-template.csv" // <-- place your sample.csv in /public/templates/
    download
    className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#8a5d95] to-[#644c6a] rounded-lg shadow hover:opacity-90 transition-all duration-300"
  >
    <FileSpreadsheet className="h-4 w-4 mr-2" />
    Download Template
  </a>
</CardHeader>

              <CardContent>
                <BulkProductUploader />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
