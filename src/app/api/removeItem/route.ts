import { NextResponse } from "next/server";
import connectDB from "../../../../server/server";
import Shop from "@/models/shop";

export async function POST(req: Request) {
    try {
        await connectDB();
        const { shopname, dishname } = await req.json();

        if (!shopname || !dishname) {
            return NextResponse.json(
                { error: "Shop name and dish name are required" },
                { status: 400 }
            );
        }

        // Find the shop and remove the menu item
        const shop = await Shop.findOne({ name: shopname });

        if (!shop) {
            return NextResponse.json(
                { error: "Shop not found" },
                { status: 404 }
            );
        }

        // Remove the menu item with matching dishname
        shop.menu = shop.menu.filter(item => item.dishname !== dishname);
        await shop.save();

        return NextResponse.json({
            message: "Menu item removed successfully"
        });

    } catch (error) {
        console.error("Remove menu item error:", error);
        return NextResponse.json(
            { error: "Failed to remove menu item" },
            { status: 500 }
        );
    }
}