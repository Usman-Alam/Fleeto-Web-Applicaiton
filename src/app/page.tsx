import HomeHero from "@components/HomeHero";
import ShopsSection from "@components/ShopsSection";

// import all these data from database [on .]
const restaurantData = [
  {
    title: "Imtiaz Super Market",
    desc: "Offering a wide selection of groceries, personal care, kitchen items, and home essentials.",
    href: "/",
    image: "/",
    rating: 4.6,
    orderCount: 600,
    category: "Grocery",
    deliveryTime: "40",
    deliveryType: "Free",
  },
  {
    title: "Imtiaz Super Market2",
    desc: "2Offering a wide selection of groceries, personal care, kitchen items, and home essentials.",
    href: "/",
    image: "/",
    rating: 4.2,
    orderCount: 200,
    category: "Grocery2",
    deliveryTime: "20",
    deliveryType: "2Free",
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
  },
];

const medicineData = [
  {
    title: "Imtiaz Super Market",
    desc: "Offering a wide selection of groceries, personal care, kitchen items, and home essentials.",
    href: "/",
    image: "/",
    rating: 4.6,
    orderCount: 600,
    category: "Grocery",
    deliveryTime: "40",
    deliveryType: "Free",
  },
  {
    title: "Imtiaz Super Market2",
    desc: "2Offering a wide selection of groceries, personal care, kitchen items, and home essentials.",
    href: "/",
    image: "/",
    rating: 4.2,
    orderCount: 200,
    category: "Grocery2",
    deliveryTime: "20",
    deliveryType: "2Free",
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
  },
];

const groceryData = [
  {
    title: "Imtiaz Super Market",
    desc: "Offering a wide selection of groceries, personal care, kitchen items, and home essentials.",
    href: "/",
    image: "/",
    rating: 4.6,
    orderCount: 600,
    category: "Grocery",
    deliveryTime: "40",
    deliveryType: "Free",
  },
  {
    title: "Imtiaz Super Market2",
    desc: "2Offering a wide selection of groceries, personal care, kitchen items, and home essentials.",
    href: "/",
    image: "/",
    rating: 4.2,
    orderCount: 200,
    category: "Grocery2",
    deliveryTime: "20",
    deliveryType: "2Free",
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
    </div>
  );
}
