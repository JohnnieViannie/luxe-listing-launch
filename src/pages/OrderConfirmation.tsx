import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Package, Receipt, Truck, Clock, MapPin, Download } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const OrderConfirmation = () => {
  const location = useLocation();
  const { 
    orderNumber, 
    total, 
    totalUGX, 
    items, 
    paymentMethod, 
    transactionRef, 
    customerInfo 
  } = location.state || {};

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

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 7); // 7 days from now

  const handleDownloadReceipt = () => {
    // Create receipt content
    const receiptContent = `
LUXE STORE - PAYMENT RECEIPT
============================

Order Number: #${orderNumber}
Transaction Ref: ${transactionRef}
Payment Method: ${paymentMethod}
Payment Status: Completed
Date: ${new Date().toLocaleDateString()}

CUSTOMER INFORMATION
====================
Name: ${customerInfo?.firstName} ${customerInfo?.lastName}
Email: ${customerInfo?.email}
Phone: ${customerInfo?.phone}
${customerInfo?.address ? `Address: ${customerInfo.address}` : ''}

ORDER ITEMS
===========
${items?.map(item => 
  `${item.name} (${item.brand})
  Size: ${item.selectedSize}, Color: ${item.selectedColor}
  Quantity: ${item.quantity}
  Price: $${(item.price * item.quantity).toFixed(2)} (UGX ${Math.round(item.price * item.quantity * 3700).toLocaleString()})`
).join('\n\n')}

TOTAL PAID: $${total?.toFixed(2)} (UGX ${totalUGX?.toLocaleString()})

Thank you for shopping with LUXE Store!
    `;

    // Create and download the receipt
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LUXE_Receipt_${orderNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-light text-black mb-2">Payment Successful!</h1>
          <p className="text-gray-600">Thank you for your purchase. Your order has been confirmed and will be processed shortly.</p>
        </div>

        {/* Payment Receipt */}
        <Card className="border border-gray-200 mb-8">
          <CardContent className="p-6">
            <div className="flex items-center mb-6">
              <Receipt className="h-6 w-6 mr-3 text-green-600" />
              <h2 className="text-xl font-semibold text-black">Payment Receipt</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-semibold text-black mb-2">Order Details</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="text-gray-600">Order Number:</span> #{orderNumber}</p>
                  <p><span className="text-gray-600">Transaction Ref:</span> {transactionRef}</p>
                  <p><span className="text-gray-600">Payment Method:</span> {paymentMethod}</p>
                  <p><span className="text-gray-600">Payment Status:</span> <span className="text-green-600 font-medium">Completed</span></p>
                  <p><span className="text-gray-600">Date:</span> {new Date().toLocaleDateString()}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-black mb-2">Customer Information</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="text-gray-600">Name:</span> {customerInfo?.firstName} {customerInfo?.lastName}</p>
                  <p><span className="text-gray-600">Email:</span> {customerInfo?.email}</p>
                  <p><span className="text-gray-600">Phone:</span> {customerInfo?.phone}</p>
                  {customerInfo?.address && (
                    <p><span className="text-gray-600">Address:</span> {customerInfo.address}</p>
                  )}
                </div>
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
                      <p className="text-sm text-gray-500">UGX {Math.round(item.price * item.quantity * 3700).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6 mt-6">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total Paid:</span>
                <div className="text-right">
                  <p className="text-black">${total?.toFixed(2)}</p>
                  <p className="text-sm text-gray-600 font-normal">UGX {totalUGX?.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Information */}
        <Card className="border border-gray-200 mb-8">
          <CardContent className="p-6">
            <div className="flex items-center mb-6">
              <Truck className="h-6 w-6 mr-3 text-blue-600" />
              <h2 className="text-xl font-semibold text-black">Delivery Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-black">Delivery Address</h4>
                    <div className="text-sm text-gray-600 mt-1">
                      <p>{customerInfo?.firstName} {customerInfo?.lastName}</p>
                      {customerInfo?.address && <p>{customerInfo.address}</p>}
                      <p>{customerInfo?.city} {customerInfo?.zipCode}</p>
                      <p>{customerInfo?.phone}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-black">Estimated Delivery</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {deliveryDate.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                    <p className="text-xs text-gray-500">Standard delivery (5-7 business days)</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Package className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-black">Tracking</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      You'll receive tracking information via email once your order ships
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6 mt-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-black mb-2">What's Next?</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• You'll receive an email confirmation with your receipt</li>
                  <li>• Your order will be processed within 24 hours</li>
                  <li>• We'll send you tracking information once your order ships</li>
                  <li>• For any questions, contact us at support@luxestore.com</li>
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
          <Button 
            onClick={handleDownloadReceipt}
            variant="outline" 
            className="border-black text-black hover:bg-gray-50 px-8 py-3"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Receipt
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
