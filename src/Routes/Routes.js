const express = require("express");
const { CreateUser, getUserById, UserOtpVerify, LogInUser, resendOtp,userDelete,userupdated,
    changePassword} = require('../controller/userController');
const { LogInAdmin, GetAllUserData } = require('../controller/AdminController')
const { authenticate } = require('../middleware/adminAuth')
const {userAuthenticate,userAuthorize} =require('../middleware/userAuth')
const router = express.Router();

// Router Provide CRUD Operation: 
// C - Create (POST), R - Read (GET), U - Update (PUT), D - Delete (DELETE)

// POST route to create a user
router.post('/CreateUser', CreateUser);
router.get('/getUserById/:id', getUserById);
router.post('/user_otp_verify/:id', UserOtpVerify);
router.post('/LogInUser', LogInUser);
router.get('/resendOtp/:id', resendOtp);
router.delete('/userDelete/:id', userAuthenticate,userAuthorize, userDelete);
router.put('/userupdated/:id', userAuthenticate,userAuthorize, userupdated);
router.put('/changePassword/:id', userAuthenticate,userAuthorize, changePassword);


// POST route to create a Admin
router.post('/LogInAdmin', LogInAdmin);
router.get('/GetAllUserData/:type/:isDeleted',authenticate, GetAllUserData);

router.use((_, res) => { res.status(404).send({ status: false, msg: 'Invalid URL' }) });

module.exports = router;
