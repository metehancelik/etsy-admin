import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      min: 3,
      max: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    img: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
  },
  { timestamps: true }
);

const orderSchema = new mongoose.Schema(
  {
    store_name: {
      type: String,
      default: process.env.STORE_NAME,
    },
    sale_date: {
      type: Date,
      default: Date.now(),
    },
    shipment_date: {
      type: Date,
      default: Date.now(),
    },
    ship_by_date: {
      type: Date,
      default: Date.now(),
    },
    source_id: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    etsy_listing_id: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    variations: {
      type: String,
    },
    personalizations: {
      type: String,
    },
    is_gift: {
      type: Boolean,
      default: false,
    },
    gift_message: {
      type: String,
    },
    buyer_message: {
      type: String,
    },
    needs_gift_wrap: {
      type: Boolean,
      default: false,
    },
    shipping_method: {
      type: String,
      default: "Standard Shipping",
    },
    buyer: {
      type: String,
    },
    ship_name: {
      type: String,
    },
    ship_adress: {
      type: String,
    },
    ship_city: {
      type: String,
    },
    ship_state: {
      type: String,
    },
    ship_country: {
      type: String,
    },
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model("User", userSchema);
export const Order =
  mongoose.models.Order || mongoose.model("Order", orderSchema);
