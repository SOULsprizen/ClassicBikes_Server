const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    profileImg: {
        type: {
            url: { type: String, required: false, trim: true },
            public_id: { type: String, required: false, trim: true }
        },  trim: true
    },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true, trim: true },
    userOtp: { type: String, default: 0 },
    isDeleted: { type: Boolean, default: false },
    isVerify: { type: Boolean, default: false },
    isAccountActive: { type: Boolean, default: true },
    role: { type: String, enum: ['user', 'admin'], required: true, trim: true }
},
    { timestamps: true }
);


module.exports = mongoose.model('User', userSchema);