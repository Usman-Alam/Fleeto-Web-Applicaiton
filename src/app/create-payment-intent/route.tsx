import { NextRequest, NextResponse } from "next/server";
const stripe = require("stripe")("sk_test_51RC085ITdjoNxqHwtGVcRwkc3BC2lI4qxmNh3XxWL3nlAhR4mRv60fGCxxowI6svT4nvNiJLNhOVOaXpK7loaGwe00231X14Xg");

export async function POST(request: NextRequest) {
  try {
    const { amount } = await request.json();

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Internal Error:", error);
    // Handle other errors (e.g., network issues, parsing errors)
    return NextResponse.json(
      { error: `Internal Server Error: ${error}` },
      { status: 500 }
    );
  }
}