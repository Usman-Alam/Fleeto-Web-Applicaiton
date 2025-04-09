import mongoose, { Schema, model, models } from "mongoose";

const FoodItemSchema = new Schema({
  name: String,
  description: String,
  image: String,
  price: Number,
  discountedPrice: Number,
  isAvailable: { type: Boolean, default: true },
  isVeg: Boolean,
  isHalal: Boolean,
  spiceLevel: { type: String, enum: ['Mild', 'Medium', 'Spicy'], default: 'Medium' },
  tags: [String], // e.g., "best seller", "combo", etc.
  customizations: [{
    name: String, // e.g. "Size", "Toppings"
    options: [{
      label: String, // e.g. "Small", "Extra Cheese"
      additionalCost: Number
    }]
  }]
});

const MenuCategorySchema = new Schema({
  title: String, // e.g. "Burgers", "Drinks"
  description: String,
  foodItems: [FoodItemSchema]
});

const RestaurantSchema = new Schema({
  name: String,
  slug: { type: String, unique: true },
  description: String,
  image: String,
  coverImage: String,
  cuisines: [String], // e.g. ["Italian", "Fast Food"]
  address: {
    street: String,
    city: String,
    postalCode: String,
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: [Number] // [longitude, latitude]
    }
  },
  contact: {
    phone: String,
    email: String
  },
  isOpen: { type: Boolean, default: true },
  openingHours: [{
    day: { type: String, enum: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] },
    open: String,
    close: String
  }],
  deliveryTimeEstimate: { min: Number, max: Number }, // in minutes
  deliveryFee: Number,
  freeDeliveryAbove: Number,
  rating: {
    average: Number,
    totalRatings: Number
  },
  menu: [MenuCategorySchema],
  offers: [{
    title: String,
    description: String,
    type: { type: String, enum: ['percentage', 'flat'] },
    value: Number,
    minimumOrder: Number,
    validUntil: Date
  }],
  createdAt: { type: Date, default: Date.now }
});

RestaurantSchema.index({ "address.location": "2dsphere" });

export default models.Restaurant || model("Restaurant", RestaurantSchema);
