import { NextResponse } from "next/server";
import connectDB from "../../../../server/server";
import Admin from "@/models/admin";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { username, email, password } = await req.json();

    // Validation
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Password length validation
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password should be at least 6 characters" },
        { status: 400 }
      );
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({
      $or: [{ email }, { username }],
    });

    if (existingAdmin) {
      return NextResponse.json(
        { error: "Admin with this email or username already exists" },
        { status: 400 }
      );
    }

    // Create new admin
    const newAdmin = await Admin.create({
      username,
      email,
      password,
      role: "admin",
    });

    // Remove password from response
    const adminResponse = {
      id: newAdmin._id,
      username: newAdmin.username,
      email: newAdmin.email,
      role: newAdmin.role,
    };

    return NextResponse.json(
      {
        message: "Admin created successfully",
        data: adminResponse,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Admin signup error:", error);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: validationErrors.join(', ') },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create admin account" },
      { status: 500 }
    );
  }
}