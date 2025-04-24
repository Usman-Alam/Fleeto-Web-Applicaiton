"use client";

import { forwardRef, useEffect, useState } from "react";
import Image from "next/image";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import SiteButton from "@components/SiteButton";
import { Coins, Crown, Star } from "lucide-react";

interface UserData {
    name: string;
    email: string;
    isPro: boolean;
    coins: number;
}

interface ProfileDropdownProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    logout: () => void;
    router: AppRouterInstance;
}

const ProfileDropdown = forwardRef<HTMLDivElement, ProfileDropdownProps>(
    function ProfileDropdown({ isOpen, setIsOpen, logout, router }, ref) {
        const [userData, setUserData] = useState<UserData>({
            name: '',
            email: '',
            isPro: false,
            coins: 0
        });

        useEffect(() => {
            // Get user data from localStorage
            const name = localStorage.getItem('name') || '';
            const email = localStorage.getItem('email') || '';
            const isPro = localStorage.getItem('isPro') === 'true';
            const coins = Number(localStorage.getItem('coins')) || 0;
            // const isPro = true
            setUserData({ name, email, isPro, coins });
        }, []);

        return (
            <div className="relative" ref={ref}>
                <Image
                    src="/no_profile.png"
                    alt={userData.name || "User"}
                    width={40}
                    height={40}
                    className="rounded-full cursor-pointer"
                    onClick={() => setIsOpen(!isOpen)}
                />

                {isOpen && (
                    <div className="absolute top-[50px] right-0 bg-white shadow-lg p-4 rounded-md w-[320px] z-50">
                        <div
                            onClick={() => {
                                setIsOpen(false);
                                router.push("/profile");
                            }}
                            className="cursor-pointer hover:text-[var(--accent)] transition-colors"
                        >
                            <h5 className="text-[16px] font-medium flex items-center">
                                {userData.name || "User"}
                                {userData.isPro && (
                                    <span className="ml-2 px-2 py-0.5 text-[10px] bg-gradient-to-r from-[#F1C40F] to-[#D4AC0D] text-white rounded-full font-bold">
                                        PRO
                                    </span>
                                )}
                                <span className="ml-1 text-lg text-[var(--accent)]">↗</span>
                            </h5>
                            <p className="text-[14px] text-gray-500">{userData.email}</p>
                        </div>

                        {/* Fleeto Coins Balance */}
                        <div className="py-3 px-2 my-3 bg-[var(--bg2)] rounded-md border border-[var(--shadow)] flex items-center gap-2">
                            <Coins className="text-[var(--accent)]" size={18} />
                            <div>
                                <p className="text-[12px] text-[var(--body)] font-medium">Fleeto Coins</p>
                                <p className="text-[16px] font-semibold text-[var(--accent)]">
                                    {userData.coins.toLocaleString()}
                                </p>
                            </div>
                        </div>

                        {/* Updated Pro Status/Button */}
                        {userData.isPro ? (
                            <div className="py-3 px-2 my-3 bg-gradient-to-r from-[#F1C40F] to-[#D4AC0D] rounded-md border border-[#F1C40F] flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Crown className="text-white" size={18} />
                                    <div>
                                        <div className="flex items-center gap-1">
                                            <p className="text-[14px] text-white font-medium">Fleeto Pro</p>
                                            <Star className="text-white" size={12} fill="white" />
                                        </div>
                                        <p className="text-[10px] text-white opacity-80">Premium Member</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <SiteButton
                                text="Get Fleeto Pro"
                                variant="outlined"
                                onClick={() => {
                                    setIsOpen(false);
                                    router.push("/fleeto-pro");
                                }}
                                fullWidth
                                className="my-3"
                            />
                        )}

                        <SiteButton
                            text="Logout"
                            variant="filled"
                            onClick={() => {
                                setIsOpen(false);
                                logout();
                                router.push("/login");
                            }}
                            fullWidth
                        />
                    </div>
                )}
            </div>
        );
    }
);

export default ProfileDropdown;