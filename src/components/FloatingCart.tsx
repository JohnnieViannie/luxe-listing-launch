
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingBag, X, Minus, Plus } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useNavigate } from 'react-router-dom';

const FloatingCart = () => {
  const { items, getTotalItems, getTotalPrice, updateQuantity, removeFromCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  if (getTotalItems() === 0) return null;

  const handleQuickCheckout = () => {
    navigate('/checkout');
  };

  return (
    <>
      {/* Floating Cart Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-full bg-black hover:bg-gray-800 text-white p-4 shadow-lg"
          size="icon"
        >
          <ShoppingBag className="h-6 w-6" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
            {getTotalItems()}
          </span>
        </Button>
      </div>

      {/* Floating Cart Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-50 w-80 max-w-[calc(100vw-2rem)]">
          <Card className="border border-gray-200 shadow-xl">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-black">Your Cart</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-6 w-6"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="max-h-60 overflow-y-auto space-y-3 mb-4">
                {items.slice(0, 3).map((item) => (
                  <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex items-center space-x-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-black truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.selectedSize}, {item.selectedColor}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 rounded border border-gray-300"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 rounded border border-gray-300"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
                {items.length > 3 && (
                  <p className="text-xs text-gray-500 text-center">
                    +{items.length - 3} more items
                  </p>
                )}
              </div>

              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-black">Total:</span>
                  <span className="font-semibold text-black">${getTotalPrice().toFixed(2)}</span>
                </div>
                
                <div className="space-y-2">
                  <Button
                    onClick={handleQuickCheckout}
                    className="w-full bg-black hover:bg-gray-800 text-white"
                  >
                    Quick Pay
                  </Button>
                  <Button
                    onClick={() => navigate('/cart')}
                    variant="outline"
                    className="w-full border-black text-black hover:bg-gray-50"
                  >
                    View Cart
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default FloatingCart;
