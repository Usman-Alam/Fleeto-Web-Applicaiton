"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SiteButton from "@components/SiteButton";

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [testSuccess, setTestSuccess] = useState(false);
  
  const amount = searchParams.get('amount') || "0.00";
  const orderDetailsParam = searchParams.get('orderDetails') || "";

  // First test if the server is reachable
  useEffect(() => {
    const testServer = async () => {
      try {
        const response = await fetch('http://localhost:4173/test');
        const data = await response.json();
        console.log('Server test response:', data);
        setTestSuccess(true);
      } catch (error) {
        console.error('Server test failed:', error);
        setError("Cannot connect to payment server. Is it running?");
        setIsLoading(false);
      }
    };
    
    testServer();
  }, []);

  // Only try to initiate payment if server test was successful
  useEffect(() => {
    if (!testSuccess) return;
    
    const initiatePayment = async () => {
      if (!orderDetailsParam) {
        setError("No order details found");
        setIsLoading(false);
        return;
      }

      try {
        console.log("Starting payment process");
        let orderDetails;
        try {
          orderDetails = JSON.parse(decodeURIComponent(orderDetailsParam));
        } catch (e) {
          console.error("Error parsing order details:", e);
          setError("Invalid order data");
          setIsLoading(false);
          return;
        }
        
        console.log("Order details:", orderDetails);
        
        // Check that required fields exist
        if (!orderDetails.items || !Array.isArray(orderDetails.items) || orderDetails.items.length === 0) {
          console.error("No items in order");
          setError("No items in order");
          setIsLoading(false);
          return;
        }
        
        // Create request payload
        const payload = {
          items: orderDetails.items || [],
          total: orderDetails.total || 0,
          email: 'customer@example.com',
          orderDetails: orderDetails,
          deliveryAddress: orderDetails.deliveryAddress || ''
        };
        
        console.log("Sending payload to server:", payload);
        
        const response = await fetch('http://localhost:4173/payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        console.log("Response status:", response.status);
        
        const data = await response.json();
        
        if (!response.ok) {
          console.error("Error from server:", data);
          throw new Error(data.message || `Payment failed: ${response.status}`);
        }

        console.log("Received response:", data);
        
        if (data.url) {
          console.log("Redirecting to:", data.url);
          // Redirect to Stripe checkout
          window.location.href = data.url;
        } else {
          throw new Error("No redirect URL received from payment server");
        }
      } catch (error) {
        console.error("Payment error:", error);
        setError(`Payment failed: ${error.message || "Unknown error"}`);
        setIsLoading(false);
      }
    };

    initiatePayment();
  }, [orderDetailsParam, testSuccess]);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-[var(--section-width)] mt-[var(--page-top-padding)] mb-[30px]">
        <h1 className="text-[32px] font-bold mb-8">Processing Payment</h1>
        
        <div className="bg-white rounded-[16px] p-8 text-center" style={{ boxShadow: "0px 1px 10px var(--shadow)" }}>
          {isLoading && !error && (
            <>
              <div className="animate-spin w-12 h-12 border-4 border-[var(--accent)] border-t-transparent rounded-full mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold mb-2">Connecting to Payment Gateway</h2>
              <p className="text-gray-500 mb-4">Please wait while we redirect you to our secure payment system...</p>
              <p className="text-sm text-gray-400">Amount: ${amount}</p>
            </>
          )}
          
          {error && (
            <>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2">Payment Error</h2>
              <p className="text-red-500 mb-4">{error}</p>
              
              {error.includes("server") ? (
                <div className="bg-yellow-50 p-4 mb-4 rounded-md text-left">
                  <h3 className="font-medium text-yellow-800 mb-1">Troubleshooting:</h3>
                  <ul className="list-disc text-sm text-yellow-700 pl-5">
                    <li>Make sure the Stripe server is running: <code className="bg-gray-100 px-1 rounded">node server/stripeServer.js</code></li>
                    <li>Check that it&apos;s running on port 4173</li>
                    <li>Check server console for errors</li>
                  </ul>
                </div>
              ) : null}
              
              <div className="flex gap-3 justify-center">
                <SiteButton
                  text="Try Again"
                  variant="filled"
                  onClick={() => window.location.reload()}
                />
                <SiteButton
                  text="Return to Checkout"
                  variant="outlined"
                  onClick={() => router.push('/checkout')}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
