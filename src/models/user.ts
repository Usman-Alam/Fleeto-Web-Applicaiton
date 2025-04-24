import mongoose, { models } from "mongoose";

const UserSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String
  },
  password: {
    type: String,
    required: true
  },
  isPro: {
    type: Boolean,
    default: false
  },
  proExpiryDate: {
    type: Date,
    default: null
  },
  stripeCustomerId: {
    type: String,
    default: null
  },
  // New fields added
  coins: {
    type: Number,
    default: 0
  },
  hasSubscription: {
    type: Boolean,
    default: false
  }
}, { collection: 'users' });

const User = models.User || mongoose.model("User", UserSchema)
export default User
