
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Truck } from 'lucide-react';
import { toast } from 'sonner';

// Flutterwave types
declare global {
  interface Window {
    FlutterwaveCheckout: (options: FlutterwaveOptions) => void;
    verified?: boolean;
  }
}

interface FlutterwaveOptions {
  public_key: string;
  tx_ref: string;
  amount: number;
  currency: string;
  payment_options: string;
  callback: (payment: { id: string; tx_ref: string; flw_ref: string }) => void;
  onclose: (incomplete?: boolean) => void;
  meta: {
    consumer_id: number;
    consumer_mac: string;
  };
  customer: {
    email: string;
    phone_number: string;
    name: string;
  };
  customizations: {
    title: string;
    description: string;
    logo: string;
  };
}

const USD_TO_UGX_RATE = 3700;

const Checkout = () => {
  const { items, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [flutterwaveLoaded, setFlutterwaveLoaded] = useState(false);
  
  const subtotal = getTotalPrice();
  const shipping = 10;
  const tax = subtotal * 0.1;
  const totalUSD = subtotal + shipping + tax;
  const totalUGX = Math.round(totalUSD * USD_TO_UGX_RATE);

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    zipCode: '',
    phone: '',
  });

  useEffect(() => {
    // Load Flutterwave script
    const script = document.createElement('script');
    script.src = 'https://checkout.flutterwave.com/v3.js';
    script.onload = () => setFlutterwaveLoaded(true);
    document.head.appendChild(script);

    return () => {
      // Cleanup script on unmount
      const existingScript = document.querySelector('script[src="https://checkout.flutterwave.com/v3.js"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const generateTxRef = () => {
    return `LUXE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const verifyTransactionOnBackend = async (transactionId: string) => {
    // Simulate backend verification
    return new Promise((resolve) => {
      setTimeout(() => {
        window.verified = true;
        resolve(true);
      }, 2000);
    });
  };

  const handleFlutterwavePayment = () => {
    if (!flutterwaveLoaded) {
      toast.error('Payment system is loading. Please try again.');
      return;
    }

    if (!formData.email || !formData.firstName || !formData.lastName || !formData.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    const txRef = generateTxRef();

    const flutterwaveOptions: FlutterwaveOptions = {
      public_key: "FLWPUBK_TEST-e5aac5907ea18b76e89efa62fd5bd843-X",
      tx_ref: txRef,
      amount: totalUGX,
      currency: "UGX",
      payment_options: "card, mobilemoneyuganda, ussd",
      callback: function(payment) {
        console.log('Payment successful:', payment);
        toast.success('Payment successful! Verifying transaction...');
        verifyTransactionOnBackend(payment.id);
      },
      onclose: function(incomplete) {
        if (incomplete || window.verified === false) {
          toast.error('Payment failed. Please try again or contact support.');
        } else {
          if (window.verified === true) {
            // Payment successful
            const orderNumber = txRef;
            clearCart();
            navigate('/order-confirmation', {
              state: {
                orderNumber,
                total: totalUSD,
                totalUGX,
                items,
                paymentMethod: 'Flutterwave',
                transactionRef: txRef,
                customerInfo: formData
              }
            });
            toast.success('Order placed successfully!');
          } else {
            toast.loading('Verifying payment...');
            setTimeout(() => {
              const orderNumber = txRef;
              clearCart();
              navigate('/order-confirmation', {
                state: {
                  orderNumber,
                  total: totalUSD,
                  totalUGX,
                  items,
                  paymentMethod: 'Flutterwave',
                  transactionRef: txRef,
                  customerInfo: formData
                }
              });
              toast.success('Payment verified! Order placed successfully!');
            }, 3000);
          }
        }
      },
      meta: {
        consumer_id: Math.floor(Math.random() * 1000),
        consumer_mac: "92a3-912ba-1192a",
      },
      customer: {
        email: formData.email,
        phone_number: formData.phone,
        name: `${formData.firstName} ${formData.lastName}`,
      },
      customizations: {
        title: "LUXE Store",
        description: "Payment for premium fashion items",
        logo: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100",
      },
    };

    window.FlutterwaveCheckout(flutterwaveOptions);
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
                    placeholder="+256 700 000000"
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
                    placeholder="Street address"
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
                    <Label htmlFor="zipCode">ZIP Code</Label>
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
                        <div className="space-y-1">
                          <p className="font-medium text-black">${(item.price * item.quantity).toFixed(2)}</p>
                          <p className="text-xs text-gray-500">UGX {Math.round(item.price * item.quantity * USD_TO_UGX_RATE).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <div className="text-right">
                      <p className="font-medium">${subtotal.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">UGX {Math.round(subtotal * USD_TO_UGX_RATE).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <div className="text-right">
                      <p className="font-medium">${shipping.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">UGX {Math.round(shipping * USD_TO_UGX_RATE).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <div className="text-right">
                      <p className="font-medium">${tax.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">UGX {Math.round(tax * USD_TO_UGX_RATE).toLocaleString()}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-base font-semibold">
                    <span>Total</span>
                    <div className="text-right">
                      <p>${totalUSD.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">UGX {totalUGX.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Payment Button */}
                <Button
                  onClick={handleFlutterwavePayment}
                  disabled={isProcessing || !flutterwaveLoaded}
                  className="w-full bg-black hover:bg-gray-800 text-white font-medium py-3 mt-6"
                >
                  {!flutterwaveLoaded ? 'Loading Payment...' : isProcessing ? 'Processing...' : 'Pay with Flutterwave'}
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
