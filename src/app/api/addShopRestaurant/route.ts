import { NextResponse } from "next/server";
import connectDB from "../../../../server/server";
import Shop from "@/models/shop";

export async function GET() {
  try {
    await connectDB();
    const restaurants = await Shop.find({ 
      category: "Restaurant",
      status: "active" 
    }).select('-createdAt -status').lean();

    // Transform data to match frontend format
    const formattedData = restaurants.map(shop => ({
      title: shop.name,
      desc: shop.description,
      href: `/restaurants/${shop.slug}`,
      image: shop.image,
      rating: shop.rating || "-",
      orderCount: shop.totalRatings || 0,
      category: shop.cuisines[0] || "Restaurant",
      deliveryTime: `${shop.deliveryTimeEstimate.min}-${shop.deliveryTimeEstimate.max}`,
      deliveryType: shop.freeDeliveryAbove ? `Free above $${shop.freeDeliveryAbove}` : `$${shop.deliveryFee}`,
      slug: shop.slug
    }));

    return NextResponse.json({ data: formattedData });
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    return NextResponse.json(
      { error: "Failed to fetch restaurants" },
      { status: 500 }
    );
  }
}