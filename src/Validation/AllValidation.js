exports.userValidationRules = {
    name: { required: true, regex: /^[A-Za-z ]+$/, errorMsg: 'Invalid Name!' },
    email: { required: true, regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, errorMsg: 'Invalid Email!' },
    password: { required: true, regex: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/, errorMsg: 'Invalid Password!' }
};