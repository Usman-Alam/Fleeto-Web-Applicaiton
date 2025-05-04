import { NextResponse } from "next/server";
import connectDB from "../../../../server/server";
import Feedback from "@/models/feedback";
import { updateShopRating } from "../../api/ratingService/route";
import { ValidationError } from "mongoose"; // Assuming ValidationError is from mongoose

export async function POST(req: Request) {
  try {
    await connectDB();
    const feedbackData = await req.json();


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


    // Create feedback
    const feedback = await Feedback.create(feedbackData);

    // If feedback is for a shop, update its rating
    if (feedbackData.category !== "App" && feedbackData.shopName) {
      await updateShopRating(feedbackData.shopName, feedbackData.category);
    }

    return NextResponse.json(
      { message: "Feedback submitted successfully", data: feedback },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Error submitting feedback:", error);
    
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json(
        { 
          error: "Validation error", 
          details: error instanceof ValidationError
            ? Object.values((error as ValidationError).errors).map((err) => (err as { message: string }).message)
            : ["Unknown validation error"]
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