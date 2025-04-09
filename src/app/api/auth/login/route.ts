import User from "@/models/user";
import { NextResponse } from "next/server";
import connectLoginDB from "../../../../../server/loginServer";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        await connectLoginDB();
        const { email, password } = await req.json();
        
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
        }
        
        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
        }
        
        // Successful login - return user data (excluding password)
        const userData = {
            id: user._id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            // Include other fields you need but exclude password
        };
        
        return NextResponse.json({ user: userData }, { status: 200 });
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ error: "An error occurred during login" }, { status: 500 });
    }
}