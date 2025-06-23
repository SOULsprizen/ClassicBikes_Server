const express = require('express');
const router = express.Router();
const {CreateUser,getuserbyId,getalldata,} = require('../Controller/UserController')



router.post('/test',CreateUser );
router.get('getuserbyId/:id',getuserbyId)
router.get('/getalldata', getalldata);
module.exports = router;