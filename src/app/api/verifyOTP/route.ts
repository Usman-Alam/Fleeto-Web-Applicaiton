import { NextResponse } from "next/server";
import connectDB from "../../../../server/server";
import Session from "@models/session";
import User from "@models/user";
import UserOTPVerify from "@models/userOTPVerification";
import bcrypt from "bcryptjs";
import { Types } from "mongoose";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { otp, email } = await req.json();

    console.log('Verifying OTP for:', {
      email: email,
      receivedOTP: otp
    });

    if (!email) {
      return NextResponse.json({ 
        error: "Email is required" 
      }, { status: 400 });
    }

    // Get the OTP verification record by email
    const otpRecord = await UserOTPVerify.findOne({ email });
    console.log('Found OTP record:', otpRecord);
    
    if (!otpRecord) {
      // Try to find any records to debug
      const allRecords = await UserOTPVerify.find({});
      console.log('All OTP records:', allRecords);
      
      return NextResponse.json({ 
        error: "Verification failed - No OTP found for this email" 
      }, { status: 400 });
    }

    // Check if OTP has expired
    if (otpRecord.expiresAt < new Date()) {
      await UserOTPVerify.deleteOne({ email });
      return NextResponse.json({ 
        error: "OTP has expired. Please request a new one." 
      }, { status: 400 });
    }

    // Verify OTP
    const isValidOTP = await bcrypt.compare(otp, otpRecord.otp);
    if (!isValidOTP) {
      return NextResponse.json({ 
        error: "Invalid OTP. Please try again." 
      }, { status: 400 });
    }

    // Get session data
    const session = await Session.findOne({ userId: otpRecord.userId });
    if (!session) {
      return NextResponse.json({ 
        error: "Session expired. Please sign up again." 
      }, { status: 400 });
    }

    // Create verified user
    const userData = session.data;
    const user = new User({
      ...userData,
      isVerified: true
    });
    await user.save();

    // Cleanup
    await Promise.all([
      Session.deleteOne({ userId: otpRecord.userId }),
      UserOTPVerify.deleteOne({ email })
    ]);

    return NextResponse.json({
      message: "Email verified successfully",
      redirectUrl: '/login'
    }, { status: 200 });

  } catch (error) {
    console.error("Error during verification:", error);
    return NextResponse.json({ 
      error: "Verification failed" 
    }, { status: 500 });
  }
}