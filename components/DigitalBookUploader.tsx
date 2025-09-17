"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2, X, Upload, FileText, Image } from "lucide-react";
import { ApiClient } from "@/lib/utils/api-client";

// Validation function
function validateDigitalBook(data: typeof initialDigitalBookData) {
  const errors: string[] = [];

  if (!data.title.trim()) errors.push("Title is required");
  if (!data.description.trim()) errors.push("Description is required");
  if (!data.price.trim()) {
    errors.push("Price is required");
  } else if (isNaN(Number(data.price))) {
    errors.push("Price must be numeric");
  }
  
  if (!data.thumbnail) errors.push("Thumbnail image is required");
  if (!data.document) errors.push("Document file is required");

  // Validate date format if provided
  if (data.releaseDate && !/^\d{4}-\d{2}-\d{2}$/.test(data.releaseDate)) {
    errors.push("Release date must be in YYYY-MM-DD format");
  }

  return errors;
}

// Initial state for digital book
const initialDigitalBookData = {
  title: "",
  description: "",
  price: "",
  author: "",
  genre: "",
  releaseDate: "",
  fileType: "",
  isAvailable: true,
  thumbnail: null as File | null,
  document: null as File | null,
  overviewImages: [] as File[],
};

export default function DigitalBookUploader() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [digitalBookData, setDigitalBookData] = useState(initialDigitalBookData);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
  const [overviewPreviews, setOverviewPreviews] = useState<string[]>([]);

  const handleDigitalBookChange = (
    field: keyof typeof initialDigitalBookData,
    value: string | boolean | File | File[] | null
  ) => {
    setDigitalBookData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle thumbnail selection
  const handleThumbnailSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file for thumbnail");
        return;
      }

      handleDigitalBookChange("thumbnail", file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  // Handle document selection
  const handleDocumentSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Auto-detect file type based on extension
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (extension) {
        handleDigitalBookChange("fileType", extension);
      }
      
      handleDigitalBookChange("document", file);
    }
    e.target.value = "";
  };

  // Handle overview images selection
  const handleOverviewImagesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Validate file types
    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        alert(`${file.name} is not an image file`);
        return false;
      }
      return true;
    });

    // Check total count (max 5)
    const currentCount = digitalBookData.overviewImages.length;
    const availableSlots = 5 - currentCount;
    
    if (validFiles.length > availableSlots) {
      alert(`You can only add ${availableSlots} more images (maximum 5 total)`);
      validFiles.splice(availableSlots);
    }

    if (validFiles.length > 0) {
      const newOverviewImages = [...digitalBookData.overviewImages, ...validFiles];
      handleDigitalBookChange("overviewImages", newOverviewImages);

      // Create previews for new images
      validFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setOverviewPreviews((prev) => [...prev, e.target?.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }

    e.target.value = "";
  };

  // Remove thumbnail
  const removeThumbnail = () => {
    handleDigitalBookChange("thumbnail", null);
    setThumbnailPreview("");
  };

  // Remove document
  const removeDocument = () => {
    handleDigitalBookChange("document", null);
  };

  // Remove overview image
  const removeOverviewImage = (index: number) => {
    const newImages = digitalBookData.overviewImages.filter((_, i) => i !== index);
    const newPreviews = overviewPreviews.filter((_, i) => i !== index);

    handleDigitalBookChange("overviewImages", newImages);
    setOverviewPreviews(newPreviews);
  };

  const resetForm = () => {
    setDigitalBookData(initialDigitalBookData);
    setThumbnailPreview("");
    setOverviewPreviews([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateDigitalBook(digitalBookData);
    if (errors.length > 0) {
      alert("Fix errors:\n" + errors.join("\n"));
      return;
    }

    // Create FormData
    const formData = new FormData();

    // Required fields
    formData.append("title", digitalBookData.title.trim());
    formData.append("description", digitalBookData.description.trim());
    formData.append("price", digitalBookData.price);
    formData.append("thumbnail", digitalBookData.thumbnail!);
    formData.append("document", digitalBookData.document!);

    // Optional fields (only append if provided)
    if (digitalBookData.author.trim()) {
      formData.append("author", digitalBookData.author.trim());
    }
    if (digitalBookData.genre.trim()) {
      formData.append("genre", digitalBookData.genre.trim());
    }
    if (digitalBookData.releaseDate.trim()) {
      formData.append("releaseDate", digitalBookData.releaseDate.trim());
    }
    if (digitalBookData.fileType.trim()) {
      formData.append("fileType", digitalBookData.fileType.trim());
    }
    
    formData.append("isAvailable", digitalBookData.isAvailable.toString());

    // Overview images
    digitalBookData.overviewImages.forEach((file) => {
      formData.append("overviewImages", file);
    });

    try {
      setIsSubmitting(true);
      console.log("Submitting to /digital-books with FormData", formData);

      // Log FormData contents for debugging
      for (const [key, value] of formData.entries()) {
        console.log(key, value);
      }
      
      const response = await ApiClient.postFormData("/digital-books", formData, true);
      console.log("✅ Digital Book Created:", response);
      alert("Digital book uploaded successfully!");
      resetForm();
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
          <CardTitle className="text-lg text-bold text-[#511d5e]">
            Digital Book Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Title */}
          <div className="flex flex-col gap-2">
            <Label>
              <strong>Book Title *</strong>
            </Label>
            <Input
              className="h-12 px-4 py-3 bg-white/30 border-gray-300 text-gray-900 placeholder:text-gray-500 transition-all duration-300 focus:bg-gradient-to-r focus:from-[#8a5d95]/20 focus:to-[#644c6a]/20 focus:border-[#8a5d95] focus:text-black focus:placeholder:text-white/50 focus:ring-2 focus:ring-[#8a5d95]/50 focus:shadow-xl focus:backdrop-blur-sm hover:border-gray-400"
              value={digitalBookData.title}
              onChange={(e) =>
                handleDigitalBookChange("title", e.target.value)
              }
              placeholder="Enter book title"
              required
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <Label>
              <strong>Description *</strong>
            </Label>
            <Textarea
              className="min-h-[100px] px-4 py-3 bg-white/30 border-gray-300 text-gray-900 placeholder:text-gray-500 transition-all duration-300 focus:bg-gradient-to-r focus:from-[#8a5d95]/20 focus:to-[#644c6a]/20 focus:border-[#8a5d95] focus:text-black focus:placeholder:text-white/50 focus:ring-2 focus:ring-[#8a5d95]/50 focus:shadow-xl focus:backdrop-blur-sm hover:border-gray-400"
              value={digitalBookData.description}
              onChange={(e) =>
                handleDigitalBookChange("description", e.target.value)
              }
              placeholder="Book description..."
              required
            />
          </div>

          {/* Price */}
          <div className="flex flex-col gap-2">
            <Label>
              <strong>Price *</strong>
            </Label>
            <Input
              className="h-12 px-4 py-3 bg-white/30 border-gray-300 text-gray-900 placeholder:text-gray-500 transition-all duration-300 focus:bg-gradient-to-r focus:from-[#8a5d95]/20 focus:to-[#644c6a]/20 focus:border-[#8a5d95] focus:text-black focus:placeholder:text-white/50 focus:ring-2 focus:ring-[#8a5d95]/50 focus:shadow-xl focus:backdrop-blur-sm hover:border-gray-400"
              type="number"
              step="0.01"
              value={digitalBookData.price}
              onChange={(e) =>
                handleDigitalBookChange("price", e.target.value)
              }
              placeholder="0.00"
              required
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-bold text-[#511d5e]">
            Additional Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Author */}
          <div className="flex flex-col gap-2">
            <Label>
              <strong>Author</strong>
            </Label>
            <Input
              className="h-12 px-4 py-3 bg-white/30 border-gray-300 text-gray-900 placeholder:text-gray-500 transition-all duration-300 focus:bg-gradient-to-r focus:from-[#8a5d95]/20 focus:to-[#644c6a]/20 focus:border-[#8a5d95] focus:text-black focus:placeholder:text-white/50 focus:ring-2 focus:ring-[#8a5d95]/50 focus:shadow-xl focus:backdrop-blur-sm hover:border-gray-400"
              value={digitalBookData.author}
              onChange={(e) =>
                handleDigitalBookChange("author", e.target.value)
              }
              placeholder="Author name"
            />
          </div>

          {/* Genre */}
          <div className="flex flex-col gap-2">
            <Label>
              <strong>Genre</strong>
            </Label>
            <Input
              className="h-12 px-4 py-3 bg-white/30 border-gray-300 text-gray-900 placeholder:text-gray-500 transition-all duration-300 focus:bg-gradient-to-r focus:from-[#8a5d95]/20 focus:to-[#644c6a]/20 focus:border-[#8a5d95] focus:text-black focus:placeholder:text-white/50 focus:ring-2 focus:ring-[#8a5d95]/50 focus:shadow-xl focus:backdrop-blur-sm hover:border-gray-400"
              value={digitalBookData.genre}
              onChange={(e) =>
                handleDigitalBookChange("genre", e.target.value)
              }
              placeholder="e.g. Fiction, Poetry, Science"
            />
          </div>

          {/* Release Date */}
          <div className="flex flex-col gap-2">
            <Label>
              <strong>Release Date</strong>
            </Label>
            <Input
              className="h-12 px-4 py-3 bg-white/30 border-gray-300 text-gray-900 placeholder:text-gray-500 transition-all duration-300 focus:bg-gradient-to-r focus:from-[#8a5d95]/20 focus:to-[#644c6a]/20 focus:border-[#8a5d95] focus:text-black focus:placeholder:text-white/50 focus:ring-2 focus:ring-[#8a5d95]/50 focus:shadow-xl focus:backdrop-blur-sm hover:border-gray-400"
              type="date"
              value={digitalBookData.releaseDate}
              onChange={(e) =>
                handleDigitalBookChange("releaseDate", e.target.value)
              }
            />
          </div>

          {/* File Type */}
          <div className="flex flex-col gap-2">
            <Label>
              <strong>File Type</strong>
            </Label>
            <Input
              className="h-12 px-4 py-3 bg-white/30 border-gray-300 text-gray-900 placeholder:text-gray-500 transition-all duration-300 focus:bg-gradient-to-r focus:from-[#8a5d95]/20 focus:to-[#644c6a]/20 focus:border-[#8a5d95] focus:text-black focus:placeholder:text-white/50 focus:ring-2 focus:ring-[#8a5d95]/50 focus:shadow-xl focus:backdrop-blur-sm hover:border-gray-400"
              value={digitalBookData.fileType}
              onChange={(e) =>
                handleDigitalBookChange("fileType", e.target.value)
              }
              placeholder="pdf, epub, mobi, etc."
            />
          </div>

          {/* Is Available */}
          <div className="flex items-center space-x-2">
            <Switch
              id="isAvailable"
              checked={digitalBookData.isAvailable}
              onCheckedChange={(checked) =>
                handleDigitalBookChange("isAvailable", checked)
              }
            />
            <Label htmlFor="isAvailable">
              <strong>Available for Purchase</strong>
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Files Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-bold text-[#511d5e]">
            File Uploads
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Thumbnail Upload */}
          <div className="space-y-2">
            <Label>
              <strong>Book Cover (Thumbnail) *</strong>
            </Label>
            <div className="mt-2">
              <Input
                type="file"
                accept="image/*"
                onChange={handleThumbnailSelect}
                className="hidden"
                id="thumbnail-upload"
              />
              <label
                htmlFor="thumbnail-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Image className="w-8 h-8 mb-4 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> book cover
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                </div>
              </label>
            </div>
            
            {thumbnailPreview && (
              <div className="relative inline-block">
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail preview"
                  className="w-32 h-40 object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={removeThumbnail}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Document Upload */}
          <div className="space-y-2">
            <Label>
              <strong>Book File (Document) *</strong>
            </Label>
            <div className="mt-2">
              <Input
                type="file"
                accept=".pdf,.epub,.mobi,.txt,.doc,.docx"
                onChange={handleDocumentSelect}
                className="hidden"
                id="document-upload"
              />
              <label
                htmlFor="document-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FileText className="w-8 h-8 mb-4 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> book file
                  </p>
                  <p className="text-xs text-gray-500">PDF, EPUB, MOBI, TXT, DOC</p>
                </div>
              </label>
            </div>
            
            {digitalBookData.document && (
              <div className="flex items-center gap-2 p-2 bg-gray-100 rounded">
                <FileText className="w-5 h-5 text-gray-600" />
                <span className="flex-1 text-sm">{digitalBookData.document.name}</span>
                <button
                  type="button"
                  onClick={removeDocument}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Overview Images Upload */}
          <div className="space-y-2">
            <Label>
              <strong>Overview Images (0-5 images)</strong>
            </Label>
            <div className="mt-2">
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={handleOverviewImagesSelect}
                className="hidden"
                id="overview-upload"
                disabled={digitalBookData.overviewImages.length >= 5}
              />
              <label
                htmlFor="overview-upload"
                className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 ${
                  digitalBookData.overviewImages.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-4 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> overview images
                  </p>
                  <p className="text-xs text-gray-500">
                    {digitalBookData.overviewImages.length}/5 images selected
                  </p>
                </div>
              </label>
            </div>
            
            {overviewPreviews.length > 0 && (
              <div>
                <Label>Overview Images ({overviewPreviews.length})</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                  {overviewPreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Overview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => removeOverviewImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          onClick={resetForm}
          variant="outline"
          className="border-gray-300 hover:bg-gray-50"
        >
          Reset Form
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-gradient-to-r from-[#8a5d95] to-[#644c6a] hover:from-[#684670] hover:to-[#644c6a] text-white shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {isSubmitting && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Upload Digital Book
        </Button>
      </div>
    </form>
  );
}