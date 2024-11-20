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

const registerValidation = async (req, res, next) => {
    const payload = {
        username: req.body.username,
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

// Login Validatior Funcation -- End

module.exports = { 
    loginWithPasswordValidation,
    registerValidation
 };

