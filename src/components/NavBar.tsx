"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import SiteButton from "./SiteButton";
import Logo from "./Logo";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const navLinks = [
        { name: "Shops", href: "#shops" },
        { name: "FAQs", href: "#faqs" }
    ];

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    return (
        <nav className="fixed top-0 left-0 w-screen h-[100px] lg:h-[120px] z-[100] flex flex-row justify-center items-center py-[10px]">
            <div
                className="flex flex-row justify-between items-center w-full md:w-[calc(var(--section-width)+60px)] h-auto md:max-w-[calc(var(--section-max-width)+60px)] px-[5%] md:px-[30px] py-[20px] bg-[var(--white)] rounded-full"
                style={{ boxShadow: "0px 1px 10px var(--shadow)", }}
            >
                <Logo />
                {/* Desktop Menu */}
                <div className="hidden lg:flex flex-row items-center gap-[60px]">
                    <div className="flex flex-row items-center gap-[20px]">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="flex flex-col justify-center items-start gap-[2px] text-[var(--body)]"
                            >
                                {link.name}
                                <div className="h-[2px] w-0 bg-[var(--accent)]"></div>
                            </Link>
                        ))}
                    </div>
                    <div className="flex flex-row items-center gap-[10px]">
                        <SiteButton text="Login" variant="outlined" href="/login" />
                        <SiteButton text="Signup" variant="filled" href="/signup" />
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="lg:hidden focus:outline-none w-[40px] h-[40px]"
                    onClick={() => setIsOpen(true)}
                >
                    ☰
                </button>
            </div>

            {/* Mobile Menu */}
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
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className="text-[var(--body)]"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                    <div className="flex flex-col items-stretch gap-[20px] mt-auto">
                        <SiteButton text="Login" variant="outlined" href="/login" onClick={() => setIsOpen(false)} />
                        <SiteButton text="Signup" variant="filled" href="/signup" onClick={() => setIsOpen(false)} />
                    </div>
                </div>
            )}
        </nav>
    );
}
