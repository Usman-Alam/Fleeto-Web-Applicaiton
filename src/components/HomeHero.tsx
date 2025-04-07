import Image from "next/image";
import SiteButton from "./SiteButton";
import hero_image from "@public/hero_image.png";

export default function HomeHero() {
    return (
        <section className="w-[var(--section-width)] mt-[var(--page-top-padding)] flex flex-row items-center justify-between">
            <div className="flex flex-col items-start w-[500px] gap-[48px]">
                <div className="flex flex-col items-start w-full gap-[16px]">
                    <h1>
                        Welcome to <span className="text-[var(--accent)]">Fleeto</span>
                    </h1>
                    <p>
                        Your one-stop platform for food, grocery and medicine. Order from your favorite campus vendors, track deliveries in real time and enjoy exclusive student deals - All in one place!
                    </p>
                </div>
                <SiteButton text="Order Now" variant="filled" href="/login" />
            </div>

            <Image
                src={hero_image}
                alt="Fleeto Logo"
                className="object-contain aspect-[475/445] w-[38%]"
            />
        </section>
    );
}
