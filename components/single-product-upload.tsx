"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Loader2, X } from "lucide-react"
import { ApiClient } from "@/lib/utils/api-client"

// Physical categories only for now
const physicalCategories = ["Accessories", "Decoration", "Fashion", "Meditation" , "HomeLiving"] as const

// Validation function
function validateProduct(data: typeof initialPhysicalProductData) {
  const errors: string[] = []

  if (!data.title.trim()) errors.push("Title is required")
  if (!data.description.trim()) errors.push("Description is required")
  if (!data.sku.trim()) errors.push("SKU is required")

  if (!data.price.trim()) {
    errors.push("Price is required")
  } else if (isNaN(Number(data.price))) {
    errors.push("Price must be numeric")
  }

  if (!data.stock.trim()) {
    errors.push("Stock is required")
  } else if (!Number.isInteger(Number(data.stock))) {
    errors.push("Stock must be an integer")
  }

  if (data.discount && isNaN(Number(data.discount))) {
    errors.push("Discount must be numeric if provided")
  }

  return errors
}

// Initial state for physical product
const initialPhysicalProductData = {
  title: "",
  description: "",
  price: "",
  stock: "",
  tags: [] as string[],
  sku: "",
  discount: "",
  deliveryTime: "",
  note: "",
  isAvailable: true,
  returnPolicy: "",
  images: [] as string[],
}

export default function SingleProductUploader() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newTag, setNewTag] = useState("")
  const [physicalProductData, setPhysicalProductData] = useState(initialPhysicalProductData)

  // const handlePhysicalProductChange = (field: string, value: any) => {
  //   setPhysicalProductData((prev) => ({ ...prev, [field]: value }))
  // }
  const handlePhysicalProductChange = (field: keyof typeof initialPhysicalProductData, value: string | string[] | boolean) => {
    setPhysicalProductData((prev) => ({ ...prev, [field]: value }))
  }

  const addTag = () => {
    if (newTag.trim() && !physicalProductData.tags.includes(newTag.trim())) {
      setPhysicalProductData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }))
    }
    setNewTag("")
  }

  const removeTag = (tag: string) => {
    setPhysicalProductData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }))
  }

  const resetForm = () => {
    setPhysicalProductData(initialPhysicalProductData)
    setNewTag("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const errors = validateProduct(physicalProductData)
    if (errors.length > 0) {
      alert("Fix errors:\n" + errors.join("\n"))
      return
    }
// "data": {
//         "id": 5,
//         "stock": 3,
//         "title": "abc decoration 2",
//         "description": "abc is mybnm",
//         "price": 45,
//         "tags": [],
//         "sku": "96969",
//         "images": [],
//         "createdAt": "2025-09-11T07:35:21.950Z",
//         "updatedAt": "2025-09-11T07:35:21.950Z",
//         "isDelete": false,
//         "userId": "cmfbfaui90000uoqcymzeicfd"
//     }
    const payload = {
      title: physicalProductData.title.trim(),
      description: physicalProductData.description.trim(),
      price: physicalProductData.price,
      stock: physicalProductData.stock,
      sku: physicalProductData.sku.trim(),
      tags: physicalProductData.tags.length > 0 ? physicalProductData.tags : undefined,
      // images:  []
    }

    let endpoint = ""
    switch (selectedCategory) {
      case "Decoration":
        endpoint = "/decoration"
        break
      case "HomeLiving":
        endpoint = "/living"
        break
      case "Accessories":
        endpoint = "/accessories"
        break
      case "Meditation":
        endpoint = "/meditation"
        break
      case "Fashion":
        endpoint = "/fashion"
        break
      // case "Home & Living":
      //   endpoint = "/home-living" // adjust if backend expects different slug
      //   break
      default:
        alert("Invalid category selected")
        return
    }

    try {
      setIsSubmitting(true)
      console.log("Submitting to", endpoint, "with data:", payload)
      const response = await ApiClient.postJson(endpoint, payload, true)
      console.log("✅ Created:", response)
      alert("Product uploaded successfully!")
      resetForm()
      setSelectedCategory(null)
    } catch (error) {
      console.error("❌ Upload failed:", error)
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
              {physicalCategories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
              {/* DigitalBook option removed for now */}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedCategory && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Product Title</Label>
                <Input
                  value={physicalProductData.title}
                  onChange={(e) => handlePhysicalProductChange("title", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>SKU</Label>
                <Input
                  value={physicalProductData.sku}
                  onChange={(e) => handlePhysicalProductChange("sku", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={physicalProductData.description}
                  onChange={(e) => handlePhysicalProductChange("description", e.target.value)}
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing & Inventory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Price</Label>
                <Input
                  type="number"
                  value={physicalProductData.price}
                  onChange={(e) => handlePhysicalProductChange("price", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>Stock</Label>
                <Input
                  type="number"
                  value={physicalProductData.stock}
                  onChange={(e) => handlePhysicalProductChange("stock", e.target.value)}
                  required
                />
              </div>
              {/* <div>
                <Label>Discount</Label>
                <Input
                  type="number"
                  value={physicalProductData.discount}
                  onChange={(e) => handlePhysicalProductChange("discount", e.target.value)}
                />
              </div> */}
              {/* <div>
                <Label>Delivery Time</Label>
                <Input
                  value={physicalProductData.deliveryTime}
                  onChange={(e) => handlePhysicalProductChange("deliveryTime", e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={physicalProductData.isAvailable}
                  onCheckedChange={(checked) => handlePhysicalProductChange("isAvailable", checked)}
                />
                <Label>Available</Label>
              </div> */}
            </CardContent>
          </Card>

          {/* <Card>
            <CardHeader>
              <CardTitle>Additional Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Note</Label>
                <Textarea
                  value={physicalProductData.note}
                  onChange={(e) => handlePhysicalProductChange("note", e.target.value)}
                />
              </div>
              <div>
                <Label>Return Policy</Label>
                <Textarea
                  value={physicalProductData.returnPolicy}
                  onChange={(e) => handlePhysicalProductChange("returnPolicy", e.target.value)}
                />
              </div>
            </CardContent>
          </Card> */}

          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-2">
                {physicalProductData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)}>
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add tag"
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag}>
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Upload
            </Button>
          </div>
        </>
      )}
    </form>
  )
}

// "use client";

// import { useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Badge } from "@/components/ui/badge";
// import { Loader2, X } from "lucide-react";
// import { ApiClient } from "@/lib/utils/api-client";

// // Physical categories only
// const physicalCategories = [
//   "Accessories",
//   "Decoration",
//   "Fashion",
//   "Meditation",
// ];

// // Initial state
// const initialPhysicalProductData = {
//   title: "",
//   description: "",
//   price: "",
//   stock: "",
//   tags: [] as string[],
//   sku: "",
//   discount: "",
//   deliveryTime: "",
//   note: "",
//   isAvailable: "true", // string now
//   returnPolicy: "",
//   images: [] as string[],
//   overviewImages: [] as File[],
//   // new
//   coverImage: null as File | null,
//   fileType: "", // new
// };

// // Validation function
// function validateProduct(data: typeof initialPhysicalProductData) {
//   const errors: string[] = [];

//   if (!data.title.trim()) errors.push("Title is required");
//   if (!data.description.trim()) errors.push("Description is required");
//   if (!data.sku.trim()) errors.push("SKU is required");

//   if (!data.price.trim()) {
//     errors.push("Price is required");
//   } else if (isNaN(Number(data.price))) {
//     errors.push("Price must be numeric");
//   }

//   if (data.stock && !Number.isInteger(Number(data.stock))) {
//     errors.push("Stock must be an integer if provided");
//   }

//   if (data.discount && isNaN(Number(data.discount))) {
//     errors.push("Discount must be numeric if provided");
//   }

//   return errors;
// }

// export default function SingleProductUploader() {
//   const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [newTag, setNewTag] = useState("");
//   const [physicalProductData, setPhysicalProductData] = useState(
//     initialPhysicalProductData
//   );

//   const handlePhysicalProductChange = (field: string, value: any) => {
//     setPhysicalProductData((prev) => ({ ...prev, [field]: value }));
//   };

//   const addTag = () => {
//     if (newTag.trim() && !physicalProductData.tags.includes(newTag.trim())) {
//       setPhysicalProductData((prev) => ({
//         ...prev,
//         tags: [...prev.tags, newTag.trim()],
//       }));
//     }
//     setNewTag("");
//   };

//   const removeTag = (tag: string) => {
//     setPhysicalProductData((prev) => ({
//       ...prev,
//       tags: prev.tags.filter((t) => t !== tag),
//     }));
//   };

//   const resetForm = () => {
//     setPhysicalProductData(initialPhysicalProductData);
//     setNewTag("");
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const errors = validateProduct(physicalProductData);
//     if (errors.length > 0) {
//       alert("Fix errors:\n" + errors.join("\n"));
//       return;
//     }

//     // const payload = {
//     //   title: physicalProductData.title.trim(),
//     //   description: physicalProductData.description.trim(),
//     //   price: physicalProductData.price,
//     //   stock: physicalProductData.stock || undefined,
//     //   sku: physicalProductData.sku.trim(),
//     //   tags:
//     //     physicalProductData.tags.length > 0
//     //       ? physicalProductData.tags
//     //       : undefined,
//     //   discount: physicalProductData.discount || undefined,
//     //   deliveryTime: physicalProductData.deliveryTime || undefined,
//     //   note: physicalProductData.note || undefined,
//     //   isAvailable: physicalProductData.isAvailable, // string
//     //   returnPolicy: physicalProductData.returnPolicy || undefined,
//     //   coverImage: physicalProductData.coverImage || undefined,
//     //   overviewImages:
//     //     physicalProductData.overviewImages.length > 0
//     //       ? physicalProductData.overviewImages
//     //       : undefined,
//     //   fileType: physicalProductData.fileType || undefined,
//     // };
//     const formData = new FormData();

//     formData.append("title", physicalProductData.title.trim());
//     formData.append("description", physicalProductData.description.trim());
//     formData.append("price", physicalProductData.price);
//     if (physicalProductData.stock)
//       formData.append("stock", physicalProductData.stock);
//     formData.append("sku", physicalProductData.sku.trim());
//     if (physicalProductData.tags.length > 0)
//       physicalProductData.tags.forEach((tag) => formData.append("tags[]", tag));
//     if (physicalProductData.discount)
//       formData.append("discount", physicalProductData.discount);
//     if (physicalProductData.deliveryTime)
//       formData.append("deliveryTime", physicalProductData.deliveryTime);
//     if (physicalProductData.note)
//       formData.append("note", physicalProductData.note);
//     formData.append("isAvailable", physicalProductData.isAvailable);
//     if (physicalProductData.returnPolicy)
//       formData.append("returnPolicy", physicalProductData.returnPolicy);
//     if (physicalProductData.coverImage)
//       formData.append("coverImage", physicalProductData.coverImage);
//     if (physicalProductData.overviewImages.length > 0)
//       physicalProductData.overviewImages.forEach((file) =>
//         formData.append("overviewImages[]", file)
//       );
//     formData.append("fileType", physicalProductData.fileType);

//     let endpoint = "";
//     switch (selectedCategory) {
//       case "Decoration":
//         endpoint = "/decoration";
//         break;
//       case "Accessories":
//         endpoint = "/accessories";
//         break;
//       case "Meditation":
//         endpoint = "/meditation";
//         break;
//       case "Fashion":
//         endpoint = "/fashion";
//         break;
//       default:
//         alert("Invalid category selected");
//         return;
//     }

//     try {
//       setIsSubmitting(true);
//       console.log("Submitting to", endpoint, "with data:", formData);
//       const response = await ApiClient.postFormData(endpoint, formData, true);
//       console.log("✅ Created:", response);
//       alert("Product uploaded successfully!");
//       resetForm();
//       setSelectedCategory(null);
//     } catch (error) {
//       console.error("❌ Upload failed:", error);
//       alert("Upload failed: " + (error as Error).message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       {/* Category selection */}
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
//               {physicalCategories.map((cat) => (
//                 <SelectItem key={cat} value={cat}>
//                   {cat}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </CardContent>
//       </Card>

//       {/* Form fields */}
//       {selectedCategory && (
//         <>
//           {/* Basic Information */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Basic Information</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div>
//                 <Label>Product Title</Label>
//                 <Input
//                   value={physicalProductData.title}
//                   onChange={(e) =>
//                     handlePhysicalProductChange("title", e.target.value)
//                   }
//                   required
//                 />
//               </div>
//               <div>
//                 <Label>SKU</Label>
//                 <Input
//                   value={physicalProductData.sku}
//                   onChange={(e) =>
//                     handlePhysicalProductChange("sku", e.target.value)
//                   }
//                   required
//                 />
//               </div>
//               <div>
//                 <Label>Description</Label>
//                 <Textarea
//                   value={physicalProductData.description}
//                   onChange={(e) =>
//                     handlePhysicalProductChange("description", e.target.value)
//                   }
//                   required
//                 />
//               </div>
//             </CardContent>
//           </Card>

//           {/* Pricing & Inventory */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Pricing & Inventory</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div>
//                 <Label>Price</Label>
//                 <Input
//                   type="number"
//                   value={physicalProductData.price}
//                   onChange={(e) =>
//                     handlePhysicalProductChange("price", e.target.value)
//                   }
//                   required
//                 />
//               </div>
//               <div>
//                 <Label>Stock</Label>
//                 <Input
//                   type="number"
//                   value={physicalProductData.stock}
//                   onChange={(e) =>
//                     handlePhysicalProductChange("stock", e.target.value)
//                   }
//                 />
//               </div>
//               <div>
//                 <Label>Discount</Label>
//                 <Input
//                   type="number"
//                   value={physicalProductData.discount}
//                   onChange={(e) =>
//                     handlePhysicalProductChange("discount", e.target.value)
//                   }
//                 />
//               </div>
//               <div>
//                 <Label>Delivery Time</Label>
//                 <Input
//                   value={physicalProductData.deliveryTime}
//                   onChange={(e) =>
//                     handlePhysicalProductChange("deliveryTime", e.target.value)
//                   }
//                 />
//               </div>
//               <div>
//                 <Label>Availability</Label>
//                 <Select
//                   value={physicalProductData.isAvailable}
//                   onValueChange={(value) =>
//                     handlePhysicalProductChange("isAvailable", value)
//                   }
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Availability" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="true">Available</SelectItem>
//                     <SelectItem value="false">Not Available</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Additional Details */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Additional Details</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div>
//                 <Label>Note</Label>
//                 <Textarea
//                   value={physicalProductData.note}
//                   onChange={(e) =>
//                     handlePhysicalProductChange("note", e.target.value)
//                   }
//                 />
//               </div>
//               <div>
//                 <Label>Return Policy</Label>
//                 <Textarea
//                   value={physicalProductData.returnPolicy}
//                   onChange={(e) =>
//                     handlePhysicalProductChange("returnPolicy", e.target.value)
//                   }
//                 />
//               </div>
//               {/* <div>
//                 <Label>Cover Image URL</Label>
//                 <Input
//                   value={physicalProductData.coverImage}
//                   onChange={(e) => handlePhysicalProductChange("coverImage", e.target.value)}
//                   placeholder="Enter image URL"
//                 />
//               </div> */}
//               <div>
//                 <Label>Cover Image</Label>
//                 <Input
//                   type="file"
//                   accept="image/*"
//                   onChange={(e) =>
//                     handlePhysicalProductChange(
//                       "coverImage",
//                       e.target.files ? e.target.files[0] : null
//                     )
//                   }
//                   // required
//                 />
//               </div>
//               <div>
//                 <Label>File Type</Label>
//                 <Input
//                   value={physicalProductData.fileType}
//                   onChange={(e) =>
//                     handlePhysicalProductChange("fileType", e.target.value)
//                   }
//                   placeholder="e.g., png, jpeg"
//                   // required
//                 />
//               </div>

//               {/* <div>
//                 <Label>File Type</Label>
//                 <Input
//                   value={physicalProductData.fileType}
//                   onChange={(e) =>
//                     handlePhysicalProductChange("fileType", e.target.value)
//                   }
//                   placeholder="e.g., pdf, epub"
//                 />
//               </div> */}
//               {/* <div>
//                 <Label>Overview Images</Label>
//                 <div className="flex flex-col gap-2">
//                   {physicalProductData.overviewImages.map((img, idx) => (
//                     <div key={idx} className="flex items-center gap-2">
//                       <Input
//                         value={img}
//                         onChange={(e) => {
//                           const newImages = [
//                             ...physicalProductData.overviewImages,
//                           ];
//                           newImages[idx] = e.target.value;
//                           handlePhysicalProductChange(
//                             "overviewImages",
//                             newImages
//                           );
//                         }}
//                         placeholder="Enter image URL"
//                       />
//                       <Button
//                         type="button"
//                         onClick={() => {
//                           const newImages =
//                             physicalProductData.overviewImages.filter(
//                               (_, i) => i !== idx
//                             );
//                           handlePhysicalProductChange(
//                             "overviewImages",
//                             newImages
//                           );
//                         }}
//                       >
//                         Remove
//                       </Button>
//                     </div>
//                   ))}
//                   <Button
//                     type="button"
//                     onClick={() =>
//                       handlePhysicalProductChange("overviewImages", [
//                         ...physicalProductData.overviewImages,
//                         "",
//                       ])
//                     }
//                   >
//                     Add Image
//                   </Button>
//                 </div>
//               </div> */}
//               <div>
//                 <Label>Overview Images</Label>
//                 <Input
//                   type="file"
//                   accept="image/*"
//                   multiple
//                   onChange={(e) =>
//                     handlePhysicalProductChange(
//                       "overviewImages",
//                       e.target.files ? Array.from(e.target.files) : []
//                     )
//                   }
//                 />
//               </div>
//             </CardContent>
//           </Card>

//           {/* Tags */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Tags</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="flex flex-wrap gap-2 mb-2">
//                 {physicalProductData.tags.map((tag) => (
//                   <Badge
//                     key={tag}
//                     variant="secondary"
//                     className="flex items-center gap-1"
//                   >
//                     {tag}
//                     <button type="button" onClick={() => removeTag(tag)}>
//                       <X className="w-3 h-3" />
//                     </button>
//                   </Badge>
//                 ))}
//               </div>
//               <div className="flex gap-2">
//                 <Input
//                   value={newTag}
//                   onChange={(e) => setNewTag(e.target.value)}
//                   placeholder="Add tag"
//                   onKeyDown={(e) =>
//                     e.key === "Enter" && (e.preventDefault(), addTag())
//                   }
//                 />
//                 <Button type="button" onClick={addTag}>
//                   Add
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Submit button */}
//           <div className="flex justify-end gap-4">
//             <Button type="submit" disabled={isSubmitting}>
//               {isSubmitting && (
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//               )}
//               Upload
//             </Button>
//           </div>
//         </>
//       )}
//     </form>
//   );
// }
