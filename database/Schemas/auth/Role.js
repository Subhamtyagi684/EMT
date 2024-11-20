const mongoose = require("mongoose");
const roleSchema = new mongoose.Schema({
    name:{
    type: String,
    required:true
   },
   shortName: {
    type: String,
    required:true
   },
   description:{
    type:String
   },
   type:{
    type:String,
    enum:["CUSTOM","DEFAULT"],
    default:"DEFAULT"
   },
   status:{
    default:1,
    type:Number
   },
   permissions:[
        {
            permissionId: {
                type:mongoose.Types.ObjectId,
                ref:"Permission",
                
                required:true
            },
            accessId:{
                type:mongoose.Types.ObjectId,
                default:null,
                required:true
            }
        }
    ]
   
   
});

// status -
// 1:"active",
// 2:"inactive",
// 3:"deactivated"
// 4:"hold"



// module.exports = mongoose.model("role", roleSchema);