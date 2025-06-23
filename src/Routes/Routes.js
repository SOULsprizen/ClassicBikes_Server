const express = require("express");
const { CreateUser,getUserById } = require('../controller/userController');

const router = express.Router();

// Router Provide CRUD Operation: 
// C - Create (POST), R - Read (GET), U - Update (PUT), D - Delete (DELETE)

// POST route to create a user
router.post('/CreateUser', CreateUser);
router.get('/getUserById/:id', getUserById);

router.use((_, res) => {res.status(404).send({ status: false, msg: 'Invalid URL' })});

module.exports = router;
