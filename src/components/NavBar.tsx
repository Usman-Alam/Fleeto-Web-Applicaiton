"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import SiteButton from "./SiteButton";
import Logo from "./Logo";
import Image from "next/image";
import { useCart } from "@contexts/CartContext";
import { useAuth } from "@contexts/AuthContext";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isHidden, setIsHidden] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const { user, isAuthenticated, logout } = useAuth();
    const { cartItems, updateQuantity } = useCart();

    const menuRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);
    const cartRef = useRef<HTMLDivElement>(null);
    const lastScrollY = useRef(0);
    const router = useRouter();
    const pathname = usePathname();
    const sectionToScroll = useRef<string | null>(null);

    const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    const handleLogin = () => {
        router.push("/login");
    };

    const handleSignup = () => {
        router.push("/signup");
    };

    const scrollToSection = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    };

    const handleNavigation = (href: string) => {
        const sectionId = href.substring(1);

        if (pathname === "/") {
            scrollToSection(sectionId);
        } else {
            sectionToScroll.current = sectionId;
            (async () => {
                await router.push("/");
                scrollToSection(sectionId);
            })();
        }
    };

    useEffect(() => {
        if (sectionToScroll.current) {
            scrollToSection(sectionToScroll.current);
            sectionToScroll.current = null;
        }
    }, [pathname]);

    const navLinks = [
        { name: "Shops", href: "#shops", onClick: () => handleNavigation("#shops") },
        { name: "FAQs", href: "#faqs", onClick: () => handleNavigation("#faqs") },
        { name: "Ask Gordon", href: "/chatbot", onClick: () => router.push("/chatbot") }
    ];

    useEffect(() => {
        function handleScroll() {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY.current) {
                setIsHidden(true);
            } else {
                setIsHidden(false);
            }

            setIsProfileOpen(false);
            setIsCartOpen(false);

            lastScrollY.current = currentScrollY;
        }
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node) &&
                isOpen
            ) {
                setIsOpen(false);
            }

            if (
                profileRef.current &&
                !profileRef.current.contains(event.target as Node) &&
                isProfileOpen
            ) {
                setIsProfileOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, isProfileOpen, isCartOpen]);

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
    }, [isOpen]);

    useEffect(() => {
        if (cartItemCount > 0) {
            setIsHidden(false);
        }
    }, [cartItems, cartItemCount]);

    const handleUpdateQuantity = (id: string, newQuantity: number, e?: React.MouseEvent) => {
        e?.preventDefault();
        e?.stopPropagation();
        updateQuantity(id, newQuantity);
    };

    const totalPrice = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    return (
        <nav
            className={`fixed top-0 left-0 w-full z-[100] flex flex-row justify-center items-center py-[10px] transition-transform duration-300 ease-out 
                ${isHidden ? "-translate-y-full" : "translate-y-0"}`}
        >
            <div
                className="flex flex-row justify-between items-center w-full md:w-[calc(var(--section-width)+60px)] h-auto md:max-w-[calc(var(--section-max-width)+60px)] px-[5%] md:px-[30px] py-[20px] bg-[var(--white)] rounded-full"
                style={{ boxShadow: "0px 1px 10px var(--shadow)" }}
            >
                <Logo />
                <div className="hidden lg:flex flex-row items-center gap-[60px]">
                    <div className="flex flex-row items-center gap-[20px]">
                        {navLinks.map((link) => (
                            <button
                                key={link.href}
                                onClick={link.onClick}
                                className="flex flex-col justify-center items-start gap-[2px] text-[var(--body)] text-[20px]"
                            >
                                {link.name}
                                <div className="h-[2px] w-0 bg-[var(--accent)]"></div>
                            </button>
                        ))}
                    </div>

                    <div className="flex flex-row items-center gap-[15px]">
                        {isAuthenticated && (
                            <div className="relative" ref={cartRef}>
                                <button
                                    className="p-1 rounded-full"
                                    onClick={() => setIsCartOpen(!isCartOpen)}
                                >
                                    <div className="relative w-[24px] h-[24px]">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>

                                        {cartItemCount > 0 && (
                                            <div className="absolute -bottom-1 -right-1 bg-[var(--accent)] text-white text-[10px] font-bold rounded-full w-[16px] h-[16px] flex items-center justify-center">
                                                {cartItemCount > 9 ? '9+' : cartItemCount}
                                            </div>
                                        )}
                                    </div>
                                </button>

                                {isCartOpen && (
                                    <div className="absolute top-[40px] right-0 bg-white shadow-lg rounded-md w-[320px] z-50 py-3 px-4">
                                        <h5 className="text-[18px] font-medium mb-3">Your Cart</h5>

                                        {cartItems.length === 0 ? (
                                            <p className="text-center text-gray-500 py-4">Your cart is empty</p>
                                        ) : (
                                            <>
                                                <div className="max-h-[300px] overflow-y-auto">
                                                    {cartItems.map((item, index) => (
                                                        <div key={item.id} className="flex items-center gap-3 py-3 border-b border-gray-100">
                                                            <div className="text-gray-500 text-sm">{index + 1}.</div>
                                                            <div className="relative w-[40px] h-[40px] rounded-md overflow-hidden">
                                                                <Image
                                                                    src={item.image}
                                                                    alt={item.name}
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="font-medium">{item.name}</div>
                                                                <div className="text-gray-600 text-sm">${item.price.toFixed(2)}</div>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center"
                                                                    data-cart-control="true"
                                                                    onClick={(e) => {
                                                                        e?.preventDefault();
                                                                        e.stopPropagation();
                                                                        handleUpdateQuantity(item.id, item.quantity - 1, e);
                                                                    }}
                                                                >
                                                                    -
                                                                </button>
                                                                <span>{item.quantity}</span>
                                                                <button
                                                                    className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center"
                                                                    data-cart-control="true"
                                                                    onClick={(e) => {
                                                                        e?.preventDefault();
                                                                        e.stopPropagation();
                                                                        handleUpdateQuantity(item.id, item.quantity + 1, e);
                                                                    }}
                                                                >
                                                                    +
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="mt-3 pt-3 border-t border-gray-200">
                                                    <div className="flex justify-between mb-3">
                                                        <span className="font-medium">Total:</span>
                                                        <span className="font-bold">${totalPrice.toFixed(2)}</span>
                                                    </div>
                                                    <SiteButton
                                                        text={cartItems.length > 0 ? "Proceed to Checkout" : "Browse Shops"}
                                                        variant="filled"
                                                        fullWidth
                                                        data-cart-proceed="true"
                                                        onClick={() => {
                                                            if (cartItems.length > 0) {
                                                                router.push("/checkout");
                                                            } else {
                                                                if (pathname === "/") {
                                                                    const shopsElement = document.getElementById("shops");
                                                                    if (shopsElement) {
                                                                        shopsElement.scrollIntoView({ behavior: "smooth" });
                                                                    }
                                                                } else {
                                                                    router.push("/#shops");
                                                                }
                                                            }
                                                            setIsCartOpen(false);
                                                        }}
                                                    />
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {!isAuthenticated ? (
                            <>
                                <SiteButton text="Login" variant="outlined" onClick={handleLogin} />
                                <SiteButton text="Signup" variant="filled" onClick={handleSignup} />
                            </>
                        ) : (
                            <div className="relative" ref={profileRef}>
                                <Image
                                    src={user?.image || "/no_profile.png"}
                                    alt={user?.name || "User"}
                                    width={40}
                                    height={40}
                                    className="rounded-full cursor-pointer"
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                />

                                {isProfileOpen && (
                                    <div className="absolute top-[50px] right-0 bg-white shadow-lg p-4 rounded-md w-[200px] z-50">
                                        <h5 className="text-[16px] font-medium">{user?.name || "User"}</h5>
                                        <p className="text-[14px] text-gray-500 mb-3">{user?.email || ""}</p>
                                        <SiteButton
                                            text="Logout"
                                            variant="outlined"
                                            onClick={async () => {
                                                setIsProfileOpen(false);
                                                await logout();
                                                router.push("/login");
                                            }}
                                            fullWidth
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:hidden flex items-center gap-3">
                    {isAuthenticated && (
                        <div className="relative">
                            <button
                                className="p-1 rounded-full"
                                onClick={() => setIsCartOpen(!isCartOpen)}
                            >
                                <div className="relative w-[24px] h-[24px]">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>

                                    {cartItemCount > 0 && (
                                        <div className="absolute -bottom-1 -right-1 bg-[var(--accent)] text-white text-[10px] font-bold rounded-full w-[16px] h-[16px] flex items-center justify-center">
                                            {cartItemCount > 9 ? '9+' : cartItemCount}
                                        </div>
                                    )}
                                </div>
                            </button>
                        </div>
                    )}

                    <button
                        className="focus:outline-none w-[40px] h-[40px]"
                        onClick={() => setIsOpen(true)}
                    >
                        ☰
                    </button>
                </div>
            </div>

            {isOpen && (
                <div
                    ref={menuRef}
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
                                onClick={() => {
                                    setIsOpen(false);
                                    link.onClick?.();
                                }}
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
                                onClick={() => {
                                    setIsOpen(false);
                                    handleLogin();
                                }}
                            />
                            <SiteButton
                                text="Signup"
                                variant="filled"
                                onClick={() => {
                                    setIsOpen(false);
                                    handleSignup();
                                }}
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col items-start gap-[10px] mt-auto">
                            <div className="flex items-center gap-[10px]">
                                <Image
                                    src={user?.image || "/default-avatar.png"}
                                    alt={user?.name || "User"}
                                    width={50}
                                    height={50}
                                    className="rounded-full"
                                />
                                <div>
                                    <h5 className="text-[16px] font-medium">{user?.name || "User"}</h5>
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
            )}

            {isCartOpen && isAuthenticated && (
                <div
                    ref={cartRef}
                    className="lg:hidden fixed top-[70px] right-4 left-4 bg-white shadow-lg rounded-md z-50 py-3 px-4 max-h-[80vh] overflow-auto"
                >
                    <h5 className="text-[18px] font-medium mb-3">Your Cart</h5>

                    {cartItems.length === 0 ? (
                        <p className="text-center text-gray-500 py-4">Your cart is empty</p>
                    ) : (
                        <>
                            <div>
                                {cartItems.map((item, index) => (
                                    <div key={item.id} className="flex items-center gap-3 py-3 border-b border-gray-100">
                                        <div className="text-gray-500 text-sm">{index + 1}.</div>
                                        <div className="relative w-[40px] h-[40px] rounded-md overflow-hidden">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-medium">{item.name}</div>
                                            <div className="text-gray-600 text-sm">${item.price.toFixed(2)}</div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center"
                                                data-cart-control="true"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleUpdateQuantity(item.id, item.quantity - 1, e);
                                                }}
                                            >
                                                -
                                            </button>
                                            <span>{item.quantity}</span>
                                            <button
                                                className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center"
                                                data-cart-control="true"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleUpdateQuantity(item.id, item.quantity + 1, e);
                                                }}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-3 pt-3 border-t border-gray-200">
                                <div className="flex justify-between mb-3">
                                    <span className="font-medium">Total:</span>
                                    <span className="font-bold">${totalPrice.toFixed(2)}</span>
                                </div>
                                <SiteButton
                                    text={cartItems.length > 0 ? "Proceed to Checkout" : "Browse Shops"}
                                    variant="filled"
                                    fullWidth
                                    data-cart-proceed="true"
                                    onClick={() => {
                                        if (cartItems.length > 0) {
                                            router.push("/checkout");
                                        } else {
                                            if (pathname === "/") {
                                                const shopsElement = document.getElementById("shops");
                                                if (shopsElement) {
                                                    shopsElement.scrollIntoView({ behavior: "smooth" });
                                                }
                                            } else {
                                                router.push("/#shops");
                                            }
                                        }
                                        setIsCartOpen(false);
                                    }}
                                />
                            </div>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
}
