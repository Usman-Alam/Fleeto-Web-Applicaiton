import { NextResponse } from "next/server";
import connectDB from "../../../../server/server";
import Feedback from "@/models/feedback";
import { updateShopRating } from "../../api/ratingService/route";

export async function POST(req: Request) {
  try {
    await connectDB();
    const feedbackData = await req.json();

    console.log('Received feedback data:', feedbackData);

    // Validate required fields
    if (!feedbackData.name || !feedbackData.feedback || !feedbackData.rating) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate category
    const validCategories = ["App", "Restaurant", "Grocery", "Medicine"];
    if (!validCategories.includes(feedbackData.category)) {
      return NextResponse.json(
        { error: `Invalid category. Must be one of: ${validCategories.join(", ")}` },
        { status: 400 }
      );
    }

    console.log("REACHED FUCKING HERE!!!!!!!!!!!!!!")

    // Create feedback
    const feedback = await Feedback.create(feedbackData);
    console.log('Feedback created:', feedback);

    // If feedback is for a shop, update its rating
    if (feedbackData.category !== "App" && feedbackData.shopName) {
      await updateShopRating(feedbackData.shopName, feedbackData.category);
    }

    return NextResponse.json(
      { message: "Feedback submitted successfully", data: feedback },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error submitting feedback:", error);
    
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { 
          error: "Validation error", 
          details: Object.values(error.errors).map((err: any) => err.message)
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to submit feedback" },
      { status: 500 }
    );
  }
}