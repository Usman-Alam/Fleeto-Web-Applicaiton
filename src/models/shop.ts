import mongoose from "mongoose";

const shopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Shop name is required"],
    trim: true,
    unique: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    trim: true
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    enum: ["Restaurant", "Grocery", "Medicine"]
  },
  cuisines: [{
    type: String,
    trim: true
  }],
  contact: {
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true
    }
  },
  address: {
    street: {
      type: String,
      required: [true, "Street address is required"],
      trim: true
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true
    },
    postalCode: {
      type: String,
      trim: true
    }
  },
  deliveryTimeEstimate: {
    min: {
      type: Number,
      required: [true, "Minimum delivery time is required"]
    },
    max: {
      type: Number,
      required: [true, "Maximum delivery time is required"]
    }
  },
  deliveryFee: {
    type: Number,
    required: [true, "Delivery fee is required"]
  },
  freeDeliveryAbove: {
    type: Number,
    default: null
  },
  image: {
    type: String,
    default: "/no_shop.png" // Default image path
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  },
  rating: {
    type: Number,
    default: null
  },
  totalRatings: {
    type: Number,
    default: 0
  }
});

// Create indexes
shopSchema.index({ name: 1, slug: 1 });

const Shop = mongoose.models.Shop || mongoose.model("Shop", shopSchema);
export default Shop;