"use client";

import { forwardRef } from "react";
import Image from "next/image";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import SiteButton from "@components/SiteButton";
import { User, useAuth } from "@contexts/AuthContext";
import { Coins } from "lucide-react";

interface ProfileDropdownProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    logout: () => Promise<void>;
    router: AppRouterInstance;
}

const ProfileDropdown = forwardRef<HTMLDivElement, ProfileDropdownProps>(
    function ProfileDropdown({ isOpen, setIsOpen, logout, router }, ref) {
        // Get user directly from context
        const { user } = useAuth();

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
                    <div className="absolute top-[50px] right-0 bg-white shadow-lg p-4 rounded-md w-[200px] z-50">
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