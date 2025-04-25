import mongoose from "mongoose";
const uri = "mongodb+srv://26100268:fleeto001@cluster0.ibjs1h8.mongodb.net/users";
// const uri = "mongodb+srv://26100268:fleeto001@cluster0.ibjs1h8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
export default async function connectDB() {
  try {
    await mongoose.connect(uri)
  } catch (error) {
    console.log(error)
  }
}


// export default async function connectDB() {
//   if (mongoose.connection.readyState >= 1) return;

//   try {
//     await mongoose.connect(uri, {
//       dbName: "Testusers", // 👈 YOUR DB NAME here (check in MongoDB Compass)
//     });
//     console.log("✅ MongoDB connected to fleeto DB");
//   } catch (err) {
//     console.error("❌ MongoDB connection error:", err);
//     throw err;
//   }
// }