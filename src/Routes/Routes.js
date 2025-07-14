const express = require("express");
const { CreateUser, getUserById, UserOtpVerify, LogInUser } = require('../controller/userController');
const { LogInAdmin} = require('../controller/AdminController')

const router = express.Router();

// Router Provide CRUD Operation: 
// C - Create (POST), R - Read (GET), U - Update (PUT), D - Delete (DELETE)

// POST route to create a user
router.post('/CreateUser', CreateUser);
router.get('/getUserById/:id', getUserById);
router.post('/user_otp_verify/:id', UserOtpVerify);
router.post('/LogInUser', LogInUser);


// POST route to create a Admin
router.post('/LogInAdmin', LogInAdmin);

router.use((_, res) => { res.status(404).send({ status: false, msg: 'Invalid URL' }) });

module.exports = router;
