// "use client";
// import { useCallback } from "react";
// import Image from "next/image";
// import { ProductDetailsModal } from "@/components/product-details-modal";
// import { useState, useEffect, useMemo } from "react";
// import { DashboardLayout } from "@/components/dashboard-layout";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Search,
//   Loader2,
// } from "lucide-react";
// import { ApiClient } from "@/lib/utils/api-client";

// // Category → endpoint mapping
// const CATEGORY_ENDPOINTS: Record<string, string> = {
//   Decoration: "/decoration",
//   Fashion: "/fashion", // using /decoration for now
//   Meditation: "/meditation", // using /decoration for now
//   Accessories: "/accessories",
//   HomeLiving: "/living"
// };

// const categories = Object.keys(CATEGORY_ENDPOINTS);

// // API Types
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

// interface ApiResponse {
//   success: boolean;
//   status: number;
//   message: string;
//   data: { [key: string]: Product[] }; // Removed any, assuming category array only
// }

// // ProductService
// class ProductService {
//   static async getProductsByCategory(
//     endpoint: string,
//     page: number = 1,
//     limit: number = 10,
//     search: string = ""
//   ): Promise<Product[]> {
//     try {
//       const params = new URLSearchParams({
//         page: page.toString(),
//         limit: limit.toString(),
//         search,
//       });
//       const response = await ApiClient.get(`${endpoint}?${params.toString()}`);
//       const json: ApiResponse = await response.json();

//       if (!json.success) throw new Error(json.message || "API error");

//       // extract products array (e.g., data.accessories, data.decoration, etc.)
//       const categoryKey = Object.keys(json.data).find((k) =>
//         Array.isArray(json.data[k])
//       );
//       if (categoryKey) {
//         return json.data[categoryKey];
//       }
//       return [];
//     } catch (error) {
//       console.error(`API Error for ${endpoint}:`, error);
//       throw error;
//     }
//   }
// }

// const getValidImageUrl = (images: string[] | undefined): string | null => {
//   if (!images || !Array.isArray(images)) return null;
  
//   for (const img of images) {
//     if (typeof img === 'string' && img.startsWith('http')) {
//       try {
//         new URL(img);
//         return img;
//       } catch {
//         continue;
//       }
//     }
//   }
//   return null;
// };

// // ProductCard
// function ProductCard({
//   product,
// }: {
//   product: Product;
//   onViewDetails: (p: Product) => void;
// }) {
//   // const displayImage = product.images?.[0] || null;
//   const displayImage = getValidImageUrl(product.images);

//   return (
//     <Card className="group overflow-hidden border border-border/50 hover:border-primary/20 transition-all duration-300 hover:shadow-lg">
//       <div className="aspect-[4/3] overflow-hidden bg-muted/20 relative">
//         {displayImage ? (
//           <Image
//             src={displayImage}
//             alt={product.title}
//             fill
//             // className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
//             className="object-cover group-hover:scale-105 transition-transform duration-300"
//             onError={(e) => {
//               const target = e.target as HTMLImageElement;
//               target.style.display = "none";
//               target.nextElementSibling?.classList.remove("hidden");
//             }}
//           />
//         ) : (
//           <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
//             <span className="text-muted-foreground text-sm">No Image</span>
//           </div>
//         )}
//       </div>

//       <CardContent className="p-4 space-y-3">
//         <div>
//           <h3 className="font-semibold line-clamp-1">{product.title}</h3>
//           <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
//             {product.description || "No description available"}
//           </p>
//         </div>

//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-2">
//             <span className="text-lg font-bold">
//               ${product.price.toFixed(2)}
//             </span>
//             <Badge
//               variant={product.stock > 0 ? "default" : "destructive"}
//               className="text-xs"
//             >
//               Stock: {product.stock}
//             </Badge>
//           </div>
//         </div>
//         <ProductDetailsModal
//           productId={product.id}
//           category={selectedCategory}
//           trigger={
//             <Button
//               className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground"
//               size="sm"
//             >
//               View Details
//             </Button>
//           }
//         />
//       </CardContent>
//     </Card>
//   );
// }

// // DashboardPage
// export default function DashboardPage() {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("Accessories");
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedProductId, setSelectedProductId] = useState<number | null>(
//     null
//   );

//   const PRODUCTS_PER_PAGE = 10;

//   // Fetch products
//   const fetchProducts = useCallback(async () => {
//   setLoading(true);
//   setError(null);
//   try {
//     const endpoint = CATEGORY_ENDPOINTS[selectedCategory];
//     if (!endpoint) return;
//     const items = await ProductService.getProductsByCategory(
//       endpoint,
//       1,
//       100,
//       searchQuery
//     );
//     setProducts(items);
//   } catch (err) {
//     setError(err instanceof Error ? err.message : "Unknown error");
//     setProducts([]);
//   } finally {
//     setLoading(false);
//   }
// }, [selectedCategory, searchQuery]); // ✅ stable dependencies


//   // Effects
//   useEffect(() => {
//     fetchProducts();
//   }, [ fetchProducts]); // Added fetchProducts to dependencies

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchQuery]);

//   // Local search
//   const filteredProducts = useMemo(() => {
//     if (!searchQuery) return products;
//     return products.filter(
//       (p) =>
//         p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         p.tags?.some((t) =>
//           t.toLowerCase().includes(searchQuery.toLowerCase())
//         )
//     );
//   }, [products, searchQuery]);

//   // Pagination
//   const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
//   const paginatedProducts = filteredProducts.slice(
//     startIndex,
//     startIndex + PRODUCTS_PER_PAGE
//   );

//   return (
//     <DashboardLayout>
//       <div className="space-y-6">
//         <div>
//           <h1 className="text-3xl font-bold">My Products</h1>
//         </div>

//         {/* Search & Category */}
//         <Card className="p-6">
//           <div className="flex flex-col sm:flex-row gap-4">
//             <div className="flex-1 relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//               <Input
//                 placeholder="Search products..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="pl-10"
//               />
//             </div>
//             <div className="sm:w-48">
//               <Select value={selectedCategory} onValueChange={setSelectedCategory}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select category" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {categories.map((c) => (
//                     <SelectItem key={c} value={c}>
//                       {c}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
//         </Card>

//         {/* Content */}
//         {loading ? (
//           <div className="flex justify-center p-8">
//             <Loader2 className="h-6 w-6 animate-spin" />
//           </div>
//         ) : error ? (
//           <div className="p-8 text-red-500">{error}</div>
//         ) : paginatedProducts.length > 0 ? (
//           <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//             {paginatedProducts.map((product) => (
//               <ProductCard
//                 key={product.id}
//                 product={product}
//                 onViewDetails={(p) => setSelectedProductId(p.id)}
//               />
//             ))}
//           </div>
//         ) : (
//           <Card className="p-12 text-center">
//             <h3>No products found</h3>
//           </Card>
//         )}
//       </div>

//       {/* Modal */}
//       {selectedProductId && (
//         <ProductDetailsModal
//           productId={selectedProductId}
//           category={selectedCategory}
//           trigger={null} // no trigger, open by state
//         />
//       )}
//     </DashboardLayout>
//   );
// }






// "use client";
// import { useCallback } from "react";
// import Image from "next/image";
// import { ProductDetailsModal } from "@/components/product-details-modal";
// import { useState, useEffect, useMemo } from "react";
// import { DashboardLayout } from "@/components/dashboard-layout";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Search,
//   Loader2,
// } from "lucide-react";
// import { ApiClient } from "@/lib/utils/api-client";

// // Category → endpoint mapping
// const CATEGORY_ENDPOINTS: Record<string, string> = {
//   Decoration: "/decoration",
//   Fashion: "/fashion",
//   Meditation: "/meditation",
//   Accessories: "/accessories",
//   HomeLiving: "/living"
// };

// const categories = Object.keys(CATEGORY_ENDPOINTS);

// // API Types
// interface Product {
//   id: number;
//   title: string;
//   name: string; // ✅ Added name field
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

// interface ApiResponse {
//   success: boolean;
//   status: number;
//   message: string;
//   data: { [key: string]: Product[] };
// }

// // ProductService
// class ProductService {
//   static async getProductsByCategory(
//     endpoint: string,
//     page: number = 1,
//     limit: number = 10,
//     search: string = ""
//   ): Promise<Product[]> {
//     try {
//       const params = new URLSearchParams({
//         page: page.toString(),
//         limit: limit.toString(),
//         search,
//       });
//       const response = await ApiClient.get(`${endpoint}?${params.toString()}`);
//       const json: ApiResponse = await response.json();

//       if (!json.success) throw new Error(json.message || "API error");

//       const categoryKey = Object.keys(json.data).find((k) =>
//         Array.isArray(json.data[k])
//       );
//       if (categoryKey) {
//         return json.data[categoryKey];
//       }
//       return [];
//     } catch (error) {
//       console.error(`API Error for ${endpoint}:`, error);
//       throw error;
//     }
//   }
// }

// const getValidImageUrl = (images: string[] | undefined): string | null => {
//   if (!images || !Array.isArray(images)) return null;
  
//   for (const img of images) {
//     if (typeof img === 'string' && img.startsWith('http')) {
//       try {
//         new URL(img);
//         return img;
//       } catch {
//         continue;
//       }
//     }
//   }
//   return null;
// };

// // ProductCard
// function ProductCard({
//   product,
//   category,  // ✅ Added: Accept category prop
//   onProductDeleted,  // ✅ Added: For refetching after delete
// }: {
//   product: Product;
//   category: string;  // ✅ Type for category
//   onProductDeleted?: () => void;  // ✅ Optional callback
// }) {
//   const displayImage = getValidImageUrl(product.images);

//   return (
//     <Card className="group overflow-hidden border border-border/50 hover:border-primary/20 transition-all duration-300 hover:shadow-lg">
//       <div className="aspect-[4/3] overflow-hidden bg-muted/20 relative">
//         {displayImage ? (
//           <Image
//             src={displayImage}
//             alt={product.title}
//             fill
//             className="object-cover group-hover:scale-105 transition-transform duration-300"
//             onError={(e) => {
//               const target = e.target as HTMLImageElement;
//               target.style.display = "none";
//               target.nextElementSibling?.classList.remove("hidden");
//             }}
//           />
//         ) : (
//           <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
//             <span className="text-muted-foreground text-sm">No Image</span>
//           </div>
//         )}
//       </div>

//       <CardContent className="p-4 space-y-3">
//         <div>
//           <h3 className="font-semibold line-clamp-1">{product.name}</h3>
//           <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
//             {product.description || "No description available"}
//           </p>
//         </div>

//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-2">
//             <span className="text-lg font-bold">
//               ${product.price.toFixed(2)}
//             </span>
//             <Badge
//               variant={product.stock > 0 ? "default" : "destructive"}
//               className="text-xs"
//             >
//               Stock: {product.stock}
//             </Badge>
//           </div>
//         </div>
//         <ProductDetailsModal
//           productId={product.id}
//           category={category}  // ✅ Pass category to modal
//           trigger={
//             <Button
//               className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground"
//               size="sm"
//             >
//               View Details
//             </Button>
//           }
//           onProductDeleted={onProductDeleted}  // ✅ Pass refetch callback
//         />
//       </CardContent>
//     </Card>
//   );
// }

// // DashboardPage
// export default function DashboardPage() {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("Accessories");
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   // const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

//   const PRODUCTS_PER_PAGE = 10;

//   // Fetch products
//   const fetchProducts = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const endpoint = CATEGORY_ENDPOINTS[selectedCategory];
//       if (!endpoint) return;
//       const items = await ProductService.getProductsByCategory(
//         endpoint,
//         1,
//         100,
//         searchQuery
//       );
//       setProducts(items);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Unknown error");
//       setProducts([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [selectedCategory, searchQuery]);

//   // Effects
//   useEffect(() => {
//     fetchProducts();
//   }, [fetchProducts]);

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchQuery]);

//   // Local search
//   const filteredProducts = useMemo(() => {
//     if (!searchQuery) return products;
//     return products.filter(
//       (p) =>
//         p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         p.tags?.some((t) =>
//           t.toLowerCase().includes(searchQuery.toLowerCase())
//         )
//     );
//   }, [products, searchQuery]);

//   // Pagination
//   const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
//   const paginatedProducts = filteredProducts.slice(
//     startIndex,
//     startIndex + PRODUCTS_PER_PAGE
//   );

//   return (
//     <DashboardLayout>
//       <div className="space-y-6">
//         <div>
//           <h1 className="text-3xl font-bold">My Products</h1>
//         </div>

//         {/* Search & Category */}
//         <Card className="p-6">
//           <div className="flex flex-col sm:flex-row gap-4">
//             <div className="flex-1 relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//               <Input
//                 placeholder="Search products..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="pl-10"
//               />
//             </div>
//             <div className="sm:w-48">
//               <Select value={selectedCategory} onValueChange={setSelectedCategory}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select category" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {categories.map((c) => (
//                     <SelectItem key={c} value={c}>
//                       {c}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
//         </Card>

//         {/* Content */}
//         {loading ? (
//           <div className="flex justify-center p-8">
//             <Loader2 className="h-6 w-6 animate-spin" />
//           </div>
//         ) : error ? (
//           <div className="p-8 text-red-500">{error}</div>
//         ) : paginatedProducts.length > 0 ? (
//           <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//             {paginatedProducts.map((product) => (
//               <ProductCard
//                 key={product.id}
//                 product={product}
//                 category={selectedCategory}  // ✅ Pass category to ProductCard
//                 onProductDeleted={fetchProducts}  // ✅ Pass refetch callback
//               />
//             ))}
//           </div>
//         ) : (
//           <Card className="p-12 text-center">
//             <h3>No products found</h3>
//           </Card>
//         )}
//       </div>

//       {/* Modal */}
//       {/* {selectedProductId && (
//         <ProductDetailsModal
//           productId={selectedProductId}
//           category={selectedCategory}  // ✅ Pass category to central modal
//           trigger={null}
//           onProductDeleted={fetchProducts}  // ✅ Pass refetch callback
//         />
//       )} */}
//     </DashboardLayout>
//   );
// }


"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ProductDetailsModal } from "@/components/product-details-modal";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Loader2 } from "lucide-react";
import { ApiClient } from "@/lib/utils/api-client";

// Category → endpoint mapping
const CATEGORY_ENDPOINTS: Record<string, string> = {
  Decoration: "/decoration",
  Fashion: "/fashion",
  Meditation: "/meditation",
  Accessories: "/accessories",
  HomeLiving: "/living",
  DigitalBooks: "/digital-books",
  Audio: "/audio"
};
const categories = Object.keys(CATEGORY_ENDPOINTS);

// Types
// interface Product {
//   id: number;
//   title: string;
//   name: string;
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

interface Product {
  id: number;
  title: string;
  name: string;
  description: string;
  price: number;
  stock?: number;     // stock not for digital books
  sku?: string;
  images?: string[];
  coverImage?: string; // ✅ new for digital books
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
  isDelete?: boolean;
  userId?: string;
  reviews?: string[];
}

interface Pagination {
  totalItems: number;
  currentPage: number;
  totalPages: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
interface ListApiResponse {
  success: boolean;
  status: number;
  message: string;
  data: Record<string, unknown>;
}

// Service
class ProductService {
  static async getProductsByCategory(
    endpoint: string,
    page: number = 1,
    limit: number = 10,
    search: string = ""
  ): Promise<{ items: Product[]; pagination: Pagination }> {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      search
    });
    const res = await ApiClient.get(`${endpoint}?${params.toString()}`);
    const json: ListApiResponse = await res.json();
    if (!json.success) throw new Error(json.message || "API error");

    const listKey = Object.keys(json.data).find((k) => Array.isArray(json.data[k as keyof typeof json.data]));
    const items = (listKey ? (json.data[listKey] as Product[]) : []) ?? [];

    const pagination = (json.data.pagination as Pagination) ?? {
      totalItems: items.length,
      currentPage: page,
      totalPages: 1,
      limit,
      hasNextPage: false,
      hasPrevPage: false
    };

    return { items, pagination };
  }
}

const getValidImageUrl = (images: string[] | undefined): string | null => {
  if (!images || !Array.isArray(images)) return null;
  for (const img of images) {
    if (typeof img === "string" && img.startsWith("http")) {
      try {
        new URL(img);
        return img;
      } catch {
        // ignore invalid URL
      }
    }
  }
  return null;
};

function ProductCard({
  product,
  category,
  onProductDeleted
}: {
  product: Product;
  category: string;
  onProductDeleted?: () => void;
}) {
  // 
  const displayImage =
  category === "DigitalBooks"
    ? getValidImageUrl([product.coverImage ?? ""]) // ✅ wrap coverImage in array
    : getValidImageUrl(product.images);
  return (
    <Card className="group overflow-hidden border border-border/50 hover:border-primary/20 transition-all duration-300 hover:shadow-lg">
      <div className="aspect-[4/3] overflow-hidden bg-muted/20 relative">
        {displayImage ? (
          <Image
            src={displayImage}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
              target.nextElementSibling?.classList.remove("hidden");
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
            <span className="text-muted-foreground text-sm">No Image</span>
          </div>
        )}
      </div>

      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold line-clamp-1">{product.name || product.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {product.description || "No description available"}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
            {category !== "DigitalBooks" && (
            <Badge
              variant={product.stock && product.stock > 0 ? "default" : "destructive"}
              className="text-xs"
            >
              Stock: {product.stock}
            </Badge>
          )}
          </div>
        </div>
        <ProductDetailsModal
          productId={product.id}
          category={category}
          trigger={
            <Button className="w-full bg-gradient-to-r from-primary to-secondary text-primary-foreground" size="sm">
              View Details
            </Button>
          }
          onProductDeleted={onProductDeleted}
        />
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Accessories");
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const PRODUCTS_PER_PAGE = 10;

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const endpoint = CATEGORY_ENDPOINTS[selectedCategory];
      if (!endpoint) return;
      const { items, pagination } = await ProductService.getProductsByCategory(
        endpoint,
        currentPage,
        PRODUCTS_PER_PAGE,
        searchQuery
      );
      setProducts(items);
      setPagination(pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setProducts([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, currentPage, searchQuery]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  // Optional local filtering on current page (kept from your code)
  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products;
    return products.filter(
      (p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [products, searchQuery]);

  // Backend already returns one page; no client-side slice here
  const paginatedProducts = filteredProducts;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Vendor Dashboard</h1>
          <div className="flex gap-2">
            {/* <Button asChild variant="outline">
              <a href="/orders">Orders</a>
            </Button> */}
            {/* <Button asChild variant="outline">
              <a href="/inventory">Inventory</a>
            </Button> */}
            {/* <Button asChild variant="outline">
              <a href="/analytics">Analytics</a>
            </Button> */}
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-4">My Products</h2>
        </div>

        <Card className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="sm:w-48">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {loading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : error ? (
          <div className="p-8 text-red-500">{error}</div>
        ) : paginatedProducts.length > 0 ? (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {paginatedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  category={selectedCategory}
                  onProductDeleted={fetchProducts}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="mt-6 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={!pagination?.hasPrevPage}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                Prev
              </Button>
              <span className="text-sm">
                Page {pagination?.currentPage ?? 1} of {pagination?.totalPages ?? 1}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={!pagination?.hasNextPage}
                onClick={() =>
                  setCurrentPage((p) =>
                    pagination ? Math.min(pagination.totalPages, p + 1) : p + 1
                  )
                }
              >
                Next
              </Button>
            </div>
          </>
        ) : (
          <Card className="p-12 text-center">
            <h3>No products found</h3>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}