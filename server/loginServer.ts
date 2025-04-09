// server/loginServer.ts
import mongoose from "mongoose";

const uri = "mongodb+srv://26100268:fleeto001@cluster0.ibjs1h8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// const uri = "mongodb+srv://26100268:fleeto001@cluster0.ibjs1h8.mongodb.net/users";

export default async function connectLoginDB() {
  if (mongoose.connection.readyState >= 1) return;

  try {
    await mongoose.connect(uri, {
      dbName: "users", // 👈 YOUR DB NAME here (check in MongoDB Compass)
    });
    console.log("✅ MongoDB connected to fleeto DB");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    throw err;
  }
}
