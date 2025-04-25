import { NextResponse } from "next/server";
import connectDB from "../../../../server/server";
import Shop from "@/models/shop";

export async function GET(req: Request) {
    try {
        await connectDB();
        
        const { searchParams } = new URL(req.url);
        const slug = searchParams.get('slug');

        if (!slug) {
            return NextResponse.json(
                { error: "Shop slug is required" },
                { status: 400 }
            );
        }

        // Explicitly select menu field and all its sub-fields
        const shop = await Shop.findOne({ slug })
            .select('name description image rating deliveryTimeEstimate deliveryFee totalRatings menu')
            .lean();

        if (!shop) {
            return NextResponse.json(
                { error: "Shop not found" },
                { status: 404 }
            );
        }


        const formattedShop = {
            id: shop._id,
            name: shop.name || 'Unnamed Shop',
            description: shop.description || 'No description available',
            image: shop.image || '/no_shop.png',
            rating: shop.rating || 0,
            deliveryTime: shop.deliveryTimeEstimate 
                ? `${shop.deliveryTimeEstimate.min}-${shop.deliveryTimeEstimate.max} mins`
                : 'Delivery time not specified',
            deliveryFee: typeof shop.deliveryFee === 'number' 
                ? shop.deliveryFee === 0 ? "Free" : `$${shop.deliveryFee.toFixed(2)}`
                : 'Delivery fee not specified',
            totalRatings: shop.totalRatings || 0,
            menu: shop.menu?.map((item: any, index: number) => ({
                id: index + 1,
                name: item.dishname,
                description: item.dishdescription,
                price: `$${item.dishprice.toFixed(2)}`,
                image: "/shops/default-dish.jpg"
            })) || []
        };

        return NextResponse.json(formattedShop);

    } catch (error) {
        console.error("Error fetching shop details:", error);
        return NextResponse.json(
            { error: "Failed to fetch shop details" },
            { status: 500 }
        );
    }
}