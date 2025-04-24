"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@contexts/AuthContext";
import { Crown } from "lucide-react";
import SiteButton from "@components/SiteButton";

export default function FleetoProPaymentPage() {
    const router = useRouter();
    // const { user } = useAuth();
    const user = localStorage.getItem('name');
    const email = localStorage.getItem('email');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [testSuccess, setTestSuccess] = useState(false);

    // First test if the server is reachable - same as regular checkout
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

        const initiateCheckout = async () => {
            if (!user) {
                router.push("/login");
                return;
            }

            try {
                console.log("Starting Fleeto Pro payment process");
                console.log("User data:", user); // Add this to debug

                // Check if user data exists and has necessary fields
                if (!user || !email) {
                    throw new Error("User information incomplete. Please try logging in again.");
                }

                // Use more flexible field access with fallbacks
                const response = await fetch("http://localhost:4173/fleeto-pro-subscription", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userId: "12",
                        userEmail: email,
                        userName: user
                    }),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || "Payment initialization failed");
                }

                console.log("Received response:", data);

                if (data.url) {
                    console.log("Redirecting to:", data.url);
                    
                    try {
                        // First update the pro status
                        const updateResponse = await fetch('/api/updatePro', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ email }),
                        });

                        if (!updateResponse.ok) {
                            throw new Error('Failed to update pro status');
                        }

                        // If update successful, update localStorage and redirect
                        localStorage.setItem('isPro', 'true');
                        window.location.href = data.url;
                        
                    } catch (error) {
                        console.error('Error updating pro status:', error);
                        setError('Failed to activate Pro status. Please contact support.');
                        setIsLoading(false);
                    }
                } else {
                    throw new Error("No redirect URL received from payment server");
                }
            } catch (error) {
                console.error("Payment error:", error);
                setError(`Payment failed: ${error.message || "Unknown error"}`);
                setIsLoading(false);
            }
        };

        initiateCheckout();
    }, [user, router, testSuccess]);

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

                            {error.includes("server") ? (
                                <div className="bg-yellow-50 p-4 mb-4 rounded-md text-left">
                                    <h3 className="font-medium text-yellow-800 mb-1">Troubleshooting:</h3>
                                    <ul className="list-disc text-sm text-yellow-700 pl-5">
                                        <li>Make sure the Stripe server is running: <code className="bg-gray-100 px-1 rounded">node server/stripeServer.js</code></li>
                                        <li>Check that it's running on port 4173</li>
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
                                    text="Return to Fleeto Pro"
                                    variant="outlined"
                                    onClick={() => router.push('/fleeto-pro')}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}