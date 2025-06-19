
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Plus, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Product {
  id: number;
  image: string;
  brand: string;
  name: string;
  price: number;
  category: string;
}

interface ProductQuickViewProps {
  product: Product;
}

const ProductQuickView = ({ product }: ProductQuickViewProps) => {
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("black");
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const sizes = ["XS", "S", "M", "L", "XL"];
  const colors = [
    { name: "black", value: "#000000" },
    { name: "white", value: "#FFFFFF" },
    { name: "navy", value: "#1E3A8A" },
    { name: "gray", value: "#6B7280" }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 p-4 sm:p-6">
      {/* Product Image */}
      <div className="space-y-4">
        <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Product Details */}
      <div className="space-y-4 sm:space-y-6">
        <div>
          <p className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
            {product.brand}
          </p>
          <h1 className="text-xl sm:text-2xl font-light text-black mb-3 sm:mb-4">
            {product.name}
          </h1>
          <p className="text-xl sm:text-2xl font-semibold text-black">
            ${product.price}
          </p>
        </div>

        {/* Color Selection */}
        <div>
          <h3 className="text-sm font-medium text-black mb-3">Color</h3>
          <div className="flex space-x-2">
            {colors.map((color) => (
              <button
                key={color.name}
                onClick={() => setSelectedColor(color.name)}
                className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 ${
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
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium text-black">Size</h3>
            <button className="text-xs text-gray-500 underline hover:text-black">
              Size Chart
            </button>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`py-2 px-2 sm:px-3 text-xs sm:text-sm font-medium border rounded-md transition-colors ${
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
          <h3 className="text-sm font-medium text-black mb-3">Quantity</h3>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-1 rounded-full border border-gray-300 hover:border-gray-400"
            >
              <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
            </button>
            <span className="text-base sm:text-lg font-medium w-8 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-1 rounded-full border border-gray-300 hover:border-gray-400"
            >
              <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <Button className="flex-1 bg-black hover:bg-gray-800 text-white font-medium py-2 sm:py-3 text-sm sm:text-base">
              Add to Cart
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsWishlisted(!isWishlisted)}
              className={`border-black hover:bg-black hover:text-white sm:w-auto w-full ${
                isWishlisted ? "bg-black text-white" : "text-black"
              }`}
            >
              <Heart className={`h-4 w-4 sm:h-5 sm:w-5 ${isWishlisted ? "fill-current" : ""}`} />
            </Button>
          </div>
          
          <Button variant="outline" className="w-full border-black text-black hover:bg-gray-50 font-medium text-sm sm:text-base py-2 sm:py-3">
            See More Details
          </Button>
        </div>

        {/* Product Description */}
        <div className="pt-4 sm:pt-6 border-t border-gray-200">
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            Premium quality {product.category} crafted with attention to detail. 
            Features modern styling and superior comfort for the contemporary man.
          </p>
        </div>

        {/* Additional Info */}
        <div className="space-y-3 text-xs text-gray-500">
          <div className="flex flex-col sm:flex-row sm:justify-between space-y-2 sm:space-y-0">
            <span>Free shipping on orders over $200</span>
            <Badge variant="outline" className="text-xs w-fit">Free Returns</Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductQuickView;
