import { NextResponse } from "next/server";
import connectDB from "../../../../server/server";
import User from "@/models/user";

export async function POST(req: Request) {
    try {
        await connectDB();
        const { email, coinsToDeduct } = await req.json();
        
        console.log('Received request:', { email, coinsToDeduct });

        if (!email || coinsToDeduct === undefined) {
            console.log('Missing required fields');
            return NextResponse.json(
                { error: "Email and coinsToDeduct are required" },
                { status: 400 }
            );
        }

        const user = await User.findOne({ email });
        console.log('Found user:', user);

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Ensure coinsToDeduct is a number
        const coinsToDeductNum = Number(coinsToDeduct);
        if (isNaN(coinsToDeductNum)) {
            return NextResponse.json(
                { error: "Invalid coins value" },
                { status: 400 }
            );
        }

        // Check if user has enough coins
        if (!user.coins || user.coins < coinsToDeductNum) {
            console.log('Insufficient coins:', { 
                userCoins: user.coins, 
                coinsToDeduct: coinsToDeductNum 
            });
            return NextResponse.json(
                { error: "Insufficient coins" },
                { status: 400 }
            );
        }

        // Update coins using findOneAndUpdate for atomic operation
        const updatedUser = await User.findOneAndUpdate(
            { email },
            { $inc: { coins: -coinsToDeductNum } },
            { new: true }
        );

        console.log('Updated user:', updatedUser);

        if (!updatedUser) {
            throw new Error('Failed to update user coins');
        }

        return NextResponse.json({
            success: true,
            newCoinsBalance: updatedUser.coins
        });

    } catch (error) {
        console.error("Error updating coins:", error);
        return NextResponse.json(
            { error: "Failed to update coins", details: error.message },
            { status: 500 }
        );
    }
}