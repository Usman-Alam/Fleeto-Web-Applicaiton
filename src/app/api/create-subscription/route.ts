import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import Stripe from "stripe";
import connectDB from "../../../../server/server";
import User from "@/models/user";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2023-10-16",
});

export async function POST(req: Request) {
    try {
        console.log(req)
        const session = await getServerSession();

        if (!session || !session.user) {
            return NextResponse.json(
                { error: "You must be logged in" },
                { status: 401 }
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

        // Check if the user already has an active Pro subscription
        if (user.isPro && user.proExpiryDate && new Date(user.proExpiryDate) > new Date()) {
            return NextResponse.json(
                { error: "You already have an active Pro subscription" },
                { status: 400 }
            );
        }

        // Create or retrieve Stripe customer
        let customerId = user.stripeCustomerId;

        if (!customerId) {
            const customer = await stripe.customers.create({
                email: user.email,
                name: user.username || user.email,
                metadata: {
                    userId: user._id.toString()
                }
            });

            customerId = customer.id;
            user.stripeCustomerId = customerId;
            await user.save();
        }

        // Create a payment intent for the subscription
        const paymentIntent = await stripe.paymentIntents.create({
            amount: 999, // $9.99 in cents
            currency: 'usd',
            customer: customerId,
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                type: 'fleeto_pro_subscription',
                userId: user._id.toString()
            }
        });

        return NextResponse.json({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error: unknown) {
        console.error("Error creating subscription:", error);
        const errorMessage = error instanceof Error ? error.message : "Failed to create subscription";
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}