"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PaymentPage() {
  const router = useRouter();

  useEffect(() => {
    fetch("http://localhost:4173/payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.url) {
          window.location.href = data.url; // 🔁 Redirect to Stripe Checkout
        }
      });
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold">Redirecting to payment...</h2>
    </div>
  );
}
