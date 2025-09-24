"use client";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ApiClient } from "@/lib/utils/api-client";
import {
  Loader2,
  Save,
  X,
  AlertCircle,
  CheckCircle2,
  Package,
  BookOpen,
  Music,
  Hash,
  Heart,
} from "lucide-react";

interface ProductUpdateModalProps {
  productId: number | null;
  category: string;
  isOpen: boolean;
  onClose: () => void;
  onProductUpdated?: () => void;
}

const CATEGORY_ENDPOINTS: Record<string, string> = {
  Decoration: "/decoration",
  Fashion: "/fashion",
  Meditation: "/meditation",
  Accessories: "/accessories",
  HomeLiving: "/living",
  DigitalBooks: "/digital-books",
  Audio: "/audio",
};

interface BaseProduct {
  id: number;
  title: string;
  description?: string;
  price: number;
  createdAt?: string;
  updatedAt?: string;
  isDelete?: boolean;
  userId?: string;
  reviews?: string[];
}

interface RegularProduct extends BaseProduct {
  name?: string;
  stock?: number;
  sku: string;
  color?: string;
  care?: string;
  material?: string;
  shippingTime?: string;
  images?: string[];
  tags?: string[];
}

interface DigitalBook extends BaseProduct {
  author: string;
  genre: string;
  releaseDate: string;
  url: string;
  coverImage: string;
  overviewImages?: string[];
  isAvailable: boolean;
}

interface AudioTrack extends BaseProduct {
  artist: string;
  duration: number;
  mp3Url?: string;
  mp4Url?: string;
}

 type Product = RegularProduct | DigitalBook | AudioTrack;
 type FormState = Partial<RegularProduct & DigitalBook & AudioTrack>;

export function ProductUpdateModal({
  productId,
  category,
  isOpen,
  onClose,
  onProductUpdated,
}: ProductUpdateModalProps) {
  const [productDetails, setProductDetails] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [tagsInput, setTagsInput] = useState("");

  const isDigitalBook = category === "DigitalBooks";
  const isAudioTrack = category === "Audio";

  // Form state
  const [formData, setFormData] = useState<FormState>({});

  const fetchProductDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const endpoint = CATEGORY_ENDPOINTS[category];
      if (!endpoint) {
        throw new Error(`Invalid category: ${category}`);
      }

      const res = await ApiClient.get(`${endpoint}/${productId}`, true);
      const data = await res.json();

      if (data.success) {
        console.log("Fetched product data:", data.data);
        setProductDetails(data.data);
        setFormData(data.data);
        setTagsInput(Array.isArray(data.data?.tags) ? data.data.tags.join(", ") : "");
        console.log("Form data set to:", data.data);
      } else {
        throw new Error(data.message || "Failed to fetch product details");
      }
    } catch (err) {
      console.error("Error fetching product details:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [productId, category]);

  useEffect(() => {
    if (isOpen && productId) {
      fetchProductDetails();
    }
  }, [isOpen, productId, fetchProductDetails]);

  const handleInputChange = (field: keyof FormState, value: unknown) => {
    console.log(`Updating field ${field} with value:`, value);
    setFormData((prev) => {
      const newData = {
        ...prev,
        [field]: value,
      };
      console.log("New form data:", newData);
      return newData;
    });
  };

  // const handleArrayInputChange = (field: keyof FormState, value: string) => {
  //   const arrayValue = value.split(',').map(item => item.trim()).filter(item => item);
  //   setFormData((prev) => ({
  //     ...prev,
  //     [field]: arrayValue,
  //   }));
  // };

  const handleTagsInputChange = (value: string) => {
    setTagsInput(value);
    // Keep form data reasonably in sync without preventing typing commas
    const parsed = value
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t);
    setFormData((prev) => ({ ...prev, tags: parsed }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId || saving) return;

    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      const endpoint = CATEGORY_ENDPOINTS[category];
      if (!endpoint) {
        throw new Error(`Invalid category: ${category}`);
      }

      // Prepare update data based on category
      let updateData: Record<string, unknown> = {};

      if (isDigitalBook) {
        // Digital book specific fields
        const dbUpdate = {
          title: formData.title?.trim() || "",
          description: formData.description?.trim() || "",
          price: typeof formData.price === "number" ? formData.price : Number(formData.price ?? 0),
          author: formData.author?.trim() || "",
          genre: formData.genre?.trim() || "",
          releaseDate: (formData.releaseDate as string) || "",
          url: formData.url?.trim() || "",
          isAvailable: String(Boolean(formData.isAvailable)), // API expects string "true"/"false"
        }

        // Validate required fields for digital books
        if (!dbUpdate.title) {
          throw new Error("Title is required");
        }
        if (!dbUpdate.author) {
          throw new Error("Author is required");
        }
        if (!dbUpdate.genre) {
          throw new Error("Genre is required");
        }
        if (dbUpdate.price <= 0) {
          throw new Error("Price must be greater than 0");
        }
        updateData = dbUpdate
      } else if (isAudioTrack) {
        // Audio track specific fields
        const atUpdate = {
          title: formData.title?.trim() || "",
          description: formData.description?.trim() || "",
          price: typeof formData.price === "number" ? formData.price : Number(formData.price ?? 0),
          artist: formData.artist?.trim() || "",
          duration: typeof formData.duration === "number" ? formData.duration : Number(formData.duration ?? 0),
          mp3Url: formData.mp3Url?.trim() || "",
          mp4Url: formData.mp4Url?.trim() || "",
        }
        updateData = atUpdate
      } else {
        // Regular product fields
        const rpUpdate = {
          title: formData.title?.trim() || "",
          name: formData.name?.trim() || "",
          description: formData.description?.trim() || "",
          price: typeof formData.price === "number" ? formData.price : Number(formData.price ?? 0),
          stock: typeof formData.stock === "number" ? formData.stock : Number(formData.stock ?? 0),
          sku: formData.sku?.trim() || "",
          color: formData.color?.trim() || "",
          material: formData.material?.trim() || "",
          shippingTime: formData.shippingTime?.trim() || "",
          care: formData.care?.trim() || "",
          tags: Array.isArray(formData.tags) ? formData.tags : [],
        }
        updateData = rpUpdate
      }

      console.log("Sending update data:", updateData);
      console.log("Endpoint:", `${endpoint}/${productId}`);

      const res = await ApiClient.patch(`${endpoint}/${productId}`, updateData, true);
      const data = await res.json();

      console.log("Update response:", data);

      if (data.success) {
        setSuccess(true);
        onProductUpdated?.();
        setTimeout(() => {
          onClose();
          setSuccess(false);
        }, 1500);
      } else {
        throw new Error(data.message || "Failed to update product");
      }
    } catch (err) {
      console.error("Error updating product:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setSaving(false);
    }
  };

  const renderRegularProductFields = () => {
    const product = productDetails as RegularProduct;
    if (!product) return null;

    return (
      <div className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Package className="h-5 w-5" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title || ""}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Product title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Product name"
                />
              </div>
              {/* <div className="space-y-2">
                <Label htmlFor="sku">SKU *</Label>
                <Input
                  id="sku"
                  value={formData.sku || ""}
                  onChange={(e) => handleInputChange("sku", e.target.value)}
                  placeholder="Product SKU"
                />
              </div> */}
              <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price || ""}
                  onChange={(e) => handleInputChange("price", parseFloat(e.target.value))}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock || ""}
                  onChange={(e) => handleInputChange("stock", parseInt(e.target.value))}
                  placeholder="0"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Details */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Hash className="h-5 w-5" />
              Product Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  value={formData.color || ""}
                  onChange={(e) => handleInputChange("color", e.target.value)}
                  placeholder="Product color"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="material">Material</Label>
                <Input
                  id="material"
                  value={formData.material || ""}
                  onChange={(e) => handleInputChange("material", e.target.value)}
                  placeholder="Product material"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shippingTime">Shipping Time</Label>
                <Input
                  id="shippingTime"
                  value={formData.shippingTime || ""}
                  onChange={(e) => handleInputChange("shippingTime", e.target.value)}
                  placeholder="e.g., 3-5 business days"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Description and Care */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Description & Care
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Product description"
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="care">Care Instructions</Label>
                <Textarea
                  id="care"
                  value={formData.care || ""}
                  onChange={(e) => handleInputChange("care", e.target.value)}
                  placeholder="Care instructions"
                  rows={3}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tags */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Tags</h3>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={tagsInput}
                onChange={(e) => handleTagsInputChange(e.target.value)}
                placeholder="tag1, tag2, tag3"
              />
              {formData.tags && formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderDigitalBookFields = () => {
    const book = productDetails as DigitalBook;
    if (!book) return null;

    return (
      <div className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Book Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title || ""}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Book title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="author">Author *</Label>
                <Input
                  id="author"
                  value={formData.author || ""}
                  onChange={(e) => handleInputChange("author", e.target.value)}
                  placeholder="Author name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="genre">Genre *</Label>
                <Input
                  id="genre"
                  value={formData.genre || ""}
                  onChange={(e) => handleInputChange("genre", e.target.value)}
                  placeholder="Book genre"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price || ""}
                  onChange={(e) => handleInputChange("price", parseFloat(e.target.value))}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="releaseDate">Release Date *</Label>
                <Input
                  id="releaseDate"
                  type="date"
                  value={formData.releaseDate ? new Date(formData.releaseDate).toISOString().split('T')[0] : ""}
                  onChange={(e) => handleInputChange("releaseDate", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="url">Book URL *</Label>
                <Input
                  id="url"
                  type="url"
                  value={formData.url || ""}
                  onChange={(e) => handleInputChange("url", e.target.value)}
                  placeholder="https://example.com/book"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Availability */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Availability</h3>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isAvailable"
                checked={formData.isAvailable || false}
                onChange={(e) => handleInputChange("isAvailable", e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="isAvailable">Book is available for purchase</Label>
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Description</h3>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Book description"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderAudioTrackFields = () => {
    const track = productDetails as AudioTrack;
    if (!track) return null;

    return (
      <div className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Music className="h-5 w-5" />
              Audio Track Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title || ""}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Track title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="artist">Artist *</Label>
                <Input
                  id="artist"
                  value={formData.artist || ""}
                  onChange={(e) => handleInputChange("artist", e.target.value)}
                  placeholder="Artist name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (seconds) *</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration || ""}
                  onChange={(e) => handleInputChange("duration", parseInt(e.target.value))}
                  placeholder="180"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price || ""}
                  onChange={(e) => handleInputChange("price", parseFloat(e.target.value))}
                  placeholder="0.00"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Media URLs */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Media Files</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mp3Url">MP3 URL</Label>
                <Input
                  id="mp3Url"
                  type="url"
                  value={formData.mp3Url || ""}
                  onChange={(e) => handleInputChange("mp3Url", e.target.value)}
                  placeholder="https://example.com/track.mp3"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mp4Url">MP4 URL</Label>
                <Input
                  id="mp4Url"
                  type="url"
                  value={formData.mp4Url || ""}
                  onChange={(e) => handleInputChange("mp4Url", e.target.value)}
                  placeholder="https://example.com/track.mp4"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Description</h3>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Track description"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#511d5e]">
            Update {isDigitalBook ? "Book" : isAudioTrack ? "Audio Track" : "Product"}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto" />
              <p className="text-gray-600">Loading product details...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <AlertCircle className="h-8 w-8 text-red-500 mx-auto" />
              <p className="text-red-600">{error}</p>
              <Button onClick={fetchProductDetails} variant="outline">
                Try Again
              </Button>
            </div>
          </div>
        ) : success ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto" />
              <p className="text-green-600 font-medium">Product updated successfully!</p>
            </div>
          </div>
        ) : productDetails ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {isDigitalBook && renderDigitalBookFields()}
            {isAudioTrack && renderAudioTrackFields()}
            {!isDigitalBook && !isAudioTrack && renderRegularProductFields()}

            <div className="flex justify-end gap-3 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={saving}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="bg-[#8a5d95] hover:bg-[#8a5d95]/90"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
