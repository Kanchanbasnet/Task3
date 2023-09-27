const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const orderRouter = express.Router();

// Import JSON files
const orders = require('../data/order.json');
const users = require('../data/user.json');
const products = require('../data/products.json');
let cart = require('../data/cart.json');




// Adding products to cart
orderRouter.post('/addToCart', (req, res) => {
  const { userId, productId, quantity } = req.body;
  const user = users.find((user) => user.id == parseInt(userId));
  const product = products.find((product) => product.id == parseInt(productId));

  if(!user || !product) {
    return res.status(404).send(`User or Product could not be found.`);
  }
  const totalPrice = product.price * product.quantity;

  const cartItem ={  userId, productId, productName:product.productName,quantity,totalPrice};
  if (!user.cart) {
    user.cart = [];
  }
  user.cart.push(cartItem);
  cart.push(cartItem);
  fs.writeFileSync('cart.json',JSON.stringify(cart,null,2), "utf-8");
  res.send("Items added to cart Successfully.");



});
orderRouter.post('/checkout',(req,res)=>{
    const {userId} = req.body;
    const user = users.find((user) => user.userId == parseInt(userId));
    if(!user){
       return res.status(404).send("User is not found");
    }
    const totalPrices = user.cart.reduce((total,item) => total + item.totalPrice, 0);
    if(totalPrices < 500){
        res.send(`Minumum Order.`);
    }
    const newOrder={
        orderId : orders.length +1,
        quantity : products.quantity,
        userId : user.id,
        totalPrice : totalPrices



    }
    orders.push(newOrder);
    fs.writeFileSync('order.json',JSON.stringify(orders,null,2), 'utf-8');
    res.send("Orders generated Successfully.");

});
orderRouter.get('/history',(req,res)=>{
    res.send(orders);
})





module.exports = orderRouter;
