
import { useState, useEffect } from "react";
import { Search, Heart, ShoppingBag, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import ProductQuickView from "@/components/ProductQuickView";
import HelpButton from "@/components/HelpButton";
import ProductFilters from "@/components/ProductFilters";
import SearchAndSort from "@/components/SearchAndSort";
import { ProductFilterProvider, useProductFilter } from "@/contexts/ProductFilterContext";

interface Product {
  id: number;
  image: string;
  brand: string;
  name: string;
  price: number;
  category: string;
}

const products: Product[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
    brand: "PREMIUM BASICS",
    name: "Essential White Tee",
    price: 89,
    category: "shirts"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
    brand: "STREETWEAR CO",
    name: "Classic Baseball Cap",
    price: 45,
    category: "hats"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400",
    brand: "SUMMER ESSENTIALS",
    name: "Linen Blend Shorts",
    price: 125,
    category: "shorts"
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400",
    brand: "POLO HERITAGE",
    name: "Classic Polo Shirt",
    price: 95,
    category: "polos"
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=400",
    brand: "URBAN EDGE",
    name: "Oversized Hoodie",
    price: 165,
    category: "shirts"
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?w=400",
    brand: "LUXURY DENIM",
    name: "Slim Fit Jeans",
    price: 210,
    category: "pants"
  },
  {
    id: 7,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400",
    brand: "FOOTWEAR ELITE",
    name: "Leather Sneakers",
    price: 295,
    category: "shoes"
  },
  {
    id: 8,
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400",
    brand: "ACCESSORY HOUSE",
    name: "Minimalist Watch",
    price: 340,
    category: "accessories"
  }
];

const ProductGrid = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { filteredProducts, setProducts } = useProductFilter();

  useEffect(() => {
    setProducts(products);
  }, [setProducts]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6 lg:gap-8">
      {filteredProducts.map((product) => (
        <Card key={product.id} className="group border-none shadow-none bg-white overflow-hidden">
          <CardContent className="p-0">
            <div className="relative overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-64 sm:h-80 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="secondary"
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white hover:bg-gray-100 text-black font-medium"
                      onClick={() => setSelectedProduct(product)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Quick View
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    {selectedProduct && <ProductQuickView product={selectedProduct} />}
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <div className="py-4 space-y-2">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                {product.brand}
              </p>
              <h3 className="text-sm font-medium text-black line-clamp-2">
                {product.name}
              </h3>
              <p className="text-lg font-semibold text-black">
                ${product.price}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const IndexContent = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Top Strip */}
      <div className="border-b border-gray-200 py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center space-x-8 text-sm font-medium text-gray-700">
            <a href="#" className="hover:text-black transition-colors">Womens</a>
            <span className="text-black font-semibold">Mens</span>
            <a href="#" className="hover:text-black transition-colors">Beauty</a>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-black tracking-wide">LUXE</h1>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex space-x-8">
              <a href="#" className="text-black font-medium hover:text-gray-600 transition-colors">NEW</a>
              <a href="#" className="text-gray-700 font-medium hover:text-black transition-colors">CLOTHING</a>
              <a href="#" className="text-gray-700 font-medium hover:text-black transition-colors">SHOES</a>
              <a href="#" className="text-gray-700 font-medium hover:text-black transition-colors">ACCESSORIES</a>
              <a href="#" className="text-gray-700 font-medium hover:text-black transition-colors">DESIGNERS</a>
              <a href="#" className="text-gray-700 font-medium hover:text-black transition-colors">CURATED</a>
              <a href="#" className="text-red-600 font-medium hover:text-red-700 transition-colors">SALE</a>
            </div>

            {/* Right Icons */}
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center">
                <Search className="h-5 w-5 text-gray-700 hover:text-black cursor-pointer transition-colors" />
              </div>
              <Heart className="h-5 w-5 text-gray-700 hover:text-black cursor-pointer transition-colors" />
              <ShoppingBag className="h-5 w-5 text-gray-700 hover:text-black cursor-pointer transition-colors" />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-4xl md:text-5xl font-light text-black mb-8 tracking-wide">
          Explore Premium Menswear
        </h2>
      </div>

      {/* Main Content with Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex gap-8">
          <ProductFilters />
          
          <div className="flex-1">
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
