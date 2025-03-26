import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String },
  password: { type: String, required: true },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
