import feedbackModel from '@models/feedback';
import { NextResponse } from "next/server";
import connectDB from '../../../../server/server';

export async function GET(req: Request) {
  try {
    await connectDB();

    // Get all feedbacks, sorted by most recent first
    const feedbacks = await feedbackModel.find({})
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      { data: feedbacks },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    return NextResponse.json(
      { error: "Failed to fetch feedbacks" },
      { status: 500 }
    );
  }
}