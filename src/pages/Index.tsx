import { useState, useEffect } from "react";
import { Search, Heart, ShoppingBag, Eye, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import ProductQuickView from "@/components/ProductQuickView";
import HelpButton from "@/components/HelpButton";
import ProductFilters from "@/components/ProductFilters";
import SearchAndSort from "@/components/SearchAndSort";
import { ProductFilterProvider, useProductFilter } from "@/contexts/ProductFilterContext";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";

interface Product {
  id: number;
  image: string;
  brand: string;
  name: string;
  price: number;
  category: string;
  images?: Array<{
    id: number;
    image: string;
    is_primary: boolean;
  }>;
  stock_quantity?: number;
  is_active?: boolean;
}

// Currency conversion rate (1 USD = 3700 UGX approximately)
const USD_TO_UGX_RATE = 3700;

const convertToUGX = (usdPrice: number) => {
  return Math.round(usdPrice * USD_TO_UGX_RATE);
};

const formatPrice = (usdPrice: number) => {
  const ugxPrice = convertToUGX(usdPrice);
  return {
    usd: usdPrice,
    ugx: ugxPrice
  };
};

const ProductGrid = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { filteredProducts, setProducts } = useProductFilter();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, [setProducts]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://127.0.0.1:8000/api/products/');
      
      if (response.ok) {
        const data = await response.json();
        const djangoProducts = data.results || data;
        
        // Transform Django products to match our interface with placeholder pricing
        const transformedProducts: Product[] = djangoProducts.map((product: any) => {
          // Use placeholder prices based on category
          let placeholderPrice = 89; // default
          const category = product.category?.toLowerCase() || '';
          
          if (category.includes('shoe')) {
            placeholderPrice = Math.floor(Math.random() * (350 - 150) + 150); // 150-350k UGX = ~40-95 USD
          } else {
            const prices = [70, 100, 150, 200]; // placeholder prices in USD equivalent
            placeholderPrice = prices[Math.floor(Math.random() * prices.length)];
          }
          
          return {
            id: product.id,
            image: product.images?.[0]?.image ? `http://127.0.0.1:8000${product.images[0].image}` : "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
            brand: product.brand || 'LUXE',
            name: product.name,
            price: placeholderPrice,
            category: product.category,
            images: product.images,
            stock_quantity: product.stock_quantity,
            is_active: product.is_active
          };
        });
        
        setProducts(transformedProducts);
      } else {
        // Fallback to static products with placeholder pricing
        console.log('Django API not available, using static products');
        setProducts(staticProducts);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      // Fallback to static products
      setProducts(staticProducts);
    } finally {
      setLoading(false);
    }
  };

  // Static fallback products with placeholder pricing
  const staticProducts: Product[] = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
      brand: "LUXE",
      name: "Essential White Tee",
      price: 70,
      category: "shirts"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
      brand: "LUXE",
      name: "Classic Baseball Cap",
      price: 100,
      category: "hats"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400",
      brand: "LUXE",
      name: "Linen Blend Shorts",
      price: 150,
      category: "shorts"
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400",
      brand: "LUXE",
      name: "Classic Polo Shirt",
      price: 100,
      category: "polos"
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=400",
      brand: "LUXE",
      name: "Oversized Hoodie",
      price: 200,
      category: "shirts"
    },
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?w=400",
      brand: "LUXE",
      name: "Slim Fit Jeans",
      price: 200,
      category: "pants"
    },
    {
      id: 7,
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400",
      brand: "LUXE",
      name: "Leather Sneakers",
      price: 250,
      category: "shoes"
    },
    {
      id: 8,
      image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400",
      brand: "LUXE",
      name: "Minimalist Watch",
      price: 350,
      category: "accessories"
    }
  ];

  const handleProductClick = (product: Product) => {
    navigate(`/product/${product.id}`, { state: { product } });
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="group border-none shadow-none bg-white overflow-hidden">
            <CardContent className="p-0">
              <div className="w-full h-48 sm:h-64 lg:h-80 bg-gray-200 animate-pulse"></div>
              <div className="py-3 sm:py-4 space-y-2 px-2 sm:px-0">
                <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-5 bg-gray-200 rounded animate-pulse w-16"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
      {filteredProducts.map((product) => {
        const pricing = formatPrice(product.price);
        return (
          <Card key={product.id} className="group border-none shadow-none bg-white overflow-hidden cursor-pointer">
            <CardContent className="p-0">
              <div className="relative overflow-hidden" onClick={() => handleProductClick(product)}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 sm:h-64 lg:h-80 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="secondary"
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white hover:bg-gray-100 text-black font-medium text-xs sm:text-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProduct(product);
                        }}
                      >
                        <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        Quick View
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogTitle className="sr-only">Product Quick View</DialogTitle>
                      {selectedProduct && <ProductQuickView product={selectedProduct} />}
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              <div className="py-3 sm:py-4 space-y-1 sm:space-y-2 px-2 sm:px-0" onClick={() => handleProductClick(product)}>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  {product.brand}
                </p>
                <h3 className="text-xs sm:text-sm font-medium text-black line-clamp-2">
                  {product.name}
                </h3>
                <div className="space-y-1">
                  <p className="text-base sm:text-lg font-semibold text-black">
                    ${pricing.usd}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">
                    UGX {pricing.ugx.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

const IndexContent = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { getTotalItems } = useCart();
  const { toggleCategory, clearFilters, filters } = useProductFilter();
  const navigate = useNavigate();

  // Category mapping for navigation
  const categoryMap: { [key: string]: string } = {
    'NEW': 'new',
    'CLOTHING': 'shirts',
    'SHOES': 'shoes',
    'ACCESSORIES': 'accessories',
    'DESIGNERS': 'designer',
    'CURATED': 'curated',
    'SALE': 'sale'
  };

  const handleCategoryClick = (categoryName: string) => {
    if (categoryName === 'ADMIN') {
      navigate('/admin');
      return;
    }

    const categoryValue = categoryMap[categoryName];
    if (categoryValue) {
      // Clear existing filters first
      clearFilters();
      // Then apply the selected category
      setTimeout(() => {
        toggleCategory(categoryValue);
      }, 100);
    }
  };

  const isActiveCategory = (categoryName: string) => {
    const categoryValue = categoryMap[categoryName];
    return categoryValue && filters.selectedCategories.includes(categoryValue);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top Strip */}
      <div className="border-b border-gray-200 py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center space-x-4 sm:space-x-8 text-xs sm:text-sm font-medium text-gray-700">
            <a href="#" className="hover:text-black transition-colors">Womens</a>
            <span className="text-black font-semibold">Mens</span>
            <a href="#" className="hover:text-black transition-colors">Beauty</a>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <h1 className="text-xl sm:text-2xl font-bold text-black tracking-wide cursor-pointer" onClick={() => navigate('/')}>LUXE</h1>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-700 hover:text-black transition-colors"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex space-x-6 lg:space-x-8">
              <button 
                onClick={() => handleCategoryClick('NEW')}
                className={`font-medium hover:text-gray-600 transition-colors text-sm lg:text-base ${
                  isActiveCategory('NEW') ? 'text-black' : 'text-gray-700'
                }`}
              >
                NEW
              </button>
              <button 
                onClick={() => handleCategoryClick('CLOTHING')}
                className={`font-medium hover:text-black transition-colors text-sm lg:text-base ${
                  isActiveCategory('CLOTHING') ? 'text-black' : 'text-gray-700'
                }`}
              >
                CLOTHING
              </button>
              <button 
                onClick={() => handleCategoryClick('SHOES')}
                className={`font-medium hover:text-black transition-colors text-sm lg:text-base ${
                  isActiveCategory('SHOES') ? 'text-black' : 'text-gray-700'
                }`}
              >
                SHOES
              </button>
              <button 
                onClick={() => handleCategoryClick('ACCESSORIES')}
                className={`font-medium hover:text-black transition-colors text-sm lg:text-base ${
                  isActiveCategory('ACCESSORIES') ? 'text-black' : 'text-gray-700'
                }`}
              >
                ACCESSORIES
              </button>
              <button 
                onClick={() => handleCategoryClick('DESIGNERS')}
                className={`font-medium hover:text-black transition-colors text-sm lg:text-base ${
                  isActiveCategory('DESIGNERS') ? 'text-black' : 'text-gray-700'
                }`}
              >
                DESIGNERS
              </button>
              <button 
                onClick={() => handleCategoryClick('CURATED')}
                className={`font-medium hover:text-black transition-colors text-sm lg:text-base ${
                  isActiveCategory('CURATED') ? 'text-black' : 'text-gray-700'
                }`}
              >
                CURATED
              </button>
              <button 
                onClick={() => handleCategoryClick('SALE')}
                className="text-red-600 font-medium hover:text-red-700 transition-colors text-sm lg:text-base"
              >
                SALE
              </button>
              <button 
                onClick={() => handleCategoryClick('ADMIN')}
                className="text-gray-700 font-medium hover:text-black transition-colors text-sm lg:text-base"
              >
                ADMIN
              </button>
            </div>

            {/* Right Icons */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="hidden sm:flex items-center">
                <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700 hover:text-black cursor-pointer transition-colors" />
              </div>
              <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700 hover:text-black cursor-pointer transition-colors" />
              <div className="relative cursor-pointer" onClick={() => navigate('/cart')}>
                <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700 hover:text-black transition-colors" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4 space-y-4">
              <button 
                onClick={() => handleCategoryClick('NEW')}
                className={`block font-medium hover:text-gray-600 transition-colors ${
                  isActiveCategory('NEW') ? 'text-black' : 'text-gray-700'
                }`}
              >
                NEW
              </button>
              <button 
                onClick={() => handleCategoryClick('CLOTHING')}
                className={`block font-medium hover:text-black transition-colors ${
                  isActiveCategory('CLOTHING') ? 'text-black' : 'text-gray-700'
                }`}
              >
                CLOTHING
              </button>
              <button 
                onClick={() => handleCategoryClick('SHOES')}
                className={`block font-medium hover:text-black transition-colors ${
                  isActiveCategory('SHOES') ? 'text-black' : 'text-gray-700'
                }`}
              >
                SHOES
              </button>
              <button 
                onClick={() => handleCategoryClick('ACCESSORIES')}
                className={`block font-medium hover:text-black transition-colors ${
                  isActiveCategory('ACCESSORIES') ? 'text-black' : 'text-gray-700'
                }`}
              >
                ACCESSORIES
              </button>
              <button 
                onClick={() => handleCategoryClick('DESIGNERS')}
                className={`block font-medium hover:text-black transition-colors ${
                  isActiveCategory('DESIGNERS') ? 'text-black' : 'text-gray-700'
                }`}
              >
                DESIGNERS
              </button>
              <button 
                onClick={() => handleCategoryClick('CURATED')}
                className={`block font-medium hover:text-black transition-colors ${
                  isActiveCategory('CURATED') ? 'text-black' : 'text-gray-700'
                }`}
              >
                CURATED
              </button>
              <button 
                onClick={() => handleCategoryClick('SALE')}
                className="block text-red-600 font-medium hover:text-red-700 transition-colors"
              >
                SALE
              </button>
              <button 
                onClick={() => handleCategoryClick('ADMIN')}
                className="block text-gray-700 font-medium hover:text-black transition-colors"
              >
                ADMIN
              </button>
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-4">
                  <Search className="h-5 w-5 text-gray-700" />
                  <span className="text-gray-700 font-medium">Search</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-black mb-4 sm:mb-6 lg:mb-8 tracking-wide">
          Explore Premium Menswear
        </h2>
      </div>

      {/* Main Content with Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <ProductFilters />
          
          <div className="flex-1 min-w-0">
            <SearchAndSort />
            <ProductGrid />
          </div>
        </div>
      </div>

      {/* Fixed Help Button */}
      <HelpButton />
    </div>
  );
};

const Index = () => {
  return (
    <ProductFilterProvider>
      <IndexContent />
    </ProductFilterProvider>
  );
};

export default Index;
