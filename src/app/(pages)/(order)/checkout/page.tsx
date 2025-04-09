"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@contexts/CartContext";
import SiteButton from "@components/SiteButton";

// Remove dormDrop from delivery method options
type DeliveryMethod = "standard" | "express";
type PaymentMethod = "card" | "cash";

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, updateQuantity, clearCart } = useCart();
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("standard");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [address, setAddress] = useState("");

  // Add new state for dorm information
  const [hostelName, setHostelName] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  // Add a separate toggle for DormDrop
  const [isDormDrop, setIsDormDrop] = useState(false);

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Calculate subtotal
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Calculate base delivery fee based on delivery method
  const baseDeliveryFee = deliveryMethod === "standard" ? 1.99 : 4.99;
  
  // Calculate extra fee for DormDrop if enabled
  const dormDropFee = isDormDrop ? 0.99 : 0;
  
  // Total delivery fee combines both
  const deliveryFee = baseDeliveryFee + dormDropFee;

  // Calculate tax (assuming 5% tax rate)
  const tax = subtotal * 0.05;

  // Calculate total
  const total = subtotal + deliveryFee + tax;

  // Validate form fields
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (cartItems.length === 0) {
      newErrors.cart = "Your cart is empty";
    }

    // Always validate address unless using DormDrop
    if (!isDormDrop && !address.trim()) {
      newErrors.address = "Delivery address is required";
    }

    // Validate dorm information when DormDrop is selected
    if (isDormDrop) {
      // Hostel name validation
      if (!hostelName.trim()) {
        newErrors.hostelName = "Hostel name is required";
      } else {
        const hostelPattern = /^([MF])([1-9])$/;
        const match = hostelName.trim().match(hostelPattern);
        
        if (!match) {
          newErrors.hostelName = "Hostel name must be in format M1-M7 or F1-F6";
        } else {
          const building = match[1]; // M or F
          const number = parseInt(match[2]);
          
          if (building === 'M' && (number < 1 || number > 7)) {
            newErrors.hostelName = "M hostels range from M1 to M7";
          } else if (building === 'F' && (number < 1 || number > 6)) {
            newErrors.hostelName = "F hostels range from F1 to F6";
          }
        }
      }
      
      // Room number validation
      if (!roomNumber.trim()) {
        newErrors.roomNumber = "Room number is required";
      } else if (!/^\d{3}$/.test(roomNumber.trim())) {
        newErrors.roomNumber = "Room number must be exactly 3 digits";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    setIsPlacingOrder(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Create order details to pass to confirmation page
      const orderDetails = {
        orderNumber: `FLT-${Math.floor(100000 + Math.random() * 900000)}`,
        orderDate: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        // Use dorm information for delivery address if DormDrop is selected
        deliveryAddress: isDormDrop
          ? `Room ${roomNumber}, ${hostelName} Hostel`
          : address,
        // Combine delivery method with DormDrop info
        estimatedDeliveryTime: deliveryMethod === "standard" 
          ? "30-45 minutes" 
          : "15-20 minutes",
        // Include both delivery method and DormDrop status
        deliveryMethod: `${deliveryMethod}${isDormDrop ? " with DormDrop" : ""}`,
        dormDrop: isDormDrop,
        items: cartItems,
        paymentMethod: paymentMethod,
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        baseDeliveryFee: baseDeliveryFee,
        dormDropFee: dormDropFee,
        tax: tax,
        total: total
      };

      // Encode the order details as a URL parameter
      const encodedOrderDetails = encodeURIComponent(JSON.stringify(orderDetails));

      // Navigate to order confirmation with order details
      router.push(`/order-confirmation?orderDetails=${encodedOrderDetails}`);

    } catch (error) {
      setErrors({ submit: "Failed to place order. Please try again." });
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-[var(--section-width)] mt-[var(--page-top-padding)] mb-[30px]">
        <h1 className="text-[32px] font-bold mb-8">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left column */}
          <div className="flex-1">
            {/* Order Summary section */}
            <div className="bg-white rounded-[16px] p-6 mb-6" style={{ boxShadow: "0px 1px 10px var(--shadow)" }}>
              <h2 className="text-[20px] font-bold mb-4">Order Summary</h2>
              
              {cartItems.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-500 mb-4">Your cart is empty</p>
                  <SiteButton 
                    text="Browse Shops" 
                    variant="outlined" 
                    onClick={() => router.push("/")}
                  />
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 pb-4 border-b border-gray-100">
                      <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100 relative">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                      
                      <div className="flex-1">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-gray-500">${item.price.toFixed(2)}</div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button 
                          className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center"
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        >
                          <span>-</span>
                        </button>
                        
                        <span className="w-6 text-center">{item.quantity}</span>
                        
                        <button 
                          className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <span>+</span>
                        </button>
                      </div>
                      
                      <div className="font-medium w-20 text-right">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                      
                      <button 
                        className="text-gray-400 hover:text-red-500"
                        onClick={() => updateQuantity(item.id, 0)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 6h18"></path>
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Delivery Method - now separate from DormDrop */}
            <div className="bg-white rounded-[16px] p-6 mb-6" style={{ boxShadow: "0px 1px 10px var(--shadow)" }}>
              <h2 className="text-[20px] font-bold mb-4">Delivery Method</h2>

              <div className="flex flex-col gap-3">
                <label className="flex items-center p-4 border rounded-lg cursor-pointer bg-white">
                  <input
                    type="radio"
                    name="deliveryMethod"
                    checked={deliveryMethod === "standard"}
                    onChange={() => setDeliveryMethod("standard")}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <div className="font-medium">Standard Delivery</div>
                    <div className="text-sm text-gray-500">Estimated delivery: 30-45 minutes</div>
                  </div>
                  <div className="font-medium">$1.99</div>
                </label>

                <label className="flex items-center p-4 border rounded-lg cursor-pointer bg-white">
                  <input
                    type="radio"
                    name="deliveryMethod"
                    checked={deliveryMethod === "express"}
                    onChange={() => setDeliveryMethod("express")}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <div className="font-medium">Express Delivery</div>
                    <div className="text-sm text-gray-500">Estimated delivery: 15-20 minutes</div>
                  </div>
                  <div className="font-medium">$4.99</div>
                </label>
              </div>
            </div>
            
            {/* DormDrop Toggle - New section */}
            <div className="bg-white rounded-[16px] p-6 mb-6" style={{ boxShadow: "0px 1px 10px var(--shadow)" }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[20px] font-bold">Dorm Drop Service</h2>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={isDormDrop}
                    onChange={(e) => setIsDormDrop(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--accent)]"></div>
                </label>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-md mb-4">
                <div className="font-medium">Campus Delivery to Your Dorm</div>
                <div className="text-sm text-gray-500 mt-1">
                  Our delivery person will bring your order directly to your dorm room.
                </div>
                <div className="text-sm font-medium mt-2 text-[var(--accent)]">
                  Additional fee: $0.99
                </div>
              </div>
            </div>

            {/* Dorm Information - Only shown when DormDrop is selected */}
            {isDormDrop && (
              <div className="bg-white rounded-[16px] p-6 mb-6" style={{ boxShadow: "0px 1px 10px var(--shadow)" }}>
                <h2 className="text-[20px] font-bold mb-4">Dorm Information</h2>

                <div className="flex flex-col gap-4">
                  <div>
                    <label htmlFor="hostelName" className="block text-sm font-medium text-gray-700 mb-1">
                      Hostel Name
                    </label>
                    <input
                      type="text"
                      id="hostelName"
                      placeholder="e.g. M1, F3"
                      value={hostelName}
                      onChange={(e) => setHostelName(e.target.value.toUpperCase())}
                      className={`w-full p-3 border rounded-lg ${errors.hostelName ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Valid formats: M1-M7 for male hostels, F1-F6 for female hostels
                    </p>
                    {errors.hostelName && (
                      <p className="text-red-500 text-sm mt-1">{errors.hostelName}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="roomNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Room Number
                    </label>
                    <input
                      type="text"
                      id="roomNumber"
                      placeholder="e.g. 101, 305"
                      value={roomNumber}
                      onChange={(e) => {
                        // Only allow digits
                        const value = e.target.value.replace(/\D/g, '');
                        // Limit to 3 digits
                        setRoomNumber(value.slice(0, 3));
                      }}
                      maxLength={3}
                      className={`w-full p-3 border rounded-lg ${errors.roomNumber ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Room number must be exactly 3 digits
                    </p>
                    {errors.roomNumber && (
                      <p className="text-red-500 text-sm mt-1">{errors.roomNumber}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Other delivery address form - only shown when NOT using DormDrop */}
            {!isDormDrop && (
              <div className="bg-white rounded-[16px] p-6 mb-6" style={{ boxShadow: "0px 1px 10px var(--shadow)" }}>
                <h2 className="text-[20px] font-bold mb-4">Delivery Address</h2>

                <div>
                  <textarea
                    placeholder="Enter your delivery address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={3}
                    className={`w-full p-3 border rounded-lg ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right column - Payment and Order Total */}
          <div className="flex-1">
            {/* Payment Method section remains the same */}
            
            {/* Order Total - update to show both delivery fees */}
            <div className="bg-white rounded-[16px] p-6" style={{ boxShadow: "0px 1px 10px var(--shadow)" }}>
              <h2 className="text-[20px] font-bold mb-4">Order Total</h2>

              <div className="flex flex-col gap-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                
                {/* Base delivery fee */}
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {deliveryMethod === "standard" ? "Standard Delivery" : "Express Delivery"}
                  </span>
                  <span>${baseDeliveryFee.toFixed(2)}</span>
                </div>
                
                {/* DormDrop fee if applicable */}
                {isDormDrop && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dorm Drop Service</span>
                    <span>${dormDropFee.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="h-px bg-gray-200 my-2"></div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {errors.submit && (
                <p className="text-red-500 text-sm mb-4">{errors.submit}</p>
              )}

              <SiteButton
                text={isPlacingOrder ? "Processing..." : "Place Order"}
                variant="filled"
                fullWidth
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder}
              />

              <button
                className="w-full text-center mt-3 text-[var(--accent)] hover:underline"
                onClick={() => router.push("/")}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}