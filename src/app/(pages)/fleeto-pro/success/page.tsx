"use client";

import { useRouter } from "next/navigation";
import { Crown, Check } from "lucide-react";
import SiteButton from "@components/SiteButton";

export default function PaymentSuccessPage() {
    const router = useRouter();

    // useEffect(() => {
    //     // Update isPro status in localStorage
    //     localStorage.setItem('isPro', 'true');
    // }, []);

    return (
        <div className="flex flex-col items-center w-full">
            <div className="w-[var(--section-width)] max-w-[var(--section-max-width)] mt-[var(--page-top-padding)] mb-[30px]">
                <div className="bg-white rounded-[16px] p-8" style={{ boxShadow: "0px 1px 10px var(--shadow)" }}>
                    {/* Success Icon */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                            <Check className="text-green-500" size={40} />
                        </div>
                    </div>

                    {/* Pro Badge */}
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <div className="p-2 bg-gradient-to-r from-[#F1C40F] to-[#D4AC0D] rounded-full">
                            <Crown className="text-white" size={24} />
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-[#F1C40F] to-[#D4AC0D] text-transparent bg-clip-text">
                            Fleeto Pro Activated
                        </span>
                    </div>

                    {/* Success Message */}
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold mb-4">Welcome to Fleeto Pro!</h1>
                        <p className="text-[var(--body)] mb-4">
                            Your subscription has been successfully activated. You now have access to all premium features.
                        </p>
                        <div className="bg-[var(--bg2)] p-4 rounded-lg">
                            <h3 className="font-semibold mb-2">Pro Benefits Include:</h3>
                            <ul className="text-[var(--body)] text-left space-y-2">
                                <li className="flex items-center">
                                    <Check className="text-[var(--accent)] mr-2" size={16} />
                                    Priority Order Processing
                                </li>
                                <li className="flex items-center">
                                    <Check className="text-[var(--accent)] mr-2" size={16} />
                                    Exclusive Discounts
                                </li>
                                <li className="flex items-center">
                                    <Check className="text-[var(--accent)] mr-2" size={16} />
                                    Double Fleeto Coins on Orders
                                </li>
                                <li className="flex items-center">
                                    <Check className="text-[var(--accent)] mr-2" size={16} />
                                    24/7 Premium Support
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex justify-center">
                        <SiteButton
                            text="Start Exploring Pro Features"
                            variant="filled"
                            onClick={() => router.push('/')}
                            className="px-8"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}