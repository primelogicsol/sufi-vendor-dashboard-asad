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
import { Separator } from "@/components/ui/separator";
import { ApiClient } from "@/lib/utils/api-client";
import { 
  Package, 
  DollarSign, 
  Hash, 
  Calendar, 
//   User,
  ImageIcon,
  Star,
  Loader2,
  Trash2
} from "lucide-react";

interface ProductDetailsModalProps {
  productId: number | null;
  trigger?: React.ReactNode;
  onProductDeleted?: () => void; // Callback to refresh parent component
}

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  stock: number;
  sku: string;
  images?: string[];
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
  isDelete?: boolean;
  userId?: string;
  reviews?: string[];
}

export function ProductDetailsModal({ productId, trigger, onProductDeleted }: ProductDetailsModalProps) {
  const [open, setOpen] = useState(false);
  const [productDetails, setProductDetails] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (open && productId) {
      const fetchDetails = async () => {
        try {
          setLoading(true);
          const res = await ApiClient.get(`/accessories/${productId}`, true);
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
  }, [open, productId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { text: "Out of Stock", variant: "destructive" as const };
    if (stock < 5) return { text: "Low Stock", variant: "secondary" as const };
    return { text: "In Stock", variant: "default" as const };
  };

  const handleDelete = async () => {
    if (!productId || deleting) return;
    
    try {
      setDeleting(true);
      const res = await ApiClient.delete(`/accessories/${productId}`, true);
      const data = await res.json();
      
      if (data.success) {
        setOpen(false);
        onProductDeleted?.(); // Call the callback to refresh parent
        
        // Hard reload the page to reflect changes
        setTimeout(() => {
          window.location.reload();
        }, 500); // Small delay to ensure modal closes smoothly
      } else {
        console.error("Failed to delete product:", data.message);
      }
    } catch (err) {
      console.error("Error deleting product:", err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <div onClick={() => setOpen(true)}>{trigger}</div>}

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20">
        <DialogHeader className="pb-4 border-b border-purple-200/30 dark:border-purple-800/30">
          <div className="flex items-center justify-between gap-4">
            <DialogTitle className="text-xl font-semibold text-foreground flex-1">
              {productDetails?.title || "Product Details"}
            </DialogTitle>
            {productDetails && (
              <div className="flex items-center gap-2 ">
                <Button
                  onClick={handleDelete}
                  disabled={deleting}
                  variant="destructive"
                  size="sm"
                  className="bg-red-500 hover:bg-red-600 text-white border-0"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading product details...</span>
          </div>
        ) : productDetails ? (
          <div className="space-y-6">
            {/* Product Images */}
            {productDetails.images && productDetails.images.length > 0 ? (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Product Images
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {productDetails.images.map((image: string, index: number) => (
                    <div key={index} className="relative group">
                      <Image
                        src={image.startsWith('http') ? image : `http://localhost:6015${image.replace('public', '')}`}
                        alt={`${productDetails.title} - Image ${index + 1}`}
                        className="w-full h-24 sm:h-32 object-cover rounded-lg border border-border hover:border-primary/50 transition-colors"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling!.classList.remove('hidden');
                        }}
                      />
                      <div className="hidden absolute inset-0 flex items-center justify-center bg-muted rounded-lg border border-dashed border-muted-foreground/25">
                        <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Description */}
            {productDetails.description && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                <p className="text-sm text-foreground leading-relaxed bg-purple-100/50 dark:bg-purple-900/20 p-3 rounded-lg border border-purple-200/50 dark:border-purple-800/30">
                  {productDetails.description}
                </p>
              </div>
            )}

            <Separator />

            {/* Product Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Price */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-950/30 dark:to-pink-950/30 border border-purple-200 dark:border-purple-800">
                <div className="p-2 bg-purple-200 dark:bg-purple-900/50 rounded-full">
                  <DollarSign className="h-4 w-4 text-purple-700 dark:text-purple-300" />
                </div>
                <div>
                  <p className="text-xs text-purple-600/80 dark:text-purple-400/80 font-medium">Price</p>
                  <p className="text-lg font-semibold text-purple-800 dark:text-purple-200">
                    ${productDetails.price?.toFixed(2) || "N/A"}
                  </p>
                </div>
              </div>

              {/* Stock */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-200 dark:border-indigo-800">
                <div className="p-2 bg-indigo-200 dark:bg-indigo-900/50 rounded-full">
                  <Package className="h-4 w-4 text-indigo-700 dark:text-indigo-300" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-indigo-600/80 dark:text-indigo-400/80 font-medium">Stock</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-lg font-semibold text-indigo-800 dark:text-indigo-200">
                      {productDetails.stock ?? "N/A"}
                    </p>
                    {typeof productDetails.stock === 'number' && (
                      <Badge variant={getStockStatus(productDetails.stock).variant} className="text-xs">
                        {getStockStatus(productDetails.stock).text}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">Additional Information</h3>
              <div className="grid grid-cols-1 gap-3">
                {/* SKU */}
                {productDetails.sku && (
                  <div className="flex items-center gap-3 p-2 rounded-lg border border-purple-200/50 dark:border-purple-800/30 bg-purple-50/30 dark:bg-purple-950/10">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <span className="text-xs text-muted-foreground">SKU:</span>
                      <span className="ml-2 text-sm font-mono font-medium">{productDetails.sku}</span>
                    </div>
                  </div>
                )}

                {/* Tags */}
                {productDetails.tags && productDetails.tags.length > 0 && (
                  <div className="flex items-start gap-3 p-2 rounded-lg border border-purple-200/50 dark:border-purple-800/30 bg-purple-50/30 dark:bg-purple-950/10">
                    <Package className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <span className="text-xs text-muted-foreground">Tags:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {productDetails.tags.map((tag: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* User ID */}
                {/* {productDetails.userId && (
                  <div className="flex items-center gap-3 p-2 rounded-lg border border-purple-200/50 dark:border-purple-800/30 bg-purple-50/30 dark:bg-purple-950/10">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <span className="text-xs text-muted-foreground">Created by:</span>
                      <span className="ml-2 text-sm font-mono text-muted-foreground">{productDetails.userId}</span>
                    </div>
                  </div>
                )} */}

                {/* Reviews */}
                {productDetails.reviews && productDetails.reviews.length > 0 ? (
                  <div className="flex items-start gap-3 p-2 rounded-lg border border-purple-200/50 dark:border-purple-800/30 bg-purple-50/30 dark:bg-purple-950/10">
                    <Star className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <span className="text-xs text-muted-foreground">Reviews:</span>
                      <span className="ml-2 text-sm font-medium">{productDetails.reviews.length} review(s)</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-2 rounded-lg border border-dashed border-purple-300/50 dark:border-purple-700/50 bg-purple-50/20 dark:bg-purple-950/5">
                    <Star className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">No reviews yet</span>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Timestamps */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-muted-foreground">
              {productDetails.createdAt && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3" />
                  <span>Created: {formatDate(productDetails.createdAt)}</span>
                </div>
              )}
              {productDetails.updatedAt && productDetails.updatedAt !== productDetails.createdAt && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3" />
                  <span>Updated: {formatDate(productDetails.updatedAt)}</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 space-y-3">
            <Package className="h-12 w-12 text-muted-foreground/50" />
            <p className="text-muted-foreground">No product details found.</p>
          </div>
        )}

        <div className="flex justify-end pt-6 border-t border-purple-200/50 dark:border-purple-800/30">
          <Button onClick={() => setOpen(false)} variant="outline" className="min-w-[100px] border-purple-300 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-950/20">
            Close 
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}