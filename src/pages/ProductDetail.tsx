
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Plus, Minus, ArrowLeft, Truck, RotateCcw, Shield } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import HelpButton from "@/components/HelpButton";

const ProductDetail = () => {
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("black");
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  const sizes = ["XS", "S", "M", "L", "XL"];
  const colors = [
    { name: "black", value: "#000000" },
    { name: "white", value: "#FFFFFF" },
    { name: "navy", value: "#1E3A8A" },
    { name: "gray", value: "#6B7280" }
  ];

  const images = [
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
    "https://images.unsplash.com/photo-1581803118522-7b72a50f7e9f?w=800",
    "https://images.unsplash.com/photo-1622445275576-721325763afe?w=800"
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Button variant="ghost" className="flex items-center text-gray-600 hover:text-black">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-black tracking-wide">LUXE</h1>
            <div className="w-16"></div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
              <img
                src={images[currentImage]}
                alt="Product"
                className="w-full h-full object-cover cursor-zoom-in"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`aspect-square overflow-hidden rounded-lg border-2 ${
                    currentImage === index ? "border-black" : "border-gray-200"
                  }`}
                >
                  <img
                    src={image}
                    alt={`Product ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-8">
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                PREMIUM BASICS
              </p>
              <h1 className="text-3xl font-light text-black mb-4">
                Essential White Tee
              </h1>
              <p className="text-3xl font-semibold text-black">
                $89
              </p>
            </div>

            {/* Color Selection */}
            <div>
              <h3 className="text-lg font-medium text-black mb-4">Color</h3>
              <div className="flex space-x-3">
                {colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-12 h-12 rounded-full border-2 ${
                      selectedColor === color.name ? "border-black" : "border-gray-300"
                    }`}
                    style={{ backgroundColor: color.value }}
                    aria-label={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-black">Size</h3>
                <button className="text-sm text-gray-500 underline hover:text-black">
                  Size Chart
                </button>
              </div>
              <div className="grid grid-cols-5 gap-3">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 px-4 text-base font-medium border rounded-md transition-colors ${
                      selectedSize === size
                        ? "border-black bg-black text-white"
                        : "border-gray-300 text-black hover:border-gray-400"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="text-lg font-medium text-black mb-4">Quantity</h3>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 rounded-full border border-gray-300 hover:border-gray-400"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="text-xl font-medium w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 rounded-full border border-gray-300 hover:border-gray-400"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <div className="flex space-x-4">
                <Button className="flex-1 bg-black hover:bg-gray-800 text-white font-medium py-4 text-lg">
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`border-black hover:bg-black hover:text-white p-4 ${
                    isWishlisted ? "bg-black text-white" : "text-black"
                  }`}
                >
                  <Heart className={`h-6 w-6 ${isWishlisted ? "fill-current" : ""}`} />
                </Button>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="bg-gray-50 p-6 rounded-lg space-y-4">
              <div className="flex items-center space-x-3">
                <Truck className="h-5 w-5 text-gray-600" />
                <span className="text-sm text-gray-700">Free shipping on orders over $200</span>
              </div>
              <div className="flex items-center space-x-3">
                <RotateCcw className="h-5 w-5 text-gray-600" />
                <span className="text-sm text-gray-700">Free returns within 30 days</span>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-gray-600" />
                <span className="text-sm text-gray-700">2-year warranty included</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Information Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-100">
              <TabsTrigger value="description" className="data-[state=active]:bg-white">Description</TabsTrigger>
              <TabsTrigger value="shipping" className="data-[state=active]:bg-white">Shipping & Returns</TabsTrigger>
              <TabsTrigger value="care" className="data-[state=active]:bg-white">Material & Care</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-8">
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  Our Essential White Tee represents the perfect balance of comfort, style, and quality. 
                  Crafted from premium 100% organic cotton, this versatile piece is designed to be a 
                  cornerstone of your wardrobe.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  The relaxed fit ensures all-day comfort while maintaining a clean, modern silhouette. 
                  Pre-shrunk and garment-washed for the perfect lived-in feel from day one.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>100% organic cotton construction</li>
                  <li>Pre-shrunk and garment-washed</li>
                  <li>Reinforced seams for durability</li>
                  <li>Tagless label for comfort</li>
                  <li>Machine washable</li>
                </ul>
              </div>
            </TabsContent>
            
            <TabsContent value="shipping" className="mt-8">
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-black mb-2">Shipping</h4>
                  <p className="text-gray-700 mb-2">• Free standard shipping on orders over $200</p>
                  <p className="text-gray-700 mb-2">• Standard shipping: 3-5 business days ($9.95)</p>
                  <p className="text-gray-700 mb-2">• Express shipping: 1-2 business days ($19.95)</p>
                  <p className="text-gray-700">• Next-day delivery available in select areas ($29.95)</p>
                </div>
                <Separator />
                <div>
                  <h4 className="font-semibold text-black mb-2">Returns</h4>
                  <p className="text-gray-700 mb-2">• 30-day free returns</p>
                  <p className="text-gray-700 mb-2">• Items must be unworn with tags attached</p>
                  <p className="text-gray-700">• Return shipping label included with every order</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="care" className="mt-8">
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-black mb-2">Material</h4>
                  <p className="text-gray-700 mb-2">100% Organic Cotton</p>
                  <p className="text-gray-700">Weight: 180 GSM</p>
                </div>
                <Separator />
                <div>
                  <h4 className="font-semibold text-black mb-2">Care Instructions</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Machine wash cold with like colors</li>
                    <li>Use mild detergent</li>
                    <li>Tumble dry low or hang to dry</li>
                    <li>Iron on low heat if needed</li>
                    <li>Do not bleach or dry clean</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <HelpButton />
    </div>
  );
};

export default ProductDetail;
