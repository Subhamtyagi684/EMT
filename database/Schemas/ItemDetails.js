const mongoose = require("mongoose");


let itemDetailSchema = new mongoose.Schema({
    itemId: {
        type: mongoose.Types.ObjectId,
        ref: "Item",
        required: true
    },
    brandId: {
        type: mongoose.Types.ObjectId,
        ref: "Brand",
        required: true
    },
    categoryId:{
        type: mongoose.Types.ObjectId,
        ref:"Category",
        required:true,
        subCategory: {
            type: mongoose.Types.ObjectId,
            ref: "subcategory"
        }
    },
    countryId:{
        type: mongoose.Types.ObjectId,
        ref:"Country",
        required:true
    },
    dp:{
        type: Number,
        required:true
    },
    mrp:{
        type: Number,
        required:true
    },
    taxId:{
        type: mongoose.Types.ObjectId,
        ref:"Tax"
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

// module.exports = new mongoose.model("Itemdetail",itemDetailSchema);