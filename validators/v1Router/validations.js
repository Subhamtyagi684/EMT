const joi = require("joi");
const {ApiResponse}  = require("../../Response")
// Login Validatior Funcation -- Start


const loginWithPasswordValidator = joi.object({
    email: joi.string().required(),
    password: joi.string().min(4).trim(true).required()
});




const loginWithPasswordValidation = async (req, res, next) => {
    const payload = {
        email: req.body.email,
        password: req.body.password
    };

    const { error } = loginWithPasswordValidator.validate(payload);
    if (error) {
        // res.status(406);
        // return res.json(
        //     errorFunction(true, `Error in Payload Data : ${error.message}`)
        // );
        let apiResponse = new ApiResponse();
        apiResponse.setStatus(406);
        apiResponse.setMessage("Error in payload, please check again");
        return res.send(apiResponse)
    } else {
        next();
    }
};

const registerValidator = joi.object({
    "firstName": joi.string().required(),
    "lastName": joi.string(),
    "email": joi.string().required(),
    "password": joi.string().min(7).required(),
    "userType":  joi.number().required()
})

const registerValidation = async (req, res, next) => {
    const payload = {
        "firstName": req.body["firstName"],
        "lastName": req.body["lastName"],
        "email": req.body["email"],
        "password": req.body["password"],
        "userType":req.body["userType"]
    };

    const { error } = registerValidator.validate(payload);
    if (error) {
        // res.status(406);
        // return res.json(
        //     errorFunction(true, `Error in Payload Data : ${error.message}`)
        // );
        let apiResponse = new ApiResponse();
        apiResponse.setStatus(406);
        apiResponse.setMessage("Error in payload, please check again");
        return res.send(apiResponse)
    } else {
        next();
    }
};

// Login Validatior Funcation -- End

module.exports = { 
    loginWithPasswordValidation,
    registerValidation
 };

