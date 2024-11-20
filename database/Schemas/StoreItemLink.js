const mongoose = require("mongoose");


let storeItemSchema = new mongoose.Schema({
    storeId: {
        type: mongoose.Types.ObjectId,
        ref: "Store",
        required: true
    },
    itemId: {
        type: mongoose.Types.ObjectId,
        ref: "Itemdetail",
        required: true
    },
    isActive: {
        type: Boolean,
        required:true,
        default: true
    },
    createdAt: {
        type: Date,
        default: function(){
            return new Date()
        }
    }

})

// module.exports = new mongoose.model("store_item",storeItemSchema);