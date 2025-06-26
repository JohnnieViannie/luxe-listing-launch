
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  CheckCircle,
  Clock
} from "lucide-react";
import { toast } from "sonner";

// Currency conversion
const USD_TO_UGX_RATE = 3700;
const convertToUGX = (usdPrice: number) => Math.round(usdPrice * USD_TO_UGX_RATE);

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
  const [activeTab, setActiveTab] = useState("overview");

  const API_BASE = "http://127.0.0.1:8000/api";

  // Sample orders data for demonstration
  const sampleOrders: DjangoOrder[] = [
    {
      id: 1,
      order_number: "ORD-2024-001",
      customer: {
        first_name: "John",
        last_name: "Mukasa",
        email: "john.mukasa@gmail.com"
      },
      status: "pending",
      payment_status: "pending",
      total_amount: "185000",
      created_at: "2024-01-15T10:30:00Z"
    },
    {
      id: 2,
      order_number: "ORD-2024-002",
      customer: {
        first_name: "Sarah",
        last_name: "Nalongo",
        email: "sarah.nalongo@gmail.com"
      },
      status: "confirmed",
      payment_status: "paid",
      total_amount: "370000",
      created_at: "2024-01-14T14:20:00Z"
    },
    {
      id: 3,
      order_number: "ORD-2024-003",
      customer: {
        first_name: "David",
        last_name: "Ochan",
        email: "david.ochan@gmail.com"
      },
      status: "delivered",
      payment_status: "paid",
      total_amount: "740000",
      created_at: "2024-01-13T09:15:00Z"
    },
    {
      id: 4,
      order_number: "ORD-2024-004",
      customer: {
        first_name: "Grace",
        last_name: "Akello",
        email: "grace.akello@gmail.com"
      },
      status: "shipped",
      payment_status: "paid",
      total_amount: "555000",
      created_at: "2024-01-12T16:45:00Z"
    },
    {
      id: 5,
      order_number: "ORD-2024-005",
      customer: {
        first_name: "Peter",
        last_name: "Kiprotich",
        email: "peter.kiprotich@gmail.com"
      },
      status: "pending",
      payment_status: "pending",
      total_amount: "259000",
      created_at: "2024-01-11T11:30:00Z"
    }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [productsRes, customersRes] = await Promise.all([
        fetch(`${API_BASE}/products/`).catch(() => ({ ok: false })),
        fetch(`${API_BASE}/customers/`).catch(() => ({ ok: false }))
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
      // Use sample data on error
      setOrders(sampleOrders);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderAction = async (orderId: number, action: 'delete' | 'confirm' | 'deliver') => {
    try {
      setOrders(prevOrders => {
        return prevOrders.map(order => {
          if (order.id === orderId) {
            switch (action) {
              case 'confirm':
                toast.success(`Order ${order.order_number} confirmed`);
                return { ...order, status: 'confirmed' };
              case 'deliver':
                toast.success(`Order ${order.order_number} marked as delivered`);
                return { ...order, status: 'delivered' };
              default:
                return order;
            }
          }
          return order;
        }).filter(order => action !== 'delete' || order.id !== orderId);
      });

      if (action === 'delete') {
        toast.success('Order deleted successfully');
      }
    } catch (error) {
      console.error(`Error ${action}ing order:`, error);
      toast.error(`Failed to ${action} order`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: string) => {
    const numAmount = parseFloat(amount);
    const usdAmount = numAmount / USD_TO_UGX_RATE;
    return {
      ugx: `UGX ${numAmount.toLocaleString()}`,
      usd: `$${usdAmount.toFixed(2)}`
    };
  };

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">LUXE Admin Dashboard</h1>
              <p className="text-gray-600">Manage your e-commerce platform</p>
            </div>
            <Button className="bg-black hover:bg-gray-800">
              <Plus className="h-4 w-4 mr-2" />
              Add New Product
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
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
                      <p className="text-sm font-medium text-gray-600">Active Products</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {products.filter(p => p.is_active).length}
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
                  {orders.slice(0, 5).map((order) => {
                    const pricing = formatCurrency(order.total_amount);
                    return (
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
                          <div className="mt-1">
                            <p className="text-sm font-medium">{pricing.ugx}</p>
                            <p className="text-xs text-gray-500">{pricing.usd}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                  <Input placeholder="Search products..." className="pl-10 w-64" />
                </div>
              </div>
              <Button className="bg-black hover:bg-gray-800">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
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
                      {products.map((product) => {
                        const pricing = formatCurrency(product.price);
                        return (
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
                            <td className="p-4">
                              <div>
                                <p className="font-medium">{pricing.ugx}</p>
                                <p className="text-sm text-gray-500">{pricing.usd}</p>
                              </div>
                            </td>
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
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Management</CardTitle>
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
                      {orders.map((order) => {
                        const pricing = formatCurrency(order.total_amount);
                        return (
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
                            <td className="p-4">
                              <div>
                                <p className="font-medium">{pricing.ugx}</p>
                                <p className="text-sm text-gray-500">{pricing.usd}</p>
                              </div>
                            </td>
                            <td className="p-4 text-sm text-gray-600">
                              {new Date(order.created_at).toLocaleDateString()}
                            </td>
                            <td className="p-4">
                              <div className="flex items-center space-x-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleOrderAction(order.id, 'confirm')}
                                  className="text-blue-600 hover:text-blue-700"
                                  disabled={order.status === 'delivered'}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleOrderAction(order.id, 'deliver')}
                                  className="text-green-600 hover:text-green-700"
                                  disabled={order.status === 'delivered'}
                                >
                                  <Truck className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleOrderAction(order.id, 'delete')}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Customers Tab */}
          <TabsContent value="customers" className="space-y-6">
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
