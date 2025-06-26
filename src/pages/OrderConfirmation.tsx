
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Package } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const OrderConfirmation = () => {
  const location = useLocation();
  const { orderNumber, total, items } = location.state || {};

  if (!orderNumber) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No order information found</p>
          <Link to="/">
            <Button className="bg-black hover:bg-gray-800 text-white">
              Return to Shop
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-light text-black mb-2">Order Confirmed!</h1>
          <p className="text-gray-600">Thank you for your purchase. Your order has been successfully placed.</p>
        </div>

        <Card className="border border-gray-200 mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-black mb-1">Order #{orderNumber}</h2>
                <p className="text-gray-600 text-sm">Confirmation sent to your email</p>
              </div>
              <div className="mt-4 sm:mt-0 text-right">
                <p className="text-2xl font-semibold text-black">${total?.toFixed(2)}</p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-semibold text-black mb-4 flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Order Items
              </h3>
              <div className="space-y-3">
                {items?.map((item: any) => (
                  <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex items-center space-x-4">
                    <div className="w-16 h-16 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-black text-sm">{item.name}</h4>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">{item.brand}</p>
                      <p className="text-sm text-gray-600">
                        {item.selectedSize}, {item.selectedColor} × {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-black">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6 mt-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-black mb-2">What's Next?</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• You'll receive an email confirmation shortly</li>
                  <li>• We'll send you tracking information once your order ships</li>
                  <li>• Estimated delivery: 5-7 business days</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center space-y-4">
          <Link to="/">
            <Button className="bg-black hover:bg-gray-800 text-white px-8 py-3 mr-4">
              Continue Shopping
            </Button>
          </Link>
          <Button variant="outline" className="border-black text-black hover:bg-gray-50 px-8 py-3">
            Track Order
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
