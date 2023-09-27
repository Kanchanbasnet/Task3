const express = require('express');

const userRouter = express.Router();

let user = [
    {

        "id": 1,
        "firstName":"Kanchan",
        "lastName": "Basnet",
        "email" : "Kanchanbasnet5@gmail.com"
    },
    
    {
        "id" : 2,
        "firstName" : "Ram",
        "lastName" : "Shrestha",
        "email" : "RamShrestha@gmail.com"
    
    },
    
    {
        "id" : 3,
        "firstName" : "Sita",
        "lastName" : "Thapa",
        "email" : "SitaThapa@gmail.com"
    }
];

userRouter.get('/', (req, res) => {
    res.json(user);
});

userRouter.post('/', (req, res) => {
    console.log("Post Route Reached.");
    const newUser = req.body;
    user.push(newUser);

    res.send(`User with the name ${newUser.firstName} added to the Database Successfully.`);
});

userRouter.get('/:id', (req, res) => {
    const { id } = req.params;
    const findUser = user.find((users) => users.id === parseInt(id));
    res.send(findUser);
});

userRouter.delete('/:id', (req, res) => {
    const { id } = req.params;
    user = user.filter((users) => users.id !== parseInt(id));
    res.send(`User with id ${id} is successfully deleted from the database.`);
});

userRouter.patch('/:id', (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, email } = req.body;
    const foundUser = user.find((users) => users.id === parseInt(id));
    if (firstName) {
        foundUser.firstName = firstName;
    }
    if (lastName) {
        foundUser.lastName = lastName;
    }
    if (email) {
        foundUser.email = email;
    }

    res.send(`User with id ${id} has been updated.`);
});

module.exports = userRouter;
