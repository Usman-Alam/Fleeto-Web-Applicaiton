import mongoose from "mongoose";
const uri = "mongodb+srv://26100268:fleeto001@cluster0.ibjs1h8.mongodb.net/users";
export default async function connectDB() {
  try {
    await mongoose.connect(uri)
  } catch (error) {
    console.log(error)
  }
}
