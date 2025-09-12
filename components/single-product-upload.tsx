// "use client"

// import { useState } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// // import { Switch } from "@/components/ui/switch"
// import { Badge } from "@/components/ui/badge"
// import { Loader2, X } from "lucide-react"
// import { ApiClient } from "@/lib/utils/api-client"

// // Physical categories only for now
// const physicalCategories = ["Accessories", "Decoration", "Fashion", "Meditation" , "HomeLiving"] as const

// // Validation function
// function validateProduct(data: typeof initialPhysicalProductData) {
//   const errors: string[] = []

//   if (!data.title.trim()) errors.push("Title is required")
//   if (!data.description.trim()) errors.push("Description is required")
//   if (!data.sku.trim()) errors.push("SKU is required")

//   if (!data.price.trim()) {
//     errors.push("Price is required")
//   } else if (isNaN(Number(data.price))) {
//     errors.push("Price must be numeric")
//   }

//   if (!data.stock.trim()) {
//     errors.push("Stock is required")
//   } else if (!Number.isInteger(Number(data.stock))) {
//     errors.push("Stock must be an integer")
//   }

//   if (data.discount && isNaN(Number(data.discount))) {
//     errors.push("Discount must be numeric if provided")
//   }

//   return errors
// }

// // Initial state for physical product
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
//   isAvailable: true,
//   returnPolicy: "",
//   images: [] as string[],
// }

// export default function SingleProductUploader() {
//   const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [newTag, setNewTag] = useState("")
//   const [physicalProductData, setPhysicalProductData] = useState(initialPhysicalProductData)

//   // const handlePhysicalProductChange = (field: string, value: any) => {
//   //   setPhysicalProductData((prev) => ({ ...prev, [field]: value }))
//   // }
//   const handlePhysicalProductChange = (field: keyof typeof initialPhysicalProductData, value: string | string[] | boolean) => {
//     setPhysicalProductData((prev) => ({ ...prev, [field]: value }))
//   }

//   const addTag = () => {
//     if (newTag.trim() && !physicalProductData.tags.includes(newTag.trim())) {
//       setPhysicalProductData((prev) => ({
//         ...prev,
//         tags: [...prev.tags, newTag.trim()],
//       }))
//     }
//     setNewTag("")
//   }

//   const removeTag = (tag: string) => {
//     setPhysicalProductData((prev) => ({
//       ...prev,
//       tags: prev.tags.filter((t) => t !== tag),
//     }))
//   }

//   const resetForm = () => {
//     setPhysicalProductData(initialPhysicalProductData)
//     setNewTag("")
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     const errors = validateProduct(physicalProductData)
//     if (errors.length > 0) {
//       alert("Fix errors:\n" + errors.join("\n"))
//       return
//     }
// // "data": {
// //         "id": 5,
// //         "stock": 3,
// //         "title": "abc decoration 2",
// //         "description": "abc is mybnm",
// //         "price": 45,
// //         "tags": [],
// //         "sku": "96969",
// //         "images": [],
// //         "createdAt": "2025-09-11T07:35:21.950Z",
// //         "updatedAt": "2025-09-11T07:35:21.950Z",
// //         "isDelete": false,
// //         "userId": "cmfbfaui90000uoqcymzeicfd"
// //     }
//     const payload = {
//       title: physicalProductData.title.trim(),
//       description: physicalProductData.description.trim(),
//       price: physicalProductData.price,
//       stock: physicalProductData.stock,
//       sku: physicalProductData.sku.trim(),
//       tags: physicalProductData.tags.length > 0 ? physicalProductData.tags : undefined,
//       // images:  []
//     }

//     let endpoint = ""
//     switch (selectedCategory) {
//       case "Decoration":
//         endpoint = "/decoration"
//         break
//       case "HomeLiving":
//         endpoint = "/living"
//         break
//       case "Accessories":
//         endpoint = "/accessories"
//         break
//       case "Meditation":
//         endpoint = "/meditation"
//         break
//       case "Fashion":
//         endpoint = "/fashion"
//         break
//       // case "Home & Living":
//       //   endpoint = "/home-living" // adjust if backend expects different slug
//       //   break
//       default:
//         alert("Invalid category selected")
//         return
//     }

//     try {
//       setIsSubmitting(true)
//       console.log("Submitting to", endpoint, "with data:", payload)
//       const response = await ApiClient.postJson(endpoint, payload, true)
//       console.log("✅ Created:", response)
//       alert("Product uploaded successfully!")
//       resetForm()
//       setSelectedCategory(null)
//     } catch (error) {
//       console.error("❌ Upload failed:", error)
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
//               {physicalCategories.map((cat) => (
//                 <SelectItem key={cat} value={cat}>
//                   {cat}
//                 </SelectItem>
//               ))}
//               {/* DigitalBook option removed for now */}
//             </SelectContent>
//           </Select>
//         </CardContent>
//       </Card>

//       {selectedCategory && (
//         <>
//           <Card>
//             <CardHeader>
//               <CardTitle>Basic Information</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div>
//                 <Label>Product Title</Label>
//                 <Input
//                   value={physicalProductData.title}
//                   onChange={(e) => handlePhysicalProductChange("title", e.target.value)}
//                   required
//                 />
//               </div>
//               <div>
//                 <Label>SKU</Label>
//                 <Input
//                   value={physicalProductData.sku}
//                   onChange={(e) => handlePhysicalProductChange("sku", e.target.value)}
//                   required
//                 />
//               </div>
//               <div>
//                 <Label>Description</Label>
//                 <Textarea
//                   value={physicalProductData.description}
//                   onChange={(e) => handlePhysicalProductChange("description", e.target.value)}
//                   required
//                 />
//               </div>
//             </CardContent>
//           </Card>

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
//                   onChange={(e) => handlePhysicalProductChange("price", e.target.value)}
//                   required
//                 />
//               </div>
//               <div>
//                 <Label>Stock</Label>
//                 <Input
//                   type="number"
//                   value={physicalProductData.stock}
//                   onChange={(e) => handlePhysicalProductChange("stock", e.target.value)}
//                   required
//                 />
//               </div>
//               {/* <div>
//                 <Label>Discount</Label>
//                 <Input
//                   type="number"
//                   value={physicalProductData.discount}
//                   onChange={(e) => handlePhysicalProductChange("discount", e.target.value)}
//                 />
//               </div> */}
//               {/* <div>
//                 <Label>Delivery Time</Label>
//                 <Input
//                   value={physicalProductData.deliveryTime}
//                   onChange={(e) => handlePhysicalProductChange("deliveryTime", e.target.value)}
//                 />
//               </div>
//               <div className="flex items-center space-x-2">
//                 <Switch
//                   checked={physicalProductData.isAvailable}
//                   onCheckedChange={(checked) => handlePhysicalProductChange("isAvailable", checked)}
//                 />
//                 <Label>Available</Label>
//               </div> */}
//             </CardContent>
//           </Card>

//           {/* <Card>
//             <CardHeader>
//               <CardTitle>Additional Details</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div>
//                 <Label>Note</Label>
//                 <Textarea
//                   value={physicalProductData.note}
//                   onChange={(e) => handlePhysicalProductChange("note", e.target.value)}
//                 />
//               </div>
//               <div>
//                 <Label>Return Policy</Label>
//                 <Textarea
//                   value={physicalProductData.returnPolicy}
//                   onChange={(e) => handlePhysicalProductChange("returnPolicy", e.target.value)}
//                 />
//               </div>
//             </CardContent>
//           </Card> */}

//           <Card>
//             <CardHeader>
//               <CardTitle>Tags</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="flex flex-wrap gap-2 mb-2">
//                 {physicalProductData.tags.map((tag) => (
//                   <Badge key={tag} variant="secondary" className="flex items-center gap-1">
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
//                   onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
//                 />
//                 <Button type="button" onClick={addTag}>
//                   Add
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>

//           <div className="flex justify-end gap-4">
//             <Button type="submit" disabled={isSubmitting}>
//               {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//               Upload
//             </Button>
//           </div>
//         </>
//       )}
//     </form>
//   )
// }

"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, X, Upload } from "lucide-react";
import { ApiClient } from "@/lib/utils/api-client";

// Physical categories only for now
const physicalCategories = [
  "Accessories",
  "Decoration",
  "Fashion",
  "Meditation",
  "HomeLiving",
] as const;

// Validation function
function validateProduct(data: typeof initialPhysicalProductData) {
  const errors: string[] = [];

  if (!data.title.trim()) errors.push("Title is required");
  if (!data.description.trim()) errors.push("Description is required");
  if (!data.sku.trim()) errors.push("SKU is required");

  if (!data.price.trim()) {
    errors.push("Price is required");
  } else if (isNaN(Number(data.price))) {
    errors.push("Price must be numeric");
  }

  if (!data.stock.trim()) {
    errors.push("Stock is required");
  } else if (!Number.isInteger(Number(data.stock))) {
    errors.push("Stock must be an integer");
  }

  if (data.discount && isNaN(Number(data.discount))) {
    errors.push("Discount must be numeric if provided");
  }

  return errors;
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
  images: [] as File[], // Changed to File[] instead of string[]
};

export default function SingleProductUploader() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [physicalProductData, setPhysicalProductData] = useState(
    initialPhysicalProductData
  );
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handlePhysicalProductChange = (
    field: keyof typeof initialPhysicalProductData,
    value: string | string[] | boolean | File[]
  ) => {
    setPhysicalProductData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle image selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // Validate file types
    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        alert(`${file.name} is not an image file`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      // Update images state
      const newImages = [...physicalProductData.images, ...validFiles];
      handlePhysicalProductChange("images", newImages);

      // Create previews for new images
      validFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreviews((prev) => [...prev, e.target?.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }

    // Reset file input
    e.target.value = "";
  };

  // Remove image
  const removeImage = (index: number) => {
    const newImages = physicalProductData.images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);

    handlePhysicalProductChange("images", newImages);
    setImagePreviews(newPreviews);
  };

  const addTag = () => {
    if (newTag.trim() && !physicalProductData.tags.includes(newTag.trim())) {
      setPhysicalProductData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
    }
    setNewTag("");
  };

  const removeTag = (tag: string) => {
    setPhysicalProductData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const resetForm = () => {
    setPhysicalProductData(initialPhysicalProductData);
    setNewTag("");
    setImagePreviews([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateProduct(physicalProductData);
    if (errors.length > 0) {
      alert("Fix errors:\n" + errors.join("\n"));
      return;
    }

    // Create FormData instead of JSON payload
    const formData = new FormData();

    // Append basic fields
    formData.append("title", physicalProductData.title.trim());
    formData.append("description", physicalProductData.description.trim());
    formData.append("price", physicalProductData.price);
    formData.append("stock", physicalProductData.stock);
    formData.append("sku", physicalProductData.sku.trim());

    // Append tags as JSON string or individually
    if (physicalProductData.tags.length > 0) {
      // Option 1: As JSON string
      formData.append("tags", JSON.stringify(physicalProductData.tags));

      // Option 2: Individual tags (uncomment if backend expects this format)
      // physicalProductData.tags.forEach(tag => {
      //   formData.append('tags[]', tag)
      // })
    }

    // Append image files
    // physicalProductData.images.forEach((file, index) => {
    //   formData.append('images', file, file.name)
    // })
    physicalProductData.images.forEach((file) => {
      formData.append("images", file, file.name);
    });

    let endpoint = "";
    switch (selectedCategory) {
      case "Decoration":
        endpoint = "/decoration";
        break;
      case "HomeLiving":
        endpoint = "/living";
        break;
      case "Accessories":
        endpoint = "/accessories";
        break;
      case "Meditation":
        endpoint = "/meditation";
        break;
      case "Fashion":
        endpoint = "/fashion";
        break;
      default:
        alert("Invalid category selected");
        return;
    }

    try {
      setIsSubmitting(true);
      console.log("Submitting to", endpoint, "with FormData");

      // Log FormData contents for debugging
      for (const [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const response = await ApiClient.postFormData(endpoint, formData, true);
      console.log("✅ Created:", response);
      alert("Product uploaded successfully!");
      resetForm();
      setSelectedCategory(null);
    } catch (error) {
      console.error("❌ Upload failed:", error);
      alert("Upload failed: " + (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

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
                  onChange={(e) =>
                    handlePhysicalProductChange("title", e.target.value)
                  }
                  required
                />
              </div>
              <div>
                <Label>SKU</Label>
                <Input
                  value={physicalProductData.sku}
                  onChange={(e) =>
                    handlePhysicalProductChange("sku", e.target.value)
                  }
                  required
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={physicalProductData.description}
                  onChange={(e) =>
                    handlePhysicalProductChange("description", e.target.value)
                  }
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
                  onChange={(e) =>
                    handlePhysicalProductChange("price", e.target.value)
                  }
                  required
                />
              </div>
              <div>
                <Label>Stock</Label>
                <Input
                  type="number"
                  value={physicalProductData.stock}
                  onChange={(e) =>
                    handlePhysicalProductChange("stock", e.target.value)
                  }
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Image Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Upload Images</Label>
                <div className="mt-2">
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageSelect}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-4 text-gray-500" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div>
                  <Label>Selected Images ({imagePreviews.length})</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg">
                          {physicalProductData.images[index]?.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-2">
                {physicalProductData.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
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
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addTag())
                  }
                />
                <Button type="button" onClick={addTag}>
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Upload Product
            </Button>
          </div>
        </>
      )}
    </form>
  );
}
