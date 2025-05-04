import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import connectDB from "../../../../../server/server";
import nodemailer from "nodemailer";
import UserOTPVerify from "@models/userOTPVerification";
import Session from "@models/session"; // Import Session model
import { Types } from "mongoose"; // Import Types for ObjectId
import dotenv from "dotenv";
dotenv.config();

// Move the function definition before it's used
async function sendOTPVerificationEmail(_id: string, email: string) {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      debug: true // Add this for more detailed error logging
    });

    await transporter.verify();

    const otp = `${Math.floor(1000 + Math.random() * 9000)}`; // Generate a random 4-digit OTP

    // mail options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify your email",
      html: `<p>Enter <b>${otp}</b> in the app to verify your email address and complete your registration</p><p>This code <b>expires in 5 minutes</b>.</p>`
    };

    // hash the otp
    const saltRounds = 10;
    const hashedOTP = await bcrypt.hash(otp, saltRounds);
    const newOTPVerify = new UserOTPVerify({
      userId: _id,
      otp: hashedOTP,
      createdAt: Date.now(),
      expiresAt: Date.now() + 300000, // 5 minutes
      email: email
    });

    

    const savedOTP = await newOTPVerify.save();
    console.log(savedOTP)

    await transporter.sendMail(mailOptions);

    return false; // Initial verification status
  } catch (error) {
    console.error('SMTP Configuration:', {
      user: process.env.EMAIL_USER ? 'Set' : 'Not set',
      pass: process.env.EMAIL_PASS ? 'Set' : 'Not set'
    });
    console.error('Detailed error:', {
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response
    });
    throw error;
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const { firstname, lastname, email, phone, address, password } = await req.json();

    // Create temporary user object with ObjectId
    const tempUser = {
      _id: new Types.ObjectId(), // Generate a temporary ID
      firstname,
      lastname,
      email,
      phone,
      address,
      password: await bcrypt.hash(password, 10),
      isVerified: false
    };


    try {
      // First create the session
      const sessionData = {
        ...tempUser,
        _id: tempUser._id.toString()
      };
      
      await Session.create({
        userId: tempUser._id,
        data: sessionData,
        expiresAt: new Date(Date.now() + 300000) // 5 minutes
      });


      // Then send OTP
      await sendOTPVerificationEmail(tempUser._id.toString(), email);


      const responseData = {
        tempUserId: tempUser._id.toString(),
        redirectUrl: `/(auth)/user/signupVerify?userId=${tempUser._id.toString()}`
      };


      return NextResponse.json({
        message: "Verification email sent successfully",
        ...responseData
      }, { status: 201 });

    } catch (error) {
      console.error("Error:", error);
      return NextResponse.json({
        error: "Registration failed - Could not send verification email"
      }, { status: 500 });
    }
  } catch (error) {
    console.error("Error during signup:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
