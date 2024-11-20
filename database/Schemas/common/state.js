const mongoose = require("mongoose");
// id, lkupcode, brandcode, brandname, status, sortorder
const StateSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique:true
    },
    gststatecode: {
        type: String,
        
    },
   
    gststateid: {
        type: Number,
        required:true
       
    },
    countryid: {
        type: Number,
       
    },
  
    statename: {
        type: String,
       
    },
    gstin: {
        type: String,
       
    },
    isunionterritory: {
        type: Number,
       
    },
    signatoryname: {
        type: String,
       
    },
    designation: {
        type: String,
       
    },
    signimage: {
        type: String,
       
    },
    signimagepath: {
        type: String,
       
    },
    signaturebaseurl: {
        type: String,
       
    },
    signatureimgname: {
        type: String,
       
    },
    registeredlocation: {
        type: String,
       
    },
    reportlocation: {
        type: String,
       
    },
    username: {
        type: String,
       
    },
    password: {
        type: String,
       
    },
    cessstatus: {
        type: Number,
       
    },
    echallanusername: {
        type: String,
       
    },
    echallanpassword: {
        type: String,
       
    },
    echallancdkey: {
        type: String,
       
    },

});

const State = mongoose.model("state", StateSchema);

// module.exports = State;