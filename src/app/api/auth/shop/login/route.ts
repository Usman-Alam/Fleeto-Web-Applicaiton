import { NextResponse } from "next/server";
import connectDB from "../../../../../../server/server";
import Shop from "@/models/shop";

export async function POST(req: Request) {
    try {
        // Connect to database
        await connectDB();

        // Get credentials from request body
        const { email, password } = await req.json();
        console.log("Login request data:", { email, password });

        // Validate input
        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        // Find shop by email using the correct path
        const shop = await Shop.findOne({ "contact.email": email });
        console.log("Shop found:", shop);   
        // Check if shop exists
        if (!shop) {
            return NextResponse.json(
                { error: "Shop not Found!!" },
                { status: 401 }
            );
        }

        // Verify password 
        // const isValidPassword = await bcrypt.compare(password, shop.password);

        // if (!isValidPassword) {
        //     return NextResponse.json(
        //         { error: "Invalid credentials Password" },
        //         { status: 401 }
        //     );
        // }

        // Return success with shop data (excluding sensitive information)
        return NextResponse.json({
            message: "Login successful",
            data: {
                shopname: shop.name,
                email: shop.contact.email, // Update this to use the correct path
                id: shop._id,
            }
        });

    } catch (error) {
        console.error("Shop login error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}