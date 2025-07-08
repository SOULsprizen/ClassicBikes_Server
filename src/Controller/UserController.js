const userModel = require('../Model/userModel');
const { otpVerificationUser } = require('../Mail/UserMail')
const { errorHandlingdata } = require('../error/errorHandling')

exports.CreateUser = async (req, res) => {
    try {
        const data = req.body;

        if (Object.keys(data).length === 0) return res.status(400).send({ status: false, msg: 'Data is empty' });

        const randomOtp = Math.floor(1000 + Math.random() * 9000);

        data.Varification = data.Varification || {};
        data.Varification.user = data.Varification.user || {};
        data.Varification.Admin = data.Varification.Admin || {};
        data.role = 'user';
        data.Varification.user.userOtp = randomOtp;
        const existingUser = await userModel.findOneAndUpdate({ email: data.email }, { $set: { 'Varification.user.userOtp': randomOtp } }).select('+Varification');

        if (existingUser) {
            const DBDATABASE = {name: existingUser.name,email: existingUser.email,_id: existingUser._id}

            const userVerification = existingUser.Varification?.user || {};
            const adminVerification = existingUser.Varification?.Admin || {};

            if (userVerification.isDeleted) return res.status(400).send({ status: false, msg: 'User already deleted' });
            if (userVerification.isVerify) return res.status(400).send({ status: false, msg: 'Account already verified, please login' });
            if (!adminVerification.isAccountActive) return res.status(400).send({ status: false, msg: 'User is blocked by admin' });

            otpVerificationUser(existingUser.name, existingUser.email, randomOtp);
            return res.status(200).send({ status: true, msg: 'OTP sent successfully',data:DBDATABASE });
        }
        otpVerificationUser(data.name, data.email, randomOtp);
        const newUser = await userModel.create(data);
        
        const newDB = {name: newUser.name,email: newUser.email,_id: newUser._id}

        return res.status(201).send({ status: true, msg: 'User created successfully', data: newDB });

    } catch (e) { errorHandlingdata(e, res) }
};

exports.UserOtpVerify = async (req, res) => {
    try {

        const otp = req.body.otp;
        const id = req.params.id;

        if (!otp) return res.status(400).send({ status: true, msg: "pls Provide OTP" });

        const user = await userModel.findById(id);

        if (!user) return res.status(400).send({ status: true, msg: "User not found" });
        const dbOtp = user.Varification.user.userOtp;
        console.log(dbOtp,otp)
        if(!(dbOtp==otp)) return res.status(400).send({ status: true, msg: "Wrong otp" });

        await userModel.findByIdAndUpdate({ _id: id }, { $set: { 'Varification.user.isVerify': true } }, { new: true });
        res.status(200).send({ status: true, msg: "User Verify successfully" });
       
    }   
    catch (e) { errorHandlingdata(e, res) }
}


exports.getUserById = async (req, res) => {
    try {
        const id = req.params.id
        const DB = await userModel.findById(id)
        if (!DB) return res.status(400).send({ status: false, msg: 'Data Not Found' })
        return res.status(200).send({ status: true, data: DB })
    }
    catch (e) { errorHandlingdata(e, res) }
}