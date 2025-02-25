import fs from 'node:fs/promises';
import axios from "axios";
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import express from 'express';
import mongoose from "mongoose";
import Meals from "./models/Meals.js"; // Import the Meal model
import Order from './models/Orders.js';


const app = express();  

app.use(bodyParser.json());

mongoose
  .connect("mongodb+srv://test-praveen:sCJTqsMkzO7YSufo@cluster0.als6h.mongodb.net/test", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static('public'));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// app.get('/meals', async (req, res) => {
//   const meals = await fs.readFile('/Users/praveenkumarc/Documents/React_project/13-managing-form-status-actions/backend/data/available-meals.json', 'utf8');
//   res.json(JSON.parse(meals));
// });

app.get("/get-pincode/:pincode", async (req, res) => {
  try {
      const { pincode } = req.params;
      const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
      
      // Send API response to the client
      var postOffice = response.data[0]['PostOffice']
      console.log("PostCode Data",response);
      res.json({response : postOffice});
  } catch (error) {
      res.status(500).json({ error: "Failed to fetch data" });
  }
});

const generateOrderId = () => {
  const timestamp = Date.now(); // Current timestamp
  const randomNum = Math.floor(1000 + Math.random() * 9000); // Random 4-digit number
  return `ORD-${timestamp}-${randomNum}`;
};

app.post('/orders', async (req, res) => {
  try {
    const orderData = req.body.order;
    orderData['orderId'] = `"#"+${generateOrderId()}`;

    if (!orderData || !orderData.items || orderData.items.length === 0) {
      return res.status(400).json({ message: "Missing order data." });
    }

    if (
      !orderData.email ||
      !orderData.email.includes("@") ||
      !orderData.name ||
      orderData.name.trim() === "" ||
      !orderData.street ||
      orderData.street.trim() === "" ||
      !orderData.postalCode ||
      orderData.postalCode.trim() === "" ||
      !orderData.city ||
      orderData.city.trim() === ""
    ) {
      return res.status(400).json({
        message: "Missing customer data: Email, name, street, postal code, or city is required.",
      });
    }


    // Create new order in MongoDB
    const newOrder = new Order(orderData);
    await newOrder.save();

    res.  status(201).json({ message: "Order created!", order: newOrder });
  } catch (error) {
    console.error("Error saving order:", error);
    res.status(500).json({ message: "Failed to create order." });
  }
  // const orderData = req.body.order;

  // await new Promise((resolve) => setTimeout(resolve, 1000));

  // if (orderData === null || orderData.items === null || orderData.items.length === 0) {
  //   return res
  //     .status(400)
  //     .json({ message: 'Missing data.' });
  // } 

  // if (
  //   orderData.customer.email === null ||
  //   !orderData.customer.email.includes('@') ||
  //   orderData.customer.name === null ||
  //   orderData.customer.name.trim() === '' ||
  //   orderData.customer.street === null ||
  //   orderData.customer.street.trim() === '' ||
  //   orderData.customer['postalCode'] === null ||
  //   orderData.customer['postalCode'].trim() === '' ||
  //   orderData.customer.city === null ||
  //   orderData.customer.city.trim() === ''
  // ) {
  //   return res.status(400).json({
  //     message:
  //       'Missing data: Email, name, street, postal code or city is missing.',
  //   });
  // }

  // const newOrder = {
  //   ...orderData,
  //   id: (Math.random() * 1000).toString(),
  // };
  // const orders = await fs.readFile('/Users/praveenkumarc/Documents/React_project/13-managing-form-status-actions/backend/data/orders.json', 'utf8');
  // const allOrders = JSON.parse(orders);
  // allOrders.push(newOrder);
  // await fs.writeFile('/Users/praveenkumarc/Documents/React_project/13-managing-form-status-actions/backend/data/orders.json', JSON.stringify(allOrders));
  // res.status(201).json({ message: 'Order created!' });
});

app.get("/get-orders", async (req, res) => {
  try {
    const orders = await Order.find(); // Fetch all orders from MongoDB
    console.log("Old Orders Data",orders);
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

app.get("/get-meals", async (req, res) => {
  try {
    const meals = await Meals.find(); // Fetch all orders from MongoDB
    console.log("Meals",meals);
    res.status(200).json(meals);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});


app.use((req, res) => {
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  res.status(404).json({ message: 'Not found' });
});

app.listen(3000);
