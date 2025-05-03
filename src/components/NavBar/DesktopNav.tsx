"use client";

import { useRef } from "react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface DesktopNavProps {
    pathname: string;
    router: AppRouterInstance;
}

export default function DesktopNav({ pathname, router }: DesktopNavProps) {
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
            router.push("/");
            setTimeout(() => {
                scrollToSection(sectionId);
                sectionToScroll.current = null;
            }, 500);
        }
    };

    const navLinks = [
        { name: "Shops", href: "#shops", onClick: () => handleNavigation("#shops") },
        { name: "FAQs", href: "#faqs", onClick: () => handleNavigation("#faqs") },
        { name: "Ask Gordon", href: "/chatbot", onClick: () => router.push("/chatbot") }
    ];

    return (
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
    );
}