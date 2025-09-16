// "use client"

// import { useState } from "react"
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Input } from "@/components/ui/input"
// import { Loader2 } from "lucide-react"
// import { BulkUploadClient } from "@/lib/utils/bulk-upload-client"

// // Same categories as before
// const categories = ["accessories", "decorations", "fashion", "meditation", "homeAndLiving"] as const

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

//     try {
//       setIsSubmitting(true)
//       console.log("Uploading bulk products for:", selectedCategory)

//       // 🔹 Use BulkUploadClient here
//       const response = await BulkUploadClient.uploadCSV(selectedCategory, file)

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







// "use client";

// import { useState } from "react";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Input } from "@/components/ui/input";
// import { Loader2, Upload, X, Plus } from "lucide-react";
// import { BulkUploadClient } from "@/lib/utils/bulk-upload-client";
// import { toast } from "sonner";

// const categories = [
//   "accessories",
//   "decorations",
//   "fashion",
//   "meditation",
//   "homeAndLiving",
// ] as const;

// type SkuEntry = {
//   sku: string;
//   images: File[];
//   previews: string[];
// };

// export default function BulkProductUploader() {
//   const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
//   const [file, setFile] = useState<File | null>(null);
//   const [skuEntries, setSkuEntries] = useState<SkuEntry[]>([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files?.length) setFile(e.target.files[0]);
//   };

//   const addSkuEntry = () => {
//     setSkuEntries((prev) => [...prev, { sku: "", images: [], previews: [] }]);
//   };

//   const removeSkuEntry = (index: number) => {
//     setSkuEntries((prev) => prev.filter((_, i) => i !== index));
//   };

//   const updateSkuValue = (index: number, value: string) => {
//     setSkuEntries((prev) => {
//       const updated = [...prev];
//       updated[index].sku = value;
//       return updated;
//     });
//   };

//   const handleSkuImages = (index: number, files: FileList | null) => {
//     if (!files) return;
//     const newFiles = Array.from(files).filter((f) =>
//       f.type.startsWith("image/")
//     );

//     setSkuEntries((prev) => {
//       const updated = [...prev];
//       const entry = updated[index];

//       // Append new files
//       entry.images = [...entry.images, ...newFiles];

//       // Generate previews in one go (no duplicate push inside reader loop)
//       newFiles.forEach((file) => {
//         const reader = new FileReader();
//         reader.onload = (e) => {
//           entry.previews = [...entry.previews, e.target?.result as string];
//           setSkuEntries([...updated]); // update state only once per file
//         };
//         reader.readAsDataURL(file);
//       });

//       return updated;
//     });
//   };

//   const removeSkuImage = (entryIndex: number, imageIndex: number) => {
//     setSkuEntries((prev) => {
//       const updated = [...prev];
//       updated[entryIndex].images = updated[entryIndex].images.filter(
//         (_, i) => i !== imageIndex
//       );
//       updated[entryIndex].previews = updated[entryIndex].previews.filter(
//         (_, i) => i !== imageIndex
//       );
//       return updated;
//     });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!selectedCategory) {
//       toast.error("Please select a category");
//       return;
//     }
//     if (!file) {
//       toast.error("Please upload a CSV file");
//       return;
//     }

//     // ✅ Validation: SKU & images must both be filled
//     for (const entry of skuEntries) {
//       if (
//         (entry.sku && entry.images.length === 0) ||
//         (!entry.sku && entry.images.length > 0)
//       ) {
//         toast.error(
//           "Each SKU must have images, and each set of images must belong to a SKU."
//         );
//         return;
//       }
//     }

//     try {
//       setIsSubmitting(true);

//       const formData = new FormData();
//       formData.append("file", file);

//       skuEntries.forEach((entry, i) => {
//         formData.append(`skus[${i}][sku]`, entry.sku);
//         entry.images.forEach((img) => {
//           formData.append(`skus[${i}][images]`, img, img.name);
//         });
//       });

//       console.log("📦 FormData being sent:");
//       for (const [key, value] of formData.entries()) {
//         console.log(key, value);
//       }

//       const response = await BulkUploadClient.uploadCSV(
//         selectedCategory,
//         formData
//       );

//       if (!response.ok) throw new Error("Upload failed");
//       toast.success("🎉 Upload successful!");

//       setFile(null);
//       setSkuEntries([]);
//       setSelectedCategory(null);
//     } catch (err) {
//       console.error("❌ Upload error:", err);
//       toast.error("❌ Upload failed: " + (err as Error).message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       {/* Category Select */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Select Category</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <Select onValueChange={setSelectedCategory}>
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

//       {/* CSV Upload */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Upload CSV File</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <Label htmlFor="file">CSV File</Label>
//           <Input
//             id="file"
//             type="file"
//             accept=".csv"
//             onChange={handleFileChange}
//           />
//         </CardContent>
//       </Card>

//       {/* SKU + Images Blocks */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Extra Images</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           {skuEntries.map((entry, i) => (
//             <div key={i} className="border p-4 rounded-lg space-y-3">
//               <div className="flex justify-between items-center">
//                 <Label>SKU {i + 1}</Label>
//                 <Button
//                   type="button"
//                   variant="destructive"
//                   size="sm"
//                   onClick={() => removeSkuEntry(i)}
//                 >
//                   Remove
//                 </Button>
//               </div>
//               <Input
//                 placeholder="Enter SKU"
//                 value={entry.sku}
//                 onChange={(e) => updateSkuValue(i, e.target.value)}
//               />

//               <Input
//                 type="file"
//                 accept="image/*"
//                 multiple
//                 onChange={(e) => handleSkuImages(i, e.target.files)}
//               />

//               {entry.previews.length > 0 && (
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                   {entry.previews.map((src, idx) => (
//                     <div key={idx} className="relative group">
//                       <img
//                         src={src}
//                         className="w-full h-24 object-cover rounded"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => removeSkuImage(i, idx)}
//                         className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100"
//                       >
//                         <X className="w-4 h-4" />
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           ))}

//           <Button
//             type="button"
//             variant="outline"
//             onClick={addSkuEntry}
//             className="w-full"
//           >
//             <Plus className="mr-2 h-4 w-4" /> Add Images
//           </Button>
//         </CardContent>
//       </Card>

//       {/* Submit */}
//       <div className="flex justify-end gap-4">
//         <Button type="submit" disabled={isSubmitting}>
//           {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//           Upload
//         </Button>
//       </div>
//     </form>
//   );
// }

"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Loader2, Upload, X } from "lucide-react";
import { BulkUploadClient } from "@/lib/utils/bulk-upload-client";
import { toast } from "sonner";

const categories = [
  "accessories",
  "decorations",
  "fashion",
  "meditation",
  "homeAndLiving",
] as const;

export default function BulkProductUploader() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [sku, setSku] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmittingCSV, setIsSubmittingCSV] = useState(false);
  const [isSubmittingImage, setIsSubmittingImage] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) setFile(e.target.files[0]);
  };



  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type.startsWith("image/")) {
        setImage(selectedFile);
        
        // Create preview
        const reader = new FileReader();
        reader.onload = (event) => {
          setImagePreview(event.target?.result as string);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        toast.error("Please select a valid image file");
      }
    }
  };

  const removeImage = () => {
    setImage(null);
    if (imagePreview) {
      setImagePreview(null);
    }
  };

  const handleCSVSubmit = async () => {
    if (!selectedCategory) {
      toast.error("Please select a category");
      return;
    }
    if (!file) {
      toast.error("Please upload a CSV file");
      return;
    }

    try {
      setIsSubmittingCSV(true);

      const formData = new FormData();
      formData.append("file", file);

      console.log("📦 CSV FormData being sent:");
      for (const [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const response = await BulkUploadClient.uploadCSV(
        selectedCategory,
        formData
      );

      if (!response.ok) throw new Error("CSV Upload failed");
      toast.success("🎉 CSV Upload successful!");

      setFile(null);
      setSelectedCategory(null);
    } catch (err) {
      console.error("❌ CSV Upload error:", err);
      toast.error("❌ CSV Upload failed: " + (err as Error).message);
    } finally {
      setIsSubmittingCSV(false);
    }
  };

  const handleImageSubmit = async () => {
    if (!selectedCategory) {
      toast.error("Please select a category");
      return;
    }

    if (!sku) {
      toast.error("Please enter a SKU");
      return;
    }

    if (!image) {
      toast.error("Please select an image");
      return;
    }

    try {
      setIsSubmittingImage(true);

      const response = await BulkUploadClient.uploadImageBySku(
        selectedCategory,
        sku,
        image
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Image upload failed");
      }

      toast.success("🎉 Image uploaded successfully!");
      
      // Reset form and refresh page
      setSku("");
      setImage(null);
      setImagePreview(null);
      
      // Refresh the page
      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (err) {
      console.error("❌ Image upload error:", err);
      toast.error("❌ Image upload failed: " + (err as Error).message);
    } finally {
      setIsSubmittingImage(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* CSV Bulk Upload Section */}
      <div className="space-y-6">
        {/* Category Select */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-bold text-[#511d5e]">Select Category</CardTitle>
          </CardHeader>
          <CardContent >
            <Select onValueChange={setSelectedCategory}>
              <SelectTrigger >
                <SelectValue placeholder="Choose a category" />
              </SelectTrigger>
              <SelectContent >
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* CSV Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-bold text-[#511d5e]">Upload Multiple Products</CardTitle>
            {/* <p className="text-sm text-muted-foreground">
              Upload multiple products at once using a CSV file. Download the template to get started.
            </p> */}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 gap-4 flex flex-col">
                <Label htmlFor="file"><strong>CSV File</strong></Label>
                <Input
                  className="h-12 px-4 py-3"
                  id="file"
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                />
              </div>
              {/* <div className="flex items-end">
                
              </div> */}
            </div>
          </CardContent>
        </Card>

        {/* CSV Upload Button */}
        <div className="flex justify-end">
          <Button 
            onClick={handleCSVSubmit}
            disabled={isSubmittingCSV}
            className="bg-gradient-to-r from-[#8a5d95] to-[#644c6a] hover:from-[#684670] hover:to-[#644c6a] text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {isSubmittingCSV && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Upload className="mr-2 h-4 w-4" />
            Upload CSV
          </Button>
        </div>
      </div>

      {/* Separator */}
      <div className="border-t border-gray-200 my-8"></div>

      {/* Single SKU Image Upload Section */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-bold text-[#511d5e]">Don&apos;t have image URL?</CardTitle>
            <p className="text-sm text-muted-foreground py-2">
              Upload an image for a specific SKU that was included in your CSV file.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4 ">
              <div className="flex flex-col gap-4">
                <Label htmlFor="sku-input "><strong>Enter SKU</strong></Label>
                <Input
                  className="h-12 px-4 py-3"
                  id="sku-input"
                  placeholder="SKU"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-4 mt-8 ">
                <Label htmlFor="image-input"><strong>Upload Image</strong></Label>
                <Input
                  className="h-12 px-4 py-3"
                  id="image-input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>

              {imagePreview && (
                <div className="relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Upload Button */}
            <div className="flex justify-end pt-4">
              <Button 
                onClick={handleImageSubmit}
                disabled={isSubmittingImage || !sku || !image}
                className="bg-gradient-to-r from-[#8a5d95] to-[#644c6a] hover:from-[#684670] hover:to-[#644c6a] text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isSubmittingImage && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Upload className="mr-2 h-4 w-4" />
                Upload Image
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}