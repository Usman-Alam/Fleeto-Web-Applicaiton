"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Logo from "@components/Logo";
import { useCart } from "@contexts/CartContext";
import SiteButton from "@components/SiteButton";
import DesktopNav from "@components/NavBar/DesktopNav";
import CartDropdown from "@components/NavBar/CartDropdown";
import ProfileDropdown from "@components/NavBar/ProfileDropdown";
import MobileMenu from "@components/NavBar/MobileMenu";
import MobileCart from "@components/NavBar/MobileCart";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isHidden, setIsHidden] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isDesktopCartOpen, setIsDesktopCartOpen] = useState(false);
    const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    const { cartItems } = useCart();

    const menuRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);
    const cartRef = useRef<HTMLDivElement>(null);
    const lastScrollY = useRef(0);
    const router = useRouter();
    const pathname = usePathname();

    const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            const email = localStorage.getItem('email');
            const name = localStorage.getItem('name');
            const isPro = localStorage.getItem('isPro') === 'true';
            const coins = Number(localStorage.getItem('coins')) || 0;

            setIsAuthenticated(!!token);
            if (token && email && name) {
                setUser({
                    email,
                    name,
                    isPro,
                    coins
                });
            } else {
                setUser(null);
            }
        };

        checkAuth();

        window.addEventListener('storage', checkAuth);
        return () => window.removeEventListener('storage', checkAuth);
    }, []);

    const logout = () => {
        localStorage.clear(); 
        setIsAuthenticated(false);
        setUser(null);

        router.push('/');
    };

    useEffect(() => {
        function handleScroll() {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY.current) {
                setIsHidden(true);
            } else {
                setIsHidden(false);
            }

            setIsProfileOpen(false);
            setIsDesktopCartOpen(false);
            setIsMobileCartOpen(false);

            lastScrollY.current = currentScrollY;
        }
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node) && isOpen) {
                setIsOpen(false);
            }

            if (profileRef.current && !profileRef.current.contains(event.target as Node) && isProfileOpen) {
                setIsProfileOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, isProfileOpen]);

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
    }, [isOpen]);

    useEffect(() => {
        if (cartItemCount > 0) {
            setIsHidden(false);
        }
    }, [cartItemCount]);

    const handleLogin = () => router.push("/login");
    const handleSignup = () => router.push("/signup");

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
                    <DesktopNav pathname={pathname} router={router} />

                    <div className="flex flex-row items-center gap-[15px]">
                        {isAuthenticated && (
                            <CartDropdown
                                isOpen={isDesktopCartOpen}
                                setIsOpen={setIsDesktopCartOpen}
                                ref={cartRef}
                            />
                        )}

                        {!isAuthenticated ? (
                            <>
                                <SiteButton text="Login" variant="outlined" onClick={handleLogin} />
                                <SiteButton text="Signup" variant="filled" onClick={handleSignup} />
                            </>
                        ) : (
                            <ProfileDropdown
                                isOpen={isProfileOpen}
                                setIsOpen={setIsProfileOpen}
                                logout={logout}
                                router={router}
                                ref={profileRef}
                                user={user}
                            />
                        )}
                    </div>
                </div>

                <div className="lg:hidden flex items-center gap-3">
                    {isAuthenticated && (
                        <button
                            className="p-1 rounded-full"
                            onClick={() => setIsMobileCartOpen(!isMobileCartOpen)}
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
                <MobileMenu
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    user={user}
                    isAuthenticated={isAuthenticated}
                    logout={logout}
                    router={router}
                    ref={menuRef}
                />
            )}

            {isMobileCartOpen && isAuthenticated && (
                <MobileCart
                    isOpen={isMobileCartOpen}
                    setIsOpen={setIsMobileCartOpen}
                    pathname={pathname}
                    router={router}
                />
            )}
        </nav>
    );
}
