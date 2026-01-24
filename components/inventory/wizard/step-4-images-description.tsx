"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, X, Star } from "lucide-react";
import { VehicleFormData } from "@/lib/services/vehicle-form.service";
import {
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_SIZE,
  MAX_IMAGES,
  DESCRIPTION_MAX_LENGTH,
} from "@/lib/constants/vehicle-data";

interface Step4ImagesDescriptionProps {
  data: VehicleFormData;
  onUpdate: (field: keyof VehicleFormData, value: any) => void;
  onBack: () => void;
  onNext: () => void;
}

export function Step4ImagesDescription({
  data,
  onUpdate,
  onBack,
  onNext,
}: Step4ImagesDescriptionProps) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files) {
      handleFiles(files);
    }
  };

  const handleFiles = (files: FileList) => {
    const newImages = Array.from(files).filter((file) => {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        alert(`Invalid file type: ${file.type}. Please use PNG, JPG, or WEBP.`);
        return false;
      }
      if (file.size > MAX_IMAGE_SIZE) {
        alert(`File ${file.name} is too large. Max size is 10MB.`);
        return false;
      }
      return true;
    });

    if (data.images.length + newImages.length > MAX_IMAGES) {
      alert(`Maximum ${MAX_IMAGES} images allowed.`);
      return;
    }

    // Convert files to base64
    newImages.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        onUpdate("images", [...data.images, base64]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    onUpdate(
      "images",
      data.images.filter((_, i) => i !== index),
    );
  };

  const setPrimaryImage = (index: number) => {
    onUpdate("primaryImageIndex", index);
  };

  const moveImage = (index: number, direction: "up" | "down") => {
    const newImages = [...data.images];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    [newImages[index], newImages[swapIndex]] = [
      newImages[swapIndex],
      newImages[index],
    ];
    onUpdate("images", newImages);
  };

  return (
    <div className="space-y-6">
      {/* Image Upload Section */}
      <div className="space-y-4">
        <Label className="text-sm font-medium">
          Upload Photos ({data.images.length}/{MAX_IMAGES})
        </Label>

        {/* Drop Zone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 bg-gray-50"
          }`}
        >
          <input
            type="file"
            multiple
            accept="image/png,image/jpeg,image/webp"
            onChange={handleFileInput}
            className="absolute inset-0 opacity-0 cursor-pointer"
            disabled={data.images.length >= MAX_IMAGES}
          />

          <div className="flex flex-col items-center gap-2">
            <Upload className="w-8 h-8 text-gray-400" />
            <p className="text-sm font-medium text-gray-700">
              Drag & drop or click to upload
            </p>
            <p className="text-xs text-gray-500">PNG, JPG, WEBP ≤10MB</p>
          </div>
        </div>

        {/* Image Preview Grid */}
        {data.images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {data.images.map((image, index) => (
              <div
                key={index}
                className="relative group bg-gray-100 rounded-lg overflow-hidden aspect-square"
              >
                <img
                  src={image}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Primary Badge */}
                {index === data.primaryImageIndex && (
                  <div className="absolute top-1 left-1 bg-amber-500 text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    Primary
                  </div>
                )}

                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => setPrimaryImage(index)}
                    className="bg-amber-500 hover:bg-amber-600 text-white p-2 rounded"
                    title="Set as primary"
                  >
                    <Star className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeImage(index)}
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"
                    title="Delete image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Index Badge */}
                <div className="absolute bottom-1 right-1 bg-black/75 text-white text-xs px-2 py-1 rounded">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Description Section */}
      <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <Label htmlFor="description" className="text-sm font-medium">
          Vehicle Description ({data.description.length}/
          {DESCRIPTION_MAX_LENGTH})
        </Label>
        <textarea
          id="description"
          value={data.description}
          onChange={(e) => {
            const text = e.target.value.slice(0, DESCRIPTION_MAX_LENGTH);
            onUpdate("description", text);
          }}
          placeholder="Describe the vehicle condition, features, and any notable aspects..."
          rows={6}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-600">
          {DESCRIPTION_MAX_LENGTH - data.description.length} characters
          remaining
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-6 border-t border-gray-200">
        <Button onClick={onBack} variant="outline" className="flex-1">
          ← Back
        </Button>
        <Button
          onClick={onNext}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
        >
          Continue →
        </Button>
      </div>
    </div>
  );
}
