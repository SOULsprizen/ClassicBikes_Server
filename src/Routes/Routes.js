const express = require("express");
const { CreateUser, getAllData } = require('../controller/userController');

const router = express.Router();

// Router Provide CRUD Operation: 
// C - Create (POST), R - Read (GET), U - Update (PUT), D - Delete (DELETE)

// POST route to create a user
router.post('/CreateUser', CreateUser);

// GET route to fetch all user data
router.get('/getAllData', getAllData);

router.use((_, res) => {res.status(404).send({ status: false, msg: 'Invalid URL' })});

module.exports = router;
