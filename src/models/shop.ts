import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Add this before the schema definition
const defaultRestaurantMenu = [
  {
    dishname: "Sample Dish",
    dishdescription: "A delicious sample dish",
    dishprice: 9.99
  }
];

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
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must be at least 8 characters long"]
  },
  menu: [{
    dishname: {
      type: String,
      required: [true, "Dish name is required"],
      trim: true
    },
    dishdescription: {
      type: String,
      required: [true, "Dish description is required"],
      trim: true
    },
    dishprice: {
      type: Number,
      required: [true, "Dish price is required"]
    }
  }]
});

// Pre-save middleware to hash password
shopSchema.pre('save', async function(next) {
  // Only hash the password if it's new or modified
  if (!this.isModified('password')) return next();

  try {
    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Add this after schema definition but before model creation
shopSchema.pre('save', async function(next) {
  if (this.isNew && this.category === 'Restaurant' && (!this.menu || this.menu.length === 0)) {
    this.menu = defaultRestaurantMenu;
  }
  next();
});

// Method to compare passwords
shopSchema.methods.comparePassword = async function(candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Create indexes
shopSchema.index({ name: 1, slug: 1 });
shopSchema.index({ "contact.email": 1 }, { unique: true });
shopSchema.index({ "menu.dishname": 1 });

const Shop = mongoose.models.Shop || mongoose.model("Shop", shopSchema);
export default Shop;