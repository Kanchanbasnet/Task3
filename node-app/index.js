const express = require('express');
const bodyParser = require('body-parser');
const userRouter = require('./routes/user.js');
const productRouter = require('./routes/products.js');
const orderRouter = require('./routes/order.js');

const app = express();
const PORT = 4000;

app.use(bodyParser.json());

app.use('/user', userRouter);
app.use('/products', productRouter);
app.use('/order', orderRouter);
app.use('/addToCart',orderRouter);

app.get('/', (req, res) => {
  res.send('Hello from Homepage');
});

app.listen(PORT, () => {
  console.log(`The server is running on the port: http://localhost:${PORT}`);
});
