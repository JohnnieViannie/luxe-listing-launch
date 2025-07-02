import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, X, Upload, Trash2, Image as ImageIcon, Package, Users, ShoppingCart, DollarSign, Eye, CheckCircle, XCircle, Edit, LogOut } from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";
import AdminSidebar from "@/components/AdminSidebar";
import ProductFormModal from "@/components/ProductFormModal";
import AdminSettings from "@/components/AdminSettings";
import AdminLogin from "@/components/AdminLogin";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { API_BASE_URL } from '@/lib/urls';
import api from '@/lib/api';
import { Product } from '@/types/product';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  total_orders: number;
  total_spent: number;
}

interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  customer_email: string;
  total_amount: number;
  total_ugx: number;
  status: 'pending' | 'processing' | 'delivered' | 'cancelled';
  payment_method: string;
  created_at: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    size: string;
    color: string;
  }>;
}

const Admin = () => {
  const { isAuthenticated, login, logout } = useAdminAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> & { 
    additional_images?: string[]; 
    newImages?: File[]; 
    deletedImages?: string[];
    existingImages?: string[];
  } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    brand: "",
    price: "",
    category: "",
    description: "",
    image: "",
    sizes: [] as string[],
    colors: [] as string[]
  });

  // If not authenticated, show login form
  if (!isAuthenticated) {
    return <AdminLogin onLogin={login} />;
  }

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch products
      try {
        const productsRes = await api.get('api/products/');
        const productsData = productsRes.data;
        
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products:", error);
      }

      // Fetch customers
      try {
        const customersRes = await api.get('api/customers/');
        const customersData = customersRes.data;
        setCustomers(customersData.results || customersData);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }

      // Fetch orders from API
      try {
        const ordersRes = await api.get('api/orders/');
        const ordersData = ordersRes.data;
        console.log("ordersData", ordersData);
        // If paginated, use .results, else use data directly
        const apiOrders = ordersData.results || ordersData;
        // Map/transform API orders to match the Order interface if needed
        const mappedOrders: Order[] = apiOrders.map((order: any) => {
          // Split customer string if possible
          let customer_name = '';
          let customer_email = '';
          if (order.customer && typeof order.customer === 'string') {
            const parts = order.customer.split('•');
            customer_name = parts[0]?.trim() || '';
            customer_email = parts[1]?.trim() || '';
          }

          return {
            id: order.id || order.order_number, // fallback to order_number if no id
            order_number: order.order_number,
            customer_name,
            customer_email,
            total_amount: Number(order.total_usd ?? order.total_amount ?? 0),
            total_ugx: Number(order.total_ugx ?? 0),
            status: (order.status || '').toLowerCase(), // convert to lowercase for consistency
            payment_method: order.payment_method || '',
            created_at: order.created_at,
            items: (order.items_detail || []).map((item: any) => ({
              name: item.product_name || '',
              quantity: item.quantity,
              price: Number(item.price),
              size: item.size || '',
              color: item.color || ''
            }))
          };
        });
        setOrders(mappedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const productData = {
        ...newProduct,
        price: parseFloat(newProduct.price),
        sizes: newProduct.sizes.length ? newProduct.sizes : ["S", "M", "L", "XL"],
        colors: newProduct.colors.length ? newProduct.colors : ["Black", "White", "Gray"]
      };

      const response = await api.post(`${API_BASE_URL}/api/products/`, productData);

      if (response.status === 201 || response.status === 200) {
        toast.success("Product added successfully!");
        setNewProduct({
          name: "",
          brand: "",
          price: "",
          category: "",
          description: "",
          image: "",
          sizes: [],
          colors: []
        });
        fetchData();
      } else {
        toast.error("Failed to add product");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Error adding product");
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await api.delete(`${API_BASE_URL}/api/delete-product/${id}/`);

      if (response.status === 204 || response.status === 200) {
        toast.success("Product deleted successfully!");
        fetchData();
      } else {
        toast.error("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Error deleting product");
    }
  };

  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      const response = await api.post(`api/orders/${orderId}/update_status/`, { status: newStatus });
      console.log("response", response);
     
      if (response.data.status === 'ok') {
    toast.success(`Order status updated to ${newStatus}`);
        fetchData(); // Refresh orders
      } else {
        toast.error('Failed to update order status');
      }
    } catch (error) {
      toast.error('Error updating order status');
    }
  };

  const handleDeleteOrder = (orderId: number) => {
    if (!confirm("Are you sure you want to delete this order?")) return;
    
    setOrders(orders.filter(order => order.id !== orderId));
    toast.success("Order deleted successfully!");
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Dashboard Overview</h2>
          <p className="text-gray-600">Welcome back to your admin panel</p>
        </div>
        <Button variant="outline" onClick={logout} className="flex items-center gap-2">
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              UGX{orders.reduce((sum, order) => sum + order.total_ugx, 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{order.items[0]?.name}</p>
                  <p className="text-sm text-gray-500">{order.customer_name}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">UGX {order.total_ugx.toFixed(2)}</p>
                  <Badge className={getStatusBadgeColor(order.status)}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Products Management</h2>
        <ProductFormModal onProductAdded={fetchData} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Products ({products.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <div key={product.id} className="border rounded-lg p-4">
                <img
                  src={`${API_BASE_URL}${product.featured_image}`}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-sm text-gray-500">{product.brand}</p>
                <p className="font-medium">
                  UGX {Number(product.ugx_price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <div className="mt-4 flex justify-between">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSelectedProduct(product);
                      setEditingProduct({
                        name: product.name || '',
                        slug: product.slug || '',
                        description: product.description || '',
                        category: product.category || '',
                        ugx_price: product.ugx_price || product.price || '',
                        usd_price: product.usd_price || '',
                        stock_quantity: product.stock_quantity ?? 0,
                        inStock: product.inStock ?? true,
                        bestseller: product.bestseller ?? false,
                        rating: String(product.rating ?? 0),
                        review_count: product.review_count ?? 0,
                        vendor: product.vendor || '',
                        featured: Boolean(product.featured),
                        featured_image: String(product.featured_image || ''),
                        images: Array.isArray(product.images) ? product.images.map(String) : [],
                        sizes: Array.isArray(product.sizes) ? product.sizes.map(String) : [],
                        colors: Array.isArray(product.colors) ? product.colors.map(String) : [],
                        brand: String(product.brand || ''),
                        material: String(product.material || ''),
                        care_instructions: Array.isArray(product.care_instructions) ? product.care_instructions.map(String) : [],
                        newImages: [],
                        deletedImages: [],
                        existingImages: Array.isArray(product.images) ? product.images.map(String) : []
                      });
                      setIsEditModalOpen(true);
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View/Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Edit Product Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          {editingProduct && selectedProduct && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                <div className="relative border rounded-lg p-2 bg-gray-50">
                  <div className="relative w-full h-64 overflow-hidden rounded-md">
                    {editingProduct.featured_image ? (
                      <img
                        src={editingProduct.featured_image.startsWith('blob:') ? editingProduct.featured_image : `${API_BASE_URL}${editingProduct.featured_image}`}
                        alt={editingProduct.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                        <span>No featured image</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-2 flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => {
                        if (fileInputRef.current) {
                          fileInputRef.current.accept = 'image/*';
                          fileInputRef.current.onchange = (e) => {
                            const file = (e.target as HTMLInputElement).files?.[0];
                            if (file) {
                              const newImage = URL.createObjectURL(file);
                              setEditingProduct(prev => ({
                                ...prev!,
                                featured_image: newImage,
                                newImages: [...(prev?.newImages || [])]
                              }));
                            }
                          };
                          fileInputRef.current.click();
                        }
                      }}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {editingProduct.featured_image ? 'Change' : 'Add Image'}
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                    />
                    {editingProduct.featured_image && (
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => {
                          if (confirm('Are you sure you want to remove this image?')) {
                            setEditingProduct(prev => ({
                              ...prev!,
                              featured_image: '',
                              deletedImages: [...(prev?.deletedImages || []), prev?.featured_image || '']
                            }));
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Additional Images</Label>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs h-7"
                      onClick={() => {
                        if (fileInputRef.current) {
                          fileInputRef.current.multiple = true;
                          fileInputRef.current.onchange = (e) => {
                            const files = Array.from((e.target as HTMLInputElement).files || []);
                            if (files.length > 0) {
                              setEditingProduct(prev => ({
                                ...prev!,
                                newImages: [...(prev?.newImages || []), ...files]
                              }));
                            }
                          };
                          fileInputRef.current.click();
                        }
                      }}
                    >
                      <Plus className="h-3 w-3 mr-1" /> Add Images
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {/* Existing additional images */}
                    {editingProduct.existingImages?.map((img, index) => (
                      <div key={`existing-${index}`} className="relative">
                        <img
                          src={img.startsWith('blob:') ? img : `${API_BASE_URL}${img}`}
                          alt={`Additional ${index + 1}`}
                          className="w-20 h-20 object-cover rounded-lg border"
                        />
                        <button
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                          onClick={() => {
                            if (confirm('Are you sure you want to remove this image?')) {
                              setEditingProduct(prev => ({
                                ...prev!,
                                existingImages: prev?.existingImages?.filter((_, i) => i !== index),
                                deletedImages: [...(prev?.deletedImages || []), img]
                              }));
                            }
                          }}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    
                    {/* Newly added images */}
                    {editingProduct.newImages?.map((file, index) => (
                      <div key={`new-${index}`} className="relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`New image ${index + 1}`}
                          className="w-20 h-20 object-cover rounded-lg border border-blue-300"
                        />
                        <button
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                          onClick={() => {
                            setEditingProduct(prev => ({
                              ...prev!,
                              newImages: prev?.newImages?.filter((_, i) => i !== index)
                            }));
                          }}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">

                <div className="space-y-2">
                  <Label htmlFor="product-name">Product Name</Label>
                  <Input
                    id="product-name"
                    value={editingProduct.name || ''}
                    onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
  <div className="space-y-2">
    <Label htmlFor="product-brand">Brand</Label>
    <Input
      id="product-brand"
      value={editingProduct.brand || ''}
      onChange={(e) => setEditingProduct({...editingProduct, brand: e.target.value})}
    />
  </div>
  <div className="space-y-2">
    <Label htmlFor="product-ugx-price">UGX Price</Label>
    <Input
      id="product-ugx-price"
      type="number"
      value={editingProduct.ugx_price || ''}
      onChange={(e) => setEditingProduct({...editingProduct, ugx_price: e.target.value})}
    />
  </div>
  <div className="space-y-2">
    <Label htmlFor="product-usd-price">USD Price</Label>
    <Input
      id="product-usd-price"
      type="number"
      value={editingProduct.usd_price || ''}
      onChange={(e) => setEditingProduct({...editingProduct, usd_price: e.target.value})}
    />
  </div>
  <div className="space-y-2">
    <Label htmlFor="product-stock">Stock Quantity</Label>
    <Input
      id="product-stock"
      type="number"
      value={editingProduct.stock_quantity || ''}
      onChange={(e) => setEditingProduct({...editingProduct, stock_quantity: Number(e.target.value)})}
    />
  </div>
</div>
<div className="grid grid-cols-2 gap-4">
  <div className="space-y-2">
    <Label htmlFor="product-material">Material</Label>
    <Input
      id="product-material"
      value={editingProduct.material || ''}
      onChange={(e) => setEditingProduct({...editingProduct, material: e.target.value})}
    />
  </div>
  <div className="space-y-2">
    <Label htmlFor="product-care">Care Instructions</Label>
    <Input
      id="product-care"
      value={editingProduct.care_instructions?.join(', ') || ''}
      onChange={(e) => setEditingProduct({...editingProduct, care_instructions: e.target.value.split(',').map(s => s.trim())})}
    />
  </div>
</div>
<div className="grid grid-cols-2 gap-4">
  <div className="flex items-center space-x-2">
    <input
      id="product-instock"
      type="checkbox"
      checked={!!editingProduct.inStock}
      onChange={e => setEditingProduct({...editingProduct, inStock: e.target.checked})}
    />
    <Label htmlFor="product-instock">In Stock</Label>
  </div>
  <div className="flex items-center space-x-2">
    <input
      id="product-bestseller"
      type="checkbox"
      checked={!!editingProduct.bestseller}
      onChange={e => setEditingProduct({...editingProduct, bestseller: e.target.checked})}
    />
    <Label htmlFor="product-bestseller">Bestseller</Label>
  </div>
  <div className="flex items-center space-x-2">
    <input
      id="product-featured"
      type="checkbox"
      checked={!!editingProduct.featured}
      onChange={e => setEditingProduct({...editingProduct, featured: e.target.checked})}
    />
    <Label htmlFor="product-featured">Featured</Label>
  </div>
</div>
                
                <div className="space-y-2">
                  <Label htmlFor="product-description">Description</Label>
                  <Textarea
                    id="product-description"
                    value={editingProduct.description || ''}
                    onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                    rows={4}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Colors</Label>
                  <div className="flex flex-wrap gap-2">
                    {editingProduct.colors?.map((color, index) => (
                      <div key={index} className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                        <div 
                          className="w-4 h-4 rounded-full border"
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-sm">{color}</span>
                        <button 
                          onClick={() => {
                            const newColors = [...editingProduct.colors];
                            newColors.splice(index, 1);
                            setEditingProduct({...editingProduct, colors: newColors});
                          }}
                          className="text-gray-500 hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    <button 
                      className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      onClick={() => {
                        const newColor = prompt('Enter a color (e.g., #FF0000 or red):');
                        if (newColor && editingProduct.colors) {
                          setEditingProduct({
                            ...editingProduct,
                            colors: [...editingProduct.colors, newColor]
                          });
                        }
                      }}
                    >
                      <Plus className="h-3 w-3" /> Add Color
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Sizes</Label>
                  <div className="flex flex-wrap gap-2">
                    {editingProduct.sizes?.map((size, index) => (
                      <div key={index} className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                        <span className="text-sm">{size}</span>
                        <button 
                          onClick={() => {
                            const newSizes = [...editingProduct.sizes];
                            newSizes.splice(index, 1);
                            setEditingProduct({...editingProduct, sizes: newSizes});
                          }}
                          className="text-gray-500 hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    <button 
                      className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      onClick={() => {
                        const newSize = prompt('Enter a size (e.g., S, M, L, XL):');
                        if (newSize && editingProduct.sizes) {
                          setEditingProduct({
                            ...editingProduct,
                            sizes: [...editingProduct.sizes, newSize]
                          });
                        }
                      }}
                    >
                      <Plus className="h-3 w-3" /> Add Size
                    </button>
                  </div>
                </div>
                
                <div className="pt-4 flex justify-end space-x-2 border-t">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
  onClick={async () => {
    try {
      setIsUploading(true);
      // Prepare FormData for multipart/form-data API call
      const form = new FormData();
      form.append('name', editingProduct.name || '');
      form.append('slug', editingProduct.slug || '');
      form.append('description', editingProduct.description || '');
      form.append('category', editingProduct.category !== undefined ? String(editingProduct.category) : '');
      form.append('ugx_price', parseFloat(editingProduct.ugx_price || '0').toFixed(2));
      form.append('usd_price', editingProduct.usd_price ? parseFloat(editingProduct.usd_price).toFixed(2) : '');
      form.append('stock_quantity', editingProduct.stock_quantity !== undefined ? String(editingProduct.stock_quantity) : '');
      form.append('inStock', String(!!editingProduct.inStock));
      form.append('bestseller', String(!!editingProduct.bestseller));
      form.append('rating', editingProduct.rating !== undefined ? String(editingProduct.rating) : '');
      form.append('review_count', editingProduct.review_count !== undefined ? String(editingProduct.review_count) : '0');
      form.append('vendor', editingProduct.vendor || '');
      form.append('featured', String(!!editingProduct.featured));
      form.append('brand', editingProduct.brand || '');
      form.append('sizes', JSON.stringify(editingProduct.sizes || []));
      form.append('colors', JSON.stringify(editingProduct.colors || []));
      form.append('material', editingProduct.material || '');
      form.append('care_instructions', JSON.stringify(editingProduct.care_instructions || []));
      if (editingProduct.featured_image && typeof editingProduct.featured_image !== 'string') {
        form.append('featured_image', editingProduct.featured_image);
      }
      if (editingProduct.newImages && editingProduct.newImages.length > 0) {
        editingProduct.newImages.forEach((img, idx) => {
          form.append(`images[${idx}]`, img);
        });
      }
      // Keep existing images that weren't deleted
      form.append('existingImages', JSON.stringify(editingProduct.existingImages?.filter(img =>
        !(editingProduct.deletedImages || []).includes(img)
      ) || []));
      // Mark deleted images
      form.append('deletedImages', JSON.stringify(editingProduct.deletedImages || []));
      // Send update request
      const response = await api.put(`/api/edit-product/${selectedProduct.id}/`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.status === 200) {
        toast.success('Product updated successfully!');
        fetchData();
        setIsEditModalOpen(false);
      } else {
        toast.error('Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    } finally {
      setIsUploading(false);
    }
  }}
>
  {isUploading ? 'Saving...' : 'Save Changes'}
</Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Orders Management ({orders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="border rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{order.order_number}</h3>
                    <p className="text-gray-600">{order.customer_name} • {order.customer_email}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString()} • {order.payment_method}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg">
                      {typeof order.total_amount === 'number' && !isNaN(order.total_amount)
                        ? `$${order.total_amount.toFixed(2)}`
                        : 'No Amount'}
                    </p>
                    <p className="text-sm text-gray-500">
                      UGX {order.total_ugx ? Number(order.total_ugx).toLocaleString() : '0'}
                    </p>
                    <Badge className={getStatusBadgeColor(order.status)}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium mb-2">Items:</h4>
                  <div className="space-y-2">
                    {(order.items && order.items.length > 0) ? order.items.map((item, index) => (
                      <div
                        key={`${item.name}-${item.size}-${item.color}-${index}`}
                        className="flex justify-between text-sm"
                      >
                        <span>
                          {(item.name || 'No Name')} ({item.size || '-'}, {item.color || '-'}) × {item.quantity || 0}
                        </span>
                        <span>
                          {typeof item.price === 'number' && !isNaN(item.price) && item.quantity
                            ? `$${(item.price * item.quantity).toFixed(2)}`
                            : 'No Price'}
                        </span>
                      </div>
                    )) : <span className="text-gray-400">No items</span>}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOrderStatusChange(order.id, 'processing')}
                    disabled={order.status === 'processing'}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Mark Processing
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOrderStatusChange(order.id, 'Delivered')}
                    disabled={order.status === 'delivered'}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Mark Delivered
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteOrder(order.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCustomers = () => (
    <Card>
      <CardHeader>
        <CardTitle>Customers ({customers.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {customers.map((customer) => (
            <div key={customer.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">{customer.name}</p>
                <p className="text-sm text-gray-500">{customer.email}</p>
                <p className="text-sm text-gray-500">{customer.phone}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">{customer.total_orders} orders</p>
                <p className="text-sm text-gray-500">
                  {typeof customer.total_spent === 'number' && !isNaN(customer.total_spent)
                    ? `$${customer.total_spent.toFixed(2)} spent`
                    : 'No amount'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderSettings = () => (
    <AdminSettings onSettingsUpdate={fetchData} />
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'products':
        return renderProducts();
      case 'orders':
        return renderOrders();
      case 'customers':
        return renderCustomers();
      case 'settings':
        return renderSettings();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </h1>
          <p className="text-gray-600">Manage your store</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Loading...</div>
          </div>
        ) : (
          renderContent()
        )}
      </div>
    </div>
  );
};

export default Admin;
