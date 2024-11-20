const mongoose = require("mongoose");


let taxSchema = new mongoose.Schema({
    tax: {
        type: Number
    },
    type: {
        type: String
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

// module.exports = new mongoose.model("Tax",taxSchema);