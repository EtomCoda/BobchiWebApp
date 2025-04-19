'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useForm } from 'react-hook-form';
import { useSupabase } from '@/components/providers/supabase-provider';
import { Database } from '@/lib/database.types';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Edit } from 'lucide-react';

type CylinderType = Database['public']['Enums']['cylinder_type'];

interface OrderItem {
  cylinderType: CylinderType;
  quantity: number;
}

interface DeliveryInfo {
  fullName: string;
  phoneNumber: string;
  email: string;
  address: string;
  landmark: string;
  deliveryTime: string;
  notes: string;
}

const CYLINDER_SIZES = {
  '3kg': 3,
  '6kg': 6,
  '12.5kg': 12.5,
  '25kg': 25,
  '50kg': 50,
};

const PRICE_PER_KG = 900;
const DELIVERY_FEE = 1000;

export default function OrderPage() {
  const [step, setStep] = useState(1);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const { supabase } = useSupabase();
  const { register, handleSubmit, formState: { errors } } = useForm<DeliveryInfo>();
  const { toast } = useToast();
  const [editingItem, setEditingItem] = useState<{ index: number; quantity: number } | null>(null);

  const calculatePrice = (size: CylinderType) => {
    return CYLINDER_SIZES[size] * PRICE_PER_KG;
  };

  const addOrderItem = (cylinderType: CylinderType, quantity: number) => {
    // Check if we already have this cylinder type
    const existingIndex = orderItems.findIndex(item => item.cylinderType === cylinderType);
    
    if (existingIndex !== -1) {
      // Update existing item
      const newItems = [...orderItems];
      newItems[existingIndex].quantity += quantity;
      setOrderItems(newItems);
    } else {
      // Add new item
      setOrderItems([...orderItems, { cylinderType, quantity }]);
    }

    toast({
      title: "Added to Order",
      description: `${quantity}x ${cylinderType} cylinder${quantity > 1 ? 's' : ''} added to your order.`,
    });
  };

  const removeOrderItem = (index: number) => {
    const newItems = orderItems.filter((_, i) => i !== index);
    setOrderItems(newItems);
    toast({
      title: "Removed from Order",
      description: "Item removed from your order.",
    });
  };

  const updateOrderItemQuantity = (index: number, quantity: number) => {
    if (quantity < 1) return;
    const newItems = [...orderItems];
    newItems[index].quantity = quantity;
    setOrderItems(newItems);
    setEditingItem(null);
    toast({
      title: "Order Updated",
      description: "Item quantity has been updated.",
    });
  };

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => {
      return total + (calculatePrice(item.cylinderType) * item.quantity);
    }, 0) + DELIVERY_FEE;
  };

  const onSubmit = async (data: DeliveryInfo) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to place an order.",
          variant: "destructive",
        });
        return;
      }

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: calculateTotal(),
          delivery_fee: DELIVERY_FEE,
          delivery_address: data.address,
          landmark: data.landmark,
          preferred_delivery_time: data.deliveryTime,
          notes: data.notes,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(
          orderItems.map(item => ({
            order_id: order.id,
            cylinder_type: item.cylinderType,
            quantity: item.quantity,
            unit_price: calculatePrice(item.cylinderType),
            refill_type: 'refill',
          }))
        );

      if (itemsError) throw itemsError;

      setStep(5);
      toast({
        title: "Order Placed Successfully",
        description: "Your order has been confirmed and is being processed.",
      });
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: "Error",
        description: "There was an error placing your order. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <main className="min-h-screen py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Order Gas</h1>
        
        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          {[1, 2, 3, 4, 5].map((number) => (
            <div
              key={number}
              className={`w-8 h-8 rounded-full flex items-center justify-center mx-2 ${
                step >= number ? 'bg-primary text-white' : 'bg-gray-200'
              }`}
            >
              {number}
            </div>
          ))}
        </div>

        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>
              {step === 1 && 'Cylinder Selection'}
              {step === 2 && 'Order Details'}
              {step === 3 && 'Delivery Information'}
              {step === 4 && 'Payment'}
              {step === 5 && 'Confirmation'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {step === 1 && (
              <div className="space-y-6">
                <Tabs defaultValue="3kg">
                  <TabsList className="grid grid-cols-5 gap-4">
                    {Object.keys(CYLINDER_SIZES).map((size) => (
                      <TabsTrigger key={size} value={size}>
                        {size}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {Object.entries(CYLINDER_SIZES).map(([size]) => (
                    <TabsContent key={size} value={size}>
                      <Card>
                        <CardContent className="pt-6">
                          <h3 className="text-2xl font-bold mb-4">{size} Cylinder</h3>
                          <p className="text-xl mb-4">₦{calculatePrice(size as CylinderType).toLocaleString()}</p>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="quantity">Quantity</Label>
                              <Input
                                id="quantity"
                                type="number"
                                min="1"
                                defaultValue="1"
                                onChange={(e) => {
                                  const value = parseInt(e.target.value);
                                  if (value >= 1) {
                                    e.target.dataset.quantity = value.toString();
                                  }
                                }}
                              />
                            </div>
                            <Button
                              onClick={(e) => {
                                const input = e.currentTarget.parentElement?.querySelector('input');
                                const quantity = parseInt(input?.value || '1');
                                addOrderItem(size as CylinderType, quantity);
                              }}
                            >
                              Add to Order
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  ))}
                </Tabs>
                <Button
                  className="w-full"
                  onClick={() => setStep(2)}
                  disabled={orderItems.length === 0}
                >
                  Continue to Order Details
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  {orderItems.map((item, index) => (
                    <Card key={index}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-bold">{item.cylinderType} Cylinder</h3>
                            {editingItem?.index === index ? (
                              <div className="flex items-center gap-2 mt-2">
                                <Input
                                  type="number"
                                  min="1"
                                  value={editingItem.quantity}
                                  onChange={(e) => setEditingItem({ 
                                    index, 
                                    quantity: parseInt(e.target.value) || 1 
                                  })}
                                  className="w-24"
                                />
                                <Button 
                                  onClick={() => updateOrderItemQuantity(index, editingItem.quantity)}
                                  size="sm"
                                >
                                  Save
                                </Button>
                              </div>
                            ) : (
                              <p className="text-sm text-gray-600">
                                {item.quantity} x ₦{calculatePrice(item.cylinderType).toLocaleString()}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <p className="font-bold mr-4">
                              ₦{(calculatePrice(item.cylinderType) * item.quantity).toLocaleString()}
                            </p>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setEditingItem({ index, quantity: item.quantity })}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeOrderItem(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <span>Delivery Fee</span>
                    <span>₦{DELIVERY_FEE.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-primary/10 rounded-lg">
                    <span className="font-bold">Total</span>
                    <span className="font-bold">₦{calculateTotal().toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button onClick={() => setStep(3)}>Continue to Delivery</Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      {...register('fullName', { required: true })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      {...register('phoneNumber', { required: true })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register('email', { required: true })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Delivery Address</Label>
                    <Input
                      id="address"
                      {...register('address', { required: true })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="landmark">Landmark</Label>
                    <Input id="landmark" {...register('landmark')} />
                  </div>
                  <div>
                    <Label htmlFor="deliveryTime">Preferred Delivery Time</Label>
                    <Input
                      id="deliveryTime"
                      type="datetime-local"
                      {...register('deliveryTime')}
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Input id="notes" {...register('notes')} />
                  </div>
                </div>
                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setStep(2)}>
                    Back
                  </Button>
                  <Button type="submit">Continue to Payment</Button>
                </div>
              </form>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <Button className="h-32 hover:border-primary" variant="outline">
                    Paystack
                  </Button>
                  <Button className="h-32 hover:border-primary" variant="outline">
                    Flutterwave
                  </Button>
                  <Button className="h-32 hover:border-primary" variant="outline">
                    Bank Transfer
                  </Button>
                  <Button className="h-32 hover:border-primary" variant="outline">
                    USSD
                  </Button>
                </div>
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(3)}>
                    Back
                  </Button>
                  <Button onClick={() => setStep(5)}>Complete Order</Button>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="text-center space-y-6">
                <div className="text-green-500 text-6xl mb-4">✓</div>
                <h2 className="text-2xl font-bold">Order Confirmed!</h2>
                <p>Your order has been successfully placed.</p>
                <p className="text-sm text-gray-600">
                  Order ID: #123456
                  <br />
                  Estimated delivery: 2-3 hours
                </p>
                <p className="text-sm">
                  A confirmation email has been sent to your email address.
                </p>
                <Button className="w-full" onClick={() => window.location.href = '/'}>
                  Return to Home
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}