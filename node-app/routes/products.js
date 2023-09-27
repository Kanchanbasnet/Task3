const express = require('express');
const bodyParser = require('body-parser');

const productRouter = express.Router();
productRouter.use(express.json());

let products = [
    {
        "id": 101,
        "productName": "Laptop",
        "price": 999,
        "quantity": 3,
        "description": "High-end Laptop",
        "productType": "Electronics"
    },
    {
        "id": 102,
        "productName": "SmartPhone",
        "price": 888,
        "quantity": 2,
        "description": "High-end Mobile",
        "productType": "Electronics"
    },
    {
        "id": 103,
        "productName": "SmartWatch",
        "price": 555,
        "quantity": 6,
        "description": "High-end Watch",
        "productType": "Electronics"
    },
    {
        "id": 104,
        "productName": "Fish",
        "price": 555,
        "quantity": 9,
        "description": "Sea-Food",
        "productType": "Grocery"
    },
    {
        "id": 105,
        "productName": "Pant",
        "price": 555,
        "quantity": 10,
        "description": "Clothes",
        "productType": "Clothing"
    }
];

productRouter.get('/', (req, res) => {
    console.log(products);
    res.json(products);
});

productRouter.post('/', (req, res) => {
    const product = req.body;
    products.push(product);

    res.send(`The product with id ${product.id} has been added successfully.`);
});

productRouter.get('/:searchQuery', (req, res) => {
    const searchQuery = req.params.searchQuery;
    const filteredProduct = products.filter((product) => {
        const productName = product.productName;
        const description = product.description;

        return productName.includes(searchQuery) || description.includes(searchQuery);
    });
    res.json(filteredProduct);
});

productRouter.delete('/:id', (req, res) => {
    const { id } = req.params;
    products = products.filter((product) => product.id !== parseInt(id));
    res.send(`The product with ${id} id has been deleted successfully.`);
});

productRouter.patch('/:productName', (req, res) => {
    const { productName } = req.params;
    const { quantity } = req.body;

    const foundProduct = products.find((product) => product.productName === productName);

    if (!foundProduct) {
        return res.status(404).send(`Product with name ${productName} not found.`);
    }

    if (typeof quantity !== 'number' || quantity < 0) {
        return res.status(400).send('Invalid quantity value.');
    }

    foundProduct.quantity = quantity;

    res.send(`Product with name ${productName} has been updated successfully.`);
});

productRouter.get('/outofStock', (req, res) => {
    const outofStock = products.filter((product) => product.quantity < 5);
    res.send(outofStock);
    console.log(outofStock);
});

module.exports = productRouter;
