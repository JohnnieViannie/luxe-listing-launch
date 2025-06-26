
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Plus, X, Upload, Package } from 'lucide-react';

interface ProductFormData {
  name: string;
  description: string;
  category: string;
  tags: string[];
  sku: string;
  price: string;
  discount_price: string;
  stock_quantity: string;
  is_in_stock: boolean;
  featured: boolean;
  images: File[];
  video_url: string;
  weight: string;
  length: string;
  width: string;
  height: string;
  delivery_options: string[];
  shipping_regions: string[];
  variants: Array<{ type: string; options: string[] }>;
  custom_attributes: Array<{ key: string; value: string }>;
  status: string;
  visibility: string;
}

const API_BASE = "http://localhost:8000/api";

const ProductFormModal = ({ onProductAdded }: { onProductAdded: () => void }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentTag, setCurrentTag] = useState('');
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    category: 'women',
    tags: [],
    sku: '',
    price: '',
    discount_price: '',
    stock_quantity: '0',
    is_in_stock: true,
    featured: false,
    images: [],
    video_url: '',
    weight: '',
    length: '',
    width: '',
    height: '',
    delivery_options: [],
    shipping_regions: [],
    variants: [{ type: 'Size', options: [] }, { type: 'Color', options: [] }],
    custom_attributes: [],
    status: 'draft',
    visibility: 'public'
  });

  const handleInputChange = (field: keyof ProductFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      handleInputChange('tags', [...formData.tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    handleInputChange('tags', formData.tags.filter(tag => tag !== tagToRemove));
  };

  const addCustomAttribute = () => {
    handleInputChange('custom_attributes', [...formData.custom_attributes, { key: '', value: '' }]);
  };

  const updateCustomAttribute = (index: number, field: 'key' | 'value', value: string) => {
    const updated = [...formData.custom_attributes];
    updated[index][field] = value;
    handleInputChange('custom_attributes', updated);
  };

  const removeCustomAttribute = (index: number) => {
    handleInputChange('custom_attributes', formData.custom_attributes.filter((_, i) => i !== index));
  };

  const updateVariantOptions = (variantIndex: number, options: string) => {
    const updated = [...formData.variants];
    updated[variantIndex].options = options.split(',').map(opt => opt.trim()).filter(opt => opt);
    handleInputChange('variants', updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        name: formData.name,
        brand: 'LUXE',
        category: formData.category,
        description: formData.description,
        price: parseFloat(formData.price) || 0,
        stock_quantity: parseInt(formData.stock_quantity) || 0,
        is_active: formData.status === 'published',
        featured: formData.featured,
        specifications: {
          sku: formData.sku,
          weight: formData.weight,
          dimensions: {
            length: formData.length,
            width: formData.width,
            height: formData.height
          },
          delivery_options: formData.delivery_options,
          shipping_regions: formData.shipping_regions,
          custom_attributes: Object.fromEntries(
            formData.custom_attributes.map(attr => [attr.key, attr.value])
          ),
          video_url: formData.video_url,
          visibility: formData.visibility
        },
        sizes: formData.variants.find(v => v.type === 'Size')?.options || [],
        colors: formData.variants.find(v => v.type === 'Color')?.options || [],
        tags: formData.tags,
        discount_price: formData.discount_price ? parseFloat(formData.discount_price) : null
      };

      const response = await fetch(`${API_BASE}/products/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        toast.success('Product added successfully!');
        setOpen(false);
        onProductAdded();
        // Reset form
        setFormData({
          name: '',
          description: '',
          category: 'women',
          tags: [],
          sku: '',
          price: '',
          discount_price: '',
          stock_quantity: '0',
          is_in_stock: true,
          featured: false,
          images: [],
          video_url: '',
          weight: '',
          length: '',
          width: '',
          height: '',
          delivery_options: [],
          shipping_regions: [],
          variants: [{ type: 'Size', options: [] }, { type: 'Color', options: [] }],
          custom_attributes: [],
          status: 'draft',
          visibility: 'public'
        });
      } else {
        const errorData = await response.json();
        toast.error(`Failed to add product: ${errorData.detail || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Error adding product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-black hover:bg-gray-800">
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Package className="h-5 w-5 mr-2" />
            Add New Product
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Product Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">🛒 Basic Product Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Wireless Bluetooth Headphones"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) => handleInputChange('sku', e.target.value)}
                  placeholder="WBH-001"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Detailed product description..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="women">Women</SelectItem>
                    <SelectItem value="men">Men</SelectItem>
                    <SelectItem value="beauty">Beauty</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Tags</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    placeholder="Add tag..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag} size="sm">Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">💵 Pricing & Inventory</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="price">Price (USD) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="discount_price">Discount Price (USD)</Label>
                <Input
                  id="discount_price"
                  type="number"
                  step="0.01"
                  value={formData.discount_price}
                  onChange={(e) => handleInputChange('discount_price', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="stock_quantity">Stock Quantity</Label>
                <Input
                  id="stock_quantity"
                  type="number"
                  value={formData.stock_quantity}
                  onChange={(e) => handleInputChange('stock_quantity', e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_in_stock"
                  checked={formData.is_in_stock}
                  onCheckedChange={(checked) => handleInputChange('is_in_stock', checked)}
                />
                <Label htmlFor="is_in_stock">Is In Stock</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => handleInputChange('featured', checked)}
                />
                <Label htmlFor="featured">Featured Product</Label>
              </div>
            </div>
          </div>

          {/* Product Variants */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">🔧 Product Variants</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Sizes (comma-separated)</Label>
                <Input
                  placeholder="S, M, L, XL"
                  onChange={(e) => updateVariantOptions(0, e.target.value)}
                />
              </div>
              
              <div>
                <Label>Colors (comma-separated)</Label>
                <Input
                  placeholder="Black, White, Blue, Red"
                  onChange={(e) => updateVariantOptions(1, e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Shipping & Delivery */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">🚚 Shipping & Delivery</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="length">Length (cm)</Label>
                <Input
                  id="length"
                  type="number"
                  value={formData.length}
                  onChange={(e) => handleInputChange('length', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="width">Width (cm)</Label>
                <Input
                  id="width"
                  type="number"
                  value={formData.width}
                  onChange={(e) => handleInputChange('width', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={formData.height}
                  onChange={(e) => handleInputChange('height', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Media */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">🖼️ Media</h3>
            <div>
              <Label htmlFor="video_url">Video URL (YouTube/MP4)</Label>
              <Input
                id="video_url"
                value={formData.video_url}
                onChange={(e) => handleInputChange('video_url', e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>
          </div>

          {/* Custom Attributes */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Custom Attributes</h3>
              <Button type="button" onClick={addCustomAttribute} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                Add Attribute
              </Button>
            </div>
            
            {formData.custom_attributes.map((attr, index) => (
              <div key={index} className="flex gap-2 items-center">
                <Input
                  placeholder="Attribute name"
                  value={attr.key}
                  onChange={(e) => updateCustomAttribute(index, 'key', e.target.value)}
                />
                <Input
                  placeholder="Attribute value"
                  value={attr.value}
                  onChange={(e) => updateCustomAttribute(index, 'value', e.target.value)}
                />
                <Button
                  type="button"
                  onClick={() => removeCustomAttribute(index)}
                  size="sm"
                  variant="destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Advanced Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">⚙️ Advanced Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="hidden">Hidden</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Visibility</Label>
                <Select value={formData.visibility} onValueChange={(value) => handleInputChange('visibility', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="login-only">Login Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-6 border-t">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-black hover:bg-gray-800">
              {loading ? 'Adding...' : 'Add Product'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductFormModal;
