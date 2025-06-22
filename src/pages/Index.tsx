
import { useState, useEffect } from "react";
import { Search, Filter, Heart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import ProductQuickView from "@/components/ProductQuickView";
import ProductFilters from "@/components/ProductFilters";
import SearchAndSort from "@/components/SearchAndSort";
import FloatingCart from "@/components/FloatingCart";
import HelpButton from "@/components/HelpButton";
import { useCart } from "@/contexts/CartContext";
import { useProductFilter } from "@/contexts/ProductFilterContext";

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

interface Product {
  id: number;
  image: string;
  brand: string;
  name: string;
  price: number;
  category: string;
}

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showQuickView, setShowQuickView] = useState(false);
  const { getTotalItems } = useCart();
  const { filteredProducts, searchTerm, setSearchTerm } = useProductFilter();

  const API_BASE = "http://127.0.0.1:8000/api";

  // USD to UGX conversion rate (approximate)
  const UGX_TO_USD_RATE = 3700;

  const convertToUSD = (ugxAmount: string | number): string => {
    const ugx = typeof ugxAmount === 'string' ? parseFloat(ugxAmount) : ugxAmount;
    const usd = ugx / UGX_TO_USD_RATE;
    return usd.toFixed(2);
  };

  const formatCurrency = (amount: string | number) => {
    const ugx = typeof amount === 'string' ? parseFloat(amount) : amount;
    const formattedUGX = `UGX ${ugx.toLocaleString()}`;
    const usd = convertToUSD(ugx);
    return `${formattedUGX} ($${usd})`;
  };

  // Sample products with UGX pricing
  const sampleProducts: Product[] = [
    {
      id: 1,
      image: "/placeholder.svg",
      brand: "LUXE",
      name: "Premium Leather Jacket",
      price: 150000,
      category: "men"
    },
    {
      id: 2,
      image: "/placeholder.svg",
      brand: "LUXE",
      name: "Designer Handbag",
      price: 200000,
      category: "women"
    },
    {
      id: 3,
      image: "/placeholder.svg",
      brand: "LUXE",
      name: "Luxury Watch",
      price: 350000,
      category: "men"
    },
    {
      id: 4,
      image: "/placeholder.svg",
      brand: "LUXE",
      name: "Silk Dress",
      price: 100000,
      category: "women"
    },
    {
      id: 5,
      image: "/placeholder.svg",
      brand: "LUXE",
      name: "Premium Sneakers",
      price: 180000,
      category: "men"
    },
    {
      id: 6,
      image: "/placeholder.svg",
      brand: "LUXE",
      name: "Diamond Earrings",
      price: 250000,
      category: "women"
    },
    {
      id: 7,
      image: "/placeholder.svg",
      brand: "LUXE",
      name: "Designer Sunglasses",
      price: 70000,
      category: "beauty"
    },
    {
      id: 8,
      image: "/placeholder.svg",
      brand: "LUXE",
      name: "Luxury Perfume",
      price: 85000,
      category: "beauty"
    }
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/products/`);
      
      if (response.ok) {
        const data = await response.json();
        const djangoProducts = data.results || data;
        
        // Convert Django products to our format
        const convertedProducts: Product[] = djangoProducts.map((product: DjangoProduct) => ({
          id: product.id,
          image: product.images[0]?.image ? `http://127.0.0.1:8000${product.images[0].image}` : "/placeholder.svg",
          brand: product.brand,
          name: product.name,
          price: parseFloat(product.price),
          category: product.category
        }));

        // Combine with sample products if needed
        const allProducts = convertedProducts.length > 0 ? convertedProducts : sampleProducts;
        setProducts(allProducts);
      } else {
        // Fallback to sample products
        setProducts(sampleProducts);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      // Fallback to sample products
      setProducts(sampleProducts);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
    setShowQuickView(true);
  };

  const displayProducts = filteredProducts.length > 0 ? filteredProducts : products;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-black">LUXE</h1>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-900 hover:text-gray-600 font-medium">Women</a>
              <a href="#" className="text-gray-900 hover:text-gray-600 font-medium">Men</a>
              <a href="#" className="text-gray-900 hover:text-gray-600 font-medium">Beauty</a>
              <a href="#" className="text-gray-900 hover:text-gray-600 font-medium">Sale</a>
            </nav>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingBag className="h-5 w-5" />
                {getTotalItems() > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-black">
                    {getTotalItems()}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <ProductFilters products={products} />
          </div>

          {/* Products Grid */}
          <div className="lg:w-3/4">
            <SearchAndSort />
            
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-0">
                      <div className="aspect-square bg-gray-200 rounded-t-lg"></div>
                      <div className="p-4 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {displayProducts.map((product) => (
                  <Card key={product.id} className="group cursor-pointer hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                      <div 
                        className="aspect-square overflow-hidden rounded-t-lg bg-gray-100"
                        onClick={() => handleQuickView(product)}
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                          {product.brand}
                        </p>
                        <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                          {product.name}
                        </h3>
                        <p className="text-lg font-semibold text-black">
                          {formatCurrency(product.price)}
                        </p>
                        <Button 
                          className="w-full mt-3 bg-black hover:bg-gray-800"
                          onClick={() => handleQuickView(product)}
                        >
                          Quick View
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <Dialog open={showQuickView} onOpenChange={setShowQuickView}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
          {selectedProduct && (
            <ProductQuickView product={selectedProduct} />
          )}
        </DialogContent>
      </Dialog>

      <FloatingCart />
      <HelpButton />
    </div>
  );
};

export default Index;
