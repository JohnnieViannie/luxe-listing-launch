import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { X, Upload, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface AddProductModalProps {
  onClose: () => void;
  onProductAdded: () => void;
}

interface Variant {
  size: string;
  color: string;
  stock_quantity: number;
  price: number;
  sku: string;
}

const AddProductModal = ({ onClose, onProductAdded }: AddProductModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category: "",
    price: "",
    discount_price: "",
    description: "",
    stock_quantity: "",
    is_active: true,
    featured: false,
    specifications: "",
    sizes: "",
    colors: "",
    tags: "",
    meta_title: "",
    meta_description: "",
    slug: "",
    weight: "",
    dimensions: "",
  });
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = ["fashion", "electronics", "accessories", "beauty", "home"];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const validFiles = newFiles.filter(file => {
        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
          toast.error(`${file.name} is not a valid image type (JPEG, PNG, WebP only).`);
          return false;
        }
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} exceeds 5MB limit.`);
          return false;
        }
        return true;
      });

      setImages(prev => [...prev, ...validFiles]);
      const previews = validFiles.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...previews]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const addVariant = () => {
    setVariants(prev => [
      ...prev,
      { size: "", color: "", stock_quantity: 0, price: 0, sku: "" },
    ]);
  };

  const updateVariant = (index: number, field: keyof Variant, value: string | number) => {
    setVariants(prev =>
      prev.map((variant, i) =>
        i === index ? { ...variant, [field]: value } : variant
      )
    );
  };

  const removeVariant = (index: number) => {
    setVariants(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    if (!formData.name.trim()) return "Product name is required.";
    if (!formData.brand.trim()) return "Brand is required.";
    if (!formData.category) return "Category is required.";
    if (!formData.price || parseFloat(formData.price) <= 0) return "Valid price is required.";
    if (!formData.stock_quantity || parseInt(formData.stock_quantity) < 0) return "Valid stock quantity is required.";
    if (images.length === 0) return "At least one product image is required.";
    if (formData.discount_price && parseFloat(formData.discount_price) >= parseFloat(formData.price)) {
      return "Discount price must be less than regular price.";
    }
    if (variants.length > 0) {
      for (const variant of variants) {
        if (!variant.size || !variant.color || variant.stock_quantity < 0 || variant.price <= 0 || !variant.sku) {
          return "All variant fields must be filled correctly.";
        }
      }
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsSubmitting(true);
    const formDataToSend = new FormData();
    
    // Append form data
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value.toString());
    });

    // Append images
    images.forEach((image, index) => {
      formDataToSend.append(`images[${index}]`, image);
    });

    // Append variants
    formDataToSend.append("variants", JSON.stringify(variants));

    try {
      const response = await fetch("http://127.0.0.1:8000/api/products/", {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        toast.success("Product added successfully!");
        onProductAdded();
        onClose();
      } else {
        const errorData = await response.json();
        toast.error("Failed to add product: " + (errorData.detail || "Unknown error"));
      }
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Failed to add product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Add New Product
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="brand">Brand *</Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => handleChange("brand", e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  placeholder="summer, casual, trendy"
                  value={formData.tags}
                  onChange={(e) => handleChange("tags", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Pricing</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price * ($)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleChange("price", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discount_price">Discount Price ($)</Label>
                <Input
                  id="discount_price"
                  type="number"
                  step="0.01"
                  value={formData.discount_price}
                  onChange={(e) => handleChange("discount_price", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock Quantity *</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock_quantity}
                  onChange={(e) => handleChange("stock_quantity", e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Product Images *</h3>
            <div className="space-y-2">
              <Label>Upload Images (JPEG, PNG, WebP, max 5MB each)</Label>
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Images
                </Button>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-4 gap-4 mt-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Preview ${index}`}
                        className="h-24 w-24 object-cover rounded"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-0 right-0 h-6 w-6"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Variants */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              Product Variants
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="ml-2">
                      ?
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Add variants for products with different sizes, colors, etc.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </h3>
            {variants.map((variant, index) => (
              <div key={index} className="grid grid-cols-5 gap-4 border p-4 rounded">
                <div className="space-y-2">
                  <Label htmlFor={`variant-size-${index}`}>Size</Label>
                  <Input
                    id={`variant-size-${index}`}
                    value={variant.size}
                    onChange={(e) => updateVariant(index, "size", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`variant-color-${index}`}>Color</Label>
                  <Input
                    id={`variant-color-${index}`}
                    value={variant.color}
                    onChange={(e) => updateVariant(index, "color", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`variant-stock-${index}`}>Stock</Label>
                  <Input
                    id={`variant-stock-${index}`}
                    type="number"
                    value={variant.stock_quantity}
                    onChange={(e) => updateVariant(index, "stock_quantity", parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`variant-price-${index}`}>Price ($)</Label>
                  <Input
                    id={`variant-price-${index}`}
                    type="number"
                    step="0.01"
                    value={variant.price}
                    onChange={(e) => updateVariant(index, "price", parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`variant-sku-${index}`}>SKU</Label>
                  <Input
                    id={`variant-sku-${index}`}
                    value={variant.sku}
                    onChange={(e) => updateVariant(index, "sku", e.target.value)}
                  />
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => removeVariant(index)}
                  className="self-end"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addVariant}>
              Add Variant
            </Button>
          </div>

          {/* Description & Specifications */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Description & Specifications</h3>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="specifications">Specifications</Label>
              <Textarea
                id="specifications"
                value={formData.specifications}
                onChange={(e) => handleChange("specifications", e.target.value)}
                rows={3}
                placeholder="Key product specifications..."
              />
            </div>
          </div>

          {/* SEO */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">SEO</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="meta_title">Meta Title</Label>
                <Input
                  id="meta_title"
                  value={formData.meta_title}
                  onChange={(e) => handleChange("meta_title", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => handleChange("slug", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="meta_description">Meta Description</Label>
              <Textarea
                id="meta_description"
                value={formData.meta_description}
                onChange={(e) => handleChange("meta_description", e.target.value)}
                rows={3}
              />
            </div>
          </div>

          {/* Shipping */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Shipping Information</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.01"
                  value={formData.weight}
                  onChange={(e) => handleChange("weight", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dimensions">Dimensions (cm)</Label>
                <Input
                  id="dimensions"
                  placeholder="L x W x H"
                  value={formData.dimensions}
                  onChange={(e) => handleChange("dimensions", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Status</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => handleChange("is_active", checked)}
                />
                <Label htmlFor="is_active">Active Product</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => handleChange("featured", checked)}
                />
                <Label htmlFor="featured">Featured Product</Label>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
              {isSubmitting ? "Adding..." : "Add Product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductModal;
