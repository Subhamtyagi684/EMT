const mongoose = require("mongoose");
const tokenSchema = new mongoose.Schema({
    distributorId:{
    type: Number,
    required:true,
    index: true
   },
   token: {
    type: String,
    required:true
   },
   roles:{
        type:[mongoose.Types.ObjectId],
        ref:"roles",
        default:[]
   },
    permissions:{
        type:[
            {
                permissionId: {
                    type:mongoose.Types.ObjectId,
                    ref:"Permission"
                },
                accessId:{
                    type:mongoose.Types.ObjectId,
                    default:null
                }
            }
        ],
        default:[]
   },
   status:{
    default:1,
    type:Number
   }
});

// status -
// 1:"active",
// 2:"inactive",
// 3:"deactivated"
// 4:"hold"



// module.exports = mongoose.model("Token", tokenSchema);