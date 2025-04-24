"use client";

import { forwardRef } from "react";
import Image from "next/image";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import SiteButton from "@components/SiteButton";
import { User } from "@contexts/AuthContext";
import { Coins, Crown } from "lucide-react";

interface ProfileDropdownProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    user: User | null;
    logout: () => Promise<void>;
    router: AppRouterInstance;
}

const ProfileDropdown = forwardRef<HTMLDivElement, ProfileDropdownProps>(
    function ProfileDropdown({ isOpen, setIsOpen, user, logout, router }, ref) {
        return (
            <div className="relative" ref={ref}>
                <Image
                    src={user?.image || "/no_profile.png"}
                    alt={user?.username || "User"}
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
                                {user?.username || "User"}
                                <span className="ml-1 text-lg text-[var(--accent)]">↗</span>
                            </h5>
                            <p className="text-[14px] text-gray-500">{user?.email || ""}</p>
                        </div>

                        {/* Fleeto Coins Balance */}
                        <div className="py-3 px-2 my-3 bg-[var(--bg2)] rounded-md border border-[var(--shadow)] flex items-center gap-2">
                            <Coins className="text-[var(--accent)]" size={18} />
                            <div>
                                <p className="text-[12px] text-[var(--body)] font-medium">Fleeto Coins</p>
                                <p className="text-[16px] font-semibold text-[var(--accent)]">
                                    {user?.fleetoCoins?.toLocaleString() || 0}
                                </p>
                            </div>
                        </div>

                        {/* Fleeto Pro Status/Button */}
                        {user?.isPro ? (
                            <div className="py-3 px-2 my-3 bg-gradient-to-r from-[#F1C40F] to-[#D4AC0D] rounded-md border border-[#F1C40F] flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Crown className="text-white" size={18} />
                                    <div>
                                        <p className="text-[12px] text-white font-medium">Fleeto Pro</p>
                                        <p className="text-[10px] text-white">
                                            Expires: {new Date(user.proExpiryDate || "").toLocaleDateString()}
                                        </p>
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
                            variant="outlined"
                            onClick={async () => {
                                setIsOpen(false);
                                await logout();
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