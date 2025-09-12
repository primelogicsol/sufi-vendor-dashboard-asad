// // "use client"

// // import type React from "react"

// // import { useState, useCallback } from "react"
// // import { Button } from "@/components/ui/button"
// // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// // import { Badge } from "@/components/ui/badge"
// // import { Progress } from "@/components/ui/progress"
// // import { Alert, AlertDescription } from "@/components/ui/alert"
// // import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// // import { ScrollArea } from "@/components/ui/scroll-area"
// // import { Upload, Download, FileSpreadsheet, CheckCircle, XCircle, AlertTriangle, Trash2, Eye } from "lucide-react"

// // interface CSVProduct {
// //   name: string
// //   category: string
// //   price: string
// //   stock: string
// //   sku: string
// //   description: string
// //   brand: string
// //   weight: string
// //   isActive: string
// //   errors?: string[]
// // }

// // interface UploadStats {
// //   total: number
// //   valid: number
// //   invalid: number
// //   uploaded: number
// // }

// // const csvTemplate = `name,category,price,stock,sku,description,brand,weight,isActive
// // iPhone 15 Pro,Electronics,999.99,50,IPH15PRO001,"Latest iPhone with advanced features",Apple,0.2,true
// // Samsung Galaxy S24,Electronics,899.99,30,SGS24001,"Flagship Android smartphone",Samsung,0.19,true
// // MacBook Air M3,Electronics,1299.99,20,MBA13M3001,"Lightweight laptop with M3 chip",Apple,1.24,true`

// // export function CSVBulkUpload() {
// //   const [csvData, setCsvData] = useState<CSVProduct[]>([])
// //   const [uploadStats, setUploadStats] = useState<UploadStats>({ total: 0, valid: 0, invalid: 0, uploaded: 0 })
// //   const [isUploading, setIsUploading] = useState(false)
// //   const [uploadProgress, setUploadProgress] = useState(0)
// //   const [dragActive, setDragActive] = useState(false)

// //   const validateProduct = (product: CSVProduct): string[] => {
// //     const errors: string[] = []

// //     if (!product.name?.trim()) errors.push("Product name is required")
// //     if (!product.category?.trim()) errors.push("Category is required")
// //     if (!product.price || isNaN(Number(product.price)) || Number(product.price) <= 0) {
// //       errors.push("Valid price is required")
// //     }
// //     if (!product.stock || isNaN(Number(product.stock)) || Number(product.stock) < 0) {
// //       errors.push("Valid stock quantity is required")
// //     }
// //     if (product.sku && csvData.filter((p) => p.sku === product.sku).length > 1) {
// //       errors.push("SKU must be unique")
// //     }

// //     return errors
// //   }

// //   const parseCSV = (csvText: string): CSVProduct[] => {
// //     const lines = csvText.trim().split("\n")
// //     if (lines.length < 2) return []

// //     const headers = lines[0].split(",").map((h) => h.trim())
// //     const products: CSVProduct[] = []

// //     for (let i = 1; i < lines.length; i++) {
// //       const values = lines[i].split(",").map((v) => v.trim().replace(/^"|"$/g, ""))
// //       const product: any = {}

// //       headers.forEach((header, index) => {
// //         product[header] = values[index] || ""
// //       })

// //       const errors = validateProduct(product)
// //       products.push({ ...product, errors })
// //     }

// //     return products
// //   }

// //   const handleFileUpload = useCallback(
// //     (file: File) => {
// //       if (!file.name.endsWith(".csv")) {
// //         alert("Please upload a CSV file")
// //         return
// //       }

// //       const reader = new FileReader()
// //       reader.onload = (e) => {
// //         const csvText = e.target?.result as string
// //         const products = parseCSV(csvText)
// //         setCsvData(products)

// //         const valid = products.filter((p) => !p.errors || p.errors.length === 0).length
// //         const invalid = products.length - valid
// //         setUploadStats({ total: products.length, valid, invalid, uploaded: 0 })
// //       }
// //       reader.readAsText(file)
// //     },
// //     [csvData],
// //   )

// //   const handleDrop = useCallback(
// //     (e: React.DragEvent) => {
// //       e.preventDefault()
// //       setDragActive(false)

// //       const files = Array.from(e.dataTransfer.files)
// //       if (files.length > 0) {
// //         handleFileUpload(files[0])
// //       }
// //     },
// //     [handleFileUpload],
// //   )

// //   const handleDragOver = useCallback((e: React.DragEvent) => {
// //     e.preventDefault()
// //     setDragActive(true)
// //   }, [])

// //   const handleDragLeave = useCallback((e: React.DragEvent) => {
// //     e.preventDefault()
// //     setDragActive(false)
// //   }, [])

// //   const downloadTemplate = () => {
// //     const blob = new Blob([csvTemplate], { type: "text/csv" })
// //     const url = URL.createObjectURL(blob)
// //     const a = document.createElement("a")
// //     a.href = url
// //     a.download = "product-template.csv"
// //     a.click()
// //     URL.revokeObjectURL(url)
// //   }

// //   const clearData = () => {
// //     setCsvData([])
// //     setUploadStats({ total: 0, valid: 0, invalid: 0, uploaded: 0 })
// //     setUploadProgress(0)
// //   }

// //   const uploadProducts = async () => {
// //     const validProducts = csvData.filter((p) => !p.errors || p.errors.length === 0)
// //     if (validProducts.length === 0) {
// //       alert("No valid products to upload")
// //       return
// //     }

// //     setIsUploading(true)
// //     setUploadProgress(0)

// //     // Simulate upload progress
// //     for (let i = 0; i < validProducts.length; i++) {
// //       await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API call
// //       const progress = ((i + 1) / validProducts.length) * 100
// //       setUploadProgress(progress)
// //       setUploadStats((prev) => ({ ...prev, uploaded: i + 1 }))
// //     }

// //     setIsUploading(false)
// //     alert(`Successfully uploaded ${validProducts.length} products!`)
// //   }

// //   const previewProducts = () => {
// //     console.log("Preview products:", csvData)
// //     alert("Preview functionality - check console for data")
// //   }

// //   return (
// //     <div className="space-y-6">
// //       {/* Upload Area */}
// //       <Card className="bg-gradient-to-br from-card to-secondary/5">
// //         <CardHeader>
// //           <CardTitle className="flex items-center justify-between">
// //             <span>Upload CSV File</span>
// //             <Button variant="outline" size="sm" onClick={downloadTemplate}>
// //               <Download className="h-4 w-4 mr-2" />
// //               Download Template
// //             </Button>
// //           </CardTitle>
// //         </CardHeader>
// //         <CardContent>
// //           <div
// //             className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
// //               dragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-accent/5"
// //             }`}
// //             onDrop={handleDrop}
// //             onDragOver={handleDragOver}
// //             onDragLeave={handleDragLeave}
// //           >
// //             <FileSpreadsheet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
// //             <h3 className="text-lg font-medium mb-2">Drop your CSV file here</h3>
// //             <p className="text-muted-foreground mb-4">or click to browse files</p>
// //             <input
// //               type="file"
// //               accept=".csv"
// //               onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
// //               className="hidden"
// //               id="csv-upload"
// //             />
// //             <label htmlFor="csv-upload">
// //               <Button variant="outline" className="cursor-pointer bg-transparent">
// //                 <Upload className="h-4 w-4 mr-2" />
// //                 Choose File
// //               </Button>
// //             </label>
// //           </div>
// //         </CardContent>
// //       </Card>

// //       {/* Upload Stats */}
// //       {csvData.length > 0 && (
// //         <div className="grid gap-4 md:grid-cols-4">
// //           <Card className="bg-gradient-to-br from-card to-primary/5">
// //             <CardContent className="p-4">
// //               <div className="flex items-center space-x-2">
// //                 <FileSpreadsheet className="h-5 w-5 text-primary" />
// //                 <div>
// //                   <p className="text-2xl font-bold text-primary">{uploadStats.total}</p>
// //                   <p className="text-sm text-muted-foreground">Total Products</p>
// //                 </div>
// //               </div>
// //             </CardContent>
// //           </Card>

// //           <Card className="bg-gradient-to-br from-card to-green-500/5">
// //             <CardContent className="p-4">
// //               <div className="flex items-center space-x-2">
// //                 <CheckCircle className="h-5 w-5 text-green-600" />
// //                 <div>
// //                   <p className="text-2xl font-bold text-green-600">{uploadStats.valid}</p>
// //                   <p className="text-sm text-muted-foreground">Valid Products</p>
// //                 </div>
// //               </div>
// //             </CardContent>
// //           </Card>

// //           <Card className="bg-gradient-to-br from-card to-red-500/5">
// //             <CardContent className="p-4">
// //               <div className="flex items-center space-x-2">
// //                 <XCircle className="h-5 w-5 text-red-600" />
// //                 <div>
// //                   <p className="text-2xl font-bold text-red-600">{uploadStats.invalid}</p>
// //                   <p className="text-sm text-muted-foreground">Invalid Products</p>
// //                 </div>
// //               </div>
// //             </CardContent>
// //           </Card>

// //           <Card className="bg-gradient-to-br from-card to-secondary/5">
// //             <CardContent className="p-4">
// //               <div className="flex items-center space-x-2">
// //                 <Upload className="h-5 w-5 text-secondary" />
// //                 <div>
// //                   <p className="text-2xl font-bold text-secondary">{uploadStats.uploaded}</p>
// //                   <p className="text-sm text-muted-foreground">Uploaded</p>
// //                 </div>
// //               </div>
// //             </CardContent>
// //           </Card>
// //         </div>
// //       )}

// //       {/* Upload Progress */}
// //       {isUploading && (
// //         <Card>
// //           <CardContent className="p-4">
// //             <div className="space-y-2">
// //               <div className="flex justify-between text-sm">
// //                 <span>Uploading products...</span>
// //                 <span>{Math.round(uploadProgress)}%</span>
// //               </div>
// //               <Progress value={uploadProgress} className="w-full" />
// //             </div>
// //           </CardContent>
// //         </Card>
// //       )}

// //       {/* Data Preview */}
// //       {csvData.length > 0 && (
// //         <Card className="bg-gradient-to-br from-card to-accent/5">
// //           <CardHeader>
// //             <CardTitle className="flex items-center justify-between">
// //               <span>Data Preview ({csvData.length} products)</span>
// //               <div className="flex space-x-2">
// //                 <Button variant="outline" size="sm" onClick={previewProducts}>
// //                   <Eye className="h-4 w-4 mr-2" />
// //                   Preview All
// //                 </Button>
// //                 <Button variant="outline" size="sm" onClick={clearData}>
// //                   <Trash2 className="h-4 w-4 mr-2" />
// //                   Clear
// //                 </Button>
// //               </div>
// //             </CardTitle>
// //           </CardHeader>
// //           <CardContent>
// //             <ScrollArea className="h-96 w-full">
// //               <Table>
// //                 <TableHeader>
// //                   <TableRow>
// //                     <TableHead>Status</TableHead>
// //                     <TableHead>Name</TableHead>
// //                     <TableHead>Category</TableHead>
// //                     <TableHead>Price</TableHead>
// //                     <TableHead>Stock</TableHead>
// //                     <TableHead>SKU</TableHead>
// //                     <TableHead>Errors</TableHead>
// //                   </TableRow>
// //                 </TableHeader>
// //                 <TableBody>
// //                   {csvData.map((product, index) => (
// //                     <TableRow key={index}>
// //                       <TableCell>
// //                         {!product.errors || product.errors.length === 0 ? (
// //                           <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
// //                             <CheckCircle className="h-3 w-3 mr-1" />
// //                             Valid
// //                           </Badge>
// //                         ) : (
// //                           <Badge variant="destructive">
// //                             <XCircle className="h-3 w-3 mr-1" />
// //                             Invalid
// //                           </Badge>
// //                         )}
// //                       </TableCell>
// //                       <TableCell className="font-medium">{product.name}</TableCell>
// //                       <TableCell>{product.category}</TableCell>
// //                       <TableCell>${product.price}</TableCell>
// //                       <TableCell>{product.stock}</TableCell>
// //                       <TableCell>{product.sku}</TableCell>
// //                       <TableCell>
// //                         {product.errors && product.errors.length > 0 && (
// //                           <div className="space-y-1">
// //                             {product.errors.map((error, errorIndex) => (
// //                               <div key={errorIndex} className="flex items-center space-x-1">
// //                                 <AlertTriangle className="h-3 w-3 text-red-500" />
// //                                 <span className="text-xs text-red-600">{error}</span>
// //                               </div>
// //                             ))}
// //                           </div>
// //                         )}
// //                       </TableCell>
// //                     </TableRow>
// //                   ))}
// //                 </TableBody>
// //               </Table>
// //             </ScrollArea>
// //           </CardContent>
// //         </Card>
// //       )}

// //       {/* Action Buttons */}
// //       {csvData.length > 0 && uploadStats.valid > 0 && (
// //         <div className="flex justify-end space-x-4">
// //           {uploadStats.invalid > 0 && (
// //             <Alert className="flex-1">
// //               <AlertTriangle className="h-4 w-4" />
// //               <AlertDescription>
// //                 {uploadStats.invalid} products have validation errors and will be skipped during upload.
// //               </AlertDescription>
// //             </Alert>
// //           )}
// //           <Button
// //             onClick={uploadProducts}
// //             disabled={isUploading || uploadStats.valid === 0}
// //             className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
// //           >
// //             {isUploading ? (
// //               <>
// //                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
// //                 Uploading...
// //               </>
// //             ) : (
// //               <>
// //                 <Upload className="h-4 w-4 mr-2" />
// //                 Upload {uploadStats.valid} Valid Products
// //               </>
// //             )}
// //           </Button>
// //         </div>
// //       )}
// //     </div>
// //   )
// // }


// "use client"

// import type React from "react"

// import { useState, useCallback } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Progress } from "@/components/ui/progress"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Upload, Download, FileSpreadsheet, CheckCircle, XCircle, AlertTriangle, Trash2, Eye } from "lucide-react"

// interface CSVProduct {
//   name: string
//   category: string
//   price: string
//   stock: string
//   sku: string
//   description: string
//   brand: string
//   weight: string
//   isActive: string
//   errors?: string[]
// }

// interface UploadStats {
//   total: number
//   valid: number
//   invalid: number
//   uploaded: number
// }

// const csvTemplate = `name,category,price,stock,sku,description,brand,weight,isActive
// iPhone 15 Pro,Electronics,999.99,50,IPH15PRO001,"Latest iPhone with advanced features",Apple,0.2,true
// Samsung Galaxy S24,Electronics,899.99,30,SGS24001,"Flagship Android smartphone",Samsung,0.19,true
// MacBook Air M3,Electronics,1299.99,20,MBA13M3001,"Lightweight laptop with M3 chip",Apple,1.24,true`

// export function CSVBulkUpload() {
//   const [csvData, setCsvData] = useState<CSVProduct[]>([])
//   const [uploadStats, setUploadStats] = useState<UploadStats>({ total: 0, valid: 0, invalid: 0, uploaded: 0 })
//   const [isUploading, setIsUploading] = useState(false)
//   const [uploadProgress, setUploadProgress] = useState(0)
//   const [dragActive, setDragActive] = useState(false)

//   const validateProduct = useCallback((product: CSVProduct): string[] => {
//     const errors: string[] = []

//     if (!product.name?.trim()) errors.push("Product name is required")
//     if (!product.category?.trim()) errors.push("Category is required")
//     if (!product.price || isNaN(Number(product.price)) || Number(product.price) <= 0) {
//       errors.push("Valid price is required")
//     }
//     if (!product.stock || isNaN(Number(product.stock)) || Number(product.stock) < 0) {
//       errors.push("Valid stock quantity is required")
//     }
//     if (product.sku && csvData.filter((p) => p.sku === product.sku).length > 1) {
//       errors.push("SKU must be unique")
//     }

//     return errors
//   }, [csvData])

//   const parseCSV = useCallback((csvText: string): CSVProduct[] => {
//     const lines = csvText.trim().split("\n")
//     if (lines.length < 2) return []

//     const headers = lines[0].split(",").map((h) => h.trim())
//     const products: CSVProduct[] = []

//     for (let i = 1; i < lines.length; i++) {
//       const values = lines[i].split(",").map((v) => v.trim().replace(/^"|"$/g, ""))
//       const productData: Record<string, string> = {}

//       headers.forEach((header, index) => {
//         productData[header] = values[index] || ""
//       })

//       // Create a proper CSVProduct object with all required fields
//       const product: CSVProduct = {
//         name: productData.name || "",
//         category: productData.category || "",
//         price: productData.price || "",
//         stock: productData.stock || "",
//         sku: productData.sku || "",
//         description: productData.description || "",
//         brand: productData.brand || "",
//         weight: productData.weight || "",
//         isActive: productData.isActive || "",
//       }

//       const errors = validateProduct(product)
//       products.push({ ...product, errors })
//     }

//     return products
//   }, [validateProduct])

//   const handleFileUpload = useCallback(
//     (file: File) => {
//       if (!file.name.endsWith(".csv")) {
//         alert("Please upload a CSV file")
//         return
//       }

//       const reader = new FileReader()
//       reader.onload = (e) => {
//         const csvText = e.target?.result as string
//         const products = parseCSV(csvText)
//         setCsvData(products)

//         const valid = products.filter((p) => !p.errors || p.errors.length === 0).length
//         const invalid = products.length - valid
//         setUploadStats({ total: products.length, valid, invalid, uploaded: 0 })
//       }
//       reader.readAsText(file)
//     },
//     [parseCSV],
//   )

//   const handleDrop = useCallback(
//     (e: React.DragEvent) => {
//       e.preventDefault()
//       setDragActive(false)

//       const files = Array.from(e.dataTransfer.files)
//       if (files.length > 0) {
//         handleFileUpload(files[0])
//       }
//     },
//     [handleFileUpload],
//   )

//   const handleDragOver = useCallback((e: React.DragEvent) => {
//     e.preventDefault()
//     setDragActive(true)
//   }, [])

//   const handleDragLeave = useCallback((e: React.DragEvent) => {
//     e.preventDefault()
//     setDragActive(false)
//   }, [])

//   const downloadTemplate = () => {
//     const blob = new Blob([csvTemplate], { type: "text/csv" })
//     const url = URL.createObjectURL(blob)
//     const a = document.createElement("a")
//     a.href = url
//     a.download = "product-template.csv"
//     a.click()
//     URL.revokeObjectURL(url)
//   }

//   const clearData = () => {
//     setCsvData([])
//     setUploadStats({ total: 0, valid: 0, invalid: 0, uploaded: 0 })
//     setUploadProgress(0)
//   }

//   const uploadProducts = async () => {
//     const validProducts = csvData.filter((p) => !p.errors || p.errors.length === 0)
//     if (validProducts.length === 0) {
//       alert("No valid products to upload")
//       return
//     }

//     setIsUploading(true)
//     setUploadProgress(0)

//     // Simulate upload progress
//     for (let i = 0; i < validProducts.length; i++) {
//       await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate API call
//       const progress = ((i + 1) / validProducts.length) * 100
//       setUploadProgress(progress)
//       setUploadStats((prev) => ({ ...prev, uploaded: i + 1 }))
//     }

//     setIsUploading(false)
//     alert(`Successfully uploaded ${validProducts.length} products!`)
//   }

//   const previewProducts = () => {
//     console.log("Preview products:", csvData)
//     alert("Preview functionality - check console for data")
//   }

//   return (
//     <div className="space-y-6">
//       {/* Upload Area */}
//       <Card className="bg-gradient-to-br from-card to-secondary/5">
//         <CardHeader>
//           <CardTitle className="flex items-center justify-between">
//             <span>Upload CSV File</span>
//             <Button variant="outline" size="sm" onClick={downloadTemplate}>
//               <Download className="h-4 w-4 mr-2" />
//               Download Template
//             </Button>
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div
//             className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
//               dragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-accent/5"
//             }`}
//             onDrop={handleDrop}
//             onDragOver={handleDragOver}
//             onDragLeave={handleDragLeave}
//           >
//             <FileSpreadsheet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
//             <h3 className="text-lg font-medium mb-2">Drop your CSV file here</h3>
//             <p className="text-muted-foreground mb-4">or click to browse files</p>
//             <input
//               type="file"
//               accept=".csv"
//               onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
//               className="hidden"
//               id="csv-upload"
//             />
//             <label htmlFor="csv-upload">
//               <Button variant="outline" className="cursor-pointer bg-transparent">
//                 <Upload className="h-4 w-4 mr-2" />
//                 Choose File
//               </Button>
//             </label>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Upload Stats */}
//       {csvData.length > 0 && (
//         <div className="grid gap-4 md:grid-cols-4">
//           <Card className="bg-gradient-to-br from-card to-primary/5">
//             <CardContent className="p-4">
//               <div className="flex items-center space-x-2">
//                 <FileSpreadsheet className="h-5 w-5 text-primary" />
//                 <div>
//                   <p className="text-2xl font-bold text-primary">{uploadStats.total}</p>
//                   <p className="text-sm text-muted-foreground">Total Products</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="bg-gradient-to-br from-card to-green-500/5">
//             <CardContent className="p-4">
//               <div className="flex items-center space-x-2">
//                 <CheckCircle className="h-5 w-5 text-green-600" />
//                 <div>
//                   <p className="text-2xl font-bold text-green-600">{uploadStats.valid}</p>
//                   <p className="text-sm text-muted-foreground">Valid Products</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="bg-gradient-to-br from-card to-red-500/5">
//             <CardContent className="p-4">
//               <div className="flex items-center space-x-2">
//                 <XCircle className="h-5 w-5 text-red-600" />
//                 <div>
//                   <p className="text-2xl font-bold text-red-600">{uploadStats.invalid}</p>
//                   <p className="text-sm text-muted-foreground">Invalid Products</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="bg-gradient-to-br from-card to-secondary/5">
//             <CardContent className="p-4">
//               <div className="flex items-center space-x-2">
//                 <Upload className="h-5 w-5 text-secondary" />
//                 <div>
//                   <p className="text-2xl font-bold text-secondary">{uploadStats.uploaded}</p>
//                   <p className="text-sm text-muted-foreground">Uploaded</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       )}

//       {/* Upload Progress */}
//       {isUploading && (
//         <Card>
//           <CardContent className="p-4">
//             <div className="space-y-2">
//               <div className="flex justify-between text-sm">
//                 <span>Uploading products...</span>
//                 <span>{Math.round(uploadProgress)}%</span>
//               </div>
//               <Progress value={uploadProgress} className="w-full" />
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {/* Data Preview */}
//       {csvData.length > 0 && (
//         <Card className="bg-gradient-to-br from-card to-accent/5">
//           <CardHeader>
//             <CardTitle className="flex items-center justify-between">
//               <span>Data Preview ({csvData.length} products)</span>
//               <div className="flex space-x-2">
//                 <Button variant="outline" size="sm" onClick={previewProducts}>
//                   <Eye className="h-4 w-4 mr-2" />
//                   Preview All
//                 </Button>
//                 <Button variant="outline" size="sm" onClick={clearData}>
//                   <Trash2 className="h-4 w-4 mr-2" />
//                   Clear
//                 </Button>
//               </div>
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ScrollArea className="h-96 w-full">
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Status</TableHead>
//                     <TableHead>Name</TableHead>
//                     <TableHead>Category</TableHead>
//                     <TableHead>Price</TableHead>
//                     <TableHead>Stock</TableHead>
//                     <TableHead>SKU</TableHead>
//                     <TableHead>Errors</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {csvData.map((product, index) => (
//                     <TableRow key={index}>
//                       <TableCell>
//                         {!product.errors || product.errors.length === 0 ? (
//                           <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
//                             <CheckCircle className="h-3 w-3 mr-1" />
//                             Valid
//                           </Badge>
//                         ) : (
//                           <Badge variant="destructive">
//                             <XCircle className="h-3 w-3 mr-1" />
//                             Invalid
//                           </Badge>
//                         )}
//                       </TableCell>
//                       <TableCell className="font-medium">{product.name}</TableCell>
//                       <TableCell>{product.category}</TableCell>
//                       <TableCell>${product.price}</TableCell>
//                       <TableCell>{product.stock}</TableCell>
//                       <TableCell>{product.sku}</TableCell>
//                       <TableCell>
//                         {product.errors && product.errors.length > 0 && (
//                           <div className="space-y-1">
//                             {product.errors.map((error, errorIndex) => (
//                               <div key={errorIndex} className="flex items-center space-x-1">
//                                 <AlertTriangle className="h-3 w-3 text-red-500" />
//                                 <span className="text-xs text-red-600">{error}</span>
//                               </div>
//                             ))}
//                           </div>
//                         )}
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </ScrollArea>
//           </CardContent>
//         </Card>
//       )}

//       {/* Action Buttons */}
//       {csvData.length > 0 && uploadStats.valid > 0 && (
//         <div className="flex justify-end space-x-4">
//           {uploadStats.invalid > 0 && (
//             <Alert className="flex-1">
//               <AlertTriangle className="h-4 w-4" />
//               <AlertDescription>
//                 {uploadStats.invalid} products have validation errors and will be skipped during upload.
//               </AlertDescription>
//             </Alert>
//           )}
//           <Button
//             onClick={uploadProducts}
//             disabled={isUploading || uploadStats.valid === 0}
//             className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
//           >
//             {isUploading ? (
//               <>
//                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
//                 Uploading...
//               </>
//             ) : (
//               <>
//                 <Upload className="h-4 w-4 mr-2" />
//                 Upload {uploadStats.valid} Valid Products
//               </>
//             )}
//           </Button>
//         </div>
//       )}
//     </div>
//   )
// }




// "use client"

// import { useState } from "react"
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Input } from "@/components/ui/input"
// import { Loader2 } from "lucide-react"
// import { BulkUploadClient } from "@/lib/utils/bulk-upload-client"
// import { ApiClient } from "@/lib/utils/api-client"

// // Same categories as before
// const categories = ["Accessories", "Decoration", "Fashion", "Meditation", "HomeLiving"] as const

// export default function BulkProductUploader() {
//   const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
//   const [file, setFile] = useState<File | null>(null)
//   const [isSubmitting, setIsSubmitting] = useState(false)

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files?.length) {
//       setFile(e.target.files[0])
//     }
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!selectedCategory) {
//       alert("Please select a category")
//       return
//     }
//     if (!file) {
//       alert("Please upload a CSV file")
//       return
//     }

//     const formData = new FormData()
//     formData.append("category", selectedCategory)
//     formData.append("file", file)

//     try {
//       setIsSubmitting(true)
//       console.log("Uploading bulk products for:", selectedCategory)

//       // 🔹 You’ll give me backend endpoint later (replace /bulk-upload)
//       const response = await fetch("/bulk-upload", {
//         method: "POST",
//         body: formData,
//       })

//       if (!response.ok) throw new Error("Upload failed")

//       alert("CSV uploaded successfully!")
//       setFile(null)
//       setSelectedCategory(null)
//     } catch (error) {
//       console.error("❌ Bulk upload failed:", error)
//       alert("Upload failed: " + (error as Error).message)
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       <Card>
//         <CardHeader>
//           <CardTitle>Select Category</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <Select onValueChange={(value) => setSelectedCategory(value)}>
//             <SelectTrigger>
//               <SelectValue placeholder="Choose a category" />
//             </SelectTrigger>
//             <SelectContent>
//               {categories.map((cat) => (
//                 <SelectItem key={cat} value={cat}>
//                   {cat}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader>
//           <CardTitle>Upload CSV File</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <Label htmlFor="file">CSV File</Label>
//           <Input id="file" type="file" accept=".csv" onChange={handleFileChange} />
//         </CardContent>
//       </Card>

//       <div className="flex justify-end gap-4">
//         <Button type="submit" disabled={isSubmitting}>
//           {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//           Upload
//         </Button>
//       </div>
//     </form>
//   )
// }


"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { BulkUploadClient } from "@/lib/utils/bulk-upload-client"

// Same categories as before
const categories = ["accessories", "decorations", "fashion", "meditation", "homeAndLiving"] as const

export default function BulkProductUploader() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCategory) {
      alert("Please select a category")
      return
    }
    if (!file) {
      alert("Please upload a CSV file")
      return
    }

    try {
      setIsSubmitting(true)
      console.log("Uploading bulk products for:", selectedCategory)

      // 🔹 Use BulkUploadClient here
      const response = await BulkUploadClient.uploadCSV(selectedCategory, file)

      if (!response.ok) throw new Error("Upload failed")

      alert("CSV uploaded successfully!")
      setFile(null)
      setSelectedCategory(null)
    } catch (error) {
      console.error("❌ Bulk upload failed:", error)
      alert("Upload failed: " + (error as Error).message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Select Category</CardTitle>
        </CardHeader>
        <CardContent>
          <Select onValueChange={(value) => setSelectedCategory(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upload CSV File</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="file">CSV File</Label>
          <Input id="file" type="file" accept=".csv" onChange={handleFileChange} />
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Upload
        </Button>
      </div>
    </form>
  )
}
