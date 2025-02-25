import mongoose from "mongoose";

const mealSchema = new mongoose.Schema({
  id: String,
  name: String,
  price: String,
  description: String,
  image: String,
});

// ✅ Check if the model already exists before defining it
const Meals = mongoose.model("Meals", mealSchema);

export default Meals;
