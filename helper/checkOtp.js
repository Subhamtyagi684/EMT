const otpModel = require("../database/Models/auth/Otp");

module.exports.generateOtp = function(){
    return Math.floor(100000 + Math.random() * 900000)
}

module.exports.checkOtp=function(obj){
    if(!obj.type || !obj.value || !obj.distributorId){
        throw new Error("Please pass correct payload")
    }
    return otpModel.findOne({
        type:obj.type,
        value:obj.value,
        distributorId:obj.distributorId,
        status:1
    });
}
