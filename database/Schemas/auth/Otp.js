const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const otpSchema = new mongoose.Schema({
    distributorId:{
    type: Number,
    required:true
   },
   userId:{
    type: ObjectId,
    ref:"User"
   },
   type:{
    type:String,
    required:true
   },
   value:{
    type:String,
    required:true
   },
   status:{
    type:Number,
    default: 1
   },
   expireAt:{
    type:Date,
    required:true
   }
});


// status -
// 1:"active",
// 2:"inactive/expired",
// 3:"deactivated/accessed"

// module.exports = mongoose.model("Otp", otpSchema);