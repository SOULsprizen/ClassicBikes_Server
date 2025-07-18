const { errorHandlingdata } = require('../error/errorHandling')
const jwt =require('jsonwebtoken')
exports.authenticate = (req, res, next) => {
    try {
        const token = req.headers["x-api-key"]
        if (!token) { return res.status(400).send({ status: false, msg: "Token must be present" }) }

        const decodedToken = jwt.verify(token, process.env.JWT_Admin_SECRET_KEY)
        // req.user = decodedToken
     
        next()
    }
    catch (e) { errorHandlingdata(e, res) }

}

