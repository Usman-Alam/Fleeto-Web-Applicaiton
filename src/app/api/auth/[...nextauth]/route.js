import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";   
import connectDB from "../../../../../server/server";
import bcrypt from "bcryptjs";
import User from "../../../../models/user"; 

const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                const { email, password } = credentials


                await connectDB();
                try{

                    var user = await User.findOne({ email });
                }
                catch(err)
                {
                    console.log(err);
                    throw new Error("Database connection failed")
                }
                console.log("Trying to authorize", email);
                if (!user) {
                    throw new Error("No user found with this email");
                }
                console.log("User found:", user.email);
                console.log("Comparing passwords");
                const passwordMatch = await bcrypt.compare(password, user.password);
                console.log("Password match:", passwordMatch);

                if (!passwordMatch) {
                    console.log("Password mismatch");
                    throw new Error("Password is incorrect")
                }

                return user;
            }
        })
    ],
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/"
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };