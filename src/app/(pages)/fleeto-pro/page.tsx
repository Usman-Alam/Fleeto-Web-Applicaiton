"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@contexts/AuthContext";
import SiteButton from "@components/SiteButton";
import { Shield, Clock, CreditCard, Percent, Gift, Crown } from "lucide-react";

export default function FleetoProPage() {
    const router = useRouter();
    const { user } = useAuth();

    const handleSubscribe = async () => {
        router.push("/fleeto-pro/payment");
    };

    return (
        <div className="flex flex-col items-center w-full">
            <div className="w-[var(--section-width)] mt-[var(--page-top-padding)] mb-[30px]">
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-1">
                        <div className="bg-[var(--bg2)] rounded-[16px] p-6 mb-6 text-[var(--body)]">
                            <div className="flex items-center gap-3 mb-4">
                                <Crown size={32} className="text-[var(--accent)]" />
                                <h1 className="text-[32px] font-bold">Fleeto Pro</h1>
                            </div>
                            <p className="text-[18px] mb-6">
                                Elevate your food delivery experience with exclusive benefits designed for our most valued customers.
                            </p>
                            <div className="bg-white/20 rounded-lg p-4">
                                <p className="text-[22px] font-bold mb-1">$9.99/month</p>
                                <p className="text-[14px]">Cancel anytime. No commitment required.</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-[16px] p-6 mb-6" style={{ boxShadow: "0px 1px 10px var(--shadow)" }}>
                            <h2 className="text-[24px] font-bold mb-6 text-[var(--accent)]">Exclusive Benefits</h2>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="bg-[var(--bg2)] p-3 rounded-full">
                                        <Percent className="text-[var(--accent)]" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-[18px] font-bold mb-1">10% OFF on Every Order</h3>
                                        <p className="text-[var(--body)]">Automatic discount applied to all your orders, no minimum purchase required.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-[var(--bg2)] p-3 rounded-full">
                                        <Gift className="text-[var(--accent)]" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-[18px] font-bold mb-1">Welcome Bonus: 100 Fleeto Coins</h3>
                                        <p className="text-[var(--body)]">Get 100 FleetoCoins instantly credited to your account when you subscribe.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-[var(--bg2)] p-3 rounded-full">
                                        <Clock className="text-[var(--accent)]" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-[18px] font-bold mb-1">Priority Delivery</h3>
                                        <p className="text-[var(--body)]">Your orders get priority treatment for faster delivery times.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-[var(--bg2)] p-3 rounded-full">
                                        <CreditCard className="text-[var(--accent)]" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-[18px] font-bold mb-1">No Service Fee</h3>
                                        <p className="text-[var(--body)]">Service fee waived on all orders above $15.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-[var(--bg2)] p-3 rounded-full">
                                        <Shield className="text-[var(--accent)]" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-[18px] font-bold mb-1">Exclusive Deals & Offers</h3>
                                        <p className="text-[var(--body)]">Get access to special promotions and deals only available to Pro members.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1">
                        <div className="bg-white rounded-[16px] p-6 sticky top-[100px]" style={{ boxShadow: "0px 1px 10px var(--shadow)" }}>
                            <h2 className="text-[24px] font-bold mb-6">Ready to Go Pro?</h2>

                            {user?.isPro ? (
                                <div>
                                    <div className="bg-[var(--bg2)] p-6 rounded-lg mb-6 text-center">
                                        <Crown className="text-[var(--accent)] mx-auto mb-3" size={40} />
                                        <h3 className="text-[20px] font-bold text-[var(--accent)] mb-2">You&apos;re already a Pro!</h3>
                                        <p className="text-[var(--body)]">Your membership is active until:</p>
                                        <p className="font-bold text-[18px]">
                                            {new Date(user.proExpiryDate || "").toLocaleDateString()}
                                        </p>
                                    </div>

                                    <SiteButton
                                        text="Return to Home"
                                        variant="filled"
                                        onClick={() => router.push("/")}
                                        fullWidth
                                    />
                                </div>
                            ) : (
                                <div>
                                    <div className="mb-6 bg-[var(--bg2)] p-6 rounded-lg">
                                        <div className="flex justify-between items-center mb-4">
                                            <div>
                                                <h3 className="text-[22px] font-bold">Monthly Subscription</h3>
                                                <p className="text-[var(--body)]">Billed monthly</p>
                                            </div>
                                            <p className="text-[22px] font-bold text-[var(--accent)]">$9.99</p>
                                        </div>

                                        <ul className="mb-4 space-y-2">
                                            <li className="flex items-center">
                                                <span className="mr-2 text-green-500">✓</span>
                                                10% OFF on every order
                                            </li>
                                            <li className="flex items-center">
                                                <span className="mr-2 text-green-500">✓</span>
                                                100 FleetoCoins welcome bonus
                                            </li>
                                            <li className="flex items-center">
                                                <span className="mr-2 text-green-500">✓</span>
                                                Priority delivery
                                            </li>
                                            <li className="flex items-center">
                                                <span className="mr-2 text-green-500">✓</span>
                                                No service fee on orders above $15
                                            </li>
                                            <li className="flex items-center">
                                                <span className="mr-2 text-green-500">✓</span>
                                                Exclusive deals and offers
                                            </li>
                                        </ul>

                                        <p className="text-sm text-[var(--body)] mb-4">
                                            Cancel anytime. You&apos;ll continue to enjoy Pro benefits until the end of your billing period.
                                        </p>
                                    </div>

                                    <SiteButton
                                        text="Subscribe Now"
                                        variant="filled"
                                        onClick={handleSubscribe}
                                        fullWidth
                                    />

                                    <div className="flex items-center justify-center mt-4 text-sm text-[var(--body)]">
                                        <CreditCard size={16} className="mr-2" />
                                        Secure payment via Stripe
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}