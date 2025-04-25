import { NextResponse } from "next/server";
import connectDB from "../../../../server/server";
import Shop from "@/models/shop";

export async function POST(req: Request) {
    try {
        await connectDB();
        console.log("Connected to DB");

        const { shopname, menuItem } = await req.json();

        if (!shopname || !menuItem) {
            return NextResponse.json(
                { error: "Shop name and menu item are required" },
                { status: 400 }
            );
        }

        // Debug log
        console.log("Adding menu item:", { shopname, menuItem });

        // First find the shop
        const shop = await Shop.findOne({ name: shopname });

        if (!shop) {
            console.log("Shop not found:", shopname);
            return NextResponse.json(
                { error: "Shop not found" },
                { status: 404 }
            );
        }

        // Initialize menu if it doesn't exist
        if (!shop.menu) {
            shop.menu = [];
        }

        // Add the new menu item
        shop.menu.push(menuItem);

        // Save the shop
        await shop.save();

        // Get the updated shop with menu
        const updatedShop = await Shop.findOne({ name: shopname })
            .select('name menu')
            .lean();

        console.log("Updated shop:", updatedShop);

        return NextResponse.json({
            message: "Menu item added successfully",
            shop: updatedShop
        });

    } catch (error) {
        console.error("Add menu item error:", error);
        return NextResponse.json(
            { error: "Failed to add menu item" },
            { status: 500 }
        );
    }
}