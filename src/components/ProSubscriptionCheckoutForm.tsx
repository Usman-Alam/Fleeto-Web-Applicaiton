"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { useAuth } from "@contexts/AuthContext";
import SiteButton from "@components/SiteButton";

export default function ProSubscriptionCheckoutForm() {
    const stripe = useStripe();
    const elements = useElements();
    const router = useRouter();
    const { user, updateUser } = useAuth();
    const [errorMessage, setErrorMessage] = useState<string | undefined>();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);

        if (!stripe || !elements || !user) {
            setLoading(false);
            return;
        }

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/fleeto-pro/success`,
            },
            redirect: "if_required",
        });

        if (error) {
            setErrorMessage(error.message);
            setLoading(false);
        } else if (paymentIntent && paymentIntent.status === "succeeded") {
            // Payment successful
            try {
                // Update the user's Pro status in the database
                const response = await fetch("/api/update-pro-status", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userId: user.id,
                        paymentIntentId: paymentIntent.id,
                    }),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || "Failed to update subscription status");
                }

                // Update user context
                await updateUser({
                    isPro: true,
                    proExpiryDate: data.expiryDate,
                    fleetoCoins: (user.fleetoCoins || 0) + 100 // Add welcome bonus
                });

                // Redirect to success page
                router.push("/fleeto-pro/success");
            } catch (error) {
                console.error("Error updating subscription:", error);
                setErrorMessage("Payment succeeded but we had trouble updating your subscription. Please contact support.");
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <PaymentElement />

            {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
                    {errorMessage}
                </div>
            )}

            <div className="pt-4">
                <SiteButton
                    text={loading ? "Processing..." : "Subscribe Now - $9.99/month"}
                    variant="filled"
                    fullWidth
                    disabled={loading || !stripe || !elements}
                />

                <p className="text-sm text-[var(--body)] text-center mt-4">
                    You&apos;ll be charged $9.99 monthly. Cancel anytime from your profile.
                </p>
            </div>
        </form>
    );
}