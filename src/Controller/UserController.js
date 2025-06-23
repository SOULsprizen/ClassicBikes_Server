const usermodel = require('../Model/UserModel')

exports.CreateUser = async (req, res) => {
    try {
        const data = req.body;     

        const userValidationRules = {
            name: { required: true, regex: /^[A-Za-z ]+$/, errorMsg: 'Invalid Name!' },
            email: { required: true, regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, errorMsg: 'Invalid Email!' },
            password: { required: true, regex: /^(?=.[A-Za-z])(?=.\d)[A-Za-z\d@$!%*?&]{8,}$/, errorMsg: 'Invalid Password!' }
        };

 
     if (Object.keys(data).length === 0) {return res.status(400).send({ status: false, msg: 'Data is empty' });}

        const validationErrors = Object.keys(userValidationRules).map(field => {
                if (userValidationRules[field].required && !data[field]) {return `${field} is Required!`;}
                if (data[field] && !userValidationRules[field].regex.test(data[field])) {return userValidationRules[field].errorMsg;}
                return null;
            }).filter(error => error !== null);

        if (validationErrors.length > 0) {return res.status(400).send({ status: false, msg: validationErrors[0] });}

        const CheckUser = await userModel.findOne({ email: data.email });
        if (CheckUser) return res.status(400).send({ status: false, msg: 'Email Already Exists!' });
        
        const DB = await UserModel.create(data);

        res.status(201).send({ status: true, msg: 'successfull Create User', data: DB });

    }
    catch (e) { res.status(500).send({ status: false, msg: e.message }) }
}

exports.getalldata = async(req, res) => {
    try{
        const DB = await usermodel.find()
        res.status(200).send({status:true, data: DB })
    }
    catch (e) {
        res.status(500).send({status:false, msg: e.message })
}
}

exports.getuserbyId = async(req, res) => {
    try{
        const userId = req.params.id
       
       const DB= await usermodel.findbyId(userId)
        if (!DB) return res.status(404).send({status:false, msg: "User not found" })
            return res.status(200).send({status:true, data: DB })

    }
  catch (e) {
    res.status(500).send({status:false, msg: e.message })
  }

}