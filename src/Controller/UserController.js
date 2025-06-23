const userModel = require('../Model/userModel');
const {userValidationRules} = require('../Validation/AllValidation')
const {otpVerificationUser} = require('../Mail/UserMail')
const bcrypt = require('bcrypt');

exports.CreateUser = async (req, res) => {
    try {
        const data = req.body;
        
        if (Object.keys(data).length === 0) { return res.status(400).send({ status: false, msg: 'Data is empty' }); }

        const validationErrors = Object.keys(userValidationRules).map(field => {
            if (userValidationRules[field].required && !data[field]) { return `${field} is Required!`; }
            if (data[field] && !userValidationRules[field].regex.test(data[field])) { return userValidationRules[field].errorMsg; }
            return null;
        }).filter(error => error !== null);

        if (validationErrors.length > 0) { return res.status(400).send({ status: false, msg: validationErrors[0] }); }
        const randomOtp = Math.floor(1000 + Math.random() * 9000);

        const CheckUser = await userModel.findOne({ email: data.email });
        if (CheckUser) {
            const {isDeleted,isVerify,isAccountActive} = CheckUser;
            if(isDeleted) return res.status(400).send({ status: false, msg: 'User Already Deleted' })
            if(!isAccountActive) return res.status(400).send({ status: false, msg: 'User Already Block' })
            if(isVerify) return res.status(400).send({ status: false, msg: 'Account Already Verify Ps Login' })
                otpVerificationUser(data.name,data.email,randomOtp)
            return res.status(200).send({ status: true, msg: 'Otp Send Successfully...' })
        }

        data.password = await bcrypt.hash(data.password, 10);
        data.role = 'user'
        data.userOtp =randomOtp

        otpVerificationUser(data.name,data.email,randomOtp)
        const DB = await userModel.create(data);

        res.status(201).send({ status: true, msg: 'successfull Create User', data: DB });

    }
    catch (e) { res.status(500).send({ status: false, msg: e.message }) }
}




exports.getUserById = async (req, res) => {
    try {
        const id = req.params.id
        const DB = await userModel.findById(id)
        if (!DB) return res.status(400).send({ status: false, msg: 'Data Not Found' })
        return res.status(200).send({ status: true, data: DB })
    }
    catch (e) { res.status(500).send({ status: false, msg: e.message }) }
}