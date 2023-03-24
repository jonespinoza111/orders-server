import "dotenv/config";
import express from "express";
import http from "http";
import cors from "cors";
import bodyparser from "body-parser";
import stripe from "stripe";

const stripeApp = stripe(process.env.STRIPE_SECRET_KEY);

const PORT = process.env.PORT || 5000;

import "./config/mongo.js";
import order from './controllers/order.js';

const app = express();

app.use(cors());
app.use(bodyparser.json());
app.use(express.json());
app.use(bodyparser.urlencoded({ extended: false }));

const server = http.createServer(app);

const calculateOrderAmount = (cart) => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  let total =
    cart.length &&
    [...cart].map((item) => item.price * item.quantity).reduce((a, b) => a + b);
    
  const taxAmount = parseFloat((total * 0.085).toFixed(2));

  const checkoutTotal = (total + taxAmount).toFixed(2);
  return parseInt(checkoutTotal * 100);
};

app.post("/create-payment-intent", async (req, res) => {
  const { cart } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripeApp.paymentIntents.create({
    amount: calculateOrderAmount(cart),
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

app.post("/order-successful", order.createOrder);
app.post("/payment-successful", order.updateOrder);
app.get("/order:orderNumber", order.getByOrderNumber)

server.listen(PORT, () => {
  console.log(`The server is running now on PORT ${PORT}`);
});
