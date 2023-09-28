const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');

const orderRouter = express.Router();

orderRouter.use(bodyParser.json());

// Import JSON files
const orders = require('../data/order.json'); 
const users = require('../data/user.json'); 
const products = require('../data/products.json');
const cart = require('../cart.json'); 

orderRouter.get('/history', (req, res) => {
  res.send(orders);
});

orderRouter.delete('/history/:orderId', (req, res) => {
  const orderId = req.params.orderId;

  const orderIndex = orders.findIndex((order) => order.id == parseInt(orderId));

  if (orderIndex === -1) {
    return res.status(404).send(`The order with ${orderId} id could not be found.`);
  }

  orders.splice(orderIndex, 1);
  fs.writeFileSync(path.join(__dirname, '../data/orders.json'), JSON.stringify(orders, null, 2), 'utf-8');
  res.send(`Order removed Successfully.`);
});

// Adding products to cart
orderRouter.post('/addToCart', (req, res) => {
  const { userId, productId, quantity } = req.body; 
  const user = users.find((user) => user.id == parseInt(userId));
  const product = products.find((product) => product.id == parseInt(productId));

  if (!user || !product) {
    return res.status(404).send(`User or Product could not be found.`);
  }

  const totalPrice = product.price * quantity; // Calculate total price for this cart item

  const cartItem = {
    userId,
    productId,
    quantity,
    totalPrice, 
  };

  if (!user.cart) {
    user.cart = [];
  }

  user.cart.push(cartItem);
  fs.writeFileSync(path.join(__dirname, '../data/users.json'), JSON.stringify(users, null, 2), 'utf-8');
  res.send("Items added to cart Successfully.");
});

// Checkout
orderRouter.post('/checkout', (req, res) => {
  const { userId } = req.body;
  const user = users.find((user) => user.id == parseInt(userId));

  if (!user) {
    return res.status(404).send("User is not found");
  }

  if (!user.cart || user.cart.length === 0) { // Check if the cart is empty
    return res.status(404).send("User's Cart is empty.");
  }

  // Calculate the total price of items in the user's cart
  const totalPrices = user.cart.reduce((total, item) => total + item.totalPrice, 0);

  if (totalPrices < 500) {
    return res.status(400).send("Minimum order total not met.");
  }

  // Create a new order object
  const newOrder = {
    id: orders.length + 1, 
    userId: user.id,
    items: user.cart,
    total_price: totalPrices, 
    order_status: "pending",
    order_date: new Date().toISOString().slice(0, 10),
  };

  orders.push(newOrder);
  fs.writeFileSync(path.join(__dirname, '../data/orders.json'), JSON.stringify(orders, null, 2), 'utf-8');

  // Clear the user's cart after successful checkout
  user.cart = [];
  fs.writeFileSync(path.join(__dirname, '../data/users.json'), JSON.stringify(users, null, 2), 'utf-8');

  res.send("Order generated Successfully.");
});

module.exports = orderRouter;
