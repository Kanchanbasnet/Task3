const express = require('express');
const bodyParser = require('body-parser');
const userRouter = require('./routes/user.js');
const productRouter = require('./routes/products.js');
const orderRouter = require('./routes/order.js');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Use routers for different routes
app.use('/users', userRouter); // User-related routes
app.use('/products', productRouter); // Product-related routes
app.use('/orders', orderRouter); // Order-related routes

app.get('/', (req, res) => {
  res.send('Hello from Homepage');
});

app.listen(PORT, () => {
  console.log(`The server is running on the port: http://localhost:${PORT}`);
});
