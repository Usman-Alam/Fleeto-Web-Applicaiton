import { updateShopRating } from "../../../lib/updateShopRating"; // Adjust path as needed
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { shopName, category } = await req.json();

    if (!shopName || !category) {
      return NextResponse.json(
        { error: "Shop name and category are required" },
        { status: 400 }
      );
    }

    const updatedRating = await updateShopRating(shopName, category);

    return NextResponse.json({
      success: true,
      rating: updatedRating,
      shopName,
      category
    });
  } catch (error) {
    console.error("Rating update error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update rating" },
      { status: 500 }
    );
  }
}
