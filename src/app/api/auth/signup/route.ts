import User from "@models/user";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import connectDB from "../../../../../server/server";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { firstname, lastname, email, phone, address, password } = await req.json();

    // --------------------------------
    // Validation for User Registration
    // --------------------------------
    console.log("I am here");
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        console.log("User already exists");
        return NextResponse.json({ error: "User already exists" }, { status: 400 });
      }
    } catch (err) {
      console.error("❌ Error checking for existing user:", err);
      return NextResponse.json({ error: "DB error on checking user" }, { status: 500 });
    }

    // -------------
    // Hash password
    // -------------
    const hashedPassword = await bcrypt.hash(password, 10);

    // ---------------
    // Create new user
    // ---------------
    // const newUser = new User({
    //   firstname,
    //   lastname,
    //   email,
    //   phone,
    //   address,
    //   password: hashedPassword,
    // });
    // await newUser.save();
    await User.create({firstname, lastname, email, phone, address, password: hashedPassword})

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error during signup:", error);
  }
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}
