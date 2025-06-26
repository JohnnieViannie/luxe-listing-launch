import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Trash2, Package, Users, ShoppingCart, DollarSign, Eye, CheckCircle, XCircle } from "lucide-react";
import AdminSidebar from "@/components/AdminSidebar";

interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  image: string;
  category: string;
  sizes: string[];
  colors: string[];
  description: string;
}

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

const sampleOrders: Order[] = [
  {
    id: 1,
    order_number: "LUXE-2024-001",
    customer_name: "John Doe",
    customer_email: "john@example.com",
    total_amount: 299.99,
    total_ugx: 1109963,
    status: 'pending',
    payment_method: 'Flutterwave',
    created_at: '2024-01-15T10:30:00Z',
    items: [
      { name: "Premium Sneakers", quantity: 1, price: 299.99, size: "42", color: "Black" }
    ]
  },
  {
    id: 2,
    order_number: "LUXE-2024-002",
    customer_name: "Jane Smith",
    customer_email: "jane@example.com",
    total_amount: 189.50,
    total_ugx: 701150,
    status: 'delivered',
    payment_method: 'Flutterwave',
    created_at: '2024-01-14T15:45:00Z',
    items: [
      { name: "Designer T-Shirt", quantity: 2, price: 94.75, size: "M", color: "White" }
    ]
  },
  {
    id: 3,
    order_number: "LUXE-2024-003",
    customer_name: "Mike Johnson",
    customer_email: "mike@example.com",
    total_amount: 450.00,
    total_ugx: 1665000,
    status: 'processing',
    payment_method: 'Flutterwave',
    created_at: '2024-01-13T09:20:00Z',
    items: [
      { name: "Luxury Watch", quantity: 1, price: 450.00, size: "One Size", color: "Gold" }
    ]
  }
];

const API_BASE = "http://localhost:8000/api";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>(sampleOrders);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch products
      try {
        const productsRes = await fetch(`${API_BASE}/products/`);
        if (productsRes.ok) {
          const productsData = await productsRes.json();
          setProducts(productsData.results || productsData);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }

      // Fetch customers
      try {
        const customersRes = await fetch(`${API_BASE}/customers/`);
        if (customersRes.ok) {
          const customersData = await customersRes.json();
          setCustomers(customersData.results || customersData);
        }
      } catch (error) {
        console.error("Error fetching customers:", error);
      }

      // Use sample orders for now
      console.info("Using sample order data");
      
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

      const response = await fetch(`${API_BASE}/products/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
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
      const response = await fetch(`${API_BASE}/products/${id}/`, {
        method: 'DELETE',
      });

      if (response.ok) {
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

  const handleOrderStatusChange = (orderId: number, newStatus: Order['status']) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    toast.success(`Order status updated to ${newStatus}`);
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
              ${orders.reduce((sum, order) => sum + order.total_amount, 0).toFixed(2)}
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
                  <p className="font-medium">{order.order_number}</p>
                  <p className="text-sm text-gray-500">{order.customer_name}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${order.total_amount.toFixed(2)}</p>
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
      <Card>
        <CardHeader>
          <CardTitle>Add New Product</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddProduct} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  value={newProduct.brand}
                  onChange={(e) => setNewProduct({...newProduct, brand: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                value={newProduct.image}
                onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={newProduct.description}
                onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                required
              />
            </div>
            <Button type="submit" className="bg-black hover:bg-gray-800">
              Add Product
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Products ({products.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <div key={product.id} className="border rounded-lg p-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-sm text-gray-500">{product.brand}</p>
                <p className="font-medium">${product.price}</p>
                <div className="mt-4 flex justify-between">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View
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
                    <p className="font-semibold text-lg">${order.total_amount.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">UGX {order.total_ugx.toLocaleString()}</p>
                    <Badge className={getStatusBadgeColor(order.status)}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium mb-2">Items:</h4>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.name} ({item.size}, {item.color}) × {item.quantity}</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
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
                    onClick={() => handleOrderStatusChange(order.id, 'delivered')}
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
                <p className="text-sm text-gray-500">${customer.total_spent.toFixed(2)} spent</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
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
        return (
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Settings panel coming soon...</p>
            </CardContent>
          </Card>
        );
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
          <p className="text-gray-600">Manage your LUXE store</p>
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
