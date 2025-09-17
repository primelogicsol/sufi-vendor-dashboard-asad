// "use client";
// import Image from "next/image";
// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import { ApiClient } from "@/lib/utils/api-client";
// import {
//   Package,
//   DollarSign,
//   Hash,
//   Calendar,
//   //   User,
//   ImageIcon,
//   Star,
//   Loader2,
//   Trash2,
// } from "lucide-react";

// interface ProductDetailsModalProps {
//   productId: number | null;
//   trigger?: React.ReactNode;
//   category: string;
//   onProductDeleted?: () => void; // Callback to refresh parent component
// }

// const CATEGORY_ENDPOINTS: Record<string, string> = {
//   Decoration: "/decoration",
//   Fashion: "/fashion",
//   Meditation: "/meditation",
//   Accessories: "/accessories",
//   HomeLiving: "/living",
// };

// interface Product {
//   id: number;
//   title: string;
//   description: string;
//   price: number;
//   stock: number;
//   sku: string;
//   images?: string[];
//   tags?: string[];
//   createdAt?: string;
//   updatedAt?: string;
//   isDelete?: boolean;
//   userId?: string;
//   reviews?: string[];
// }

// export function ProductDetailsModal({
//   productId,
//   category,
//   trigger,
//   onProductDeleted,
// }: ProductDetailsModalProps) {
//   const [open, setOpen] = useState(false);
//   const [productDetails, setProductDetails] = useState<Product | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [deleting, setDeleting] = useState(false);

//   useEffect(() => {
//     if (open && productId) {
//       const fetchDetails = async () => {
//         try {
//           setLoading(true);
//           const endpoint = CATEGORY_ENDPOINTS[category];
//           if (!endpoint) {
//             console.error(`Invalid category: ${category}`); // ✅ Safety check
//             return;
//           }
//           const res = await ApiClient.get(`${endpoint}/${productId}`, true);
//           // const res = await ApiClient.get(`/accessories/${productId}`, true);
//           const data = await res.json();

//           if (data.success) {
//             setProductDetails(data.data);
//           } else {
//             console.error("Failed to fetch product details:", data.message);
//           }
//         } catch (err) {
//           console.error("Error fetching product details:", err);
//         } finally {
//           setLoading(false);
//         }
//       };

//       fetchDetails();
//     }
//   }, [open, productId]);

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   const getStockStatus = (stock: number) => {
//     if (stock === 0)
//       return { text: "Out of Stock", variant: "destructive" as const };
//     if (stock < 5) return { text: "Low Stock", variant: "secondary" as const };
//     return { text: "In Stock", variant: "default" as const };
//   };

//   const handleDelete = async () => {
//     if (!productId || deleting) return;

//     try {
//       setDeleting(true);
//       const endpoint = CATEGORY_ENDPOINTS[category];
//       if (!endpoint) {
//         console.error(`Invalid category: ${category}`);
//         return;
//       }
//       const res = await ApiClient.delete(`${endpoint}/${productId}`, true);
//       // const res = await ApiClient.delete(`/accessories/${productId}`, true);
//       const data = await res.json();

//       if (data.success) {
//         setOpen(false);
//         onProductDeleted?.(); // Call the callback to refresh parent

//         // Hard reload the page to reflect changes
//         setTimeout(() => {
//           window.location.reload();
//         }, 500); // Small delay to ensure modal closes smoothly
//       } else {
//         console.error("Failed to delete product:", data.message);
//       }
//     } catch (err) {
//       console.error("Error deleting product:", err);
//     } finally {
//       setDeleting(false);
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       {trigger && <div onClick={() => setOpen(true)}>{trigger}</div>}

//       <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20">
//         <DialogHeader className="pb-4 border-b border-purple-200/30 dark:border-purple-800/30">
//           <div className="flex items-center justify-between gap-4">
//             <DialogTitle className="text-xl font-semibold text-foreground flex-1">
//               {productDetails?.title || "Product Details"}
//             </DialogTitle>
//             {productDetails && (
//               <div className="flex items-center gap-2 ">
//                 <Button
//                   onClick={handleDelete}
//                   disabled={deleting}
//                   variant="destructive"
//                   size="sm"
//                   className="bg-red-500 hover:bg-red-600 text-white border-0"
//                 >
//                   {deleting ? (
//                     <>
//                       <Loader2 className="h-4 w-4 animate-spin mr-2" />
//                       Deleting...
//                     </>
//                   ) : (
//                     <>
//                       <Trash2 className="h-4 w-4 mr-2" />
//                       Delete
//                     </>
//                   )}
//                 </Button>
//               </div>
//             )}
//           </div>
//         </DialogHeader>

//         {loading ? (
//           <div className="flex items-center justify-center py-12">
//             <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
//             <span className="ml-2 text-muted-foreground">
//               Loading product details...
//             </span>
//           </div>
//         ) : productDetails ? (
//           <div className="space-y-6">
//             {/* Product Images */}
//             {productDetails.images && productDetails.images.length > 0 ? (
//               <div className="space-y-3">
//                 <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
//                   <ImageIcon className="h-4 w-4" />
//                   Product Images
//                 </h3>
//                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
//                   {productDetails.images.map((image: string, index: number) => (
//                     <div key={index} className="relative group">
//                       {/* <Image
//                         src={
//                           image.startsWith("http")
//                             ? image
//                             : `http://localhost:6015${image.replace(
//                                 "public",
//                                 ""
//                               )}`
//                         }
//                         alt={`${productDetails.title} - Image ${index + 1}`}
//                         className="w-full h-24 sm:h-32 object-cover rounded-lg border border-border hover:border-primary/50 transition-colors"
//                         onError={(e) => {
//                           const target = e.target as HTMLImageElement;
//                           target.style.display = "none";
//                           target.nextElementSibling!.classList.remove("hidden");
//                         }}
//                       /> */}
//                       <Image
//                         src={
//   image.startsWith("http") || image.startsWith("https")
//     ? image
//     : `http://localhost:6015${image.startsWith("/") ? image : `/${image}`}`.replace("/public", "")
// }
//                         alt={`${productDetails.title} - Image ${index + 1}`}
//                         width={200}
//                         height={128}
//                         className="w-full h-24 sm:h-32 object-cover rounded-lg border border-border hover:border-primary/50 transition-colors"
//                         onError={(e) => {
//                           const target = e.target as HTMLImageElement;
//                           target.style.display = "none";
//                           target.nextElementSibling!.classList.remove("hidden");
//                         }}
//                       />
//                       <div className="hidden absolute inset-0 flex items-center justify-center bg-muted rounded-lg border border-dashed border-muted-foreground/25">
//                         <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             ) : null}

//             {/* Description */}
//             {productDetails.description && (
//               <div className="space-y-2">
//                 <h3 className="text-sm font-medium text-muted-foreground">
//                   Description
//                 </h3>
//                 <p className="text-sm text-foreground leading-relaxed bg-purple-100/50 dark:bg-purple-900/20 p-3 rounded-lg border border-purple-200/50 dark:border-purple-800/30">
//                   {productDetails.description}
//                 </p>
//               </div>
//             )}

//             <Separator />

//             {/* Product Information Grid */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               {/* Price */}
//               <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-950/30 dark:to-pink-950/30 border border-purple-200 dark:border-purple-800">
//                 <div className="p-2 bg-purple-200 dark:bg-purple-900/50 rounded-full">
//                   <DollarSign className="h-4 w-4 text-purple-700 dark:text-purple-300" />
//                 </div>
//                 <div>
//                   <p className="text-xs text-purple-600/80 dark:text-purple-400/80 font-medium">
//                     Price
//                   </p>
//                   <p className="text-lg font-semibold text-purple-800 dark:text-purple-200">
//                     ${productDetails.price?.toFixed(2) || "N/A"}
//                   </p>
//                 </div>
//               </div>

//               {/* Stock */}
//               <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-200 dark:border-indigo-800">
//                 <div className="p-2 bg-indigo-200 dark:bg-indigo-900/50 rounded-full">
//                   <Package className="h-4 w-4 text-indigo-700 dark:text-indigo-300" />
//                 </div>
//                 <div className="flex-1">
//                   <p className="text-xs text-indigo-600/80 dark:text-indigo-400/80 font-medium">
//                     Stock
//                   </p>
//                   <div className="flex items-center gap-2 mt-1">
//                     <p className="text-lg font-semibold text-indigo-800 dark:text-indigo-200">
//                       {productDetails.stock ?? "N/A"}
//                     </p>
//                     {typeof productDetails.stock === "number" && (
//                       <Badge
//                         variant={getStockStatus(productDetails.stock).variant}
//                         className="text-xs"
//                       >
//                         {getStockStatus(productDetails.stock).text}
//                       </Badge>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Additional Details */}
//             <div className="space-y-3">
//               <h3 className="text-sm font-medium text-muted-foreground">
//                 Additional Information
//               </h3>
//               <div className="grid grid-cols-1 gap-3">
//                 {/* SKU */}
//                 {productDetails.sku && (
//                   <div className="flex items-center gap-3 p-2 rounded-lg border border-purple-200/50 dark:border-purple-800/30 bg-purple-50/30 dark:bg-purple-950/10">
//                     <Hash className="h-4 w-4 text-muted-foreground" />
//                     <div>
//                       <span className="text-xs text-muted-foreground">
//                         SKU:
//                       </span>
//                       <span className="ml-2 text-sm font-mono font-medium">
//                         {productDetails.sku}
//                       </span>
//                     </div>
//                   </div>
//                 )}

//                 {/* Tags */}
//                 {productDetails.tags && productDetails.tags.length > 0 && (
//                   <div className="flex items-start gap-3 p-2 rounded-lg border border-purple-200/50 dark:border-purple-800/30 bg-purple-50/30 dark:bg-purple-950/10">
//                     <Package className="h-4 w-4 text-muted-foreground mt-0.5" />
//                     <div className="flex-1">
//                       <span className="text-xs text-muted-foreground">
//                         Tags:
//                       </span>
//                       <div className="flex flex-wrap gap-1 mt-1">
//                         {productDetails.tags.map(
//                           (tag: string, index: number) => (
//                             <Badge
//                               key={index}
//                               variant="outline"
//                               className="text-xs"
//                             >
//                               {tag}
//                             </Badge>
//                           )
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* User ID */}
//                 {/* {productDetails.userId && (
//                   <div className="flex items-center gap-3 p-2 rounded-lg border border-purple-200/50 dark:border-purple-800/30 bg-purple-50/30 dark:bg-purple-950/10">
//                     <User className="h-4 w-4 text-muted-foreground" />
//                     <div>
//                       <span className="text-xs text-muted-foreground">Created by:</span>
//                       <span className="ml-2 text-sm font-mono text-muted-foreground">{productDetails.userId}</span>
//                     </div>
//                   </div>
//                 )} */}

//                 {/* Reviews */}
//                 {productDetails.reviews && productDetails.reviews.length > 0 ? (
//                   <div className="flex items-start gap-3 p-2 rounded-lg border border-purple-200/50 dark:border-purple-800/30 bg-purple-50/30 dark:bg-purple-950/10">
//                     <Star className="h-4 w-4 text-muted-foreground mt-0.5" />
//                     <div>
//                       <span className="text-xs text-muted-foreground">
//                         Reviews:
//                       </span>
//                       <span className="ml-2 text-sm font-medium">
//                         {productDetails.reviews.length} review(s)
//                       </span>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="flex items-center gap-3 p-2 rounded-lg border border-dashed border-purple-300/50 dark:border-purple-700/50 bg-purple-50/20 dark:bg-purple-950/5">
//                     <Star className="h-4 w-4 text-muted-foreground" />
//                     <span className="text-xs text-muted-foreground">
//                       No reviews yet
//                     </span>
//                   </div>
//                 )}
//               </div>
//             </div>

//             <Separator />

//             {/* Timestamps */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-muted-foreground">
//               {productDetails.createdAt && (
//                 <div className="flex items-center gap-2">
//                   <Calendar className="h-3 w-3" />
//                   <span>Created: {formatDate(productDetails.createdAt)}</span>
//                 </div>
//               )}
//               {productDetails.updatedAt &&
//                 productDetails.updatedAt !== productDetails.createdAt && (
//                   <div className="flex items-center gap-2">
//                     <Calendar className="h-3 w-3" />
//                     <span>Updated: {formatDate(productDetails.updatedAt)}</span>
//                   </div>
//                 )}
//             </div>
//           </div>
//         ) : (
//           <div className="flex flex-col items-center justify-center py-12 space-y-3">
//             <Package className="h-12 w-12 text-muted-foreground/50" />
//             <p className="text-muted-foreground">No product details found.</p>
//           </div>
//         )}

//         <div className="flex justify-end pt-6 border-t border-purple-200/50 dark:border-purple-800/30">
//           <Button
//             onClick={() => setOpen(false)}
//             variant="outline"
//             className="min-w-[100px] border-purple-300 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-950/20"
//           >
//             Close
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }



// "use client";
// import Image from "next/image";
// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import { ApiClient } from "@/lib/utils/api-client";
// import {
//   Package,
//   DollarSign,
//   Hash,
//   Calendar,
//   ImageIcon,
//   Star,
//   Loader2,
//   Trash2,
// } from "lucide-react";

// interface ProductDetailsModalProps {
//   productId: number | null;
//   trigger?: React.ReactNode;
//   category: string;
//   onProductDeleted?: () => void; // Callback to refresh parent component
// }

// const CATEGORY_ENDPOINTS: Record<string, string> = {
//   Decoration: "/decoration",
//   Fashion: "/fashion",
//   Meditation: "/meditation",
//   Accessories: "/accessories",
//   HomeLiving: "/living",
// };

// interface Product {
//   id: number;
//   title: string;
//   description: string;
//   price: number;
//   stock: number;
//   sku: string;
//   images?: string[];
//   tags?: string[];
//   createdAt?: string;
//   updatedAt?: string;
//   isDelete?: boolean;
//   userId?: string;
//   reviews?: string[];
// }

// export function ProductDetailsModal({
//   productId,
//   category,
//   trigger,
//   onProductDeleted,
// }: ProductDetailsModalProps) {
//   const [open, setOpen] = useState(false);
//   const [productDetails, setProductDetails] = useState<Product | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [deleting, setDeleting] = useState(false);
//   const [failedImages, setFailedImages] = useState<Set<number>>(new Set());

//   useEffect(() => {
//     if (open && productId) {
//       const fetchDetails = async () => {
//         try {
//           setLoading(true);
//           // Reset failed images when loading new product
//           setFailedImages(new Set());
          
//           const endpoint = CATEGORY_ENDPOINTS[category];
//           if (!endpoint) {
//             console.error(`Invalid category: ${category}`); // ✅ Safety check
//             return;
//           }
//           const res = await ApiClient.get(`${endpoint}/${productId}`, true);
//           const data = await res.json();

//           if (data.success) {
//             setProductDetails(data.data);
//           } else {
//             console.error("Failed to fetch product details:", data.message);
//           }
//         } catch (err) {
//           console.error("Error fetching product details:", err);
//         } finally {
//           setLoading(false);
//         }
//       };

//       fetchDetails();
//     }
//   }, [open, productId, category]);

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   const getStockStatus = (stock: number) => {
//     if (stock === 0)
//       return { text: "Out of Stock", variant: "destructive" as const };
//     if (stock < 5) return { text: "Low Stock", variant: "secondary" as const };
//     return { text: "In Stock", variant: "default" as const };
//   };

//   const handleDelete = async () => {
//     if (!productId || deleting) return;

//     try {
//       setDeleting(true);
//       const endpoint = CATEGORY_ENDPOINTS[category];
//       if (!endpoint) {
//         console.error(`Invalid category: ${category}`);
//         return;
//       }
//       const res = await ApiClient.delete(`${endpoint}/${productId}`, true);
//       const data = await res.json();

//       if (data.success) {
//         setOpen(false);
//         onProductDeleted?.(); // Call the callback to refresh parent

//         // Hard reload the page to reflect changes
//         setTimeout(() => {
//           window.location.reload();
//         }, 500); // Small delay to ensure modal closes smoothly
//       } else {
//         console.error("Failed to delete product:", data.message);
//       }
//     } catch (err) {
//       console.error("Error deleting product:", err);
//     } finally {
//       setDeleting(false);
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       {trigger && <div onClick={() => setOpen(true)}>{trigger}</div>}

//       <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20">
//         <DialogHeader className="pb-4 border-b border-purple-200/30 dark:border-purple-800/30">
//           <div className="flex items-center justify-between gap-4">
//             <DialogTitle className="text-xl font-semibold text-foreground flex-1">
//               {productDetails?.title || "Product Details"}
//             </DialogTitle>
//             {productDetails && (
//               <div className="flex items-center gap-2 ">
//                 <Button
//                   onClick={handleDelete}
//                   disabled={deleting}
//                   variant="destructive"
//                   size="sm"
//                   className="bg-red-500 hover:bg-red-600 text-white border-0"
//                 >
//                   {deleting ? (
//                     <>
//                       <Loader2 className="h-4 w-4 animate-spin mr-2" />
//                       Deleting...
//                     </>
//                   ) : (
//                     <>
//                       <Trash2 className="h-4 w-4 mr-2" />
//                       Delete
//                     </>
//                   )}
//                 </Button>
//               </div>
//             )}
//           </div>
//         </DialogHeader>

//         {loading ? (
//           <div className="flex items-center justify-center py-12">
//             <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
//             <span className="ml-2 text-muted-foreground">
//               Loading product details...
//             </span>
//           </div>
//         ) : productDetails ? (
//           <div className="space-y-6">
//             {/* Product Images with Error Handling */}
//             {productDetails.images && productDetails.images.length > 0 ? (
//               <div className="space-y-3">
//                 <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
//                   <ImageIcon className="h-4 w-4" />
//                   Product Images
//                 </h3>
//                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
//                   {productDetails.images.map((image: string, index: number) => (
//                     <div key={index} className="relative group">
//                       {!failedImages.has(index) ? (
//                         <Image
//                           src={
//                             image.startsWith("http") || image.startsWith("https")
//                               ? image
//                               : `http://localhost:6015${
//                                   image.startsWith("/") ? image : `/${image}`
//                                 }`.replace("/public", "")
//                           }
//                           alt={`${productDetails.title} - Image ${index + 1}`}
//                           width={200}
//                           height={128}
//                           className="w-full h-24 sm:h-32 object-cover rounded-lg border border-border hover:border-primary/50 transition-colors"
//                           onError={() => {
//                             setFailedImages(prev => new Set([...prev, index]));
//                           }}
//                         />
//                       ) : (
//                         <div className="w-full h-24 sm:h-32 flex items-center justify-center bg-muted rounded-lg border border-dashed border-muted-foreground/25">
//                           <div className="flex flex-col items-center gap-1">
//                             <ImageIcon className="h-6 w-6 text-muted-foreground/50" />
//                             <span className="text-xs text-muted-foreground/70">Failed to load</span>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             ) : null}

//             {/* Description */}
//             {productDetails.description && (
//               <div className="space-y-2">
//                 <h3 className="text-sm font-medium text-muted-foreground">
//                   Description
//                 </h3>
//                 <p className="text-sm text-foreground leading-relaxed bg-purple-100/50 dark:bg-purple-900/20 p-3 rounded-lg border border-purple-200/50 dark:border-purple-800/30">
//                   {productDetails.description}
//                 </p>
//               </div>
//             )}

//             <Separator />

//             {/* Product Information Grid */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               {/* Price */}
//               <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-950/30 dark:to-pink-950/30 border border-purple-200 dark:border-purple-800">
//                 <div className="p-2 bg-purple-200 dark:bg-purple-900/50 rounded-full">
//                   <DollarSign className="h-4 w-4 text-purple-700 dark:text-purple-300" />
//                 </div>
//                 <div>
//                   <p className="text-xs text-purple-600/80 dark:text-purple-400/80 font-medium">
//                     Price
//                   </p>
//                   <p className="text-lg font-semibold text-purple-800 dark:text-purple-200">
//                     ${productDetails.price?.toFixed(2) || "N/A"}
//                   </p>
//                 </div>
//               </div>

//               {/* Stock */}
//               <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-200 dark:border-indigo-800">
//                 <div className="p-2 bg-indigo-200 dark:bg-indigo-900/50 rounded-full">
//                   <Package className="h-4 w-4 text-indigo-700 dark:text-indigo-300" />
//                 </div>
//                 <div className="flex-1">
//                   <p className="text-xs text-indigo-600/80 dark:text-indigo-400/80 font-medium">
//                     Stock
//                   </p>
//                   <div className="flex items-center gap-2 mt-1">
//                     <p className="text-lg font-semibold text-indigo-800 dark:text-indigo-200">
//                       {productDetails.stock ?? "N/A"}
//                     </p>
//                     {typeof productDetails.stock === "number" && (
//                       <Badge
//                         variant={getStockStatus(productDetails.stock).variant}
//                         className="text-xs"
//                       >
//                         {getStockStatus(productDetails.stock).text}
//                       </Badge>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Additional Details */}
//             <div className="space-y-3">
//               <h3 className="text-sm font-medium text-muted-foreground">
//                 Additional Information
//               </h3>
//               <div className="grid grid-cols-1 gap-3">
//                 {/* SKU */}
//                 {productDetails.sku && (
//                   <div className="flex items-center gap-3 p-2 rounded-lg border border-purple-200/50 dark:border-purple-800/30 bg-purple-50/30 dark:bg-purple-950/10">
//                     <Hash className="h-4 w-4 text-muted-foreground" />
//                     <div>
//                       <span className="text-xs text-muted-foreground">
//                         SKU:
//                       </span>
//                       <span className="ml-2 text-sm font-mono font-medium">
//                         {productDetails.sku}
//                       </span>
//                     </div>
//                   </div>
//                 )}

//                 {/* Tags */}
//                 {productDetails.tags && productDetails.tags.length > 0 && (
//                   <div className="flex items-start gap-3 p-2 rounded-lg border border-purple-200/50 dark:border-purple-800/30 bg-purple-50/30 dark:bg-purple-950/10">
//                     <Package className="h-4 w-4 text-muted-foreground mt-0.5" />
//                     <div className="flex-1">
//                       <span className="text-xs text-muted-foreground">
//                         Tags:
//                       </span>
//                       <div className="flex flex-wrap gap-1 mt-1">
//                         {productDetails.tags.map(
//                           (tag: string, index: number) => (
//                             <Badge
//                               key={index}
//                               variant="outline"
//                               className="text-xs"
//                             >
//                               {tag}
//                             </Badge>
//                           )
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* Reviews */}
//                 {productDetails.reviews && productDetails.reviews.length > 0 ? (
//                   <div className="flex items-start gap-3 p-2 rounded-lg border border-purple-200/50 dark:border-purple-800/30 bg-purple-50/30 dark:bg-purple-950/10">
//                     <Star className="h-4 w-4 text-muted-foreground mt-0.5" />
//                     <div>
//                       <span className="text-xs text-muted-foreground">
//                         Reviews:
//                       </span>
//                       <span className="ml-2 text-sm font-medium">
//                         {productDetails.reviews.length} review(s)
//                       </span>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="flex items-center gap-3 p-2 rounded-lg border border-dashed border-purple-300/50 dark:border-purple-700/50 bg-purple-50/20 dark:bg-purple-950/5">
//                     <Star className="h-4 w-4 text-muted-foreground" />
//                     <span className="text-xs text-muted-foreground">
//                       No reviews yet
//                     </span>
//                   </div>
//                 )}
//               </div>
//             </div>

//             <Separator />

//             {/* Timestamps */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-muted-foreground">
//               {productDetails.createdAt && (
//                 <div className="flex items-center gap-2">
//                   <Calendar className="h-3 w-3" />
//                   <span>Created: {formatDate(productDetails.createdAt)}</span>
//                 </div>
//               )}
//               {productDetails.updatedAt &&
//                 productDetails.updatedAt !== productDetails.createdAt && (
//                   <div className="flex items-center gap-2">
//                     <Calendar className="h-3 w-3" />
//                     <span>Updated: {formatDate(productDetails.updatedAt)}</span>
//                   </div>
//                 )}
//             </div>
//           </div>
//         ) : (
//           <div className="flex flex-col items-center justify-center py-12 space-y-3">
//             <Package className="h-12 w-12 text-muted-foreground/50" />
//             <p className="text-muted-foreground">No product details found.</p>
//           </div>
//         )}

//         <div className="flex justify-end pt-6 border-t border-purple-200/50 dark:border-purple-800/30">
//           <Button
//             onClick={() => setOpen(false)}
//             variant="outline"
//             className="min-w-[100px] border-purple-300 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-950/20"
//           >
//             Close
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }






"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

import { Card, CardContent } from "@/components/ui/card";
import { ApiClient } from "@/lib/utils/api-client";
import {
  Package,
  DollarSign,
  Hash,
  Calendar,
  ImageIcon,
  Star,
  Loader2,
  Trash2,
  Palette,
  Heart,
  Truck,
  Scissors,
  
  Info,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";

interface ProductDetailsModalProps {
  productId: number | null;
  trigger?: React.ReactNode;
  category: string;
  onProductDeleted?: () => void;
}

const CATEGORY_ENDPOINTS: Record<string, string> = {
  Decoration: "/decoration",
  Fashion: "/fashion",
  Meditation: "/meditation",
  Accessories: "/accessories",
  HomeLiving: "/living",
};

interface Product {
  id: number;
  title: string;
  name?: string;
  description?: string;
  price: number;
  stock?: number;
  sku: string;
  color?: string;
  care?: string;
  material?: string;
  shippingTime?: string;
  images?: string[];
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
  isDelete?: boolean;
  userId?: string;
  reviews?: string[];
}

export function ProductDetailsModal({
  productId,
  category,
  trigger,
  onProductDeleted,
}: ProductDetailsModalProps) {
  const [open, setOpen] = useState(false);
  const [productDetails, setProductDetails] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (open && productId) {
      const fetchDetails = async () => {
        try {
          setLoading(true);
          setFailedImages(new Set());
          
          const endpoint = CATEGORY_ENDPOINTS[category];
          if (!endpoint) {
            console.error(`Invalid category: ${category}`);
            return;
          }
          const res = await ApiClient.get(`${endpoint}/${productId}`, true);
          const data = await res.json();

          if (data.success) {
            setProductDetails(data.data);
          } else {
            console.error("Failed to fetch product details:", data.message);
          }
        } catch (err) {
          console.error("Error fetching product details:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchDetails();
    }
  }, [open, productId, category]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStockStatus = (stock?: number) => {
    if (stock === undefined || stock === null) return { text: "Unknown", variant: "outline" as const, icon: AlertCircle };
    if (stock === 0) return { text: "Out of Stock", variant: "destructive" as const, icon: XCircle };
    if (stock < 5) return { text: "Low Stock", variant: "secondary" as const, icon: AlertCircle };
    return { text: "In Stock", variant: "default" as const, icon: CheckCircle2 };
  };

  const handleDelete = async () => {
    if (!productId || deleting) return;

    try {
      setDeleting(true);
      const endpoint = CATEGORY_ENDPOINTS[category];
      if (!endpoint) {
        console.error(`Invalid category: ${category}`);
        return;
      }
      const res = await ApiClient.delete(`${endpoint}/${productId}`, true);
      const data = await res.json();

      if (data.success) {
        setOpen(false);
        onProductDeleted?.();
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        console.error("Failed to delete product:", data.message);
      }
    } catch (err) {
      console.error("Error deleting product:", err);
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const stockStatus = productDetails ? getStockStatus(productDetails.stock) : null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <div onClick={() => setOpen(true)}>{trigger}</div>}

      <DialogContent className="w-screen h-screen max-w-none sm:max-w-none max-h-none overflow-hidden bg-white dark:bg-gray-950 border-0 shadow-2xl rounded-none flex flex-col m-0 p-0 top-0 left-0 translate-x-0 translate-y-0">
        <DialogHeader className="pb-6 border-b border-gray-100 dark:border-gray-800 flex-shrink-0 px-6 pt-6">
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1 space-y-2 flex flex-col items-center justify-center text-center">
              <DialogTitle className="text-3xl font-bold text-[#511d5e] dark:text-gray-100 leading-tight">
                {productDetails?.title || productDetails?.name || "Product Details"}
              </DialogTitle>
              {productDetails?.name && productDetails?.title !== productDetails?.name && (
                <p className="text-xl text-gray-600 dark:text-gray-400 font-medium">
                  {productDetails.name}
                </p>
              )}
            </div>
            
            {productDetails && (
              <div className="flex items-center gap-3">
                {!showDeleteConfirm ? (
                  <Button
                    onClick={() => setShowDeleteConfirm(true)}
                    variant="outline"
                    size="sm"
                    className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/20"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                ) : (
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={handleDelete}
                      disabled={deleting}
                      variant="destructive"
                      size="sm"
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {deleting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Deleting...
                        </>
                      ) : (
                        "Confirm Delete"
                      )}
                    </Button>
                    <Button
                      onClick={() => setShowDeleteConfirm(false)}
                      variant="outline"
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogHeader>

        <div className="overflow-y-auto flex-1 px-6 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 dark:scrollbar-track-gray-800 dark:scrollbar-thumb-gray-600">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto" />
                <p className="text-gray-600 dark:text-gray-400 font-medium">
                  Loading product details...
                </p>
              </div>
            </div>
          ) : productDetails ? (
            <div className="space-y-6 py-2">
              {/* Product Images */}
              {productDetails.images && productDetails.images.length > 0 && (
                <Card className="overflow-hidden border-gray-200 dark:border-gray-800">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-[#8a5d95]/30 dark:bg-[#8a5d95]/30 rounded-lg">
                        <ImageIcon className="h-5 w-5 text-[#8a5d95] dark:text-[#8a5d95]" />
                      </div>
                      <h3 className="text-xl font-semibold text-[#511d5e] dark:text-gray-100">
                        Product Gallery
                      </h3>
                    </div>
                    
                    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                      {productDetails.images.map((image: string, index: number) => (
                        <div key={index} className="group relative aspect-square">
                          {!failedImages.has(index) ? (
                            <Image
                              src={
                                image.startsWith("http") || image.startsWith("https")
                                  ? image
                                  : `http://localhost:6015${
                                      image.startsWith("/") ? image : `/${image}`
                                    }`.replace("/public", "")
                              }
                              alt={`${productDetails.title} - Image ${index + 1}`}
                              fill
                              className="object-cover rounded-xl border-2 border-gray-100 dark:border-gray-800 group-hover:border-blue-300 dark:group-hover:border-blue-600 transition-all duration-200 group-hover:shadow-lg"
                              onError={() => {
                                setFailedImages(prev => new Set([...prev, index]));
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                              <div className="text-center space-y-2">
                                <ImageIcon className="h-8 w-8 text-gray-400 mx-auto" />
                                <span className="text-xs text-gray-500">Failed to load</span>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Main Product Information */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                {/* Price & Stock Card */}
                <Card className="border-gray-200 dark:border-gray-800">
                  <CardContent className="p-4">
                    <h3 className="text-xl font-semibold text-[#511d5e] dark:text-gray-100 mb-3">
                      Pricing & Availability
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-green-500 rounded-md">
                            <DollarSign className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <p className="text-xs text-green-700 dark:text-green-300 font-medium">
                              Price
                            </p>
                            <p className="text-lg font-bold text-green-800 dark:text-green-200">
                              ${productDetails.price?.toFixed(2) || "0.00"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {stockStatus && (
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                          <div className="flex items-center gap-2">
                            <div className={`p-1.5 rounded-md ${
                              stockStatus.variant === 'destructive' ? 'bg-red-500' :
                              stockStatus.variant === 'secondary' ? 'bg-orange-500' : 'bg-green-500'
                            }`}>
                              <stockStatus.icon className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                                Stock
                              </p>
                              <div className="flex items-center gap-1">
                                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                  {productDetails.stock ?? "N/A"}
                                </p>
                                <Badge variant={stockStatus.variant} className="text-xs px-1 py-0">
                                  {stockStatus.text}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Product Details Card */}
                <Card className="xl:col-span-2 border-gray-200 dark:border-gray-800">
                  <CardContent className="p-4">
                    <h3 className="text-xl font-semibold text-[#511d5e] dark:text-gray-100 mb-3">
                      Product Information
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className=" flex items-center gap-2 p-4 bg-gray-50 dark:bg-gray-900 rounded-md">
                        <Hash className="h-3 w-3 text-gray-600 dark:text-gray-400" />
                        <div>
                          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">SKU</span>
                          <p className="font-mono text-xs font-semibold text-gray-900 dark:text-gray-100">
                            {productDetails.sku}
                          </p>
                        </div>
                      </div>

                      {productDetails.color && (
                        <div className="flex items-center gap-2 p-4 bg-gray-50 dark:bg-gray-900 rounded-md">
                          <Palette className="h-3 w-3 text-gray-600 dark:text-gray-400" />
                          <div>
                            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Color</span>
                            <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 capitalize">
                              {productDetails.color}
                            </p>
                          </div>
                        </div>
                      )}

                      {productDetails.material && (
                        <div className="flex items-center gap-2 p-4 bg-gray-50 dark:bg-gray-900 rounded-md">
                          <Scissors className="h-3 w-3 text-gray-600 dark:text-gray-400" />
                          <div>
                            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Material</span>
                            <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 capitalize">
                              {productDetails.material}
                            </p>
                          </div>
                        </div>
                      )}

                      {productDetails.shippingTime && (
                        <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-950/20 rounded-md border border-blue-200 dark:border-blue-800">
                          <Truck className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                          <div>
                            <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">Shipping</span>
                            <p className="text-xs font-semibold text-blue-800 dark:text-blue-200">
                              {productDetails.shippingTime}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Description and Care Instructions Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Description */}
                {productDetails.description && (
                  <Card className="border-gray-200 dark:border-gray-800">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-md">
                          <Info className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h3 className="text-base font-semibold text-[#511d5e] dark:text-gray-100">
                          Description
                        </h3>
                      </div>
                      <div className="bg-[#8a5d95]/30 dark:bg-[#8a5d95]/20 p-3 rounded-lg border border-[#8a5d95] dark:border-[#8a5d95]">
                      <p className="px-8 text-base text-black dark:text-black leading-relaxed">
                        {productDetails.description}
                      </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Care Instructions */}
                {productDetails.care && (
                  <Card className="border-gray-200 dark:border-gray-800">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-1.5 bg-[#8a5d95]/30 dark:bg-[#8a5d95]/30 rounded-md">
                          <Heart className="h-4 w-4 text-[#8a5d95] dark:text-[#8a5d95]" />
                        </div>
                          <h3 className="text-base font-semibold text-[#511d5e] dark:text-gray-100">
                          Care Instructions
                        </h3>
                      </div>
                      <div className="bg-[#8a5d95]/30 dark:bg-[#8a5d95]/20 p-3 rounded-lg border border-[#8a5d95] dark:border-[#8a5d95]">
                        <p className="px-8 text-base text-black dark:text-black leading-relaxed">
                          {productDetails.care}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Tags, Reviews and Timeline Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Tags */}
                {productDetails.tags && productDetails.tags.length > 0 && (
                  <Card className="border-gray-200 dark:border-gray-800">
                    <CardContent className="p-4">
                      <h3 className="text-xl font-semibold text-[#511d5e] dark:text-gray-100 mb-3">
                        Tags
                      </h3>
                      <div className="flex flex-wrap gap-1">
                        {productDetails.tags.map((tag: string, index: number) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="px-4 py-0.5 text-base bg-[#8a5d95]/30 dark:bg-[#8a5d95]/30 text-black/80 hover:bg-[#8a5d95]/90 dark:text-[#8a5d95] hover:bg-[#8a5d95]/20 border-[#8a5d95]/60 dark:border-black/60"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Reviews */}
                <Card className="border-gray-200 dark:border-gray-800">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-1.5 bg-[#8a5d95]/30 dark:bg-[#8a5d95]/30 rounded-md">
                        <Star className="h-4 w-4 text-[#8a5d95] dark:text-[#8a5d95]" />
                      </div>
                      <h3 className="text-xl font-semibold text-[#511d5e] dark:text-gray-100">
                        Reviews
                      </h3>
                    </div>
                    
                    {productDetails.reviews && productDetails.reviews.length > 0 ? (
                      <div className="bg-[#8a5d95]/30 dark:bg-[#8a5d95]/20 p-3 rounded-lg border border-[#8a5d95] dark:border-[#8a5d95]">
                        <p className="text-sm text-black dark:text-black font-semibold">
                          {productDetails.reviews.length} review{productDetails.reviews.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    ) : (
                      <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
                        <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                          No reviews yet
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Timeline */}
                <Card className="border-gray-200 dark:border-gray-800">
                  <CardContent className="p-4">
                    <h3 className="text-xl font-semibold text-[#511d5e] dark:text-gray-100 mb-3">
                      Timeline
                    </h3>
                    <div className="space-y-2">
                      {productDetails.createdAt && (
                        <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-950/20 rounded-md border border-green-200 dark:border-green-800">
                          <Calendar className="h-3 w-3 text-green-600 dark:text-green-400" />
                          <div>
                            <span className="text-xs text-green-600 dark:text-green-400 font-medium">Created</span>
                            <p className="text-xs font-semibold text-green-800 dark:text-green-200">
                              {formatDate(productDetails.createdAt)}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {productDetails.updatedAt && productDetails.updatedAt !== productDetails.createdAt && (
                        <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-950/20 rounded-md border border-blue-200 dark:border-blue-800">
                          <Calendar className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                          <div>
                            <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">Updated</span>
                            <p className="text-xs font-semibold text-blue-800 dark:text-blue-200">
                              {formatDate(productDetails.updatedAt)}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded-full">
                <Package className="h-16 w-16 text-gray-400" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  No Product Found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Unable to load product details. Please try again.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-6 border-t border-gray-100 dark:border-gray-800 flex-shrink-0 px-6 pb-6">
          <Button
            onClick={() => setOpen(false)}
            variant="outline"
            className="min-w-[120px] border-gray-300 dark:border-gray-700 hover:bg-[#8a5d95]/70 hover:text-black/80"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}