import User from "@/models/user";
import connectDB from "../../../../../server/server";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
    try {
        await connectDB();
        const { firstname, lastname, email, phone, address, password } = await req.json()
        const user = await User.findOne({email}).select("_id");
        console.log("User", user);
        return NextResponse.json({user});
    } catch (error) {
        console.log(error)
    }
}