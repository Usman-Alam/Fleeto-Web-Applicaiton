import { NextResponse } from "next/server";
import connectDB from "../../../../server/server";
import Shop from "@/models/shop";

export async function GET() {
  try {
    await connectDB();
    const pharmacies = await Shop.find({ 
      category: "Medicine",
      status: "active" 
    }).select('-createdAt -status').lean();

    const formattedData = pharmacies.map(shop => ({
      title: shop.name,
      desc: shop.description,
      href: `/medicine/${shop.slug}`,
      image: shop.image,
      rating: shop.rating || "-",
      orderCount: shop.totalRatings || 0,
      category: "Medicine",
      deliveryTime: `${shop.deliveryTimeEstimate.min}-${shop.deliveryTimeEstimate.max}`,
      deliveryType: shop.freeDeliveryAbove ? `Free above $${shop.freeDeliveryAbove}` : `$${shop.deliveryFee}`,
      slug: shop.slug
    }));

    return NextResponse.json({ data: formattedData });
  } catch (error) {
    console.error("Error fetching pharmacies:", error);
    return NextResponse.json(
      { error: "Failed to fetch pharmacies" },
      { status: 500 }
    );
  }
}