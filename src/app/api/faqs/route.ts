import { NextResponse } from "next/server";
import connectDB from "../../../../server/server";  
import FAQ from "@/models/Faqs";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { question, answer } = await req.json();

    if (!question || !answer) {
      return NextResponse.json(
        { error: "Question and answer are required" },
        { status: 400 }
      );
    }

    const newFaq = await FAQ.create({ 
      question, 
      answer 
    });

    return NextResponse.json(
      { 
        message: "FAQ saved successfully", 
        data: newFaq 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving FAQ:", error);
    return NextResponse.json(
      { error: "Failed to save FAQ" },
      { status: 500 }
    );
  }
}