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
  items: PharmacyItem[];
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
  const [Pharmacy, setPharmacy] = useState<PharmacyData | null>(null);
  const { addToCart } = useCart();

  // Simulate fetching Pharmacy data
  useEffect(() => {
    // Replace this with an actual API call
    const fetchPharmacyData = async () => {
      const mockData: PharmacyData = {
        id,
        name: "Pakistan Pharmacy",
        description:
          "Providing a wide range of Pharmacys, healthcare products, and personal care items.",
        image: "/shops/pakistan_pharma.jpg",
        rating: 4.8,
        deliveryTime: "20-30 mins",
        deliveryFee: "Free",
        items: [
          {
            id: "1",
            name: "Paracetamol",
            description: "Pain reliever and fever reducer.",
            price: "$2.99",
            image: "/shops/paracetamol.jpg",
          },
          {
            id: "2",
            name: "Vitamin C Tablets",
            description: "Boosts immunity and overall health.",
            price: "$4.99",
            image: "/shops/vitaminc.jpeg",
          },
          {
            id: "3",
            name: "Cough Syrup",
            description: "Relieves cough and throat irritation.",
            price: "$5.99",
            image: "/shops/coughsyp.jpeg",
          },
        ],
      };
      setPharmacy(mockData);
    };

    if (id) fetchPharmacyData();
  }, [id]);

  // Function to handle adding an item to the cart
  const handleAddToCart = (item: PharmacyItem) => {
    // Convert the string price to a number by removing the $ sign
    const numericPrice = parseFloat(item.price.replace('$', ''));
    
    addToCart({
      id: item.id,
      name: item.name,
      price: numericPrice,
      image: item.image,
    });
  };

  if (!Pharmacy) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center w-full">
      {/* Pharmacy Banner */}
      <div className="relative w-full h-[300px]">
        <Image
          src={Pharmacy.image}
          alt={Pharmacy.name}
          fill
          className="object-cover"
        />
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent p-4 text-white">
        <h1><span className="text-[var(--white)]">{Pharmacy.name}</span></h1>
          <p className="text-[16px]">{Pharmacy.description}</p>
          <div className="flex flex-row items-center gap-[10px] mt-[10px]">
            <div className="flex items-center gap-[5px]">
              <Image
                src="/star.svg"
                alt="Rating"
                width={16}
                height={16}
                className="object-contain"
              />
              <span>{Pharmacy.rating}</span>
            </div>
            <span>•</span>
            <span>{Pharmacy.deliveryTime}</span>
            <span>•</span>
            <span>{Pharmacy.deliveryFee}</span>
          </div>
        </div>
      </div>

      {/* Pharmacy Items Section */}
      <div className="w-[var(--section-width)] mt-[20px] flex flex-col gap-[20px]">
        <h2 className="text-[20px] font-bold">Available Pharmacys</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px]">
          {Pharmacy.items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col items-stretch gap-[10px] bg-[var(--bg2)] rounded-[16px] p-[16px]"
              style={{ boxShadow: "0px 1px 10px var(--shadow)" }}
            >
              <div className="relative w-full h-[150px]">
                <Image
                  src={item.image}
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