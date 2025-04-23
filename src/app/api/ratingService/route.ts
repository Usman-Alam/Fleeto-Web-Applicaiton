import Feedback from "@models/feedback";
import Shop from "@models/shop";
import connectDB from "../../../../server/server";
import { NextResponse } from "next/server";

export async function updateShopRating(shopName: string, category: string) {
  try {
    await connectDB();
    
    // First verify the shop exists and log its current state
    const shop = await Shop.findOne({ name: shopName, category });
    console.log('Initial shop state:', {
      exists: !!shop,
      name: shop?.name,
      currentRating: shop?.rating,
      currentTotalRatings: shop?.totalRatings
    });

    if (!shop) {
      throw new Error(`Shop not found: ${shopName}`);
    }

    // Get all feedback for this shop
    const feedbacks = await Feedback.find({ 
      shopName,
      category 
    }).lean();

    console.log(`Found ${feedbacks.length} feedbacks`);

    if (feedbacks.length === 0) {
      console.log('No feedbacks found');
      return null;
    }

    // Calculate average rating
    const totalRating = feedbacks.reduce((sum, feedback) => sum + Number(feedback.rating), 0);
    const averageRating = totalRating / feedbacks.length;
    const roundedRating = Number(averageRating.toFixed(1));
    
    console.log('Rating calculation:', {
      totalRating,
      averageRating,
      roundedRating,
      feedbackCount: feedbacks.length
    });

    // Use updateOne for more precise update
    const result = await Shop.updateOne(
      { _id: shop._id }, // Use _id for exact match
      { 
        $set: { 
          rating: roundedRating,
          totalRatings: feedbacks.length
        }
      }
    );

    console.log('Update result:', {
      matched: result.matchedCount,
      modified: result.modifiedCount
    });

    // Verify the update
    const updatedShop = await Shop.findById(shop._id);
    console.log('Final shop state:', {
      name: updatedShop.name,
      newRating: updatedShop.rating,
      newTotalRatings: updatedShop.totalRatings
    });

    if (updatedShop.rating !== roundedRating) {
      throw new Error('Rating update failed - values do not match');
    }

    return roundedRating;
  } catch (error) {
    console.error('Error updating shop rating:', error);
    throw error;
  }
}

export async function POST(req: Request) {
  try {
    const { shopName, category } = await req.json();
    
    if (!shopName || !category) {
      return NextResponse.json(
        { error: "Shop name and category are required" },
        { status: 400 }
      );
    }

    const updatedRating = await updateShopRating(shopName, category);
    
    return NextResponse.json({
      success: true,
      rating: updatedRating,
      shopName,
      category
    });
  } catch (error) {
    console.error("Rating update error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update rating" },
      { status: 500 }
    );
  }
}