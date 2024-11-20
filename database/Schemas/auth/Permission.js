const mongoose = require("mongoose");

const accessSchema = {
    canFetch:{
        type:Boolean,
        default:false
    },
    canCreate:{
        type:Boolean,
        default:false
    },
    canUpdate:{
        type:Boolean,
        default:false
    },
    canDelete:{
        type:Boolean,
        default:false
    },
    fullAccess:{
        type:Boolean,
        default:false
    }
}

const permissionSchema = new mongoose.Schema({
    moduleName:{
    type: String,
    required:true
   },
   routingUrl: {
    type:String
   },
   canAccess:[accessSchema],
   status:{
    type:Number,
    default:1
   }
   
});

// status -
// 1:"active",
// 2:"inactive",
// 3:"deactivated"
// 4:"hold"



// module.exports = mongoose.model("Permission", permissionSchema);