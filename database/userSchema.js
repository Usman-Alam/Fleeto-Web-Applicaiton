const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
        name: string,
        category: "App" | "Restaurant" | "Grocery" | "Pharmacy",
        shopName: string | null,
        rating: number,
        feedback: string,
})

const feedbackModel = mongoose.model("Feedback", feedbackSchema);

export default feedbackModel;