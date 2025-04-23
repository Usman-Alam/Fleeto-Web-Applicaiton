import feedbackModel from '@models/feedback';
import { NextResponse } from "next/server";
import connectDB from '../../../../server/server'

export async function POST(req: Request) {
  try {
    await connectDB();
    const { name, category, feedback, rating, shopName } = await req.json();

    // --------------------------------
    // Validation for Feedback Submission
    // -------------------------------- 
    if (!name || !category || !feedback || !rating) {
      console.log("Missing required fields");
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      console.log("Invalid rating value");
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // ----------------
    // Create feedback
    // ----------------
    await feedbackModel.create({
      name,
      category,
      feedback,
      rating,
      shopName: category !== "App" ? shopName : null,
      createdAt: new Date()
    });

    return NextResponse.json(
      { message: "Feedback submitted successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting feedback:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}