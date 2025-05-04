import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "../../../../../server/server";
import Shop from "@/models/shop";
import { writeFile } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
    try {
        // Check authentication
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Parse form data
        const formData = await req.formData();
        const shopId = formData.get("shopId") as string;
        const file = formData.get("image") as File;

        if (!shopId || !file) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Connect to database
        await connectDB();

        // Find the shop and verify ownership
        const shop = await Shop.findById(shopId);

        if (!shop) {
            return NextResponse.json(
                { error: "Shop not found" },
                { status: 404 }
            );
        }

        // Verify ownership (user.id should match shop owner ID or user is admin)
        if (shop.owner.toString() !== session.user.id && session.user.role !== "admin") {
            return NextResponse.json(
                { error: "Not authorized to update this shop" },
                { status: 403 }
            );
        }

        // Process the file
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create unique filename
        const fileName = `shop_${shopId}_${uuidv4()}${path.extname(file.name)}`;
        const publicPath = path.join(process.cwd(), "public", "uploads", fileName);

        // Save file to public directory
        await writeFile(publicPath, buffer);

        // Update shop image in database
        const imageUrl = `/uploads/${fileName}`;
        await Shop.findByIdAndUpdate(shopId, { image: imageUrl });

        return NextResponse.json({
            message: "Shop image updated successfully",
            imageUrl
        });

    } catch (error: unknown) {
        console.error("Error updating shop image:", error);
    
        const errorMessage = error instanceof Error ? error.message : "Failed to update shop image";
    
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}