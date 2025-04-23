import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "../../../../server/server";
import Admin from "@/models/admin";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { username, password } = await req.json();

    // Validate required fields
    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    // Find admin by username
    const admin = await Admin.findOne({ username });

    if (!admin) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Create admin response without sensitive data
    const adminResponse = {
      id: admin._id,
      username: admin.username,
      email: admin.email,
      role: admin.role,
    };

    return NextResponse.json({
      message: "Login successful",
      data: adminResponse
    });

  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}