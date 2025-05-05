"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Crown } from "lucide-react";
import SiteButton from "@components/SiteButton";

export default function FleetoProPaymentPage() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const user = typeof window !== "undefined" ? localStorage.getItem("name") : null;
  const email = typeof window !== "undefined" ? localStorage.getItem("email") : null;

  useEffect(() => {
    const initiateCheckout = async () => {
      if (!user || !email) {
        router.push("/login");
        return;
      }

      try {
        const response = await fetch("/api/payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "fleeto_pro_subscription",
            userEmail: email,
            userName: user,
          }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Payment session creation failed");

        if (data.url) {
          localStorage.setItem("isPro", "true");
          window.location.href = data.url;
        } else {
          throw new Error("No redirect URL received from payment server");
        }
      } catch (err) {
        console.error("Payment error:", err);
        setError(`Payment failed: ${err.message || "Unknown error"}`);
        setIsLoading(false);
      }
    };

    initiateCheckout();
  }, [user, email, router]);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-[var(--section-width)] max-w-[var(--section-max-width)] mt-[var(--page-top-padding)] mb-[30px]">
        <div className="bg-white rounded-[16px] p-6" style={{ boxShadow: "0px 1px 10px var(--shadow)" }}>
          <div className="flex items-center gap-3 mb-6 pb-6 border-b">
            <div className="p-2 bg-[var(--bg2)] rounded-full">
              <Crown className="text-[var(--accent)]" size={24} />
            </div>
            <div>
              <h2 className="text-[20px] font-bold">Fleeto Pro Subscription</h2>
              <p className="text-[var(--body)]">$9.99/month</p>
            </div>
          </div>

          {isLoading && !error && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--accent)] mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold mb-2">Connecting to Payment Gateway</h2>
              <p className="text-gray-500 mb-4">Please wait while we redirect you to our secure payment system...</p>
            </div>
          )}

          {error && (
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2">Payment Error</h2>
              <p className="text-red-500 mb-4">{error}</p>

              <div className="flex gap-3 justify-center">
                <SiteButton text="Try Again" variant="filled" onClick={() => window.location.reload()} />
                <SiteButton text="Return to Fleeto Pro" variant="outlined" onClick={() => router.push('/fleeto-pro')} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
