
const joi = require("joi");
const {ApiResponse}  = require("../../Response")
// Login Validatior Funcation -- Start


const fetchUserListValidator = joi.object({
    "limit": joi.number(),
    "page": joi.number()
})

const fetchUserList = async (req, res, next) => {
    const payload = {
        limit: req.body.limit,
        page: req.body.page
    };

    const { error } = fetchUserListValidator.validate(payload);
    if (error) {
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
    fetchUserList
 };

