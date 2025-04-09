"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@contexts/CartContext";
import SiteButton from "@components/SiteButton";

type DeliveryMethod = "standard" | "express" | "dormDrop";
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

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Calculate subtotal
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Calculate delivery fee based on method
  const deliveryFee =
    deliveryMethod === "standard" ? 1.99 :
      deliveryMethod === "express" ? 4.99 :
        0.99; // Dorm Drop fee

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

    if (deliveryMethod !== "dormDrop" && !address.trim()) {
      newErrors.address = "Delivery address is required";
    }

    // Validate dorm information when dormDrop is selected
    if (deliveryMethod === "dormDrop") {
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
        // Use dorm information for delivery address if dormDrop is selected
        deliveryAddress: deliveryMethod === "dormDrop"
          ? `Room ${roomNumber}, ${hostelName} Hostel`
          : address,
        estimatedDeliveryTime:
          deliveryMethod === "standard" ? "30-45 minutes" :
            deliveryMethod === "express" ? "15-20 minutes" :
              "40-50 minutes", // Dorm Drop
        deliveryMethod: deliveryMethod,
        items: cartItems,
        paymentMethod: paymentMethod,
        subtotal: subtotal,
        deliveryFee: deliveryFee,
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
      <div className="w-[var(--section-width)] mt-[60px] mb-[30px]">
        <h1 className="text-[32px] font-bold mb-8">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left column - Order Summary */}
          <div className="flex-1">
            <div className="bg-white rounded-[16px] p-6 mb-6" style={{ boxShadow: "0px 1px 10px var(--shadow)" }}>
              <h2 className="text-[20px] font-bold mb-4">Order Summary</h2>

              {cartItems.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Your cart is empty</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 pb-4 border-b border-gray-100">
                      <div className="relative w-[60px] h-[60px] rounded-md overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-gray-600 text-sm">${item.price.toFixed(2)} × {item.quantity}</div>
                      </div>
                      <div className="font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-gray-700"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-gray-700"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {errors.cart && (
                <p className="text-red-500 text-sm mt-2">{errors.cart}</p>
              )}
            </div>

            {/* Delivery Method */}
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

                <label className="flex items-center p-4 border rounded-lg cursor-pointer bg-white">
                  <input
                    type="radio"
                    name="deliveryMethod"
                    checked={deliveryMethod === "dormDrop"}
                    onChange={() => setDeliveryMethod("dormDrop")}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <div className="font-medium">Dorm Drop</div>
                    <div className="text-sm text-gray-500">Campus delivery to your dorm: 40-50 minutes</div>
                  </div>
                  <div className="font-medium">$0.99</div>
                </label>
              </div>
            </div>

            {/* Dorm Information - Only shown when dormDrop is selected */}
            {deliveryMethod === "dormDrop" && (
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

            {/* Other delivery address form - only shown when NOT dormDrop */}
            {deliveryMethod !== "dormDrop" && (
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

          {/* Right column - Delivery and Payment */}
          <div className="flex-1">
            {/* Payment Method */}
            <div className="bg-white rounded-[16px] p-6 mb-6" style={{ boxShadow: "0px 1px 10px var(--shadow)" }}>
              <h2 className="text-[20px] font-bold mb-4">Payment Method</h2>

              <div className="flex flex-col gap-3">
                <label className="flex items-center p-4 border rounded-lg cursor-pointer bg-white">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <div className="font-medium">Credit/Debit Card</div>
                    <div className="text-sm text-gray-500">Pay securely with your card</div>
                  </div>
                  <div className="flex space-x-1">
                    <div className="w-8 h-6 bg-gray-200 rounded"></div>
                    <div className="w-8 h-6 bg-gray-200 rounded"></div>
                  </div>
                </label>

                <label className="flex items-center p-4 border rounded-lg cursor-pointer bg-white">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === "cash"}
                    onChange={() => setPaymentMethod("cash")}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <div className="font-medium">Cash on Delivery</div>
                    <div className="text-sm text-gray-500">Pay when your order arrives</div>
                  </div>
                  <div className="w-8 h-6 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                    </svg>
                  </div>
                </label>
              </div>
            </div>

            {/* Order Total */}
            <div className="bg-white rounded-[16px] p-6" style={{ boxShadow: "0px 1px 10px var(--shadow)" }}>
              <h2 className="text-[20px] font-bold mb-4">Order Total</h2>

              <div className="flex flex-col gap-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
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