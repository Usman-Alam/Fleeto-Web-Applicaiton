import mongoose from "mongoose";

const faqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, "Question is required"],
    trim: true
  },
  answer: {
    type: String,
    required: [true, "Answer is required"],
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const FAQ = mongoose.models.FAQ || mongoose.model("FAQ", faqSchema);
export default FAQ;