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

// import { Card, CardContent } from "@/components/ui/card";
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
//   Palette,
//   Heart,
//   Truck,
//   Scissors,
//   Info,
//   AlertCircle,
//   CheckCircle2,
//   XCircle,
//   BookOpen,
//   User,
//   ExternalLink,
//   Download,
//   Globe,
//   Clock,
//   Music,
//   Video,
//   Edit,
// } from "lucide-react";
// import { ProductUpdateModal } from "./product-update-modal";


// interface ProductDetailsModalProps {
//   productId: number | null;
//   trigger?: React.ReactNode;
//   category: string;
//   onProductDeleted?: () => void;
// }

// const CATEGORY_ENDPOINTS: Record<string, string> = {
//   Decoration: "/decoration",
//   Fashion: "/fashion",
//   Meditation: "/meditation",
//   Accessories: "/accessories",
//   HomeLiving: "/living",
//   DigitalBooks: "/digital-books",
//   Audio: "/audio",
// };

// interface BaseProduct {
//   id: number;
//   title: string;
//   description?: string;
//   price: number;
//   createdAt?: string;
//   updatedAt?: string;
//   isDelete?: boolean;
//   userId?: string;
//   reviews?: string[];
// }

// interface RegularProduct extends BaseProduct {
//   name?: string;
//   stock?: number;
//   sku: string;
//   color?: string;
//   care?: string;
//   material?: string;
//   shippingTime?: string;
//   images?: string[];
//   tags?: string[];
// }

// interface DigitalBook extends BaseProduct {
//   author: string;
//   genre: string;
//   releaseDate: string;
//   url: string;
//   coverImage: string;
//   overviewImages?: string[];
//   isAvailable: boolean;
// }

// interface AudioTrack extends BaseProduct {
//   artist: string;
//   duration: number; 
//   mp3Url?: string;
//   mp4Url?: string;
// }

// type Product = RegularProduct | DigitalBook | AudioTrack;

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
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//   const [showUpdateModal, setShowUpdateModal] = useState(false);

//   const isDigitalBook = category === "DigitalBooks";
//   const isAudioTrack = category === "Audio";

//   useEffect(() => {
//     if (open && productId) {
//       const fetchDetails = async () => {
//         try {
//           setLoading(true);
//           setFailedImages(new Set());

//           const endpoint = CATEGORY_ENDPOINTS[category];
//           if (!endpoint) {
//             console.error(`Invalid category: ${category}`);
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

//   const getStockStatus = (stock?: number) => {
//     if (stock === undefined || stock === null)
//       return {
//         text: "Unknown",
//         variant: "outline" as const,
//         icon: AlertCircle,
//       };
//     if (stock === 0)
//       return {
//         text: "Out of Stock",
//         variant: "destructive" as const,
//         icon: XCircle,
//       };
//     if (stock < 5)
//       return {
//         text: "Low Stock",
//         variant: "secondary" as const,
//         icon: AlertCircle,
//       };
//     return {
//       text: "In Stock",
//       variant: "default" as const,
//       icon: CheckCircle2,
//     };
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
//         onProductDeleted?.();
//         setTimeout(() => {
//           window.location.reload();
//         }, 500);
//       } else {
//         console.error("Failed to delete product:", data.message);
//       }
//     } catch (err) {
//       console.error("Error deleting product:", err);
//     } finally {
//       setDeleting(false);
//       setShowDeleteConfirm(false);
//     }
//   };

//   const regularProduct = !isDigitalBook
//     ? (productDetails as RegularProduct)
//     : null;
//   const digitalBook = isDigitalBook ? (productDetails as DigitalBook) : null;
//   const audioTrack = isAudioTrack ? (productDetails as AudioTrack) : null;
//   const stockStatus = regularProduct
//     ? getStockStatus(regularProduct.stock)
//     : null;

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       {trigger && <div onClick={() => setOpen(true)}>{trigger}</div>}

//       <DialogContent className="w-screen h-screen max-w-none sm:max-w-none max-h-none overflow-hidden bg-white dark:bg-gray-950 border-0 shadow-2xl rounded-none flex flex-col m-0 p-0 top-0 left-0 translate-x-0 translate-y-0">
//         <DialogHeader className="pb-6 border-b border-gray-100 dark:border-gray-800 flex-shrink-0 px-6 pt-6">
//           <div className="flex items-start justify-between gap-6">
//             <div className="flex-1 space-y-2 flex flex-col items-center justify-center text-center">
//               <DialogTitle className="text-3xl font-bold text-[#511d5e] dark:text-gray-100 leading-tight">
//                 {productDetails?.title || "Product Details"}
//               </DialogTitle>
//               {digitalBook?.author && (
//                 <p className="text-xl text-gray-600 dark:text-gray-400 font-medium">
//                   By {digitalBook.author}
//                 </p>
//               )}
//               {regularProduct?.name &&
//                 regularProduct?.title !== regularProduct?.name && (
//                   <p className="text-xl text-gray-600 dark:text-gray-400 font-medium">
//                     {regularProduct.name}
//                   </p>
//                 )}
//             </div>

//             {productDetails && (
//               <div className="flex items-center gap-3">
//                 <Button
//                   onClick={() => setShowUpdateModal(true)}
//                   variant="outline"
//                   size="sm"
//                   className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-950/20"
//                 >
//                   <Edit className="h-4 w-4 mr-2" />
//                   Update
//                 </Button>
//                 {!showDeleteConfirm ? (
//                   <Button
//                     onClick={() => setShowDeleteConfirm(true)}
//                     variant="outline"
//                     size="sm"
//                     className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/20"
//                   >
//                     <Trash2 className="h-4 w-4 mr-2" />
//                     Delete
//                   </Button>
//                 ) : (
//                   <div className="flex items-center gap-2">
//                     <Button
//                       onClick={handleDelete}
//                       disabled={deleting}
//                       variant="destructive"
//                       size="sm"
//                       className="bg-red-600 hover:bg-red-700"
//                     >
//                       {deleting ? (
//                         <>
//                           <Loader2 className="h-4 w-4 animate-spin mr-2" />
//                           Deleting...
//                         </>
//                       ) : (
//                         "Confirm Delete"
//                       )}
//                     </Button>
//                     <Button
//                       onClick={() => setShowDeleteConfirm(false)}
//                       variant="outline"
//                       size="sm"
//                     >
//                       Cancel
//                     </Button>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         </DialogHeader>

//         <div className="overflow-y-auto flex-1 px-6 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 dark:scrollbar-track-gray-800 dark:scrollbar-thumb-gray-600">
//           {loading ? (
//             <div className="flex items-center justify-center py-20">
//               <div className="text-center space-y-4">
//                 <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto" />
//                 <p className="text-gray-600 dark:text-gray-400 font-medium">
//                   Loading {isDigitalBook ? "book" : "product"} details...
//                 </p>
//               </div>
//             </div>
//           ) : productDetails ? (
//             <div className="space-y-6 py-2">
//               {/* Digital Book Cover Image */}
//               {isDigitalBook && digitalBook?.coverImage && (
//                 <Card className="overflow-hidden border-gray-200 dark:border-gray-800">
//                   <CardContent className="p-6">
//                     <div className="flex items-center gap-3 mb-4">
//                       <div className="p-2 bg-[#8a5d95]/30 dark:bg-[#8a5d95]/30 rounded-lg">
//                         <BookOpen className="h-5 w-5 text-[#8a5d95] dark:text-[#8a5d95]" />
//                       </div>
//                       <h3 className="text-xl font-semibold text-[#511d5e] dark:text-gray-100">
//                         Book Cover
//                       </h3>
//                     </div>

//                     <div className="flex justify-center">
//                       <div className="relative aspect-[3/4] w-64">
//                         <Image
//                           src={digitalBook.coverImage}
//                           alt={`${digitalBook.title} cover`}
//                           fill
//                           className="object-cover rounded-xl border-2 border-gray-100 dark:border-gray-800 shadow-lg"
//                         />
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               )}

//               {/* Regular Product Images */}
//               {!isDigitalBook &&
//                 regularProduct?.images &&
//                 regularProduct.images.length > 0 && (
//                   <Card className="overflow-hidden border-gray-200 dark:border-gray-800">
//                     <CardContent className="p-6">
//                       <div className="flex items-center gap-3 mb-4">
//                         <div className="p-2 bg-[#8a5d95]/30 dark:bg-[#8a5d95]/30 rounded-lg">
//                           <ImageIcon className="h-5 w-5 text-[#8a5d95] dark:text-[#8a5d95]" />
//                         </div>
//                         <h3 className="text-xl font-semibold text-[#511d5e] dark:text-gray-100">
//                           Product Gallery
//                         </h3>
//                       </div>

//                       <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
//                         {regularProduct.images.map(
//                           (image: string, index: number) => (
//                             <div
//                               key={index}
//                               className="group relative aspect-square"
//                             >
//                               {!failedImages.has(index) ? (
//                                 <Image
//                                   src={
//                                     image.startsWith("http") ||
//                                     image.startsWith("https")
//                                       ? image
//                                       : `http://localhost:6015${
//                                           image.startsWith("/")
//                                             ? image
//                                             : `/${image}`
//                                         }`.replace("/public", "")
//                                   }
//                                   alt={`${regularProduct.title} - Image ${
//                                     index + 1
//                                   }`}
//                                   fill
//                                   className="object-cover rounded-xl border-2 border-gray-100 dark:border-gray-800 group-hover:border-blue-300 dark:group-hover:border-blue-600 transition-all duration-200 group-hover:shadow-lg"
//                                   onError={() => {
//                                     setFailedImages(
//                                       (prev) => new Set([...prev, index])
//                                     );
//                                   }}
//                                 />
//                               ) : (
//                                 <div className="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
//                                   <div className="text-center space-y-2">
//                                     <ImageIcon className="h-8 w-8 text-gray-400 mx-auto" />
//                                     <span className="text-xs text-gray-500">
//                                       Failed to load
//                                     </span>
//                                   </div>
//                                 </div>
//                               )}
//                             </div>
//                           )
//                         )}
//                       </div>
//                     </CardContent>
//                   </Card>
//                 )}

//               {/* Digital Book Overview Images */}
//               {isDigitalBook &&
//                 digitalBook?.overviewImages &&
//                 digitalBook.overviewImages.length > 0 && (
//                   <Card className="overflow-hidden border-gray-200 dark:border-gray-800">
//                     <CardContent className="p-6">
//                       <div className="flex items-center gap-3 mb-4">
//                         <div className="p-2 bg-[#8a5d95]/30 dark:bg-[#8a5d95]/30 rounded-lg">
//                           <ImageIcon className="h-5 w-5 text-[#8a5d95] dark:text-[#8a5d95]" />
//                         </div>
//                         <h3 className="text-xl font-semibold text-[#511d5e] dark:text-gray-100">
//                           Book Overview
//                         </h3>
//                       </div>

//                       <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
//                         {digitalBook.overviewImages.map(
//                           (image: string, index: number) => (
//                             <div
//                               key={index}
//                               className="group relative aspect-square"
//                             >
//                               <Image
//                                 src={image}
//                                 alt={`${digitalBook.title} - Overview ${
//                                   index + 1
//                                 }`}
//                                 fill
//                                 className="object-cover rounded-xl border-2 border-gray-100 dark:border-gray-800 group-hover:border-blue-300 dark:group-hover:border-blue-600 transition-all duration-200 group-hover:shadow-lg"
//                               />
//                             </div>
//                           )
//                         )}
//                       </div>
//                     </CardContent>
//                   </Card>
//                 )}

//               {/* Main Information */}
//               <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
//                 {/* Price & Status Card */}
//                 <Card className="border-gray-200 dark:border-gray-800">
//                   <CardContent className="p-4">
//                     <h3 className="text-xl font-semibold text-[#511d5e] dark:text-gray-100 mb-3">
//                       {isDigitalBook
//                         ? "Pricing & Availability"
//                         : "Pricing & Stock"}
//                     </h3>

//                     <div className="space-y-3">
//                       <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg border border-green-200 dark:border-green-800">
//                         <div className="flex items-center gap-2">
//                           <div className="p-1.5 bg-green-500 rounded-md">
//                             <DollarSign className="h-4 w-4 text-white" />
//                           </div>
//                           <div>
//                             <p className="text-xs text-green-700 dark:text-green-300 font-medium">
//                               Price
//                             </p>
//                             <p className="text-lg font-bold text-green-800 dark:text-green-200">
//                               ${productDetails.price?.toFixed(2) || "0.00"}
//                             </p>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Digital Book Availability */}
//                       {isDigitalBook && digitalBook && (
//                         <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
//                           <div className="flex items-center gap-2">
//                             <div
//                               className={`p-1.5 rounded-md ${
//                                 digitalBook.isAvailable
//                                   ? "bg-green-500"
//                                   : "bg-red-500"
//                               }`}
//                             >
//                               {digitalBook.isAvailable ? (
//                                 <CheckCircle2 className="h-4 w-4 text-white" />
//                               ) : (
//                                 <XCircle className="h-4 w-4 text-white" />
//                               )}
//                             </div>
//                             <div>
//                               <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
//                                 Status
//                               </p>
//                               <div className="flex items-center gap-1">
//                                 <Badge
//                                   variant={
//                                     digitalBook.isAvailable
//                                       ? "default"
//                                       : "destructive"
//                                   }
//                                   className="text-xs px-2 py-1"
//                                 >
//                                   {digitalBook.isAvailable
//                                     ? "Available"
//                                     : "Unavailable"}
//                                 </Badge>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       )}

//                       {/* Regular Product Stock */}
//                       {!isDigitalBook && stockStatus && (
//                         <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
//                           <div className="flex items-center gap-2">
//                             <div
//                               className={`p-1.5 rounded-md ${
//                                 stockStatus.variant === "destructive"
//                                   ? "bg-red-500"
//                                   : stockStatus.variant === "secondary"
//                                   ? "bg-orange-500"
//                                   : "bg-green-500"
//                               }`}
//                             >
//                               <stockStatus.icon className="h-4 w-4 text-white" />
//                             </div>
//                             <div>
//                               <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
//                                 Stock
//                               </p>
//                               <div className="flex items-center gap-1">
//                                 <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
//                                   {regularProduct?.stock ?? "N/A"}
//                                 </p>
//                                 <Badge
//                                   variant={stockStatus.variant}
//                                   className="text-xs px-1 py-0"
//                                 >
//                                   {stockStatus.text}
//                                 </Badge>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </CardContent>
//                 </Card>

//                 {/* Product/Book Details Card */}
//                 <Card className="xl:col-span-2 border-gray-200 dark:border-gray-800">
//                   <CardContent className="p-4">
//                     <h3 className="text-xl font-semibold text-[#511d5e] dark:text-gray-100 mb-3">
//                       {isDigitalBook
//                         ? "Book Information"
//                         : isAudioTrack 
//           ? "Audio Track Information" 
//                         : "Product Information"}
//                     </h3>

//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
//                       {/* Digital Book Fields */}
//                       {isDigitalBook && digitalBook && (
//                         <>
//                           <div className="flex items-center gap-2 p-4 bg-gray-50 dark:bg-gray-900 rounded-md">
//                             <User className="h-3 w-3 text-gray-600 dark:text-gray-400" />
//                             <div>
//                               <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
//                                 Author
//                               </span>
//                               <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">
//                                 {digitalBook.author}
//                               </p>
//                             </div>
//                           </div>

//                           <div className="flex items-center gap-2 p-4 bg-gray-50 dark:bg-gray-900 rounded-md">
//                             <BookOpen className="h-3 w-3 text-gray-600 dark:text-gray-400" />
//                             <div>
//                               <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
//                                 Genre
//                               </span>
//                               <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">
//                                 {digitalBook.genre}
//                               </p>
//                             </div>
//                           </div>

//                           <div className="flex items-center gap-2 p-4 bg-gray-50 dark:bg-gray-900 rounded-md">
//                             <Calendar className="h-3 w-3 text-gray-600 dark:text-gray-400" />
//                             <div>
//                               <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
//                                 Release Date
//                               </span>
//                               <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">
//                                 {new Date(
//                                   digitalBook.releaseDate
//                                 ).toLocaleDateString()}
//                               </p>
//                             </div>
//                           </div>

//                           <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-950/20 rounded-md border border-blue-200 dark:border-blue-800">
//                             <Globe className="h-3 w-3 text-blue-600 dark:text-blue-400" />
//                             <div>
//                               <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
//                                 Access Link
//                               </span>
//                               <div className="flex items-center gap-2 mt-1">
//                                 <Button
//                                   asChild
//                                   variant="outline"
//                                   size="sm"
//                                   className="text-xs px-2 py-1 h-auto border-blue-300 text-blue-700 hover:bg-blue-50"
//                                 >
//                                   <a
//                                     href={digitalBook.url}
//                                     target="_blank"
//                                     rel="noopener noreferrer"
//                                     className="flex items-center gap-1"
//                                   >
//                                     <Download className="h-3 w-3" />
//                                     Open Book
//                                     <ExternalLink className="h-3 w-3" />
//                                   </a>
//                                 </Button>
//                               </div>
//                             </div>
//                           </div>
//                         </>
//                       )}

//                       {/* Regular Product Fields */}
//                       {!isDigitalBook && !isAudioTrack && regularProduct && (
//                         <>
//                           <div className="flex items-center gap-2 p-4 bg-gray-50 dark:bg-gray-900 rounded-md">
//                             <Hash className="h-3 w-3 text-gray-600 dark:text-gray-400" />
//                             <div>
//                               <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
//                                 SKU
//                               </span>
//                               <p className="font-mono text-xs font-semibold text-gray-900 dark:text-gray-100">
//                                 {regularProduct.sku}
//                               </p>
//                             </div>
//                           </div>

//                           {regularProduct.color && (
//                             <div className="flex items-center gap-2 p-4 bg-gray-50 dark:bg-gray-900 rounded-md">
//                               <Palette className="h-3 w-3 text-gray-600 dark:text-gray-400" />
//                               <div>
//                                 <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
//                                   Color
//                                 </span>
//                                 <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 capitalize">
//                                   {regularProduct.color}
//                                 </p>
//                               </div>
//                             </div>
//                           )}

//                           {regularProduct.material && (
//                             <div className="flex items-center gap-2 p-4 bg-gray-50 dark:bg-gray-900 rounded-md">
//                               <Scissors className="h-3 w-3 text-gray-600 dark:text-gray-400" />
//                               <div>
//                                 <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
//                                   Material
//                                 </span>
//                                 <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 capitalize">
//                                   {regularProduct.material}
//                                 </p>
//                               </div>
//                             </div>
//                           )}

//                           {regularProduct.shippingTime && (
//                             <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-950/20 rounded-md border border-blue-200 dark:border-blue-800">
//                               <Truck className="h-3 w-3 text-blue-600 dark:text-blue-400" />
//                               <div>
//                                 <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
//                                   Shipping
//                                 </span>
//                                 <p className="text-xs font-semibold text-blue-800 dark:text-blue-200">
//                                   {regularProduct.shippingTime}
//                                 </p>
//                               </div>
//                             </div>
//                           )}
//                         </>
//                       )}
//                       {isAudioTrack && audioTrack && (
//                         <>
//                           <div className="flex items-center gap-2 p-4 bg-gray-50 dark:bg-gray-900 rounded-md">
//                             <User className="h-3 w-3 text-gray-600 dark:text-gray-400" />
//                             <div>
//                               <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
//                                 Artist
//                               </span>
//                               <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">
//                                 {audioTrack.artist}
//                               </p>
//                             </div>
//                           </div>

//                           <div className="flex items-center gap-2 p-4 bg-gray-50 dark:bg-gray-900 rounded-md">
//                             <Clock className="h-3 w-3 text-gray-600 dark:text-gray-400" />
//                             <div>
//                               <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
//                                 Duration
//                               </span>
//                               <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">
//                                 {audioTrack.duration} seconds
//                               </p>
//                             </div>
//                           </div>

//                           {audioTrack.mp3Url && (
//                             <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-950/20 rounded-md border border-blue-200 dark:border-blue-800">
//                               <Music className="h-3 w-3 text-blue-600 dark:text-blue-400" />
//                               <div>
//                                 <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
//                                   MP3 File
//                                 </span>
//                                 <div className="flex items-center gap-2 mt-1">
//                                   <Button
//                                     asChild
//                                     variant="outline"
//                                     size="sm"
//                                     className="text-xs px-2 py-1 h-auto border-blue-300 text-blue-700 hover:bg-blue-50"
//                                   >
//                                     <a
//                                       href={audioTrack.mp3Url}
//                                       target="_blank"
//                                       rel="noopener noreferrer"
//                                       className="flex items-center gap-1"
//                                     >
//                                       <Download className="h-3 w-3" />
//                                       Download MP3
//                                       <ExternalLink className="h-3 w-3" />
//                                     </a>
//                                   </Button>
//                                 </div>
//                               </div>
//                             </div>
//                           )}

//                           {audioTrack.mp4Url && (
//                             <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-950/20 rounded-md border border-green-200 dark:border-green-800">
//                               <Video className="h-3 w-3 text-green-600 dark:text-green-400" />
//                               <div>
//                                 <span className="text-xs text-green-600 dark:text-green-400 font-medium">
//                                   MP4 File
//                                 </span>
//                                 <div className="flex items-center gap-2 mt-1">
//                                   <Button
//                                     asChild
//                                     variant="outline"
//                                     size="sm"
//                                     className="text-xs px-2 py-1 h-auto border-green-300 text-green-700 hover:bg-green-50"
//                                   >
//                                     <a
//                                       href={audioTrack.mp4Url}
//                                       target="_blank"
//                                       rel="noopener noreferrer"
//                                       className="flex items-center gap-1"
//                                     >
//                                       <Download className="h-3 w-3" />
//                                       Download MP4
//                                       <ExternalLink className="h-3 w-3" />
//                                     </a>
//                                   </Button>
//                                 </div>
//                               </div>
//                             </div>
//                           )}
//                         </>
//                       )}
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>

//               {/* Description and Care Instructions Row */}
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//                 {/* Description */}
//                 {productDetails.description && (
//                   <Card className="border-gray-200 dark:border-gray-800">
//                     <CardContent className="p-4">
//                       <div className="flex items-center gap-2 mb-3">
//                         <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-md">
//                           <Info className="h-4 w-4 text-purple-600 dark:text-purple-400" />
//                         </div>
//                         <h3 className="text-base font-semibold text-[#511d5e] dark:text-gray-100">
//                           Description
//                         </h3>
//                       </div>
//                       <div className="bg-[#8a5d95]/30 dark:bg-[#8a5d95]/20 p-3 rounded-lg border border-[#8a5d95] dark:border-[#8a5d95]">
//                         <p className="px-8 text-base text-black dark:text-black leading-relaxed">
//                           {productDetails.description}
//                         </p>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 )}

//                 {/* Care Instructions (only for regular products) */}
//                 {!isDigitalBook && regularProduct?.care && (
//                   <Card className="border-gray-200 dark:border-gray-800">
//                     <CardContent className="p-4">
//                       <div className="flex items-center gap-2 mb-3">
//                         <div className="p-1.5 bg-[#8a5d95]/30 dark:bg-[#8a5d95]/30 rounded-md">
//                           <Heart className="h-4 w-4 text-[#8a5d95] dark:text-[#8a5d95]" />
//                         </div>
//                         <h3 className="text-base font-semibold text-[#511d5e] dark:text-gray-100">
//                           Care Instructions
//                         </h3>
//                       </div>
//                       <div className="bg-[#8a5d95]/30 dark:bg-[#8a5d95]/20 p-3 rounded-lg border border-[#8a5d95] dark:border-[#8a5d95]">
//                         <p className="px-8 text-base text-black dark:text-black leading-relaxed">
//                           {regularProduct.care}
//                         </p>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 )}
//               </div>

//               {/* Tags, Reviews and Timeline Row */}
//               <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
//                 {/* Tags (only for regular products) */}
//                 {!isDigitalBook &&
//                   regularProduct?.tags &&
//                   regularProduct.tags.length > 0 && (
//                     <Card className="border-gray-200 dark:border-gray-800">
//                       <CardContent className="p-4">
//                         <h3 className="text-xl font-semibold text-[#511d5e] dark:text-gray-100 mb-3">
//                           Tags
//                         </h3>
//                         <div className="flex flex-wrap gap-1">
//                           {regularProduct.tags.map(
//                             (tag: string, index: number) => (
//                               <Badge
//                                 key={index}
//                                 variant="secondary"
//                                 className="px-4 py-0.5 text-base bg-[#8a5d95]/30 dark:bg-[#8a5d95]/30 text-black/80 hover:bg-[#8a5d95]/90 dark:text-[#8a5d95] hover:bg-[#8a5d95]/20 border-[#8a5d95]/60 dark:border-black/60"
//                               >
//                                 {tag}
//                               </Badge>
//                             )
//                           )}
//                         </div>
//                       </CardContent>
//                     </Card>
//                   )}

//                 {/* Reviews */}
//                 <Card className="border-gray-200 dark:border-gray-800">
//                   <CardContent className="p-4">
//                     <div className="flex items-center gap-2 mb-3">
//                       <div className="p-1.5 bg-[#8a5d95]/30 dark:bg-[#8a5d95]/30 rounded-md">
//                         <Star className="h-4 w-4 text-[#8a5d95] dark:text-[#8a5d95]" />
//                       </div>
//                       <h3 className="text-xl font-semibold text-[#511d5e] dark:text-gray-100">
//                         Reviews
//                       </h3>
//                     </div>

//                     {productDetails.reviews &&
//                     productDetails.reviews.length > 0 ? (
//                       <div className="bg-[#8a5d95]/30 dark:bg-[#8a5d95]/20 p-3 rounded-lg border border-[#8a5d95] dark:border-[#8a5d95]">
//                         <p className="text-sm text-black dark:text-black font-semibold">
//                           {productDetails.reviews.length} review
//                           {productDetails.reviews.length !== 1 ? "s" : ""}
//                         </p>
//                       </div>
//                     ) : (
//                       <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
//                         <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
//                           No reviews yet
//                         </p>
//                       </div>
//                     )}
//                   </CardContent>
//                 </Card>

//                 {/* Timeline */}
//                 <Card className="border-gray-200 dark:border-gray-800">
//                   <CardContent className="p-4">
//                     <h3 className="text-xl font-semibold text-[#511d5e] dark:text-gray-100 mb-3">
//                       Timeline
//                     </h3>
//                     <div className="space-y-2">
//                       {productDetails.createdAt && (
//                         <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-950/20 rounded-md border border-green-200 dark:border-green-800">
//                           <Calendar className="h-3 w-3 text-green-600 dark:text-green-400" />
//                           <div>
//                             <span className="text-xs text-green-600 dark:text-green-400 font-medium">
//                               Created
//                             </span>
//                             <p className="text-xs font-semibold text-green-800 dark:text-green-200">
//                               {formatDate(productDetails.createdAt)}
//                             </p>
//                           </div>
//                         </div>
//                       )}

//                       {productDetails.updatedAt &&
//                         productDetails.updatedAt !==
//                           productDetails.createdAt && (
//                           <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-950/20 rounded-md border border-blue-200 dark:border-blue-800">
//                             <Calendar className="h-3 w-3 text-blue-600 dark:text-blue-400" />
//                             <div>
//                               <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
//                                 Updated
//                               </span>
//                               <p className="text-xs font-semibold text-blue-800 dark:text-blue-200">
//                                 {formatDate(productDetails.updatedAt)}
//                               </p>
//                             </div>
//                           </div>
//                         )}

//                       {/* Digital Book Release Date in Timeline */}
//                       {isDigitalBook && digitalBook?.releaseDate && (
//                         <div className="flex items-center gap-2 p-2 bg-purple-50 dark:bg-purple-950/20 rounded-md border border-purple-200 dark:border-purple-800">
//                           <BookOpen className="h-3 w-3 text-purple-600 dark:text-purple-400" />
//                           <div>
//                             <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">
//                               Released
//                             </span>
//                             <p className="text-xs font-semibold text-purple-800 dark:text-purple-200">
//                               {formatDate(digitalBook.releaseDate)}
//                             </p>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>
//             </div>
//           ) : (
//             <div className="flex flex-col items-center justify-center py-20 space-y-4">
//               <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded-full">
//                 {isDigitalBook ? (
//                   <BookOpen className="h-16 w-16 text-gray-400" />
//                 ) : (
//                   <Package className="h-16 w-16 text-gray-400" />
//                 )}
//               </div>
//               <div className="text-center">
//                 <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
//                   No {isDigitalBook ? "Book" : "Product"} Found
//                 </h3>
//                 <p className="text-gray-600 dark:text-gray-400">
//                   Unable to load {isDigitalBook ? "book" : "product"} details.
//                   Please try again.
//                 </p>
//               </div>
//             </div>
//           )}
//         </div>

//         <div className="flex justify-end pt-6 border-t border-gray-100 dark:border-gray-800 flex-shrink-0 px-6 pb-6">
//           <Button
//             onClick={() => setOpen(false)}
//             variant="outline"
//             className="min-w-[120px] border-gray-300 dark:border-gray-700 hover:bg-[#8a5d95]/70 hover:text-black/80"
//           >
//             Close
//           </Button>
//         </div>
//       </DialogContent>

//       {/* Update Modal */}
//       <ProductUpdateModal
//         productId={productId}
//         category={category}
//         isOpen={showUpdateModal}
//         onClose={() => setShowUpdateModal(false)}
//         onProductUpdated={() => {
//           // Refresh the product details after update
//           if (open && productId) {
//             const fetchDetails = async () => {
//               try {
//                 setLoading(true);
//                 const endpoint = CATEGORY_ENDPOINTS[category];
//                 if (!endpoint) {
//                   console.error(`Invalid category: ${category}`);
//                   return;
//                 }
//                 const res = await ApiClient.get(`${endpoint}/${productId}`, true);
//                 const data = await res.json();

//                 if (data.success) {
//                   setProductDetails(data.data);
//                 } else {
//                   console.error("Failed to fetch product details:", data.message);
//                 }
//               } catch (err) {
//                 console.error("Error fetching product details:", err);
//               } finally {
//                 setLoading(false);
//               }
//             };
//             fetchDetails();
//           }
//         }}
//       />
//     </Dialog>
//   );
// }



"use client"
import Image from "next/image"
import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ApiClient } from "@/lib/utils/api-client"
import {
  Package,
  DollarSign,
  Hash,
  ImageIcon,
  Star,
  Loader2,
  Trash2,
  Palette,
  Heart,
  Truck,
  Info,
  AlertCircle,
  CheckCircle2,
  XCircle,
  BookOpen,
  User,
  Download,
  Clock,
  Edit,
} from "lucide-react"
import { ProductUpdateModal } from "./product-update-modal"

interface ProductDetailsModalProps {
  productId: number | null
  trigger?: React.ReactNode
  category: string
  onProductDeleted?: () => void
}

const CATEGORY_ENDPOINTS: Record<string, string> = {
  Decoration: "/decoration",
  Fashion: "/fashion",
  Meditation: "/meditation",
  Accessories: "/accessories",
  HomeLiving: "/living",
  DigitalBooks: "/digital-books",
  Audio: "/audio",
}

interface BaseProduct {
  id: number
  title: string
  description?: string
  price: number
  createdAt?: string
  updatedAt?: string
  isDelete?: boolean
  userId?: string
  reviews?: string[]
}

interface RegularProduct extends BaseProduct {
  name?: string
  stock?: number
  sku: string
  color?: string
  care?: string
  material?: string
  shippingTime?: string
  images?: string[]
  tags?: string[]
}

interface DigitalBook extends BaseProduct {
  author: string
  genre: string
  releaseDate: string
  url: string
  coverImage: string
  overviewImages?: string[]
  isAvailable: boolean
}

interface AudioTrack extends BaseProduct {
  artist: string
  duration: number
  mp3Url?: string
  mp4Url?: string
}

type Product = RegularProduct | DigitalBook | AudioTrack

export function ProductDetailsModal({ productId, category, trigger, onProductDeleted }: ProductDetailsModalProps) {
  const [open, setOpen] = useState(false)
  const [productDetails, setProductDetails] = useState<Product | null>(null)
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set())
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)

  const isDigitalBook = category === "DigitalBooks"
  // const isAudioTrack = category === "Audio"

  useEffect(() => {
    if (open && productId) {
      const fetchDetails = async () => {
        try {
          setLoading(true)
          setFailedImages(new Set())

          const endpoint = CATEGORY_ENDPOINTS[category]
          if (!endpoint) {
            console.error(`Invalid category: ${category}`)
            return
          }
          const res = await ApiClient.get(`${endpoint}/${productId}`, true)
          const data = await res.json()

          if (data.success) {
            setProductDetails(data.data)
          } else {
            console.error("Failed to fetch product details:", data.message)
          }
        } catch (err) {
          console.error("Error fetching product details:", err)
        } finally {
          setLoading(false)
        }
      }

      fetchDetails()
    }
  }, [open, productId, category])


  // const getStockStatus = (stock?: number) => {
  //   if (stock === undefined || stock === null)
  //     return {
  //       text: "Unknown",
  //       variant: "outline" as const,
  //       icon: AlertCircle,
  //     }
  //   if (stock === 0)
  //     return {
  //       text: "Out of Stock",
  //       variant: "destructive" as const,
  //       icon: XCircle,
  //     }
  //   if (stock < 5)
  //     return {
  //       text: "Low Stock",
  //       variant: "secondary" as const,
  //       icon: AlertCircle,
  //     }
  //   return {
  //     text: "In Stock",
  //     variant: "default" as const,
  //     icon: CheckCircle2,
  //   }
  // }

  const handleDelete = async () => {
    if (!productId || deleting) return

    try {
      setDeleting(true)
      const endpoint = CATEGORY_ENDPOINTS[category]
      if (!endpoint) {
        console.error(`Invalid category: ${category}`)
        return
      }
      const res = await ApiClient.delete(`${endpoint}/${productId}`, true)
      const data = await res.json()

      if (data.success) {
        setOpen(false)
        onProductDeleted?.()
        setTimeout(() => {
          window.location.reload()
        }, 500)
      } else {
        console.error("Failed to delete product:", data.message)
      }
    } catch (err) {
      console.error("Error deleting product:", err)
    } finally {
      setDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  const regularProduct = !isDigitalBook ? (productDetails as RegularProduct) : null
  const digitalBook = isDigitalBook ? (productDetails as DigitalBook) : null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <div onClick={() => setOpen(true)}>{trigger}</div>}

      <DialogContent className="w-screen h-screen max-w-none sm:max-w-none max-h-none overflow-hidden bg-white dark:bg-gray-950 border-0 shadow-2xl rounded-none flex flex-col m-0 p-0 top-0 left-0 translate-x-0 translate-y-0">
        <DialogHeader className="pb-4 sm:pb-6 border-b border-gray-100 dark:border-gray-800 flex-shrink-0 px-4 sm:px-6 pt-4 sm:pt-6">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4 sm:gap-6">
            <div className="flex-1 space-y-1 sm:space-y-2 flex flex-col items-center justify-center text-center">
              <DialogTitle className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#511d5e] dark:text-gray-100 leading-tight">
                {productDetails?.title || "Product Details"}
              </DialogTitle>
              {digitalBook?.author && (
                <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400 font-medium">
                  By {digitalBook.author}
                </p>
              )}
              {regularProduct?.name && regularProduct?.title !== regularProduct?.name && (
                <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400 font-medium">
                  {regularProduct.name}
                </p>
              )}
            </div>

            {productDetails && (
              <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-center sm:justify-end">
                <Button
                  onClick={() => setShowUpdateModal(true)}
                  variant="outline"
                  size="sm"
                  className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-950/20 text-xs sm:text-sm"
                >
                  <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Update
                </Button>
                {!showDeleteConfirm ? (
                  <Button
                    onClick={() => setShowDeleteConfirm(true)}
                    variant="outline"
                    size="sm"
                    className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/20 text-xs sm:text-sm"
                  >
                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    Delete
                  </Button>
                ) : (
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={handleDelete}
                      disabled={deleting}
                      variant="destructive"
                      size="sm"
                      className="bg-red-600 hover:bg-red-700 text-xs sm:text-sm"
                    >
                      {deleting ? (
                        <>
                          <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin mr-1 sm:mr-2" />
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
                      className="text-xs sm:text-sm"
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogHeader>

        <div className="overflow-y-auto flex-1 px-4 sm:px-6 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 dark:scrollbar-track-gray-800 dark:scrollbar-thumb-gray-600">
          {loading ? (
            <div className="flex items-center justify-center py-12 sm:py-20">
              <div className="text-center space-y-4">
                <Loader2 className="h-8 w-8 sm:h-12 sm:w-12 animate-spin text-[#684570] mx-auto" />
                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">Loading product details...</p>
              </div>
            </div>
          ) : !productDetails ? (
            <div className="flex items-center justify-center py-12 sm:py-20">
              <div className="text-center space-y-4">
                <AlertCircle className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto" />
                <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400">Product not found</p>
              </div>
            </div>
          ) : (
            <div className="py-4 sm:py-6 lg:py-8 space-y-6 sm:space-y-8">
              {/* Hero Section with Images */}
              <div className="bg-gradient-to-br from-[#39243d]/5 to-[#684570]/5 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-[#684570]/10">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
                  {/* Images Section */}
                  <div className="space-y-4 sm:space-y-6">
                    <h3 className="text-lg sm:text-xl font-semibold text-[#39243d] dark:text-gray-200 flex items-center gap-2">
                      <ImageIcon className="h-4 w-4 sm:h-5 sm:w-5 text-[#684570]" />
                      Product Images
                    </h3>

                    {isDigitalBook && digitalBook?.coverImage ? (
                      <div className="flex justify-center">
                        <div className="relative group">
                          <div className="aspect-[3/4] w-48 sm:w-56 lg:w-64 rounded-xl overflow-hidden bg-gradient-to-br from-[#39243d]/10 to-[#684570]/10 border-2 border-[#684570]/20">
                            <Image
                              src={digitalBook.coverImage || "/placeholder.svg"}
                              alt={`${digitalBook.title} cover`}
                              fill
                              className="object-cover transition-transform group-hover:scale-105"
                              onError={() => setFailedImages((prev) => new Set(prev).add(0))}
                            />
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-[#39243d]/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    ) : regularProduct?.images && regularProduct.images.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        {regularProduct.images.slice(0, 4).map((image, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-[#39243d]/10 to-[#684570]/10 border-2 border-[#684570]/20">
                              {!failedImages.has(index) ? (
                                <Image
                                  src={image || "/placeholder.svg"}
                                  alt={`${regularProduct.title} - Image ${index + 1}`}
                                  fill
                                  className="object-cover transition-transform group-hover:scale-105"
                                  onError={() => setFailedImages((prev) => new Set(prev).add(index))}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <ImageIcon className="h-8 w-8 sm:h-12 sm:w-12 text-[#684570]/40" />
                                </div>
                              )}
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-[#39243d]/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="aspect-square rounded-xl bg-gradient-to-br from-[#39243d]/10 to-[#684570]/10 border-2 border-dashed border-[#684570]/30 flex items-center justify-center">
                        <div className="text-center space-y-2">
                          <ImageIcon className="h-12 w-12 sm:h-16 sm:w-16 text-[#684570]/40 mx-auto" />
                          <p className="text-sm sm:text-base text-[#684570]/60 font-medium">No images available</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Key Information */}
                  <div className="space-y-4 sm:space-y-6">
                    <h3 className="text-lg sm:text-xl font-semibold text-[#39243d] dark:text-gray-200 flex items-center gap-2">
                      <Info className="h-4 w-4 sm:h-5 sm:w-5 text-[#684570]" />
                      Key Information
                    </h3>

                    <div className="grid gap-3 sm:gap-4">
                      {/* Price */}
                      <div className="bg-white dark:bg-gray-900 rounded-xl p-4 sm:p-6 border border-[#684570]/20 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div className="p-1.5 sm:p-2 bg-[#684570]/10 rounded-lg">
                              <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-[#684570]" />
                            </div>
                            <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium">
                              Price
                            </span>
                          </div>
                          <span className="text-xl sm:text-2xl font-bold text-[#39243d] dark:text-gray-200">
                            ${productDetails.price}
                          </span>
                        </div>
                      </div>

                      {/* Status/Availability */}
                      <div className="bg-white dark:bg-gray-900 rounded-xl p-4 sm:p-6 border border-[#684570]/20 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div className="p-1.5 sm:p-2 bg-[#684570]/10 rounded-lg">
                              {isDigitalBook ? (
                                digitalBook?.isAvailable ? (
                                  <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                                ) : (
                                  <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
                                )
                              ) : (
                                <Package className="h-4 w-4 sm:h-5 sm:w-5 text-[#684570]" />
                              )}
                            </div>
                            <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium">
                              {isDigitalBook ? "Availability" : "Stock"}
                            </span>
                          </div>
                          {isDigitalBook ? (
                            <Badge
                              variant={digitalBook?.isAvailable ? "default" : "destructive"}
                              className={
                                digitalBook?.isAvailable
                                  ? "bg-green-100 text-green-800 hover:bg-green-200 text-xs sm:text-sm"
                                  : "text-xs sm:text-sm"
                              }
                            >
                              {digitalBook?.isAvailable ? "Available" : "Unavailable"}
                            </Badge>
                          ) : (
                            <span className="text-lg font-semibold text-[#39243d] dark:text-gray-200">
                              {regularProduct?.stock || 0} units
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Category-specific key info */}
                      {isDigitalBook && digitalBook?.author && (
                        <div className="bg-white dark:bg-gray-900 rounded-xl p-4 sm:p-6 border border-[#684570]/20 shadow-sm">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 sm:gap-3">
                              <div className="p-1.5 sm:p-2 bg-[#684570]/10 rounded-lg">
                                <User className="h-4 w-4 sm:h-5 sm:w-5 text-[#684570]" />
                              </div>
                              <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium">
                                Author
                              </span>
                            </div>
                            <span className="text-sm sm:text-base lg:text-lg font-semibold text-[#39243d] dark:text-gray-200">
                              {digitalBook.author}
                            </span>
                          </div>
                        </div>
                      )}

                      {regularProduct?.sku && (
                        <div className="bg-white dark:bg-gray-900 rounded-xl p-4 sm:p-6 border border-[#684570]/20 shadow-sm">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 sm:gap-3">
                              <div className="p-1.5 sm:p-2 bg-[#684570]/10 rounded-lg">
                                <Hash className="h-4 w-4 sm:h-5 sm:w-5 text-[#684570]" />
                              </div>
                              <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium">
                                SKU
                              </span>
                            </div>
                            <span className="text-sm sm:text-base lg:text-lg font-mono font-semibold text-[#39243d] dark:text-gray-200">
                              {regularProduct.sku}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Digital Book Overview Images Section */}
              {isDigitalBook && digitalBook?.overviewImages && digitalBook.overviewImages.length > 0 && (
                <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-[#684570]/20 shadow-sm">
                  <h3 className="text-lg sm:text-xl font-semibold text-[#39243d] dark:text-gray-200 mb-4 sm:mb-6 flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 sm:h-5 sm:w-5 text-[#684570]" />
                    Book Overview
                  </h3>
                  <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                    {digitalBook.overviewImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-[#39243d]/10 to-[#684570]/10 border-2 border-[#684570]/20">
                          <Image
                            src={image || "/placeholder.svg"}
                            alt={`${digitalBook.title} - Overview ${index + 1}`}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                            onError={() => setFailedImages((prev) => new Set(prev).add(index + 100))}
                          />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-[#39243d]/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Description Section */}
              {productDetails.description && (
                <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-[#684570]/20 shadow-sm">
                  <h3 className="text-lg sm:text-xl font-semibold text-[#39243d] dark:text-gray-200 mb-4 sm:mb-6 flex items-center gap-2">
                    <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-[#684570]" />
                    Description
                  </h3>
                  <div className="prose prose-gray dark:prose-invert max-w-none">
                    <p className="text-sm sm:text-base lg:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                      {productDetails.description}
                    </p>
                  </div>
                </div>
              )}

              {/* Product Specifications */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                {/* Left Column - Product Details */}
                <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-[#684570]/20 shadow-sm">
                  <h3 className="text-lg sm:text-xl font-semibold text-[#39243d] dark:text-gray-200 mb-4 sm:mb-6 flex items-center gap-2">
                    <Package className="h-4 w-4 sm:h-5 sm:w-5 text-[#684570]" />
                    Product Details
                  </h3>

                  <div className="space-y-3 sm:space-y-4">
                    {isDigitalBook ? (
                      <>
                        {digitalBook?.genre && (
                          <div className="flex items-center justify-between py-2 sm:py-3 border-b border-gray-100 dark:border-gray-800">
                            <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium">
                              Genre
                            </span>
                            <Badge
                              variant="secondary"
                              className="bg-[#684570]/10 text-[#39243d] hover:bg-[#684570]/20 text-xs sm:text-sm"
                            >
                              {digitalBook.genre}
                            </Badge>
                          </div>
                        )}
                        {digitalBook?.releaseDate && (
                          <div className="flex items-center justify-between py-2 sm:py-3 border-b border-gray-100 dark:border-gray-800">
                            <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium">
                              Release Date
                            </span>
                            <span className="text-sm sm:text-base text-[#39243d] dark:text-gray-200 font-semibold">
                              {new Date(digitalBook.releaseDate).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                        {digitalBook?.url && (
                          <div className="flex items-center justify-between py-2 sm:py-3">
                            <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium">
                              Download
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-[#684570] text-[#684570] hover:bg-[#684570] hover:text-white bg-transparent text-xs sm:text-sm"
                              onClick={() => window.open(digitalBook.url, "_blank")}
                            >
                              <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                              Download
                            </Button>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        {regularProduct?.color && (
                          <div className="flex items-center justify-between py-2 sm:py-3 border-b border-gray-100 dark:border-gray-800">
                            <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium">
                              Color
                            </span>
                            <div className="flex items-center gap-2">
                              <Palette className="h-3 w-3 sm:h-4 sm:w-4 text-[#684570]" />
                              <span className="text-sm sm:text-base text-[#39243d] dark:text-gray-200 font-semibold">
                                {regularProduct.color}
                              </span>
                            </div>
                          </div>
                        )}
                        {regularProduct?.material && (
                          <div className="flex items-center justify-between py-2 sm:py-3 border-b border-gray-100 dark:border-gray-800">
                            <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium">
                              Material
                            </span>
                            <span className="text-sm sm:text-base text-[#39243d] dark:text-gray-200 font-semibold">
                              {regularProduct.material}
                            </span>
                          </div>
                        )}
                        {regularProduct?.shippingTime && (
                          <div className="flex items-center justify-between py-2 sm:py-3 border-b border-gray-100 dark:border-gray-800">
                            <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium">
                              Shipping Time
                            </span>
                            <div className="flex items-center gap-2">
                              <Truck className="h-3 w-3 sm:h-4 sm:w-4 text-[#684570]" />
                              <span className="text-sm sm:text-base text-[#39243d] dark:text-gray-200 font-semibold">
                                {regularProduct.shippingTime}
                              </span>
                            </div>
                          </div>
                        )}
                        {regularProduct?.care && (
                          <div className="flex items-center justify-between py-2 sm:py-3">
                            <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium">
                              Care Instructions
                            </span>
                            <div className="flex items-center gap-2">
                              <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-[#684570]" />
                              <span className="text-sm sm:text-base text-[#39243d] dark:text-gray-200 font-semibold">
                                {regularProduct.care}
                              </span>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Right Column - System Information */}
                <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-[#684570]/20 shadow-sm">
                  <h3 className="text-lg sm:text-xl font-semibold text-[#39243d] dark:text-gray-200 mb-4 sm:mb-6 flex items-center gap-2">
                    <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-[#684570]" />
                    System Information
                  </h3>

                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center justify-between py-2 sm:py-3 border-b border-gray-100 dark:border-gray-800">
                      <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium">
                        Product ID
                      </span>
                      <span className="text-sm sm:text-base text-[#39243d] dark:text-gray-200 font-mono font-semibold">
                        #{productDetails.id}
                      </span>
                    </div>

                    {productDetails.createdAt && (
                      <div className="flex items-center justify-between py-2 sm:py-3 border-b border-gray-100 dark:border-gray-800">
                        <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium">
                          Created
                        </span>
                        <span className="text-sm sm:text-base text-[#39243d] dark:text-gray-200 font-semibold">
                          {new Date(productDetails.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}

                    {productDetails.updatedAt && (
                      <div className="flex items-center justify-between py-2 sm:py-3 border-b border-gray-100 dark:border-gray-800">
                        <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium">
                          Last Updated
                        </span>
                        <span className="text-sm sm:text-base text-[#39243d] dark:text-gray-200 font-semibold">
                          {new Date(productDetails.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between py-2 sm:py-3">
                      <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium">Status</span>
                      <Badge
                        variant={productDetails.isDelete ? "destructive" : "default"}
                        className={`text-xs sm:text-sm ${!productDetails.isDelete ? "bg-green-100 text-green-800 hover:bg-green-200" : ""}`}
                      >
                        {productDetails.isDelete ? "Deleted" : "Active"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags Section */}
              {regularProduct?.tags && regularProduct.tags.length > 0 && (
                <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-[#684570]/20 shadow-sm">
                  <h3 className="text-lg sm:text-xl font-semibold text-[#39243d] dark:text-gray-200 mb-4 sm:mb-6 flex items-center gap-2">
                    <Hash className="h-4 w-4 sm:h-5 sm:w-5 text-[#684570]" />
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {regularProduct.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-[#684570]/10 text-[#39243d] hover:bg-[#684570]/20 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews Section */}
              {productDetails.reviews && productDetails.reviews.length > 0 && (
                <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-[#684570]/20 shadow-sm">
                  <h3 className="text-lg sm:text-xl font-semibold text-[#39243d] dark:text-gray-200 mb-4 sm:mb-6 flex items-center gap-2">
                    <Star className="h-4 w-4 sm:h-5 sm:w-5 text-[#684570]" />
                    Reviews ({productDetails.reviews.length})
                  </h3>
                  <div className="space-y-3 sm:space-y-4">
                    {productDetails.reviews.slice(0, 3).map((review, index) => (
                      <div
                        key={index}
                        className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
                      >
                        <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                          {review}
                        </p>
                      </div>
                    ))}
                    {productDetails.reviews.length > 3 && (
                      <p className="text-sm sm:text-base text-[#684570] font-medium text-center">
                        +{productDetails.reviews.length - 3} more reviews
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex-shrink-0 px-4 sm:px-6 py-3 sm:py-4 border-t border-[#684570]/20 bg-gradient-to-r from-[#39243d]/5 to-[#684570]/5">
          <Button
            onClick={() => setOpen(false)}
            variant="outline"
            className="min-w-[100px] sm:min-w-[120px] border-[#684570] text-[#684570] hover:bg-[#684570] hover:text-white transition-all duration-200 text-sm sm:text-base"
          >
            Close
          </Button>
        </div>
      </DialogContent>

      {/* Update Modal */}
      <ProductUpdateModal
        productId={productId}
        category={category}
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        onProductUpdated={() => {
          // Refresh the product details after update
          if (open && productId) {
            const fetchDetails = async () => {
              try {
                setLoading(true)
                const endpoint = CATEGORY_ENDPOINTS[category]
                if (!endpoint) {
                  console.error(`Invalid category: ${category}`)
                  return
                }
                const res = await ApiClient.get(`${endpoint}/${productId}`, true)
                const data = await res.json()

                if (data.success) {
                  setProductDetails(data.data)
                } else {
                  console.error("Failed to fetch product details:", data.message)
                }
              } catch (err) {
                console.error("Error fetching product details:", err)
              } finally {
                setLoading(false)
              }
            }
            fetchDetails()
          }
        }}
      />
    </Dialog>
  )
}
