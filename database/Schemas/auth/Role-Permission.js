const mongoose = require("mongoose");
const permissionSchema = new mongoose.Schema({
    role:{
        type:mongoose.Types.ObjectId
    },
    permissions:{
        type:[mongoose.Types.ObjectId]
    },
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



// module.exports = mongoose.model("RolePermission", permissionSchema);