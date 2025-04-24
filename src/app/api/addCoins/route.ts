import { NextResponse } from "next/server";
import connectDB from "../../../../server/server";
import User from "@/models/user";

export async function POST(req: Request) {
    try {
        await connectDB();
        const { email, coinsToAdd } = await req.json();

        if (!email || typeof coinsToAdd !== 'number') {
            return NextResponse.json(
                { error: "Invalid input" },
                { status: 400 }
            );
        }

        // Find and update user's coins
        const user = await User.findOneAndUpdate(
            { email },
            { $inc: { coins: coinsToAdd } }, // Increment coins by coinsToAdd
            { new: true } // Return updated document
        );

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            newCoinsBalance: user.coins
        });

    } catch (error) {
        console.error("Error updating coins:", error);
        return NextResponse.json(
            { error: "Failed to update coins" },
            { status: 500 }
        );
    }
}