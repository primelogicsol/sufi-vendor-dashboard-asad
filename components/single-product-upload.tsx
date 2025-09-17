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
// import { Loader2, X, Upload } from "lucide-react";
// import { ApiClient } from "@/lib/utils/api-client";

// // Physical categories only for now
// const physicalCategories = [
//   "Accessories",
//   "Decoration",
//   "Fashion",
//   "Meditation",
//   "HomeLiving",
// ] as const;

// // Validation function
// function validateProduct(data: typeof initialPhysicalProductData) {
//   const errors: string[] = [];

//   if (!data.title.trim()) errors.push("Title is required");
//   if (!data.sku.trim()) errors.push("SKU is required");
//   if (!data.price.trim()) {
//     errors.push("Price is required");
//   } else if (isNaN(Number(data.price))) {
//     errors.push("Price must be numeric");
//   }

//   // Stock is optional → validate only if provided
//   if (data.stock && !Number.isInteger(Number(data.stock))) {
//     errors.push("Stock must be an integer if provided");
//   }

//   return errors;
// }

// // Initial state for physical product
// // Initial state for physical product
// const initialPhysicalProductData = {
//   title: "",
//   name: "", // optional
//   color: "", // optional
//   care: "", // optional
//   material: "", // optional
//   shippingTime: "", // optional
//   description: "",
//   price: "",
//   stock: "",
//   tags: [] as string[],
//   sku: "",
//   images: [] as File[],
// };

// export default function SingleProductUploader() {
//   const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [newTag, setNewTag] = useState("");
//   const [physicalProductData, setPhysicalProductData] = useState(
//     initialPhysicalProductData
//   );
//   const [imagePreviews, setImagePreviews] = useState<string[]>([]);

//   const handlePhysicalProductChange = (
//     field: keyof typeof initialPhysicalProductData,
//     value: string | string[] | boolean | File[]
//   ) => {
//     setPhysicalProductData((prev) => ({ ...prev, [field]: value }));
//   };

//   // Handle image selection
//   const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = Array.from(e.target.files || []);

//     // Validate file types
//     const validFiles = files.filter((file) => {
//       if (!file.type.startsWith("image/")) {
//         alert(`${file.name} is not an image file`);
//         return false;
//       }
//       return true;
//     });

//     if (validFiles.length > 0) {
//       // Update images state
//       const newImages = [...physicalProductData.images, ...validFiles];
//       handlePhysicalProductChange("images", newImages);

//       // Create previews for new images
//       validFiles.forEach((file) => {
//         const reader = new FileReader();
//         reader.onload = (e) => {
//           setImagePreviews((prev) => [...prev, e.target?.result as string]);
//         };
//         reader.readAsDataURL(file);
//       });
//     }

//     // Reset file input
//     e.target.value = "";
//   };

//   // Remove image
//   const removeImage = (index: number) => {
//     const newImages = physicalProductData.images.filter((_, i) => i !== index);
//     const newPreviews = imagePreviews.filter((_, i) => i !== index);

//     handlePhysicalProductChange("images", newImages);
//     setImagePreviews(newPreviews);
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
//     setImagePreviews([]);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const errors = validateProduct(physicalProductData);
//     if (errors.length > 0) {
//       alert("Fix errors:\n" + errors.join("\n"));
//       return;
//     }

//     // Create FormData instead of JSON payload
//     const formData = new FormData();

//     // Required
//     formData.append("title", physicalProductData.title.trim());
//     formData.append("sku", physicalProductData.sku.trim());
//     formData.append("price", physicalProductData.price);

//     // Optional (only append if provided)
//     if (physicalProductData.name.trim()) {
//       formData.append("name", physicalProductData.name.trim());
//     }
//     if (physicalProductData.color.trim()) {
//       formData.append("color", physicalProductData.color.trim());
//     }
//     if (physicalProductData.care.trim()) {
//       formData.append("care", physicalProductData.care.trim());
//     }
//     if (physicalProductData.material.trim()) {
//       formData.append("material", physicalProductData.material.trim());
//     }
//     if (physicalProductData.shippingTime.trim()) {
//       formData.append("shippingTime", physicalProductData.shippingTime.trim());
//     }
//     if (physicalProductData.description.trim()) {
//       formData.append("description", physicalProductData.description.trim());
//     }
//     if (physicalProductData.stock) {
//       formData.append("stock", physicalProductData.stock);
//     }

//     // Tags

//     if (physicalProductData.tags.length > 0) {
//       physicalProductData.tags.forEach((tag) => {
//         formData.append("tags", tag);
//       });
//     }

//     // Images
//     physicalProductData.images.forEach((file) => {
//       formData.append("images", file, file.name);
//     });

//     let endpoint = "";
//     switch (selectedCategory) {
//       case "Decoration":
//         endpoint = "/decoration";
//         break;
//       case "HomeLiving":
//         endpoint = "/living";
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
//       console.log("Submitting to", endpoint, "with FormData", formData);

//       // Log FormData contents for debugging
//       for (const [key, value] of formData.entries()) {
//         console.log(key, value);
//       }

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
//       <Card>
//         <CardHeader>
//           <CardTitle className="text-lg text-bold text-[#511d5e]">
//             Select Category
//           </CardTitle>
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

//       {selectedCategory && (
//         <>
//           <Card>
//             <CardHeader>
//               <CardTitle className="text-lg  text-bold text-[#511d5e]">
//                 Basic Information
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4 ">
//               <div className="flex flex-col gap-2">
//                 <Label>
//                   <strong>Product Title</strong>
//                 </Label>
//                 <Input
//                   className="h-12 px-4 py-3 bg-white/30 border-gray-300 text-gray-900 placeholder:text-gray-500 transition-all duration-300 focus:bg-gradient-to-r focus:from-[#8a5d95]/20 focus:to-[#644c6a]/20 focus:border-[#8a5d95] focus:text-black focus:placeholder:text-white/50 focus:ring-2 focus:ring-[#8a5d95]/50 focus:shadow-xl focus:backdrop-blur-sm hover:border-gray-400"
//                   value={physicalProductData.title}
//                   onChange={(e) =>
//                     handlePhysicalProductChange("title", e.target.value)
//                   }
//                   required
//                 />
//               </div>
//               <div className="flex flex-col gap-2">
//                 <Label>
//                   <strong>SKU</strong>
//                 </Label>
//                 <Input
//                   className="h-12 px-4 py-3 bg-white/30 border-gray-300 text-gray-900 placeholder:text-gray-500 transition-all duration-300 focus:bg-gradient-to-r focus:from-[#8a5d95]/20 focus:to-[#644c6a]/20 focus:border-[#8a5d95] focus:text-black focus:placeholder:text-white/50 focus:ring-2 focus:ring-[#8a5d95]/50 focus:shadow-xl focus:backdrop-blur-sm hover:border-gray-400"
//                   value={physicalProductData.sku}
//                   onChange={(e) =>
//                     handlePhysicalProductChange("sku", e.target.value)
//                   }
//                   required
//                 />
//               </div>
//               <div className="flex flex-col gap-2">
//                 <Label>
//                   <strong>Description</strong>
//                 </Label>
//                 <Textarea
//                   className="h-12 px-4 py-3 bg-white/30 border-gray-300 text-gray-900 placeholder:text-gray-500 transition-all duration-300 focus:bg-gradient-to-r focus:from-[#8a5d95]/20 focus:to-[#644c6a]/20 focus:border-[#8a5d95] focus:text-black focus:placeholder:text-white/50 focus:ring-2 focus:ring-[#8a5d95]/50 focus:shadow-xl focus:backdrop-blur-sm hover:border-gray-400"
//                   value={physicalProductData.description}
//                   onChange={(e) =>
//                     handlePhysicalProductChange("description", e.target.value)
//                   }
//                   required
//                 />
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader>
//               <CardTitle className="text-lg text-bold text-[#511d5e]">
//                 Additional Information
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               {/* Name */}
//               <div className="flex flex-col gap-2">
//                 <Label>
//                   <strong>Name </strong>
//                 </Label>
//                 <Input
//                   className="h-12 px-4 py-3 bg-white/30 border-gray-300 text-gray-900 placeholder:text-gray-500 
//           transition-all duration-300 focus:bg-gradient-to-r focus:from-[#8a5d95]/20 focus:to-[#644c6a]/20 
//           focus:border-[#8a5d95] focus:text-black focus:placeholder:text-white/50 
//           focus:ring-2 focus:ring-[#8a5d95]/50 focus:shadow-xl focus:backdrop-blur-sm hover:border-gray-400"
//                   value={physicalProductData.name}
//                   onChange={(e) =>
//                     handlePhysicalProductChange("name", e.target.value)
//                   }
//                   placeholder="Product name"
//                 />
//               </div>

//               {/* Color */}
//               <div className="flex flex-col gap-2">
//                 <Label>
//                   <strong>Color </strong>
//                 </Label>
//                 <Input
//                   className="h-12 px-4 py-3 bg-white/30 border-gray-300 text-gray-900 placeholder:text-gray-500 
//           transition-all duration-300 focus:bg-gradient-to-r focus:from-[#8a5d95]/20 focus:to-[#644c6a]/20 
//           focus:border-[#8a5d95] focus:text-black focus:placeholder:text-white/50 
//           focus:ring-2 focus:ring-[#8a5d95]/50 focus:shadow-xl focus:backdrop-blur-sm hover:border-gray-400"
//                   value={physicalProductData.color}
//                   onChange={(e) =>
//                     handlePhysicalProductChange("color", e.target.value)
//                   }
//                   placeholder="Product color"
//                 />
//               </div>

//               {/* Care Instructions */}
//               <div className="flex flex-col gap-2">
//                 <Label>
//                   <strong>Care Instructions </strong>
//                 </Label>
//                 <Textarea
//                   className="h-12 px-4 py-3 bg-white/30 border-gray-300 text-gray-900 placeholder:text-gray-500 
//           transition-all duration-300 focus:bg-gradient-to-r focus:from-[#8a5d95]/20 focus:to-[#644c6a]/20 
//           focus:border-[#8a5d95] focus:text-black focus:placeholder:text-white/50 
//           focus:ring-2 focus:ring-[#8a5d95]/50 focus:shadow-xl focus:backdrop-blur-sm hover:border-gray-400"
//                   value={physicalProductData.care}
//                   onChange={(e) =>
//                     handlePhysicalProductChange("care", e.target.value)
//                   }
//                   placeholder="Washing/Dry clean instructions"
//                 />
//               </div>

//               {/* Material */}
//               <div className="flex flex-col gap-2">
//                 <Label>
//                   <strong>Material </strong>
//                 </Label>
//                 <Input
//                   className="h-12 px-4 py-3 bg-white/30 border-gray-300 text-gray-900 placeholder:text-gray-500 
//           transition-all duration-300 focus:bg-gradient-to-r focus:from-[#8a5d95]/20 focus:to-[#644c6a]/20 
//           focus:border-[#8a5d95] focus:text-black focus:placeholder:text-white/50 
//           focus:ring-2 focus:ring-[#8a5d95]/50 focus:shadow-xl focus:backdrop-blur-sm hover:border-gray-400"
//                   value={physicalProductData.material}
//                   onChange={(e) =>
//                     handlePhysicalProductChange("material", e.target.value)
//                   }
//                   placeholder="Cotton, Polyester, etc."
//                 />
//               </div>

//               {/* Shipping Time */}
//               <div className="flex flex-col gap-2">
//                 <Label>
//                   <strong>Shipping Time</strong>
//                 </Label>
//                 <Input
//                   className="h-12 px-4 py-3 bg-white/30 border-gray-300 text-gray-900 placeholder:text-gray-500 
//           transition-all duration-300 focus:bg-gradient-to-r focus:from-[#8a5d95]/20 focus:to-[#644c6a]/20 
//           focus:border-[#8a5d95] focus:text-black focus:placeholder:text-white/50 
//           focus:ring-2 focus:ring-[#8a5d95]/50 focus:shadow-xl focus:backdrop-blur-sm hover:border-gray-400"
//                   value={physicalProductData.shippingTime}
//                   onChange={(e) =>
//                     handlePhysicalProductChange("shippingTime", e.target.value)
//                   }
//                   placeholder="e.g. 3-5 business days"
//                 />
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader>
//               <CardTitle className="text-lg text-bold text-[#511d5e]">
//                 Pricing & Inventory
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="flex flex-col gap-2">
//                 <Label>
//                   <strong>Price</strong>
//                 </Label>
//                 <Input
//                   className="h-12 px-4 py-3 bg-white/30 border-gray-300 text-gray-900 placeholder:text-gray-500 transition-all duration-300 focus:bg-gradient-to-r focus:from-[#8a5d95]/20 focus:to-[#644c6a]/20 focus:border-[#8a5d95] focus:text-black focus:placeholder:text-white/50 focus:ring-2 focus:ring-[#8a5d95]/50 focus:shadow-xl focus:backdrop-blur-sm hover:border-gray-400"
//                   type="number"
//                   value={physicalProductData.price}
//                   onChange={(e) =>
//                     handlePhysicalProductChange("price", e.target.value)
//                   }
//                   required
//                 />
//               </div>
//               <div className="flex flex-col gap-2">
//                 <Label>
//                   <strong>Stock</strong>
//                 </Label>
//                 <Input
//                   className="h-12 px-4 py-3 bg-white/30 border-gray-300 text-gray-900 placeholder:text-gray-500 transition-all duration-300 focus:bg-gradient-to-r focus:from-[#8a5d95]/20 focus:to-[#644c6a]/20 focus:border-[#8a5d95] focus:text-black focus:placeholder:text-white/50 focus:ring-2 focus:ring-[#8a5d95]/50 focus:shadow-xl focus:backdrop-blur-sm hover:border-gray-400"
//                   type="number"
//                   value={physicalProductData.stock}
//                   onChange={(e) =>
//                     handlePhysicalProductChange("stock", e.target.value)
//                   }
//                   required
//                 />
//               </div>
//             </CardContent>
//           </Card>

//           {/* Image Upload Section */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="text-lg text-bold text-[#511d5e]">
//                 Product Images
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="flex flex-col gap-2">
//                 <Label>
//                   <strong>Upload Images</strong>
//                 </Label>
//                 <div className="mt-2">
//                   <Input
//                     type="file"
//                     accept="image/*"
//                     multiple
//                     onChange={handleImageSelect}
//                     className="hidden"
//                     id="image-upload"
//                   />
//                   <label
//                     htmlFor="image-upload"
//                     className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
//                   >
//                     <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                       <Upload className="w-8 h-8 mb-4 text-gray-500" />
//                       <p className="mb-2 text-sm text-gray-500">
//                         <span className="font-semibold">Click to upload</span>{" "}
//                         or drag and drop
//                       </p>
//                       <p className="text-xs text-gray-500">
//                         PNG, JPG, GIF up to 10MB
//                       </p>
//                     </div>
//                   </label>
//                 </div>
//               </div>

//               {/* Image Previews */}
//               {imagePreviews.length > 0 && (
//                 <div>
//                   <Label>Selected Images ({imagePreviews.length})</Label>
//                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
//                     {imagePreviews.map((preview, index) => (
//                       <div key={index} className="relative group">
//                         <img
//                           src={preview}
//                           alt={`Preview ${index + 1}`}
//                           className="w-full h-24 object-cover rounded-lg border"
//                         />
//                         <button
//                           type="button"
//                           onClick={() => removeImage(index)}
//                           className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
//                         >
//                           <X className="w-4 h-4" />
//                         </button>
//                         <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg">
//                           {physicalProductData.images[index]?.name}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader>
//               <CardTitle className="text-lg text-bold text-[#511d5e]">
//                 Tags
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="flex flex-wrap gap-2 mb-2">
//                 {physicalProductData.tags.map((tag) => (
//                   <Badge
//                     key={tag}
//                     variant="secondary"
//                     className="flex items-center gap-1 "
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
//                   className="bg-white/30 border-gray-300 text-gray-900 placeholder:text-gray-500 transition-all duration-300 focus:bg-gradient-to-r focus:from-[#8a5d95]/20 focus:to-[#644c6a]/20 focus:border-[#8a5d95] focus:text-black focus:placeholder:text-white/50 focus:ring-2 focus:ring-[#8a5d95]/50 focus:shadow-xl focus:backdrop-blur-sm hover:border-gray-400"
//                   value={newTag}
//                   onChange={(e) => setNewTag(e.target.value)}
//                   placeholder="Add tag"
//                   onKeyDown={(e) =>
//                     e.key === "Enter" && (e.preventDefault(), addTag())
//                   }
//                 />
//                 <Button
//                   type="button"
//                   onClick={addTag}
//                   className="bg-gradient-to-r from-[#8a5d95] to-[#644c6a] hover:from-[#684670] hover:to-[#644c6a] text-white shadow-lg hover:shadow-xl transition-all duration-300"
//                 >
//                   Add
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>

//           <div className="flex justify-end gap-4">
//             <Button
//               type="submit"
//               disabled={isSubmitting}
//               className="bg-gradient-to-r from-[#8a5d95] to-[#644c6a] hover:from-[#684670] hover:to-[#644c6a] text-white shadow-lg hover:shadow-xl transition-all duration-300"
//             >
//               {isSubmitting && (
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//               )}
//               Upload Product
//             </Button>
//           </div>
//         </>
//       )}
//     </form>
//   );
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
import DigitalBookUploader from "./DigitalBookUploader"; // Add this import

// All categories including digital books
const allCategories = [
  "Accessories",
  "Decoration",
  "Fashion",
  "Meditation",
  "HomeLiving",
  "DigitalBooks", // New category
] as const;

// Physical categories only
// const physicalCategories = [
//   "Accessories",
//   "Decoration",
//   "Fashion",
//   "Meditation",
//   "HomeLiving",
// ] as const;

// Validation function
function validateProduct(data: typeof initialPhysicalProductData) {
  const errors: string[] = [];

  if (!data.title.trim()) errors.push("Title is required");
  if (!data.sku.trim()) errors.push("SKU is required");
  if (!data.price.trim()) {
    errors.push("Price is required");
  } else if (isNaN(Number(data.price))) {
    errors.push("Price must be numeric");
  }

  // Stock is optional → validate only if provided
  if (data.stock && !Number.isInteger(Number(data.stock))) {
    errors.push("Stock must be an integer if provided");
  }

  return errors;
}

// Initial state for physical product
const initialPhysicalProductData = {
  title: "",
  name: "", // optional
  color: "", // optional
  care: "", // optional
  material: "", // optional
  shippingTime: "", // optional
  description: "",
  price: "",
  stock: "",
  tags: [] as string[],
  sku: "",
  images: [] as File[],
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

    // Required
    formData.append("title", physicalProductData.title.trim());
    formData.append("sku", physicalProductData.sku.trim());
    formData.append("price", physicalProductData.price);

    // Optional (only append if provided)
    if (physicalProductData.name.trim()) {
      formData.append("name", physicalProductData.name.trim());
    }
    if (physicalProductData.color.trim()) {
      formData.append("color", physicalProductData.color.trim());
    }
    if (physicalProductData.care.trim()) {
      formData.append("care", physicalProductData.care.trim());
    }
    if (physicalProductData.material.trim()) {
      formData.append("material", physicalProductData.material.trim());
    }
    if (physicalProductData.shippingTime.trim()) {
      formData.append("shippingTime", physicalProductData.shippingTime.trim());
    }
    if (physicalProductData.description.trim()) {
      formData.append("description", physicalProductData.description.trim());
    }
    if (physicalProductData.stock) {
      formData.append("stock", physicalProductData.stock);
    }

    // Tags
    if (physicalProductData.tags.length > 0) {
      physicalProductData.tags.forEach((tag) => {
        formData.append("tags", tag);
      });
    }

    // Images
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
      console.log("Submitting to", endpoint, "with FormData", formData);

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
    <>
    <Card>
        <CardHeader>
          <CardTitle className="text-lg text-bold text-[#511d5e]">
            Select Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select onValueChange={(value) => setSelectedCategory(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a category" />
            </SelectTrigger>
            <SelectContent>
              {allCategories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat === "DigitalBooks" ? "Digital Books" : cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
    
      

      {selectedCategory === "DigitalBooks" ? (
        <DigitalBookUploader />
      ) : selectedCategory? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg  text-bold text-[#511d5e]">
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 ">
              <div className="flex flex-col gap-2">
                <Label>
                  <strong>Product Title</strong>
                </Label>
                <Input
                  className="h-12 px-4 py-3 bg-white/30 border-gray-300 text-gray-900 placeholder:text-gray-500 transition-all duration-300 focus:bg-gradient-to-r focus:from-[#8a5d95]/20 focus:to-[#644c6a]/20 focus:border-[#8a5d95] focus:text-black focus:placeholder:text-white/50 focus:ring-2 focus:ring-[#8a5d95]/50 focus:shadow-xl focus:backdrop-blur-sm hover:border-gray-400"
                  value={physicalProductData.title}
                  onChange={(e) =>
                    handlePhysicalProductChange("title", e.target.value)
                  }
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>
                  <strong>SKU</strong>
                </Label>
                <Input
                  className="h-12 px-4 py-3 bg-white/30 border-gray-300 text-gray-900 placeholder:text-gray-500 transition-all duration-300 focus:bg-gradient-to-r focus:from-[#8a5d95]/20 focus:to-[#644c6a]/20 focus:border-[#8a5d95] focus:text-black focus:placeholder:text-white/50 focus:ring-2 focus:ring-[#8a5d95]/50 focus:shadow-xl focus:backdrop-blur-sm hover:border-gray-400"
                  value={physicalProductData.sku}
                  onChange={(e) =>
                    handlePhysicalProductChange("sku", e.target.value)
                  }
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>
                  <strong>Description</strong>
                </Label>
                <Textarea
                  className="h-12 px-4 py-3 bg-white/30 border-gray-300 text-gray-900 placeholder:text-gray-500 transition-all duration-300 focus:bg-gradient-to-r focus:from-[#8a5d95]/20 focus:to-[#644c6a]/20 focus:border-[#8a5d95] focus:text-black focus:placeholder:text-white/50 focus:ring-2 focus:ring-[#8a5d95]/50 focus:shadow-xl focus:backdrop-blur-sm hover:border-gray-400"
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
              <CardTitle className="text-lg text-bold text-[#511d5e]">
                Additional Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Name */}
              <div className="flex flex-col gap-2">
                <Label>
                  <strong>Name </strong>
                </Label>
                <Input
                  className="h-12 px-4 py-3 bg-white/30 border-gray-300 text-gray-900 placeholder:text-gray-500 
          transition-all duration-300 focus:bg-gradient-to-r focus:from-[#8a5d95]/20 focus:to-[#644c6a]/20 
          focus:border-[#8a5d95] focus:text-black focus:placeholder:text-white/50 
          focus:ring-2 focus:ring-[#8a5d95]/50 focus:shadow-xl focus:backdrop-blur-sm hover:border-gray-400"
                  value={physicalProductData.name}
                  onChange={(e) =>
                    handlePhysicalProductChange("name", e.target.value)
                  }
                  placeholder="Product name"
                />
              </div>

              {/* Color */}
              <div className="flex flex-col gap-2">
                <Label>
                  <strong>Color </strong>
                </Label>
                <Input
                  className="h-12 px-4 py-3 bg-white/30 border-gray-300 text-gray-900 placeholder:text-gray-500 
          transition-all duration-300 focus:bg-gradient-to-r focus:from-[#8a5d95]/20 focus:to-[#644c6a]/20 
          focus:border-[#8a5d95] focus:text-black focus:placeholder:text-white/50 
          focus:ring-2 focus:ring-[#8a5d95]/50 focus:shadow-xl focus:backdrop-blur-sm hover:border-gray-400"
                  value={physicalProductData.color}
                  onChange={(e) =>
                    handlePhysicalProductChange("color", e.target.value)
                  }
                  placeholder="Product color"
                />
              </div>

              {/* Care Instructions */}
              <div className="flex flex-col gap-2">
                <Label>
                  <strong>Care Instructions </strong>
                </Label>
                <Textarea
                  className="h-12 px-4 py-3 bg-white/30 border-gray-300 text-gray-900 placeholder:text-gray-500 
          transition-all duration-300 focus:bg-gradient-to-r focus:from-[#8a5d95]/20 focus:to-[#644c6a]/20 
          focus:border-[#8a5d95] focus:text-black focus:placeholder:text-white/50 
          focus:ring-2 focus:ring-[#8a5d95]/50 focus:shadow-xl focus:backdrop-blur-sm hover:border-gray-400"
                  value={physicalProductData.care}
                  onChange={(e) =>
                    handlePhysicalProductChange("care", e.target.value)
                  }
                  placeholder="Washing/Dry clean instructions"
                />
              </div>

              {/* Material */}
              <div className="flex flex-col gap-2">
                <Label>
                  <strong>Material </strong>
                </Label>
                <Input
                  className="h-12 px-4 py-3 bg-white/30 border-gray-300 text-gray-900 placeholder:text-gray-500 
          transition-all duration-300 focus:bg-gradient-to-r focus:from-[#8a5d95]/20 focus:to-[#644c6a]/20 
          focus:border-[#8a5d95] focus:text-black focus:placeholder:text-white/50 
          focus:ring-2 focus:ring-[#8a5d95]/50 focus:shadow-xl focus:backdrop-blur-sm hover:border-gray-400"
                  value={physicalProductData.material}
                  onChange={(e) =>
                    handlePhysicalProductChange("material", e.target.value)
                  }
                  placeholder="Cotton, Polyester, etc."
                />
              </div>

              {/* Shipping Time */}
              <div className="flex flex-col gap-2">
                <Label>
                  <strong>Shipping Time</strong>
                </Label>
                <Input
                  className="h-12 px-4 py-3 bg-white/30 border-gray-300 text-gray-900 placeholder:text-gray-500 
          transition-all duration-300 focus:bg-gradient-to-r focus:from-[#8a5d95]/20 focus:to-[#644c6a]/20 
          focus:border-[#8a5d95] focus:text-black focus:placeholder:text-white/50 
          focus:ring-2 focus:ring-[#8a5d95]/50 focus:shadow-xl focus:backdrop-blur-sm hover:border-gray-400"
                  value={physicalProductData.shippingTime}
                  onChange={(e) =>
                    handlePhysicalProductChange("shippingTime", e.target.value)
                  }
                  placeholder="e.g. 3-5 business days"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-bold text-[#511d5e]">
                Pricing & Inventory
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-2">
                <Label>
                  <strong>Price</strong>
                </Label>
                <Input
                  className="h-12 px-4 py-3 bg-white/30 border-gray-300 text-gray-900 placeholder:text-gray-500 transition-all duration-300 focus:bg-gradient-to-r focus:from-[#8a5d95]/20 focus:to-[#644c6a]/20 focus:border-[#8a5d95] focus:text-black focus:placeholder:text-white/50 focus:ring-2 focus:ring-[#8a5d95]/50 focus:shadow-xl focus:backdrop-blur-sm hover:border-gray-400"
                  type="number"
                  value={physicalProductData.price}
                  onChange={(e) =>
                    handlePhysicalProductChange("price", e.target.value)
                  }
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>
                  <strong>Stock</strong>
                </Label>
                <Input
                  className="h-12 px-4 py-3 bg-white/30 border-gray-300 text-gray-900 placeholder:text-gray-500 transition-all duration-300 focus:bg-gradient-to-r focus:from-[#8a5d95]/20 focus:to-[#644c6a]/20 focus:border-[#8a5d95] focus:text-black focus:placeholder:text-white/50 focus:ring-2 focus:ring-[#8a5d95]/50 focus:shadow-xl focus:backdrop-blur-sm hover:border-gray-400"
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
              <CardTitle className="text-lg text-bold text-[#511d5e]">
                Product Images
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-2">
                <Label>
                  <strong>Upload Images</strong>
                </Label>
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
              <CardTitle className="text-lg text-bold text-[#511d5e]">
                Tags
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-2">
                {physicalProductData.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="flex items-center gap-1 "
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
                  className="bg-white/30 border-gray-300 text-gray-900 placeholder:text-gray-500 transition-all duration-300 focus:bg-gradient-to-r focus:from-[#8a5d95]/20 focus:to-[#644c6a]/20 focus:border-[#8a5d95] focus:text-black focus:placeholder:text-white/50 focus:ring-2 focus:ring-[#8a5d95]/50 focus:shadow-xl focus:backdrop-blur-sm hover:border-gray-400"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add tag"
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addTag())
                  }
                />
                <Button
                  type="button"
                  onClick={addTag}
                  className="bg-gradient-to-r from-[#8a5d95] to-[#644c6a] hover:from-[#684670] hover:to-[#644c6a] text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-[#8a5d95] to-[#644c6a] hover:from-[#684670] hover:to-[#644c6a] text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Upload Product
            </Button>
          </div>
        
    </form>
    ) : null}
</>
  );
}