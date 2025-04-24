import { NextResponse } from "next/server";
import connectDB from "../../../../../server/server";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    await connectDB();
    
    const { email, password } = await req.json();

    // Find user and select specific fields
    const user = await User.findOne({ email }).select(
      'email firstname password isPro coins hasSubscription'
    );
    
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    // Log the user data before sending
    console.log('User data being sent:', {
      email: user.email,
      firstname: user.firstname,
      isPro: user.isPro,
      coins: user.coins,
      hasSubscription: user.hasSubscription
    });

    // Return user data and token
    return NextResponse.json({
      email: user.email,
      firstname: user.firstname,
      token,
      isPro: user.isPro,
      coins: user.coins,
      hasSubscription: user.hasSubscription
    });

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}