const userModel = require('../Model/userModel');
const { otpVerificationAdmin } = require('../Mail/UserMail')
const { errorHandlingdata } = require('../error/errorHandling')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config();



exports.LogInAdmin = async (req, res) => {
    try {
        const data = req.body;
        const { email, password } = data;

        const randomOtp = Math.floor(1000 + Math.random() * 9000);

        const existingUser = await userModel.findOne({ email: email, role: 'admin' });

        if (!existingUser) return res.status(400).send({ status: false, msg: "User Not Found" });

        const comparePass = await bcrypt.compare(password, existingUser.password);
        if (!comparePass) return res.status(400).send({ status: false, msg: "Wrong Password" });

        await userModel.findOneAndUpdate({ email: email, role: 'admin' }, { $set: { 'Varification.Admin.adminOtp': randomOtp } });

        otpVerificationAdmin(existingUser.name, existingUser.email, randomOtp);

        const token = jwt.sign({ userId: existingUser._id }, process.env.JWT_Admin_SECRET_KEY, { expiresIn: '1d' });
        return res.status(200).send({ status: true, msg: 'Admin Login successfully', data: { token, id: existingUser._id } });

    }
    catch (e) { errorHandlingdata(e, res) }
}