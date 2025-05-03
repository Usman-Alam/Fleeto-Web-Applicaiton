"use client";

import Image from "next/image";
import shop_benefits from "@public/benefits.svg";

export default function BecomeAPartner() {
    return (
        <section className="w-[var(--section-width)] max-w-[var(--section-max-width)] my-[80px] flex flex-col items-center">
            <h2 className="text-3xl font-bold mb-[48px] text-center">
                Become a <span className="text-[var(--accent)]">Partner</span>
            </h2>

            <div className="flex flex-col md:flex-row items-center w-full gap-[48px]">
                {/* Content side */}
                <div className="flex flex-col w-full md:w-1/2 gap-[24px]">
                    <h3 className="text-2xl font-semibold">Grow your business with Fleeto</h3>

                    <ul className="flex flex-col gap-[16px]">
                        <li className="flex gap-[12px] items-center">
                            <div className="rounded-full bg-[var(--accent)] text-white w-[32px] h-[32px] flex items-center justify-center flex-shrink-0">
                                1
                            </div>
                            <p>
                                <span className="font-semibold">Expand Your Reach</span> - Access a large student customer base looking for convenient ordering options
                            </p>
                        </li>
                        <li className="flex gap-[12px] items-center">
                            <div className="rounded-full bg-[var(--accent)] text-white w-[32px] h-[32px] flex items-center justify-center flex-shrink-0">
                                2
                            </div>
                            <p>
                                <span className="font-semibold">Easy Management</span> - Our intuitive dashboard makes managing your menu, orders, and inventory simple
                            </p>
                        </li>
                        <li className="flex gap-[12px] items-center">
                            <div className="rounded-full bg-[var(--accent)] text-white w-[32px] h-[32px] flex items-center justify-center flex-shrink-0">
                                3
                            </div>
                            <p>
                                <span className="font-semibold">Increase Revenue</span> - Shops on our platform see an average of 30% increase in monthly orders
                            </p>
                        </li>
                        <li className="flex gap-[12px] items-center">
                            <div className="rounded-full bg-[var(--accent)] text-white w-[32px] h-[32px] flex items-center justify-center flex-shrink-0">
                                4
                            </div>
                            <p>
                                <span className="font-semibold">Real-time Analytics</span> - Get valuable insights about your sales, popular items, and customer preferences
                            </p>
                        </li>
                    </ul>
                </div>

                {/* Image side */}
                <div className="w-full md:w-1/2">
                    <Image
                        src={shop_benefits}
                        alt="Shop benefits"
                        className="object-contain w-full"
                        priority
                    />
                </div>
            </div>
        </section>
    );
}