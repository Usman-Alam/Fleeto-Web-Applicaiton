import { NextResponse } from "next/server";
import connectDB from "../../../../server/server";
import FAQ from "@/models/Faqs";

export async function GET() {
  try {
    await connectDB();
    const faqs = await FAQ.find({})
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      { data: faqs },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    return NextResponse.json(
      { error: "Failed to fetch FAQs" },
      { status: 500 }
    );
  }
}