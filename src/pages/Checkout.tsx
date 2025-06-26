
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Truck } from 'lucide-react';

// Declare Flutterwave types
declare global {
  interface Window {
    FlutterwaveCheckout: (options: any) => void;
    verified?: boolean;
  }
}

const Checkout = () => {
  const { items, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const shipping = 50000; // 50k UGX
  const tax = getTotalPrice() * 0.1;
  const total = getTotalPrice() + shipping + tax;

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    zipCode: '',
    phone: '',
  });

  // Load Flutterwave script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.flutterwave.com/v3.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const generateTxRef = () => {
    return `TX-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const makePayment = () => {
    if (!formData.email || !formData.firstName || !formData.lastName || !formData.phone) {
      alert('Please fill in all required fields');
      return;
    }

    setIsProcessing(true);

    window.FlutterwaveCheckout({
      public_key: "FLWPUBK_TEST-e5aac5907ea18b76e89efa62fd5bd843-X",
      tx_ref: generateTxRef(),
      amount: total,
      currency: "UGX",
      payment_options: "card, mobilemoneyuganda, ussd",
      callback: function(payment: any) {
        console.log('Payment successful:', payment);
        verifyTransactionOnBackend(payment.id, payment.tx_ref);
      },
      onclose: function(incomplete: boolean) {
        setIsProcessing(false);
        if (incomplete || window.verified === false) {
          console.log('Payment failed or incomplete');
        } else {
          if (window.verified === true) {
            // Navigate to success page
            const orderNumber = Math.random().toString(36).substr(2, 9).toUpperCase();
            clearCart();
            navigate('/order-confirmation', {
              state: {
                orderNumber,
                total,
                items,
                customerInfo: formData,
                paymentMethod: 'Flutterwave'
              }
            });
          }
        }
      },
      meta: {
        consumer_id: Date.now(),
        consumer_mac: "92a3-912ba-1192a",
      },
      customer: {
        email: formData.email,
        phone_number: formData.phone,
        name: `${formData.firstName} ${formData.lastName}`,
      },
      customizations: {
        title: "Fashion Store",
        description: "Payment for fashion items",
        logo: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=200&fit=crop&crop=center",
      },
    });
  };

  const verifyTransactionOnBackend = (transactionId: string, txRef: string) => {
    // In a real app, this would be an API call to your backend
    // For now, we'll simulate verification
    console.log('Verifying transaction:', transactionId, txRef);
    setTimeout(() => {
      window.verified = true;
      console.log('Transaction verified successfully');
    }, 1000);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <h2 className="text-2xl font-light text-black mb-4">Your cart is empty</h2>
            <Button onClick={() => navigate('/')} className="bg-black hover:bg-gray-800 text-white">
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mr-4 p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl sm:text-3xl font-light text-black">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+256 700 000 000"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center">
                  <Truck className="h-5 w-5 mr-2" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Street address, P.O. Box, etc."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Kampala"
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode">Postal Code</Label>
                    <Input
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      placeholder="00000"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="max-h-60 overflow-y-auto space-y-3">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex items-center space-x-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-black text-sm">{item.name}</h4>
                        <p className="text-xs text-gray-500">{item.selectedSize}, {item.selectedColor} × {item.quantity}</p>
                        <p className="font-medium text-black">
                          ${(item.price / 3700).toFixed(2)} / UGX {item.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">
                      ${(getTotalPrice() / 3700).toFixed(2)} / UGX {getTotalPrice().toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      ${(shipping / 3700).toFixed(2)} / UGX {shipping.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">
                      ${(tax / 3700).toFixed(2)} / UGX {tax.toLocaleString()}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-base font-semibold">
                    <span>Total</span>
                    <span>
                      ${(total / 3700).toFixed(2)} / UGX {total.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Pay with Flutterwave Button */}
                <Button
                  onClick={makePayment}
                  disabled={isProcessing}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 mt-6"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  {isProcessing ? 'Processing...' : 'Pay with Flutterwave'}
                </Button>
                
                <p className="text-xs text-gray-500 text-center">
                  Secure payment powered by Flutterwave
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
