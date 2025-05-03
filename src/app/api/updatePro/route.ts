import { NextResponse } from "next/server";
import connectDB from "../../../../server/server";
import User from "../../../models/user";

export async function POST(req: Request) {
    try {
        await connectDB();
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        const user = await User.findOneAndUpdate(
            { email },
            { 
                isPro: true,
                // proActivationDate: new Date(),
                // proExpiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
            },
            { new: true }
        );

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Pro status updated successfully"
        });

    } catch (error) {
        console.error("Error updating pro status:", error);
        return NextResponse.json(
            { error: "Failed to update pro status" },
            { status: 500 }
        );
    }
}
