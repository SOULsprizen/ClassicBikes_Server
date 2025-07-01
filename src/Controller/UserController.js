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

        const existingUser = await userModel.findOneAndUpdate({ email: data.email, 'Varification.user.userOtp': randomOtp }).select('+Varification');

        if (existingUser) {
            const userVerification = existingUser.Varification?.user || {};
            const adminVerification = existingUser.Varification?.Admin || {};

            if (userVerification.isDeleted) return res.status(400).send({ status: false, msg: 'User already deleted' });
            if (userVerification.isVerify) return res.status(400).send({ status: false, msg: 'Account already verified, please login' });
            if (!adminVerification.isAccountActive) return res.status(400).send({ status: false, msg: 'User is blocked by admin' });

            otpVerificationUser(existingUser.name, existingUser.email, randomOtp);
            return res.status(200).send({ status: true, msg: 'OTP sent successfully' });
        }

        otpVerificationUser(data.name, data.email, randomOtp);
        const newUser = await userModel.create(data);

        return res.status(201).send({ status: true, msg: 'User created successfully', data: newUser });

    } catch (e) { errorHandlingdata(e, res) }
};


exports.getUserById = async (req, res) => {
    try {
        const id = req.params.id
        const DB = await userModel.findById(id)
        if (!DB) return res.status(400).send({ status: false, msg: 'Data Not Found' })
        return res.status(200).send({ status: true, data: DB })
    }
    catch (e) { res.status(500).send({ status: false, msg: e.message }) }
}