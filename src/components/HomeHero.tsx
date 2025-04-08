"use client";

import Image from "next/image";
import SiteButton from "./SiteButton";
import hero_image from "@public/hero_image.png";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export default function HomeHero() {
    const router = useRouter();
    const pathname = usePathname();
    const shouldScrollRef = useRef(false);

    // Function to scroll to shops section
    const scrollToShops = () => {
        const shopsElement = document.getElementById("shops");
        if (shopsElement) {
            shopsElement.scrollIntoView({ behavior: "smooth" });
        }
    };

    const handleOrderNowClick = () => {
        // Always scroll to shops section, regardless of login status
        if (pathname === "/") {
            scrollToShops();
        } else {
            shouldScrollRef.current = true;
            router.push("/");
        }
    };

    // Effect to handle scrolling after navigation
    useEffect(() => {
        if (shouldScrollRef.current && pathname === "/") {
            // Small delay to ensure the DOM is ready
            setTimeout(scrollToShops, 100);
            shouldScrollRef.current = false;
        }
    }, [pathname]);

    return (
        <section className="w-[var(--section-width)] mt-[var(--page-top-padding)] flex flex-row items-center justify-between">
            <div className="flex flex-col items-start w-[500px] gap-[48px]">
                <div className="flex flex-col items-start w-full gap-[16px]">
                    <h1>
                        Welcome to <span className="text-[var(--accent)]">Fleeto</span>
                    </h1>
                    <p>
                        Your one-stop platform for food, grocery, and medicine. Order from your favorite campus vendors, track deliveries in real time, and enjoy exclusive student deals - All in one place!
                    </p>
                </div>
                <SiteButton
                    text="Order Now"
                    variant="filled"
                    onClick={handleOrderNowClick}
                />
            </div>

            <Image
                src={hero_image}
                alt="Fleeto Logo"
                className="object-contain aspect-[475/445] w-[38%]"
            />
        </section>
    );
}
