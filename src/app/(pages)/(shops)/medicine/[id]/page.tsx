"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import SiteButton from "@components/SiteButton";
import { useCart } from "@contexts/CartContext";

interface PharmacyData {
  id: string;
  name: string;
  description: string;
  image: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: string;
  menu: PharmacyItem[]; // Changed from items to menu for consistency
}

interface PharmacyItem {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
}

export default function PharmacyPage() {
  const { id } = useParams() as { id: string };
  const [pharmacy, setPharmacy] = useState<PharmacyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchPharmacyData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/shopMenu?slug=${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch pharmacy data");
        }

        setPharmacy(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching pharmacy:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPharmacyData();
    }
  }, [id]);

  const handleAddToCart = (item: PharmacyItem) => {
    const numericPrice = parseFloat(item.price.replace("$", ""));
    addToCart({
      id: item.id,
      name: item.name,
      price: numericPrice,
      image: "/shops/meds.png",
    });
  };

  const filterSampleItems = (menuItems: PharmacyItem[]) => {
    return menuItems.filter(
      (item) =>
        !item.name.toLowerCase().includes("sample") &&
        !item.description.toLowerCase().includes("sample")
    );
  };

  if (loading) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center">
        <div className="text-xl">Loading pharmacy details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  if (!pharmacy) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center">
        <div className="text-xl">Pharmacy not found</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full">
      {/* Pharmacy Banner */}
      <div className="relative w-full h-[300px]">
        <Image
          src={pharmacy.image}
          alt={pharmacy.name}
          fill
          className="object-cover"
        />
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent p-4 text-white">
          <h1>
            <span className="text-[var(--white)]">{pharmacy.name}</span>
          </h1>
          <p className="text-[16px]">{pharmacy.description}</p>
          <div className="flex flex-row items-center gap-[10px] mt-[10px]">
            <div className="flex items-center gap-[5px]">
              <Image
                src="/star.svg"
                alt="Rating"
                width={16}
                height={16}
                className="object-contain"
              />
              <span>{pharmacy.rating}</span>
            </div>
            <span>•</span>
            <span>{pharmacy.deliveryTime}</span>
            <span>•</span>
            <span>{pharmacy.deliveryFee}</span>
          </div>
        </div>
      </div>

      {/* Medicine Items Section */}
      <div className="w-[var(--section-width)] mt-[20px] flex flex-col gap-[20px]">
        <h2 className="text-[20px] font-bold">Available Medicines</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px]">
          {pharmacy.menu &&
            filterSampleItems(pharmacy.menu).map((item) => (
              <div
                key={item.id}
                className="flex flex-col items-stretch gap-[10px] bg-[var(--bg2)] rounded-[16px] p-[16px]"
                style={{ boxShadow: "0px 1px 10px var(--shadow)" }}
              >
                <div className="relative w-full h-[150px]">
                  <Image
                    src={"/shops/meds.png"}
                    alt={item.name}
                    fill
                    className="object-cover rounded-[8px]"
                  />
                </div>
                <div className="flex flex-col gap-[10px]">
                  <h3 className="text-[18px] font-medium">{item.name}</h3>
                  <p className="text-[14px] text-gray-500">{item.description}</p>
                  <div className="flex flex-row items-center justify-between">
                    <span className="text-[16px] font-bold">{item.price}</span>
                    <SiteButton
                      text="Add to Cart"
                      variant="outlined"
                      onClick={() => handleAddToCart(item)}
                    />
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}