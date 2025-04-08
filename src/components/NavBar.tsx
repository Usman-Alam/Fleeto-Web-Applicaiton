"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import SiteButton from "./SiteButton";
import Logo from "./Logo";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isHidden, setIsHidden] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const lastScrollY = useRef(0);
    const router = useRouter();
    const pathname = usePathname();
    const sectionToScroll = useRef<string | null>(null);

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
    ];

    useEffect(() => {
        function handleScroll() {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY.current) {
                setIsHidden(true);
            } else {
                setIsHidden(false);
            }

            lastScrollY.current = currentScrollY;
        }

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

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

    useEffect(() => {
        if (isOpen) {
            document.body.style.height = "100%";
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.height = "";
            document.body.style.overflow = "";
        }
    }, [isOpen]);

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
                    <div className="flex flex-row items-center gap-[10px]">
                        <SiteButton text="Login" variant="outlined" href="/login" />
                        <SiteButton text="Signup" variant="filled" href="/signup" />
                    </div>
                </div>
                <button
                    className="lg:hidden focus:outline-none w-[40px] h-[40px]"
                    onClick={() => setIsOpen(true)}
                >
                    ☰
                </button>
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
                    <div className="flex flex-col items-stretch gap-[20px] mt-auto">
                        <SiteButton text="Login" variant="outlined" href="/login" onClick={() => { setIsOpen(false) }} />
                        <SiteButton text="Signup" variant="filled" href="/signup" onClick={() => { setIsOpen(false) }} />
                    </div>
                </div>
            )}
        </nav>
    );
}
