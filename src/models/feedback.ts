import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    enum: ["App", "Restaurant", "Grocery", "Medicine"]
  },
  feedback: {
    type: String,
    required: [true, "Feedback is required"],
    trim: true
  },
  rating: {
    type: Number,
    required: [true, "Rating is required"],
    min: 1,
    max: 5
  },
  shopName: {
    type: String,
    required: function() {
      return this.category !== "App";
    },
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const feedback = mongoose.models.Feedback || mongoose.model("Feedback", feedbackSchema);

export default feedback;