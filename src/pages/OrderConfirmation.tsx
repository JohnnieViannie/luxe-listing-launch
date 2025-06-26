
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Package, CreditCard, Truck, Mail, Phone, MapPin } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const OrderConfirmation = () => {
  const location = useLocation();
  const { orderNumber, total, items, customerInfo, paymentMethod } = location.state || {};

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

  const currentDate = new Date();
  const deliveryDate = new Date(currentDate.getTime() + (7 * 24 * 60 * 60 * 1000)); // 7 days from now

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-light text-black mb-2">Payment Successful!</h1>
          <p className="text-gray-600">Thank you for your purchase. Your order has been confirmed and payment processed.</p>
        </div>

        {/* Payment Receipt */}
        <Card className="border border-gray-200 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <CreditCard className="h-5 w-5 mr-2" />
              Payment Receipt
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Order Number</p>
                <p className="font-semibold">#{orderNumber}</p>
              </div>
              <div>
                <p className="text-gray-600">Payment Method</p>
                <p className="font-semibold">{paymentMethod || 'Flutterwave'}</p>
              </div>
              <div>
                <p className="text-gray-600">Transaction Date</p>
                <p className="font-semibold">{currentDate.toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-600">Amount Paid</p>
                <p className="font-semibold text-green-600">
                  ${(total / 3700).toFixed(2)} / UGX {total?.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer & Delivery Information */}
        <Card className="border border-gray-200 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Truck className="h-5 w-5 mr-2" />
              Delivery Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  Customer Details
                </h4>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-600">Name:</span> {customerInfo?.firstName} {customerInfo?.lastName}</p>
                  <p><span className="text-gray-600">Email:</span> {customerInfo?.email}</p>
                  <p><span className="text-gray-600">Phone:</span> {customerInfo?.phone}</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3 flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Delivery Address
                </h4>
                <div className="space-y-2 text-sm">
                  {customerInfo?.address && <p>{customerInfo.address}</p>}
                  {customerInfo?.city && <p>{customerInfo.city}</p>}
                  {customerInfo?.zipCode && <p>{customerInfo.zipCode}</p>}
                  <p className="text-green-600 font-medium">
                    Estimated Delivery: {deliveryDate.toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card className="border border-gray-200 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Package className="h-5 w-5 mr-2" />
              Order Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {items?.map((item: any) => (
                <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex items-center space-x-4 pb-4 border-b border-gray-100 last:border-b-0">
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
                    <p className="font-medium text-black">
                      ${((item.price * item.quantity) / 3700).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">
                      UGX {(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>UGX {(total - 50000 - (total * 0.1)).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>UGX 50,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span>UGX {(total * 0.1).toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                <span>Total Paid</span>
                <span className="text-green-600">UGX {total?.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="border border-gray-200 mb-8">
          <CardContent className="pt-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-black mb-2">What's Next?</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Payment confirmation sent to {customerInfo?.email}</li>
                <li>• We'll send you tracking information once your order ships</li>
                <li>• Estimated delivery: {deliveryDate.toLocaleDateString()} (5-7 business days)</li>
                <li>• Contact us at support@fashionstore.com for any questions</li>
              </ul>
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
            Download Receipt
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
