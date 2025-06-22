import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  ShoppingCart, 
  Users, 
  Truck,
  Plus,
  Search,
  Edit,
  Eye,
  Trash2,
  LayoutDashboard,
  LogOut,
  Check,
  X
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminLogin from "../components/AdminLogin";
import AddProductModal from "../components/AddProductModal";
import { useToast } from "@/hooks/use-toast";

// Types for Django API data
interface DjangoProduct {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: string;
  stock_quantity: number;
  is_active: boolean;
  featured: boolean;
  images: Array<{
    id: number;
    image: string;
    is_primary: boolean;
  }>;
}

interface DjangoOrder {
  id: number;
  order_number: string;
  customer: {
    first_name: string;
    last_name: string;
    email: string;
  };
  status: string;
  payment_status: string;
  total_amount: string;
  created_at: string;
}

interface DjangoCustomer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  created_at: string;
}

const Admin = () => {
  const [products, setProducts] = useState<DjangoProduct[]>([]);
  const [orders, setOrders] = useState<DjangoOrder[]>([]);
  const [customers, setCustomers] = useState<DjangoCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("overview");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const API_BASE = "http://127.0.0.1:8000/api";

  // Sample data for demonstration
  const sampleOrders: DjangoOrder[] = [
    {
      id: 1,
      order_number: "ORD-2024-001",
      customer: { first_name: "John", last_name: "Doe", email: "john@example.com" },
      status: "pending",
      payment_status: "pending",
      total_amount: "70000",
      created_at: "2024-01-15T10:30:00Z"
    },
    {
      id: 2,
      order_number: "ORD-2024-002",
      customer: { first_name: "Jane", last_name: "Smith", email: "jane@example.com" },
      status: "confirmed",
      payment_status: "paid",
      total_amount: "150000",
      created_at: "2024-01-14T14:20:00Z"
    },
    {
      id: 3,
      order_number: "ORD-2024-003",
      customer: { first_name: "Mike", last_name: "Johnson", email: "mike@example.com" },
      status: "shipped",
      payment_status: "paid",
      total_amount: "250000",
      created_at: "2024-01-13T09:15:00Z"
    },
    {
      id: 4,
      order_number: "ORD-2024-004",
      customer: { first_name: "Sarah", last_name: "Wilson", email: "sarah@example.com" },
      status: "delivered",
      payment_status: "paid",
      total_amount: "100000",
      created_at: "2024-01-12T16:45:00Z"
    },
    {
      id: 5,
      order_number: "ORD-2024-005",
      customer: { first_name: "David", last_name: "Brown", email: "david@example.com" },
      status: "processing",
      payment_status: "paid",
      total_amount: "320000",
      created_at: "2024-01-11T11:30:00Z"
    }
  ];

  // USD to UGX conversion rate (approximate)
  const UGX_TO_USD_RATE = 3700;

  const convertToUSD = (ugxAmount: string | number): string => {
    const ugx = typeof ugxAmount === 'string' ? parseFloat(ugxAmount) : ugxAmount;
    const usd = ugx / UGX_TO_USD_RATE;
    return usd.toFixed(2);
  };

  const formatCurrency = (amount: string | number, showBoth: boolean = true) => {
    const ugx = typeof amount === 'string' ? parseFloat(amount) : amount;
    const formattedUGX = `UGX ${ugx.toLocaleString()}`;
    
    if (showBoth) {
      const usd = convertToUSD(ugx);
      return `${formattedUGX} ($${usd})`;
    }
    return formattedUGX;
  };

  useEffect(() => {
    // Check if admin is already logged in
    const adminAuth = localStorage.getItem('adminAuth');
    if (adminAuth === 'true') {
      setIsAuthenticated(true);
      fetchData();
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = (success: boolean) => {
    if (success) {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuth', 'true');
      fetchData();
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuth');
    navigate('/');
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [productsRes, customersRes] = await Promise.all([
        fetch(`${API_BASE}/products/`),
        fetch(`${API_BASE}/customers/`)
      ]);

      if (productsRes.ok) {
        const productsData = await productsRes.json();
        setProducts(productsData.results || productsData);
      }

      if (customersRes.ok) {
        const customersData = await customersRes.json();
        setCustomers(customersData.results || customersData);
      }

      // Use sample orders for now
      setOrders(sampleOrders);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Use sample data as fallback
      setOrders(sampleOrders);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderAction = async (orderId: number, action: 'delete' | 'delivered' | 'confirmed') => {
    try {
      if (action === 'delete') {
        setOrders(prev => prev.filter(order => order.id !== orderId));
        toast({
          title: "Order Deleted",
          description: "Order has been successfully deleted.",
        });
      } else if (action === 'delivered') {
        setOrders(prev => prev.map(order => 
          order.id === orderId 
            ? { ...order, status: 'delivered', payment_status: 'paid' }
            : order
        ));
        toast({
          title: "Order Updated",
          description: "Order marked as delivered.",
        });
      } else if (action === 'confirmed') {
        setOrders(prev => prev.map(order => 
          order.id === orderId 
            ? { ...order, status: 'confirmed', payment_status: 'paid' }
            : order
        ));
        toast({
          title: "Order Updated",
          description: "Order marked as confirmed.",
        });
      }
    } catch (error) {
      console.error("Error updating order:", error);
      toast({
        title: "Error",
        description: "Failed to update order. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'processing': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'customers', label: 'Customers', icon: Users }
  ];

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} loading={loading} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-gray-900">LUXE Admin</h1>
          <p className="text-sm text-gray-600">E-commerce Dashboard</p>
        </div>
        
        <nav className="mt-6">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-100 transition-colors ${
                activeSection === item.id ? 'bg-gray-100 border-r-2 border-black' : ''
              }`}
            >
              <item.icon className="h-5 w-5 mr-3" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-6 left-6">
          <Button onClick={handleLogout} variant="outline" className="flex items-center">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-x-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 capitalize">{activeSection}</h2>
              <p className="text-gray-600">Manage your e-commerce platform</p>
            </div>
            {activeSection === 'products' && (
              <Button onClick={() => setShowAddProduct(true)} className="bg-black hover:bg-gray-800">
                <Plus className="h-4 w-4 mr-2" />
                Add New Product
              </Button>
            )}
          </div>

          {/* Content based on active section */}
          {activeSection === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Products</p>
                        <p className="text-3xl font-bold text-gray-900">{products.length}</p>
                      </div>
                      <Package className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Orders</p>
                        <p className="text-3xl font-bold text-gray-900">{orders.length}</p>
                      </div>
                      <ShoppingCart className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Customers</p>
                        <p className="text-3xl font-bold text-gray-900">{customers.length}</p>
                      </div>
                      <Users className="h-8 w-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Revenue (UGX)</p>
                        <p className="text-xl font-bold text-gray-900">
                          {formatCurrency(orders.reduce((sum, order) => sum + parseFloat(order.total_amount), 0), false)}
                        </p>
                      </div>
                      <Truck className="h-8 w-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Orders */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">#{order.order_number}</p>
                          <p className="text-sm text-gray-600">
                            {order.customer.first_name} {order.customer.last_name}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                          <p className="text-sm text-gray-600 mt-1">{formatCurrency(order.total_amount)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeSection === 'products' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                    <Input placeholder="Search products..." className="pl-10 w-64" />
                  </div>
                </div>
              </div>

              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b bg-gray-50">
                        <tr>
                          <th className="text-left p-4">Product</th>
                          <th className="text-left p-4">Category</th>
                          <th className="text-left p-4">Price</th>
                          <th className="text-left p-4">Stock</th>
                          <th className="text-left p-4">Status</th>
                          <th className="text-left p-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((product) => (
                          <tr key={product.id} className="border-b">
                            <td className="p-4">
                              <div className="flex items-center space-x-3">
                                {product.images[0] && (
                                  <img 
                                    src={`http://127.0.0.1:8000${product.images[0].image}`}
                                    alt={product.name}
                                    className="w-12 h-12 object-cover rounded"
                                  />
                                )}
                                <div>
                                  <p className="font-medium">{product.name}</p>
                                  <p className="text-sm text-gray-600">{product.brand}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 capitalize">{product.category}</td>
                            <td className="p-4">{formatCurrency(product.price)}</td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                product.stock_quantity > 10 ? 'bg-green-100 text-green-800' :
                                product.stock_quantity > 0 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {product.stock_quantity} in stock
                              </span>
                            </td>
                            <td className="p-4">
                              <Badge className={product.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                                {product.is_active ? 'Active' : 'Inactive'}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center space-x-2">
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeSection === 'orders' && (
            <Card>
              <CardHeader>
                <CardTitle>All Orders</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b bg-gray-50">
                      <tr>
                        <th className="text-left p-4">Order #</th>
                        <th className="text-left p-4">Customer</th>
                        <th className="text-left p-4">Status</th>
                        <th className="text-left p-4">Payment</th>
                        <th className="text-left p-4">Total</th>
                        <th className="text-left p-4">Date</th>
                        <th className="text-left p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id} className="border-b">
                          <td className="p-4 font-medium">#{order.order_number}</td>
                          <td className="p-4">
                            <div>
                              <p className="font-medium">
                                {order.customer.first_name} {order.customer.last_name}
                              </p>
                              <p className="text-sm text-gray-600">{order.customer.email}</p>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge className={getStatusColor(order.status)}>
                              {order.status}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <Badge className={getStatusColor(order.payment_status)}>
                              {order.payment_status}
                            </Badge>
                          </td>
                          <td className="p-4 font-medium">{formatCurrency(order.total_amount)}</td>
                          <td className="p-4 text-sm text-gray-600">
                            {new Date(order.created_at).toLocaleDateString()}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleOrderAction(order.id, 'confirmed')}
                                title="Mark as Confirmed"
                                className="text-blue-600 hover:text-blue-700"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleOrderAction(order.id, 'delivered')}
                                title="Mark as Delivered"
                                className="text-green-600 hover:text-green-700"
                              >
                                <Truck className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-red-600 hover:text-red-700"
                                onClick={() => handleOrderAction(order.id, 'delete')}
                                title="Delete Order"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === 'customers' && (
            <Card>
              <CardHeader>
                <CardTitle>All Customers</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b bg-gray-50">
                      <tr>
                        <th className="text-left p-4">Name</th>
                        <th className="text-left p-4">Email</th>
                        <th className="text-left p-4">Phone</th>
                        <th className="text-left p-4">Location</th>
                        <th className="text-left p-4">Joined</th>
                        <th className="text-left p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customers.map((customer) => (
                        <tr key={customer.id} className="border-b">
                          <td className="p-4 font-medium">
                            {customer.first_name} {customer.last_name}
                          </td>
                          <td className="p-4">{customer.email}</td>
                          <td className="p-4">{customer.phone || 'Not provided'}</td>
                          <td className="p-4">
                            {customer.city && customer.state ? 
                              `${customer.city}, ${customer.state}` : 
                              'Not provided'
                            }
                          </td>
                          <td className="p-4 text-sm text-gray-600">
                            {new Date(customer.created_at).toLocaleDateString()}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddProduct && (
        <AddProductModal 
          onClose={() => setShowAddProduct(false)} 
          onProductAdded={fetchData}
        />
      )}
    </div>
  );
};

export default Admin;
