import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import connectDB from "../../../../server/server";
import User from "@/models/user";

export async function POST(req: Request) {
    try {
        const session = await getServerSession();

        if (!session || !session.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { userId, timestamp } = await req.json();

        if (!userId || !timestamp) {
            return NextResponse.json(
                { error: "Missing payment information" },
                { status: 400 }
            );
        }

        await connectDB();

        // Get user from database
        const user = await User.findOne({ email: session.user.email });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Calculate expiry date (one month from now)
        const expiryDate = new Date();
        expiryDate.setMonth(expiryDate.getMonth() + 1);

        // Update user with Pro status
        user.isPro = true;
        user.proExpiryDate = expiryDate;
        user.fleetoCoins = (user.fleetoCoins || 0) + 100; // Add 100 coins bonus

        await user.save();

        return NextResponse.json({
            message: "Pro status updated successfully",
            expiryDate: expiryDate.toISOString(),
        });
    } catch (error: any) {
        console.error("Error updating Pro status:", error);
        return NextResponse.json(
            { error: error.message || "Failed to update Pro status" },
            { status: 500 }
        );
    }
}