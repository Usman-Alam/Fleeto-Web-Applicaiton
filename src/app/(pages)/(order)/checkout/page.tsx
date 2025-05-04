"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@contexts/CartContext";
import OrderSummary from "@components/Checkout/OrderSummary";
import FleetoCoinsSection from "@components/Checkout/FleetoCoinsSection";
import DeliveryMethod from "@components/Checkout/DeliveryMethod";
import DormDropToggle from "@components/Checkout/DormDropToggle";
import DormInformation from "@components/Checkout/DormInformation";
import DeliveryAddress from "@components/Checkout/DeliveryAddress";
import PaymentMethod from "@components/Checkout/PaymentMethod";
import OrderTotal from "@components/Checkout/OrderTotal";

type DeliveryMethod = "standard" | "express";
type PaymentMethod = "card" | "cash";

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, updateQuantity, clearCart } = useCart();  
  console.log(clearCart)
  // States
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("standard");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [address, setAddress] = useState("");
  const [hostelName, setHostelName] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [isDormDrop, setIsDormDrop] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [availableCoins, setAvailableCoins] = useState(Number(localStorage.getItem('coins')) || 0);
  const [coinsToUse, setCoinsToUse] = useState(0);

  // Calculate values
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const baseDeliveryFee = deliveryMethod === "standard" ? 1.99 : 4.99;
  const dormDropFee = isDormDrop ? 0.99 : 0;
  const deliveryFee = baseDeliveryFee + dormDropFee;
  const tax = subtotal * 0.05;
  const coinDiscount = Math.min((coinsToUse / 10), subtotal); // 10 coins = $1, capped at subtotal
  const projectedCoinsToEarn = Math.floor(subtotal / 20);
  const isPro = localStorage.getItem('isPro') === 'true';
  const proDiscount = isPro ? (subtotal * 0.10) : 0; // 10% discount on subtotal
  const total = Math.max(0, subtotal + deliveryFee + tax - coinDiscount - proDiscount);

  // Maximum usable coins
  const maxUsableCoins = Math.min(
    availableCoins,
    Math.floor((subtotal + deliveryFee) * 20) // Can't use coins to pay tax
  );

  // Form validation
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (cartItems.length === 0) {
      newErrors.cart = "Your cart is empty";
    }

    if (!isDormDrop && !address.trim()) {
      newErrors.address = "Delivery address is required";
    }

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
          const building = match[1];
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

    // Coin validation
    if (coinsToUse > availableCoins) {
      newErrors.coins = "You don't have enough FleetoCoins";
    }

    if (coinsToUse % 20 !== 0) {
      newErrors.coins = "FleetoCoins must be used in multiples of 20";
    }

    if (coinsToUse > subtotal * 10) {
      newErrors.coins = "Coin discount cannot exceed order subtotal";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Update user coins
  const updateUserCoins = async () => {
    if (coinsToUse === 0) return;

    try {
      const email = localStorage.getItem('email');
      if (!email) throw new Error("User email not found");

      const response = await fetch('/api/deductCoins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          coinsToDeduct: coinsToUse
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update coins');
      }

      // Update local storage with new balance
      localStorage.setItem('coins', String(data.newCoinsBalance));
      setAvailableCoins(data.newCoinsBalance);

    } catch (error) {
      console.error('Error updating coins:', error);
      setErrors({ ...errors, coins: 'Failed to update coins balance' });
    }
  };

  // Order placement
  const handlePlaceOrder = async () => {
    if (!validateForm()) return;
    setIsPlacingOrder(true);

    try {
      // Update coins first
      await updateUserCoins();

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const orderDetails = {
        orderNumber: `FLT-${Math.floor(100000 + Math.random() * 900000)}`,
        orderDate: new Date().toLocaleDateString('en-US', {
          year: 'numeric', month: 'long', day: 'numeric',
          hour: '2-digit', minute: '2-digit'
        }),
        deliveryAddress: isDormDrop ? `Room ${roomNumber}, ${hostelName} Hostel` : address,
        estimatedDeliveryTime: deliveryMethod === "standard" ? "30-45 minutes" : "15-20 minutes",
        deliveryMethod: `${deliveryMethod}${isDormDrop ? " with DormDrop" : ""}`,
        dormDrop: isDormDrop,
        items: cartItems,
        paymentMethod,
        subtotal,
        deliveryFee,
        baseDeliveryFee,
        dormDropFee,
        tax,
        coinsUsed: coinsToUse,
        coinDiscount,
        coinsEarned: projectedCoinsToEarn,
        isPro,
        proDiscount,
        total // This will now include the Pro discount
      };

      const encodedOrderDetails = encodeURIComponent(JSON.stringify(orderDetails));

      if (paymentMethod === "card") {
        router.push(`/payment?amount=${total.toFixed(2)}&orderDetails=${encodedOrderDetails}`);
      } else {
        router.push(`/order-confirmation?orderDetails=${encodedOrderDetails}`);
      }
    } catch (error) {
      console.log(error);
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
            {/* Order Summary */}
            <OrderSummary
              cartItems={cartItems}
              updateQuantity={updateQuantity}
              router={router}
            />

            {/* FleetoCoins Section */}
            <FleetoCoinsSection
              availableCoins={availableCoins}
              coinsToUse={coinsToUse}
              setCoinsToUse={setCoinsToUse}
              maxUsableCoins={maxUsableCoins}
              coinDiscount={coinDiscount}
              projectedCoinsToEarn={projectedCoinsToEarn}
              errors={errors.coins}
            />

            {/* Delivery Method */}
            <DeliveryMethod
              deliveryMethod={deliveryMethod}
              setDeliveryMethod={setDeliveryMethod}
            />

            {/* DormDrop Toggle */}
            <DormDropToggle
              isDormDrop={isDormDrop}
              setIsDormDrop={setIsDormDrop}
            />

            {/* Dorm Information or Delivery Address */}
            {isDormDrop ? (
              <DormInformation
                hostelName={hostelName}
                setHostelName={setHostelName}
                roomNumber={roomNumber}
                setRoomNumber={setRoomNumber}
                errors={{
                  hostelName: errors.hostelName,
                  roomNumber: errors.roomNumber
                }}
              />
            ) : (
              <DeliveryAddress
                address={address}
                setAddress={setAddress}
                error={errors.address}
              />
            )}
          </div>

          {/* Right column */}
          <div className="flex-1"> 
            {/* Payment Method */}
            <PaymentMethod
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
            />

            {/* Order Total */}
            <OrderTotal
              subtotal={subtotal}
              deliveryMethod={deliveryMethod}
              baseDeliveryFee={baseDeliveryFee}
              isDormDrop={isDormDrop}
              dormDropFee={dormDropFee}
              tax={tax}
              coinsToUse={coinsToUse}
              coinDiscount={coinDiscount}
              isPro={isPro}
              proDiscount={proDiscount}
              total={total}
              isPlacingOrder={isPlacingOrder}
              error={errors.submit}
              onPlaceOrder={handlePlaceOrder}
              onContinueShopping={() => router.push("/")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}