import { NextResponse } from "next/server";
import connectDB from "../../../../server/server";
import Shop from "@/models/shop";

export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();

    // Basic validation
    if (!data.name || !data.description || !data.category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate delivery times
    if (parseInt(data.deliveryTimeEstimate.min) >= parseInt(data.deliveryTimeEstimate.max)) {
      return NextResponse.json(
        { error: "Maximum delivery time must be greater than minimum delivery time" },
        { status: 400 }
      );
    }

    // Check if shop with same name exists
    const existingShop = await Shop.findOne({
      $or: [
        { name: data.name },
        { slug: data.name.toLowerCase().replace(/\s+/g, '-') }
      ]
    });

    if (existingShop) {
      return NextResponse.json(
        { error: "A shop with this name already exists" },
        { status: 400 }
      );
    }

    // Create new shop
    const newShop = await Shop.create({
      ...data,
      image: data.image || "/no_shop.png" // Use default image if none provided
    });

    return NextResponse.json(
      {
        message: "Shop created successfully",
        data: newShop
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating shop:", error);

    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: validationErrors.join(', ') },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create shop" },
      { status: 500 }
    );
  }
}