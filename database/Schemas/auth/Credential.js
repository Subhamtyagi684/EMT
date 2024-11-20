const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const credentialSchema = new mongoose.Schema({
   userId:{
    type: ObjectId,
    ref:"User",
    required:true
   },
   password: {
    type:String,
    required:true
   },
   distributorId: {
    type: Number,
    unique:true,
    required: true,
    index:true
   },
   expireAt:{
    type: Date
   },
   resetAt:{
    type:Date,
    default:null
   },
   userGeneratedPassword:{
    type:Boolean,
    default:false
   },
   firstTimeLogin:{
      type:Boolean,
      default:true
   }
});



// module.exports = mongoose.model("Credential", credentialSchema);