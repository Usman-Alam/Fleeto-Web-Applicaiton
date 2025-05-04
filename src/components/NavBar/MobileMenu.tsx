"use client";

import { forwardRef } from "react";
import Image from "next/image";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Logo from "@components/Logo";
import SiteButton from "@components/SiteButton";
import { User } from "@contexts/AuthContext";

interface MobileMenuProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    user: User | null;
    isAuthenticated: boolean;
    logout: () => Promise<void>;
    router: AppRouterInstance;
}

const MobileMenu = forwardRef<HTMLDivElement, MobileMenuProps>(
    function MobileMenu({ isOpen, setIsOpen, user, isAuthenticated, logout, router }, ref) {
        console.log(isOpen)
        const handleLogin = () => {
            setIsOpen(false);
            router.push("/login");
        };

        const handleSignup = () => {
            setIsOpen(false);
            router.push("/signup");
        };

        const navLinks = [
            {
                name: "Shops", href: "#shops", onClick: () => {
                    setIsOpen(false);
                    router.push(router.pathname === "/" ? "/#shops" : "/");
                }
            },
            {
                name: "FAQs", href: "#faqs", onClick: () => {
                    setIsOpen(false);
                    router.push(router.pathname === "/" ? "/#faqs" : "/");
                }
            },
            {
                name: "Ask Gordon", href: "/chatbot", onClick: () => {
                    setIsOpen(false);
                    router.push("/chatbot");
                }
            }
        ];

        return (
            <div
                ref={ref}
                className="bg-white absolute w-[80%] h-screen right-0 top-0 flex flex-col justify-start pb-[5vh] px-[5%]"
                style={{ boxShadow: "0px 1px 10px var(--shadow)" }}
            >
                <div className="flex flex-row items-center justify-between h-[100px]">
                    <Logo />
                    <button
                        className="focus:outline-none w-[40px] h-[40px]"
                        onClick={() => setIsOpen(false)}
                    >
                        ✖
                    </button>
                </div>

                <div className="flex flex-col items-stretch gap-[20px] pt-[60px]">
                    {navLinks.map((link) => (
                        <button
                            key={link.href}
                            onClick={link.onClick}
                            className="text-[var(--body)] text-[20px] text-left"
                        >
                            {link.name}
                        </button>
                    ))}
                </div>

                {!isAuthenticated ? (
                    <div className="flex flex-col items-stretch gap-[20px] mt-auto">
                        <SiteButton
                            text="Login"
                            variant="outlined"
                            onClick={handleLogin}
                        />
                        <SiteButton
                            text="Signup"
                            variant="filled"
                            onClick={handleSignup}
                        />
                    </div>
                ) : (
                    <div className="flex flex-col items-start gap-[10px] mt-auto">
                        <div
                            className="flex items-center gap-[10px] cursor-pointer hover:text-[var(--accent)] transition-colors w-full"
                            onClick={() => {
                                setIsOpen(false);
                                router.push("/profile");
                            }}
                        >
                            <Image
                                src={user?.image || "/default-avatar.png"}
                                alt={user?.username || "User"}
                                width={50}
                                height={50}
                                className="rounded-full"
                            />
                            <div>
                                <h5 className="text-[16px] font-medium">{user?.username || "User"}</h5>
                                <p className="text-[14px] text-gray-500">{user?.email || ""}</p>
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

export default MobileMenu;