"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import SiteButton from "@components/SiteButton";
import { useCart } from "@contexts/CartContext";

interface GroceryData {
  id: string;
  name: string;
  description: string;
  image: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: string;
  items: GroceryItem[];
}

interface GroceryItem {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
}

export default function GroceryPage() {
  const { id } = useParams() as { id: string };
  const [grocery, setGrocery] = useState<GroceryData | null>(null);
  const { addToCart } = useCart();

  // Simulate fetching grocery data
  useEffect(() => {
    // Replace this with an actual API call
    const fetchGroceryData = async () => {
      const mockData: GroceryData = {
        id,
        name: "Imtiaz Grocery Store",
        description:
          "Offering a wide range of fresh produce, pantry staples, and household essentials.",
        image: "/shops/imtiaz_supermarket.jpg",
        rating: 4.7,
        deliveryTime: "25-35 mins",
        deliveryFee: "Free",
        items: [
          {
            id: "1",
            name: "Fresh Apples",
            description: "Crisp and juicy apples, perfect for snacking.",
            price: "$3.99 / lb",
            image: "/shops/fresh_apples.jpeg",
          },
          {
            id: "2",
            name: "Organic Milk",
            description: "Fresh organic milk from local farms.",
            price: "$4.49 / gallon",
            image: "/shops/organic_milk.jpeg",
          },
          {
            id: "3",
            name: " Wheat Bread",
            description: "Soft and healthy whole wheat bread.",
            price: "$2.99 / loaf",
            image: "/shops/wheat_bread.jpeg",
          },
        ],
      };
      setGrocery(mockData);
    };

    if (id) fetchGroceryData();
  }, [id]);

  // Function to handle adding an item to the cart
  const handleAddToCart = (item: GroceryItem) => {
    // Extract the numeric price from the string (e.g., "$3.99 / lb" → 3.99)
    const numericPrice = parseFloat(item.price.replace(/[^0-9.]/g, ''));
    
    addToCart({
      id: item.id,
      name: item.name,
      price: numericPrice,
      image: item.image,
    });
  };

  if (!grocery) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center w-full">
      {/* Grocery Banner */}
      <div className="relative w-full h-[300px]">
        <Image
          src={grocery.image}
          alt={grocery.name}
          fill
          className="object-cover"
        />
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent p-4 text-white">
          <h1 className="text-[24px] font-bold">{grocery.name}</h1>
          <p className="text-[16px]">{grocery.description}</p>
          <div className="flex flex-row items-center gap-[10px] mt-[10px]">
            <div className="flex items-center gap-[5px]">
              <Image
                src="/star.svg"
                alt="Rating"
                width={16}
                height={16}
                className="object-contain"
              />
              <span>{grocery.rating}</span>
            </div>
            <span>•</span>
            <span>{grocery.deliveryTime}</span>
            <span>•</span>
            <span>{grocery.deliveryFee}</span>
          </div>
        </div>
      </div>

      {/* Grocery Items Section */}
      <div className="w-[var(--section-width)] mt-[20px] flex flex-col gap-[20px]">
        <h2 className="text-[20px] font-bold">Available Groceries</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px]">
          {grocery.items.map((item) => (
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