"use client";

import HomeHero from "@components/HomeHero";
import ShopsSection from "@components/ShopsSection";
import FAQsSection from "@components/FAQsSection";
import { useEffect, useState } from "react";

// import all these data from database [on .]
const restaurantData = [
  {
    title: "Zakir Tikka",
    desc: "Pakistani BBQ restaurant serving sizzling tikka, kebabs, and karahi, known for its rich flavors and traditional charcoal-grilled taste.",
    href: "/",
    image: "/shops/zakir.jpg",
    rating: 4.6,
    orderCount: 600,
    category: "Desi Food",
    deliveryTime: "40",
    deliveryType: "Free",
    slug: "zakir-tikka",
  },
  {
    title: "Stufd",
    desc: "Craving something heavy and delicious? Stufd. has you covered with juicy burgers, cheesy wraps and all the meaty goodness you can handle.",
    href: "",
    image: "/shops/stufd.jpg",
    rating: 4.2,
    orderCount: 200,
    category: "Fast Food",
    deliveryTime: "20",
    deliveryType: "2Free",
    slug: "stufd",
  },
  {
    title: "Burrito",
    desc: "Serving bold Mexican flavors right on campus. With fresh ingredients and spicy options, it’s a go-to for a filling, flavorful meal.",
    href: "/",
    image: "/shops/burrito.jpg",
    rating: 4.3,
    orderCount: 300,
    category: "Fast Food",
    deliveryTime: "30",
    deliveryType: "Free",
    slug: "burrito",
  },
  {
    title: "Imtiaz Super Market3",
    desc: "3Offering a wide selection of groceries, personal care, kitchen items, and home essentials.",
    href: "/",
    image: "/",
    rating: 4.3,
    orderCount: 300,
    category: "3Grocery",
    deliveryTime: "30",
    deliveryType: "Free",
    slug: "imtiaz-super-market3",
  },
  {
    title: "Imtiaz Super Market3",
    desc: "3Offering a wide selection of groceries, personal care, kitchen items, and home essentials.",
    href: "/",
    image: "/",
    rating: 4.3,
    orderCount: 300,
    category: "3Grocery",
    deliveryTime: "30",
    deliveryType: "Free",
    slug: "imtiaz-super-market3",
  },
  {
    title: "Imtiaz Super Market3",
    desc: "3Offering a wide selection of groceries, personal care, kitchen items, and home essentials.",
    href: "/",
    image: "/",
    rating: 4.3,
    orderCount: 300,
    category: "3Grocery",
    deliveryTime: "30",
    deliveryType: "Free",
    slug: "imtiaz-super-market3",
  },
  {
    title: "Imtiaz Super Market3",
    desc: "3Offering a wide selection of groceries, personal care, kitchen items, and home essentials.",
    href: "/",
    image: "/",
    rating: 4.3,
    orderCount: 300,
    category: "3Grocery",
    deliveryTime: "30",
    deliveryType: "Free",
    slug: "imtiaz-super-market3",
  },
  {
    title: "Imtiaz Super Market3",
    desc: "3Offering a wide selection of groceries, personal care, kitchen items, and home essentials.",
    href: "/",
    image: "/",
    rating: 4.3,
    orderCount: 300,
    category: "3Grocery",
    deliveryTime: "30",
    deliveryType: "Free",
    slug: "imtiaz-super-market3",
  },
  {
    title: "Imtiaz Super Market3",
    desc: "3Offering a wide selection of groceries, personal care, kitchen items, and home essentials.",
    href: "/",
    image: "/",
    rating: 4.3,
    orderCount: 300,
    category: "3Grocery",
    deliveryTime: "30",
    deliveryType: "Free",
    slug: "imtiaz-super-market3",
  },
  {
    title: "Imtiaz Super Market3",
    desc: "3Offering a wide selection of groceries, personal care, kitchen items, and home essentials.",
    href: "/",
    image: "/",
    rating: 4.3,
    orderCount: 300,
    category: "3Grocery",
    deliveryTime: "30",
    deliveryType: "Free",
    slug: "imtiaz-super-market3",
  },
  {
    title: "Imtiaz Super Market3",
    desc: "3Offering a wide selection of groceries, personal care, kitchen items, and home essentials.",
    href: "/",
    image: "/",
    rating: 4.3,
    orderCount: 300,
    category: "3Grocery",
    deliveryTime: "30",
    deliveryType: "Free",
    slug: "imtiaz-super-market3",
  },
];

const medicineData = [
  {
    title: "Pakistan Pharmacy",
    desc: "Pakistan Pharmacy offers a wide range of authentic medicines, wellness products, and personal care essentials. We’re here to deliver, fast and safely.",
    href: "/",
    image: "/shops/pakistan_pharmacy.jpg",
    rating: 4.6,
    orderCount: 600,
    category: "Medicine",
    deliveryTime: "40",
    deliveryType: "Free",
    slug: "pakistan-pharmacy",
  },
  {
    title: "Servaid Pharmacy",
    desc: "Buy Medicines online in Pakistan from the most trusted online pharmacy, Servaid. Fastest delivery in Pakistan with Cash on Delivery.",
    href: "/",
    image: "/shops/servaid_pharmacy.jpg",
    rating: 4.2,
    orderCount: 200,
    category: "Medicine",
    deliveryTime: "20",
    deliveryType: "Free",
    slug: "servaid-pharmacy",
  },
  {
    title: "Green Pharmacy",
    desc: "We deliver medicines and health products all over in Lahore. Grab your phone and place your order instantly. We offer 10% discount on  the first order.",
    href: "/",
    image: "/shops/green_pharmacy.jpg",
    rating: 4.3,
    orderCount: 300,
    category: "Medicine",
    deliveryTime: "30",
    deliveryType: "Free",
    slug: "imtiaz-super-market3",
  },
];

const groceryData = [
  {
    title: "Imtiaz Super Market",
    desc: "Offering a wide selection of groceries, personal care, kitchen items, and home essentials.",
    href: "/",
    image: "/shops/imtiaz_supermarket.jpg",
    rating: 4.6,
    orderCount: 600,
    category: "Grocery",
    deliveryTime: "40",
    deliveryType: "Free",
    slug: "imtiaz-supermarket",
  },
  {
    title: "The LUMS Store",
    desc: "A one-stop shop for daily essentials, offering fresh groceries, snacks, beverages, and household items at affordable prices.",
    href: "/",
    image: "/shops/lums_store.jpg",
    rating: 4.2,
    orderCount: 200,
    category: "Grocery",
    deliveryTime: "20",
    deliveryType: "Free",
    slug: "lums-store",
  },
  {
    title: "Usman Mart",
    desc: "A leading supermarket offering a wide range of fresh groceries, household essentials at great prices.",
    href: "/",
    image: "/shops/usman_mart.jpg",
    rating: 4.3,
    orderCount: 300,
    category: "Grocery",
    deliveryTime: "30",
    deliveryType: "Free",
    slug: "usman-mart",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-top w-full">
      <HomeHero />
      <div id="shops"></div>
      <ShopsSection icon="/restaurant.svg" heading="Restaurants" data={restaurantData} />
      <ShopsSection icon="/medicine.svg" heading="Medicine" data={medicineData} />
      <ShopsSection icon="/grocery.svg" heading="Grocery" data={groceryData} />
      <div id="faqs"></div>
      <FAQsSection />
    </div>
  );
}
