import mongoose from "mongoose";

const mealSchema = new mongoose.Schema({
    orderId : {
        type: String,
        required: true,
        trim: true
      },
    email: {
      type: String,
      required: true,
      match: /.+\@.+\..+/ // Simple email validation
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    street: {
      type: String,
      required: true,
      trim: true
    },
    postalCode: {
      type: String,
      required: true,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    items: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true, min: 1 },
        description: { type: String, required: true },
      }
    ],
    createdAt: {
      type: Date,
      default: Date.now
    }
  });

// ✅ Check if the model already exists before defining it
const Order = mongoose.model("Orders", mealSchema);

export default Order;