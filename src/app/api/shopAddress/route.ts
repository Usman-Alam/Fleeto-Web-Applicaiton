import { NextResponse } from "next/server";
import connectDB from "../../../../server/server"
import Shop from "@/models/shop";

export async function POST(req: Request) {
    try {
        await connectDB();
        
        const { shopname } = await req.json();

        if (!shopname) {
            return NextResponse.json(
                { error: "Shop name is required" },
                { status: 400 }
            );
        }

        // Find shop and select only needed fields
        const shop = await Shop.findOne({ name: shopname })
            .select('address deliveryTimeEstimate')
            .lean();

        if (!shop) {
            return NextResponse.json(
                { error: "Shop not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            address: shop.address,
            maxDeliveryTime: shop.deliveryTimeEstimate.max
        });

    } catch (error) {
        console.error("Error fetching shop details:", error);
        return NextResponse.json(
            { error: "Failed to fetch shop details" },
            { status: 500 }
        );
    }
}