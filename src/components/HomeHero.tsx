"use client";

import Image from "next/image";
import SiteButton from "@components/SiteButton";
import hero_image from "@public/hero_image.png";
import { useRouter } from "next/navigation";
import { useAuth } from "@contexts/AuthContext";

export default function HomeHero() {
    const router = useRouter();
    const { isAuthenticated } = useAuth();

    const handleOrderNowClick = () => {
        if (!isAuthenticated) {
            // Redirect to login if user is not authenticated
            router.push("/login");
        } else {
            // Scroll to shops section if authenticated
            const shopsElement = document.getElementById("shops");
            if (shopsElement) {
                shopsElement.scrollIntoView({ behavior: "smooth" });
            }
        }
    };

    return (
        <section className="w-[var(--section-width)] max-w-[var(--section-max-width)] mt-[var(--page-top-padding)] flex flex-row items-center justify-between">
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
