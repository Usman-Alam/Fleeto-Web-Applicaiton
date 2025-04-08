"use client";

import { useState } from "react";
import Image from "next/image";
import SiteButton from "./SiteButton";

interface ShopData {
    title: string;
    desc: string;
    href: string;
    image: string;
    rating: number;
    orderCount: number;
    category: string;
    deliveryTime: string;
    deliveryType: string;
    slug: string; // Added slug property
}

interface ShopsSectionProps {
    icon: string;
    heading: string;
    data: ShopData[];
}

export default function ShopsSection({ icon, heading, data }: ShopsSectionProps) {
    const [visibleRows, setVisibleRows] = useState(1); // State to track visible rows
    const itemsPerRow = 3; // Number of items per row
    const visibleItems = visibleRows * itemsPerRow;

    const handleLoadMore = () => {
        setVisibleRows((prev) => prev + 1); // Increase the number of visible rows
    };

    return (
        <section className="w-[var(--section-width)] mt-[var(--section-top-padding)] flex flex-col items-start justify-top gap-[48px]">
            <div className="flex flex-row items-start justify-center gap-[10px]">
                <div className="relative w-[58px] aspect-[1]">
                    <Image
                        src={icon}
                        alt="Section Icon"
                        fill
                    />
                </div>
                <h2>{heading}</h2>
            </div>
            <div className="flex flex-col items-center w-full gap-[32px]">
                <div className="grid grid-cols-3 w-full gap-[40px]">
                    {data.slice(0, visibleItems).map((item) => (
                        <div
                            key={item.slug}
                            className="flex flex-col items-stretch gap-[20px] bg-[var(--bg2)] rounded-[16px]"
                            style={{ boxShadow: "0px 1px 10px var(--shadow)" }}
                        >
                            <div className="h-[220px] relative">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex flex-col gap-[20px] px-[16px] pt-[20px] pb-[30px]">
                                <div className="flex flex-col gap-[10px]">
                                    <div className="flex flex-col gap-[6px]">
                                        <div className="flex flex-row items-center justify-between gap-[4px]">
                                            <h6>{item.title}</h6>
                                            <div className="flex flex-row items-center gap-[4px] text-[14px]">
                                                <div className="relative w-[16px] aspect-[1]">
                                                    <Image
                                                        src="/star.svg"
                                                        alt="Star Icon"
                                                        fill
                                                    />
                                                </div>
                                                <p>{item.rating}</p>
                                                <p>
                                                    (<span>{item.orderCount}</span>+)
                                                </p>
                                            </div>
                                        </div>
                                        <p className="text-[16px]">{item.desc}</p>
                                    </div>
                                    <div className="flex flex-row items-start justify-between gap-[10px] text-[14px]">
                                        <div className="flex flex-row items-center gap-[4px]">
                                            <div className="relative w-[16px] aspect-[1]">
                                                <Image
                                                    src="/eat.svg"
                                                    alt="Category Icon"
                                                    fill
                                                />
                                            </div>
                                            <p>{item.category}</p>
                                        </div>
                                        <div className="flex flex-row items-center gap-[4px]">
                                            <div className="relative w-[16px] aspect-[1]">
                                                <Image
                                                    src="/clock.svg"
                                                    alt="Clock Icon"
                                                    fill
                                                />
                                            </div>
                                            <p>
                                                <span>{item.deliveryTime}</span> - <span>{Math.floor(5 + Number(item.deliveryTime))}</span> mins
                                            </p>
                                        </div>
                                        <div className="flex flex-row items-center gap-[4px]">
                                            <div className="relative w-[16px] aspect-[1]">
                                                <Image
                                                    src="/truck.svg"
                                                    alt="Truck Icon"
                                                    fill
                                                />
                                            </div>
                                            <p>{item.deliveryType}</p>
                                        </div>
                                    </div>
                                </div>
                                <SiteButton
                                    text="Order Now"
                                    variant="outlined"
                                    fullWidth
                                    href={`/${heading.toLowerCase()}/${item.slug}`} // Dynamic link using slug
                                />
                            </div>
                        </div>
                    ))}
                </div>
                {visibleItems < data.length && ( // Show "Load More" button only if there are more items to load
                    <SiteButton text="Load More" variant="filled" onClick={handleLoadMore} />
                )}
            </div>
        </section>
    );
}