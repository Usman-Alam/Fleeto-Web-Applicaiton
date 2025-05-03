import { NextResponse } from "next/server";
import connectDB from "../../../../server/server";
import Shop from "@/models/shop";

export async function GET() {
  try {
    await connectDB();
    const groceryStores = await Shop.find({ 
      category: "Grocery",
      status: "active" 
    }).select('-createdAt -status').lean();

    const formattedData = groceryStores.map(shop => ({
      title: shop.name,
      desc: shop.description,
      href: `/grocery/${shop.slug}`,
      image: shop.image,
      rating: shop.rating || "-",
      orderCount: shop.totalRatings || 0,
      category: "Grocery",
      deliveryTime: `${shop.deliveryTimeEstimate.min}-${shop.deliveryTimeEstimate.max}`,
      deliveryType: shop.freeDeliveryAbove ? `Free above $${shop.freeDeliveryAbove}` : `$${shop.deliveryFee}`,
      slug: shop.slug
    }));

    return NextResponse.json({ data: formattedData });
  } catch (error) {
    console.error("Error fetching grocery stores:", error);
    return NextResponse.json(
      { error: "Failed to fetch grocery stores" },
      { status: 500 }
    );
  }
}