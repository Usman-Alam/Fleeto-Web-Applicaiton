// app/api/payment/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(
  "sk_test_51RBiFTH6dDt990IEShjcNM0AgqwYx1UruNcckD5fLMf8pujNGPdEW1O6UNOSQmqDf8WMqtXFCcW1wuy0sMITO08200HHp5SqKt",
  {
    apiVersion: "2023-10-16",
  }
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Determine which request we're handling
    const { type } = body;

    // Subscription: Fleeto Pro
    if (type === "fleeto_pro_subscription") {
      const { userId, userEmail } = body;

      if (!userEmail) {
        return NextResponse.json(
          { error: "Missing user email" },
          { status: 400 }
        );
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "Fleeto Pro Subscription",
                description:
                  "Monthly subscription for Fleeto Pro with exclusive benefits",
                images: ["https://your-website.com/images/fleeto-pro-logo.png"],
              },
              unit_amount: 999, // $9.99 in cents
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `https://fleeto-eight.vercel.app/fleeto-pro/success?userEmail=${encodeURIComponent(
          userEmail
        )}&timestamp=${Date.now()}`,
        cancel_url: "https://fleeto-eight.vercel.app/fleeto-pro?canceled=true",
        customer_email: userEmail,
        metadata: {
          userId,
          userEmail,
          type: "fleeto_pro_subscription",
        },
      });

      return NextResponse.json({ url: session.url });
    }

    // Food Order Payment
    const {
      items = [],
      total = 0,
      email = "customer@example.com",
      orderDetails = {},
    } = body;

    const lineItems = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name || "Product",
          description: `Quantity: ${item.quantity}`,
          ...(item.image
            ? {
                images: [
                  item.image.startsWith("/")
                    ? `https://fleeto-eight.vercel.app${item.image}`
                    : item.image,
                ],
              }
            : {}),
        },
        unit_amount: Math.round((item.price || 0) * 100),
      },
      quantity: item.quantity || 1,
    }));

    if (orderDetails.deliveryFee > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: "Delivery Fee",
            description: orderDetails.deliveryMethod || "Standard Delivery",
          },
          unit_amount: Math.round(orderDetails.deliveryFee * 100),
        },
        quantity: 1,
      });
    }

    if (orderDetails.tax > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: { name: "Tax" },
          unit_amount: Math.round(orderDetails.tax * 100),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `https://fleeto-eight.vercel.app/order-confirmation?amount=${total}&orderDetails=${encodeURIComponent(
        JSON.stringify(orderDetails)
      )}`,
      cancel_url: "https://fleeto-eight.vercel.app/checkout",
      customer_email: email,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe error:", error);
    return NextResponse.json(
      {
        error: "Payment Processing Error",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
