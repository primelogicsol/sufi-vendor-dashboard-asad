"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, X, Music, Video, FileAudio } from "lucide-react";
import { ApiClient } from "@/lib/utils/api-client";

// Initial state
const initialAudioData = {
  title: "",
  description: "",
  artist: "",
  stock: "",
  price: "",
  duration: "", // seconds as string to bind to input
  music: null as File | null,
  video: null as File | null,
};

// Validation
function validateAudio(data: typeof initialAudioData) {
  const errors: string[] = [];
  if (!data.title.trim()) errors.push("Title is required");
  if (!data.description.trim()) errors.push("Description is required");
  if (!data.artist.trim()) errors.push("Artist is required");

  if (!data.price.trim()) {
    errors.push("Price is required");
  } else if (isNaN(Number(data.price))) {
    errors.push("Price must be numeric");
  }

  if (!data.stock.trim()) {
    errors.push("Stock is required");
  } else if (!Number.isInteger(Number(data.stock)) || Number(data.stock) < 0) {
    errors.push("Stock must be a non-negative integer");
  }

  if (!data.duration.trim()) {
    errors.push("Duration is required");
  } else if (isNaN(Number(data.duration)) || Number(data.duration) <= 0) {
    errors.push("Duration must be a positive number (seconds)");
  }

//   if (!data.music) errors.push("Music (MP3) file is required");
//   else {
//     const ext = data.music.name.split(".").pop()?.toLowerCase() || "";
//     if (!(data.music.type.startsWith("audio/") || ext === "mp3")) {
//       errors.push("Music must be an MP3 file");
//     }
//   }

//   if (!data.video) errors.push("Video (MP4) file is required");
//   else {
//     const ext = data.video.name.split(".").pop()?.toLowerCase() || "";
//     if (!(data.video.type.startsWith("video/") || ext === "mp4")) {
//       errors.push("Video must be an MP4 file");
//     }
//   }

  return errors;
}

export default function AudioSpectrumUploader() {
  const [audioData, setAudioData] = useState(initialAudioData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [musicPreview, setMusicPreview] = useState<string>("");
  const [videoPreview, setVideoPreview] = useState<string>("");

  // Generic field updater
  const handleAudioChange = (
    field: keyof typeof initialAudioData,
    value: string | File | null
  ) => {
    setAudioData((prev) => ({ ...prev, [field]: value }));
  };

  // Music select
  const handleMusicSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) {
      e.target.value = "";
      return;
    }
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!(file.type.startsWith("audio/") || ext === "mp3")) {
      alert("Please upload an MP3 audio file.");
      e.target.value = "";
      return;
    }

    // revoke previous URL
    if (musicPreview) URL.revokeObjectURL(musicPreview);

    const url = URL.createObjectURL(file);
    setMusicPreview(url);
    handleAudioChange("music", file);
    e.target.value = "";
  };

  // Video select
  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) {
      e.target.value = "";
      return;
    }
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!(file.type.startsWith("video/") || ext === "mp4")) {
      alert("Please upload an MP4 video file.");
      e.target.value = "";
      return;
    }

    if (videoPreview) URL.revokeObjectURL(videoPreview);

    const url = URL.createObjectURL(file);
    setVideoPreview(url);
    handleAudioChange("video", file);
    e.target.value = "";
  };

  // remove files / previews
  const removeMusic = () => {
    if (musicPreview) {
      URL.revokeObjectURL(musicPreview);
      setMusicPreview("");
    }
    handleAudioChange("music", null);
  };

  const removeVideo = () => {
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
      setVideoPreview("");
    }
    handleAudioChange("video", null);
  };

  const resetForm = () => {
    // revoke previews
    if (musicPreview) URL.revokeObjectURL(musicPreview);
    if (videoPreview) URL.revokeObjectURL(videoPreview);
    setMusicPreview("");
    setVideoPreview("");
    setAudioData(initialAudioData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateAudio(audioData);
    if (errors.length > 0) {
      alert("Fix errors:\n" + errors.join("\n"));
      return;
    }

    const formData = new FormData();
    formData.append("title", audioData.title.trim());
    formData.append("description", audioData.description.trim());
    formData.append("artist", audioData.artist.trim());
    formData.append("stock", audioData.stock.trim());
    formData.append("price", audioData.price.trim());
    formData.append("duration", audioData.duration.trim());
    formData.append("music", audioData.music!);
    formData.append("video", audioData.video!);

    try {
      setIsSubmitting(true);
      console.log("Submitting AudioSpectrum FormData");
      for (const [k, v] of formData.entries()) {
        console.log(k, v);
      }

      // Adjust endpoint if you want a different slug
      const response = await ApiClient.postFormData("/audio", formData, true);
      console.log("✅ Audio created:", response);
      alert("Audio item uploaded successfully!");
      resetForm();
    } catch (err) {
      console.error("❌ Upload failed:", err);
      alert("Upload failed: " + (err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      if (musicPreview) URL.revokeObjectURL(musicPreview);
      if (videoPreview) URL.revokeObjectURL(videoPreview);
    };
  }, [musicPreview, videoPreview]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-bold text-[#511d5e]">
            Audio Spectrum — Basic Info
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Title */}
          <div className="flex flex-col gap-2">
            <Label><strong>Title *</strong></Label>
            <Input
              className="h-12 px-4 py-3 bg-white/30 border-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-[#8a5d95]/50"
              value={audioData.title}
              onChange={(e) => handleAudioChange("title", e.target.value)}
              placeholder="Track title"
              required
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <Label><strong>Description *</strong></Label>
            <Textarea
              className="min-h-[100px] px-4 py-3 bg-white/30 border-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-[#8a5d95]/50"
              value={audioData.description}
              onChange={(e) => handleAudioChange("description", e.target.value)}
              placeholder="Track description..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Artist */}
            <div className="flex flex-col gap-2">
              <Label><strong>Artist *</strong></Label>
              <Input
                className="h-12 px-4 py-3"
                value={audioData.artist}
                onChange={(e) => handleAudioChange("artist", e.target.value)}
                placeholder="Artist name"
                required
              />
            </div>

            {/* Stock */}
            <div className="flex flex-col gap-2">
              <Label><strong>Stock *</strong></Label>
              <Input
                className="h-12 px-4 py-3"
                type="number"
                min={0}
                step={1}
                value={audioData.stock}
                onChange={(e) => handleAudioChange("stock", e.target.value)}
                placeholder="0"
                required
              />
            </div>

            {/* Price */}
            <div className="flex flex-col gap-2">
              <Label><strong>Price *</strong></Label>
              <Input
                className="h-12 px-4 py-3"
                type="number"
                step="0.01"
                value={audioData.price}
                onChange={(e) => handleAudioChange("price", e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
          </div>

          {/* Duration */}
          <div className="flex flex-col gap-2">
            <Label><strong>Duration (seconds) *</strong></Label>
            <Input
              className="h-12 px-4 py-3"
              type="number"
              min={1}
              step={1}
              value={audioData.duration}
              onChange={(e) => handleAudioChange("duration", e.target.value)}
              placeholder="Duration in seconds"
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Files */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-bold text-[#511d5e]">Files</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Music (MP3) */}
          <div className="space-y-2">
            <Label><strong>Music (MP3) *</strong></Label>
            <div className="mt-2">
              <Input
                id="music-upload"
                type="file"
                accept=".mp3,audio/*"
                onChange={handleMusicSelect}
                className="hidden"
              />
              <label
                htmlFor="music-upload"
                className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
              >
                <div className="flex flex-col items-center justify-center pt-3 pb-4">
                  <Music className="w-8 h-8 mb-3 text-gray-500" />
                  <p className="mb-1 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> MP3</p>
                  <p className="text-xs text-gray-500">MP3 up to 200MB</p>
                </div>
              </label>
            </div>

            {audioData.music && (
              <div className="flex items-center gap-3 p-2 bg-gray-100 rounded">
                <FileAudio className="w-5 h-5 text-gray-600" />
                <div className="flex-1">
                  <div className="text-sm">{audioData.music.name}</div>
                  {musicPreview && (
                    <audio controls src={musicPreview} className="mt-1 w-full" />
                  )}
                </div>
                <button type="button" onClick={removeMusic} className="text-red-500 hover:text-red-700">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Video (MP4) */}
          <div className="space-y-2">
            <Label><strong>Video (MP4) *</strong></Label>
            <div className="mt-2">
              <Input
                id="video-upload"
                type="file"
                accept=".mp4,video/*"
                onChange={handleVideoSelect}
                className="hidden"
              />
              <label
                htmlFor="video-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
              >
                <div className="flex flex-col items-center justify-center pt-3 pb-4">
                  <Video className="w-8 h-8 mb-3 text-gray-500" />
                  <p className="mb-1 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> MP4</p>
                  <p className="text-xs text-gray-500">MP4 up to 500MB</p>
                </div>
              </label>
            </div>

            {audioData.video && videoPreview && (
              <div className="relative p-2 bg-gray-100 rounded">
                <video src={videoPreview} controls className="w-full max-h-48 object-cover rounded" />
                <button
                  type="button"
                  onClick={removeVideo}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="text-sm mt-2">{audioData.video.name}</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" onClick={resetForm} variant="outline" className="border-gray-300 hover:bg-gray-50">
          Reset Form
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-gradient-to-r from-[#8a5d95] to-[#644c6a] text-white shadow-lg"
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Upload Audio
        </Button>
      </div>
    </form>
  );
}
