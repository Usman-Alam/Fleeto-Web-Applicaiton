"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import SiteButton from "@components/SiteButton";
import { useCart } from "@contexts/CartContext";

interface RestaurantData {
  id: string;
  name: string;
  description: string;
  image: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: string;
  menu: MenuItem[];
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
}

export default function RestaurantPage() {
  const { id } = useParams() as { id: string };
  const [restaurant, setRestaurant] = useState<RestaurantData | null>(null);
  const { addToCart } = useCart();

  // Simulate fetching restaurant data
  useEffect(() => {
    // Replace this with an actual API call
    const fetchRestaurantData = async () => {
      const mockData: RestaurantData = {
        id,
        name: "Imtiaz Super Market",
        description:
          "Offering a wide selection of groceries, personal care, kitchen items, and home essentials.",
        image: "/restaurant-banner.jpg",
        rating: 4.6,
        deliveryTime: "30-40 mins",
        deliveryFee: "Free",
        menu: [
          {
            id: "1",
            name: "Chicken Biryani",
            description: "Delicious chicken biryani served with raita.",
            price: "$5.99",
            image: "/menu-item-1.jpg",
          },
          {
            id: "2",
            name: "Beef Burger",
            description: "Juicy beef burger with fresh lettuce and tomato.",
            price: "$4.99",
            image: "/menu-item-2.jpg",
          },
          {
            id: "3",
            name: "Veggie Pizza",
            description: "Cheesy veggie pizza with a crispy crust.",
            price: "$7.99",
            image: "/menu-item-3.jpg",
          },
        ],
      };
      setRestaurant(mockData);
    };

    if (id) fetchRestaurantData();
  }, [id]);

  // Function to handle adding an item to the cart
  const handleAddToCart = (item: MenuItem) => {
    // Convert the string price to a number by removing the $ sign
    const numericPrice = parseFloat(item.price.replace('$', ''));
    
    addToCart({
      id: item.id,
      name: item.name,
      price: numericPrice,
      image: item.image,
    });
  };

  if (!restaurant) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center w-full">
      {/* Restaurant Banner */}
      <div className="relative w-full h-[300px]">
        <Image
          src={restaurant.image}
          alt={restaurant.name}
          fill
          className="object-cover"
        />
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent p-4 text-white">
          <h1 className="text-[24px] font-bold">{restaurant.name}</h1>
          <p className="text-[16px]">{restaurant.description}</p>
          <div className="flex flex-row items-center gap-[10px] mt-[10px]">
            <div className="flex items-center gap-[5px]">
              <Image
                src="/star.svg"
                alt="Rating"
                width={16}
                height={16}
                className="object-contain"
              />
              <span>{restaurant.rating}</span>
            </div>
            <span>•</span>
            <span>{restaurant.deliveryTime}</span>
            <span>•</span>
            <span>{restaurant.deliveryFee}</span>
          </div>
        </div>
      </div>

      {/* Menu Section */}
      <div className="w-[var(--section-width)] mt-[20px] flex flex-col gap-[20px]">
        <h2 className="text-[20px] font-bold">Menu</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px]">
          {restaurant.menu.map((item) => (
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