const mongoose = require("mongoose");


let addressSchema = new mongoose.Schema({
    userId: {
        type:mongoose.Types.ObjectId,
        ref:"user"
    },
    address: [
        {
            addressLine1: {
                type: String,
                required:true
            },
            addressLine2:{
                type:String,
                default: null
            },
            isDefault:{
                type:Boolean,
                default:false
            }
        }
    ]

})

// module.exports = new mongoose.model("Address",addressSchema);