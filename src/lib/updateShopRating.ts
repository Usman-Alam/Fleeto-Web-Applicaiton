// src/lib/updateShopRating.ts
import Feedback from "@models/feedback";
import Shop from "@models/shop";
import connectDB from "../../server/server"; // adjust path if needed

export async function updateShopRating(shopName: string, category: string) {
  try {
    await connectDB();

    const shop = await Shop.findOne({ name: shopName, category });
    if (!shop) throw new Error(`Shop not found: ${shopName}`);

    const feedbacks = await Feedback.find({ shopName, category }).lean();
    if (feedbacks.length === 0) return null;

    const totalRating = feedbacks.reduce((sum, fb) => sum + Number(fb.rating), 0);
    const averageRating = totalRating / feedbacks.length;
    const roundedRating = Number(averageRating.toFixed(1));

    await Shop.updateOne(
      { _id: shop._id },
      { $set: { rating: roundedRating, totalRatings: feedbacks.length } }
    );

    const updatedShop = await Shop.findById(shop._id);
    if (updatedShop.rating !== roundedRating) {
      throw new Error("Rating update failed - values do not match");
    }

    return roundedRating;
  } catch (error) {
    console.error("Error updating shop rating:", error);
    throw error;
  }
}
