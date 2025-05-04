import NextAuth from "next-auth";
import { authOptions } from "../../../../lib/authOptions"; // Make sure the path is correct based on your structure

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
