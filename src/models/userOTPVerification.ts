import mongoose from 'mongoose'

const UserOTPVerificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true, // Add this to ensure consistent case
    trim: true // Add this to remove whitespace
  },
  otp: {
    type: String,
    required: true
  },
  createdAt: Date,
  expiresAt: Date
});

// Add this index for better query performance
UserOTPVerificationSchema.index({ email: 1, expiresAt: 1 });

const UserOTPVerification = mongoose.models.UserOTPVerification || mongoose.model("UserOTPVerification", UserOTPVerificationSchema)
export default UserOTPVerification