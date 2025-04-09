"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import SiteButton from "@components/SiteButton";
import { useCart } from "@contexts/CartContext";

export interface OrderDetails {
  orderNumber: string;
  orderDate: string;
  deliveryAddress: string;
  estimatedDeliveryTime: string;
  items: OrderItem[];
  paymentMethod?: string;
  subtotal?: number;
  deliveryFee?: number;
  tax?: number;
  total?: number;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export default function OrderConfirmation() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  
  useEffect(() => {
    // Only clear cart once when component mounts
    clearCart();
  }, []); // Empty dependency array to run only once
  
  useEffect(() => {
    // This effect should only run once to get/set order details
    if (orderDetails === null) {
      // Try to get order details from URL query
      const orderDetailsStr = searchParams.get('orderDetails');
      
      if (orderDetailsStr) {
        try {
          const parsedOrderDetails = JSON.parse(decodeURIComponent(orderDetailsStr));
          setOrderDetails(parsedOrderDetails);
        } catch (error) {
          console.error("Error parsing order details:", error);
          // Fallback to generating a random order
          generateRandomOrder();
        }
      } else {
        // No details provided, generate random order
        generateRandomOrder();
      }
    }
  }, [searchParams, orderDetails]); // Only depend on searchParams and orderDetails
  
  const generateRandomOrder = () => {
    // Create a default/fallback order
    setOrderDetails({
      orderNumber: `FLT-${Math.floor(100000 + Math.random() * 900000)}`,
      orderDate: new Date().toLocaleDateString('en-US', {
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      deliveryAddress: "123 Default Address St.",
      estimatedDeliveryTime: "20-30 minutes",
      items: [
        {
          id: "default-item-1",
          name: "Sample Item",
          price: 9.99,
          quantity: 1,
          image: "/images/food-placeholder.jpg"
        }
      ],
    });
  };
  
  if (!orderDetails) {
    return <div className="pt-[150px] text-center">Loading order details...</div>;
  }
  
  // Calculate total price from order items if not provided
  const totalPrice = orderDetails.total || 
    orderDetails.items.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <main className="w-[var(--section-width)] mt-[var(--page-top-padding)] flex flex-col items-center justify-start pt-[40px] px-[5%]">
      <div className="w-full max-w-[800px] bg-white rounded-[16px] p-6 md:p-8 shadow-md">
        {/* Success header */}
        <div className="flex flex-col items-center justify-center text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-[26px] md:text-[32px] font-bold mb-2">Order Confirmed!</h1>
          <p className="text-gray-600 text-[16px] md:text-[18px]">
            Thank you for your order. We've received your {orderDetails.paymentMethod === 'card' ? 'payment' : 'order'} and will prepare your items.
          </p>
        </div>
        
        {/* Order details */}
        <div className="border border-gray-200 rounded-[8px] p-4 mb-6">
          <h2 className="text-[18px] md:text-[20px] font-semibold mb-4">Order Details</h2>
          <div className="grid grid-cols-2 gap-y-2">
            <span className="text-gray-600">Order Number:</span>
            <span className="font-medium">{orderDetails.orderNumber}</span>
            <span className="text-gray-600">Date:</span>
            <span className="font-medium">{orderDetails.orderDate}</span>
            {orderDetails.paymentMethod && (
              <>
                <span className="text-gray-600">Payment Method:</span>
                <span className="font-medium">
                  {orderDetails.paymentMethod === 'card' ? 'Credit/Debit Card' : 'Cash on Delivery'}
                </span>
              </>
            )}
          </div>
        </div>
        
        {/* Order summary */}
        <div className="mb-6">
          <h2 className="text-[18px] md:text-[20px] font-semibold mb-4">Order Summary</h2>
          
          {orderDetails.items && orderDetails.items.length > 0 ? (
            <div className="border border-gray-200 rounded-[8px] overflow-hidden">
              {/* Items list */}
              <div className="max-h-[300px] overflow-y-auto">
                {orderDetails.items.map((item, index) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 border-b border-gray-100">
                    <div className="text-gray-500 text-sm">{index + 1}.</div>
                    <div className="relative w-[50px] h-[50px] rounded-md overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-gray-600 text-sm">Qty: {item.quantity}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                      <div className="text-gray-600 text-sm">${item.price.toFixed(2)} each</div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Price breakdown */}
              <div className="bg-gray-50 p-4">
                {orderDetails.subtotal !== undefined && (
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Subtotal:</span>
                    <span>${orderDetails.subtotal.toFixed(2)}</span>
                  </div>
                )}
                
                {orderDetails.deliveryFee !== undefined && (
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Delivery Fee:</span>
                    <span>${orderDetails.deliveryFee.toFixed(2)}</span>
                  </div>
                )}
                
                {orderDetails.tax !== undefined && (
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Tax:</span>
                    <span>${orderDetails.tax.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="h-px bg-gray-200 my-2"></div>
                
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total:</span>
                  <span className="font-bold text-[18px]">${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4">No items in this order</p>
          )}
        </div>
        
        {/* Delivery info */}
        <div className="border border-gray-200 rounded-[8px] p-4 mb-6">
          <h2 className="text-[18px] md:text-[20px] font-semibold mb-4">Delivery Information</h2>
          <div className="grid grid-cols-1 gap-y-2">
            <div>
              <span className="text-gray-600 block">Delivery Address:</span>
              <span className="font-medium">{orderDetails.deliveryAddress || "No address provided"}</span>
            </div>
            <div>
              <span className="text-gray-600 block">Estimated Delivery Time:</span>
              <span className="font-medium">{orderDetails.estimatedDeliveryTime}</span>
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <SiteButton
            text="Return to Home"
            variant="outlined"
            onClick={() => router.push("/")}
            fullWidth
          />
          <SiteButton
            text="Track My Order"
            variant="filled"
            onClick={() => router.push(`/order-tracking?orderNumber=${orderDetails.orderNumber}`)}
            fullWidth
          />
        </div>
      </div>
    </main>
  );
}