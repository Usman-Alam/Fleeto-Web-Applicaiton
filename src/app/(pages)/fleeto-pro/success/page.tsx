"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@contexts/AuthContext";
import { Check, Crown, Coins } from "lucide-react";
import SiteButton from "@components/SiteButton";

export default function FleetoProSuccessPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, updateUser, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [subscriptionUpdated, setSubscriptionUpdated] = useState(false);

    // Store parameters in state to preserve them
    const [params, setParams] = useState({
        userId: "",
        timestamp: ""
    });

    // First useEffect to capture and store URL parameters
    useEffect(() => {
        const userId = searchParams.get("userId");
        const timestamp = searchParams.get("timestamp");

        if (userId && timestamp) {
            setParams({
                userId,
                timestamp
            });

            // Also store them in sessionStorage as backup
            sessionStorage.setItem("fleetoPro_userId", userId);
            sessionStorage.setItem("fleetoPro_timestamp", timestamp);
        } else {
            // Try to get from sessionStorage if not in URL
            const storedUserId = sessionStorage.getItem("fleetoPro_userId");
            const storedTimestamp = sessionStorage.getItem("fleetoPro_timestamp");

            if (storedUserId && storedTimestamp) {
                setParams({
                    userId: storedUserId,
                    timestamp: storedTimestamp
                });
            } else {
                // If no parameters anywhere, redirect
                router.push("/fleeto-pro");
            }
        }
    }, [searchParams, router]);

    // Second useEffect to handle subscription update after auth is ready
    useEffect(() => {
        // Only proceed if both auth is loaded and we have parameters
        if (authLoading || !params.userId || !params.timestamp) {
            return;
        }

        // Instead, just log the mismatch but continue processing
        if (user && user.id !== params.userId) {
            console.log("Note: User ID from Auth context doesn't match URL parameter", {
                fromContext: user.id,
                fromURL: params.userId
            });
            // Continue processing anyway since the user is authenticated
        }

        // Only update if user is loaded and not already processed
        if (user && !subscriptionUpdated) {
            const updateSubscription = async () => {
                try {
                    console.log("Updating subscription for user:", user.id);

                    // Use the user ID from Auth context, not the URL parameter
                    const response = await fetch("/api/update-pro-status", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            userId: user.id, // Use the ID from Auth context
                            timestamp: params.timestamp,
                        }),
                    });

                    const data = await response.json();

                    if (!response.ok) {
                        throw new Error(data.error || "Failed to update subscription status");
                    }

                    // Calculate expiry date (one month from now)
                    const expiryDate = new Date();
                    expiryDate.setMonth(expiryDate.getMonth() + 1);

                    // Update user context
                    await updateUser({
                        isPro: true,
                        proExpiryDate: expiryDate.toISOString(),
                        fleetoCoins: (user.fleetoCoins || 0) + 100, // Add welcome bonus
                    });

                    setSubscriptionUpdated(true);

                    // Clear session storage values after successful update
                    sessionStorage.removeItem("fleetoPro_userId");
                    sessionStorage.removeItem("fleetoPro_timestamp");

                } catch (error) {
                    console.error("Error updating subscription:", error);
                    setError("We had trouble updating your subscription. Please contact support.");
                } finally {
                    setLoading(false);
                }
            };

            updateSubscription();
        } else if (!authLoading) {
            // If auth has finished loading but no user, show error
            setLoading(false);
        }
    }, [user, authLoading, params, updateUser, subscriptionUpdated]);

    if (loading) {
        return (
            <div className="flex flex-col items-center w-full">
                <div className="w-[var(--section-width)] max-w-[600px] mt-[var(--page-top-padding)] mb-[30px]">
                    <div className="bg-white rounded-[16px] p-6 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--accent)] mx-auto mb-4"></div>
                        <p>Processing your subscription...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center w-full">
            <div className="w-[var(--section-width)] max-w-[600px] mt-[var(--page-top-padding)] mb-[30px]">
                <div className="bg-white rounded-[16px] p-6 text-center" style={{ boxShadow: "0px 1px 10px var(--shadow)" }}>
                    {error ? (
                        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-4">
                            {error}
                            <div className="mt-4">
                                <p>Your payment was processed, but we had trouble updating your account.</p>
                                <p>Please contact customer support with reference: {searchParams.get("timestamp")}</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="flex justify-center mb-6">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                                    <Check className="h-10 w-10 text-green-600" />
                                </div>
                            </div>

                            <h1 className="text-[28px] font-bold mb-2">Welcome to Fleeto Pro!</h1>
                            <p className="text-[18px] text-[var(--body)] mb-6">
                                Your subscription has been successfully activated.
                            </p>

                            <div className="bg-[var(--bg2)] p-6 rounded-lg mb-8">
                                <div className="flex items-center justify-center mb-4">
                                    <Crown className="text-[var(--accent)] mr-2" size={24} />
                                    <h3 className="text-[20px] font-bold text-[var(--accent)]">
                                        Your Pro Benefits
                                    </h3>
                                </div>

                                <div className="bg-white/60 p-4 rounded-md mb-4">
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <Coins className="text-[var(--accent)]" size={20} />
                                        <h4 className="text-[18px] font-bold text-[var(--accent)]">100 Fleeto Coins Added!</h4>
                                    </div>
                                    <p className="text-[var(--body)]">
                                        We&apos;ve added 100 Fleeto Coins to your account as a welcome bonus.
                                    </p>
                                </div>

                                {/* Benefits list */}
                                <ul className="text-left space-y-3">
                                    <li className="flex items-center">
                                        <span className="mr-2 bg-green-100 rounded-full p-1">
                                            <Check className="h-4 w-4 text-green-600" />
                                        </span>
                                        <span className="text-[var(--body)]">
                                            <span className="font-medium">10% OFF</span> on all your orders
                                        </span>
                                    </li>
                                    <li className="flex items-center">
                                        <span className="mr-2 bg-green-100 rounded-full p-1">
                                            <Check className="h-4 w-4 text-green-600" />
                                        </span>
                                        <span className="text-[var(--body)]">
                                            <span className="font-medium">Priority Delivery</span> on all orders
                                        </span>
                                    </li>
                                    <li className="flex items-center">
                                        <span className="mr-2 bg-green-100 rounded-full p-1">
                                            <Check className="h-4 w-4 text-green-600" />
                                        </span>
                                        <span className="text-[var(--body)]">
                                            <span className="font-medium">No Service Fee</span> on orders above $15
                                        </span>
                                    </li>
                                    <li className="flex items-center">
                                        <span className="mr-2 bg-green-100 rounded-full p-1">
                                            <Check className="h-4 w-4 text-green-600" />
                                        </span>
                                        <span className="text-[var(--body)]">
                                            <span className="font-medium">Exclusive Deals</span> only for Pro members
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4">
                        <SiteButton
                            text="Explore Restaurants"
                            variant="filled"
                            onClick={() => router.push("/")}
                            fullWidth
                        />
                        <SiteButton
                            text="View Profile"
                            variant="outlined"
                            onClick={() => router.push("/profile")}
                            fullWidth
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}