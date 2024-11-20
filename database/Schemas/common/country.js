const mongoose = require("mongoose");
// id, lkupcode, brandcode, brandname, status, sortorder
const CountrySchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique:true
    },
    countryisocode: {
        type: String,
        required: true,
    },
    countryname: {
        type: String,
        required: true,
    },
    sortorder: {
        type: Number,
       
    },
    status: {
        type: Number,
       
    },
    taxcalculationmode: {
        type: Number,
       
    },
    financialyear: {
        type: Number,
       
    },
    taxtype: {
        type: String,
       
    },
    taxpercentage: {
        type: String,
       
    },
    image: {
        type: String,
       
    },
    currency: {
        type: String,
       
    },
    Isdprefix: {
        type: String,
       
    },
    pincodelength: {
        type: String,
       
    },
    mobilelength: {
        type: String,
       
    },
    decimallimit: {
        type: Number,
       
    },
    invoicetext: {
        type: String,
       
    },
    distributorstatus: {
        type: Number,
       
    },
    Isdiscountitem: {
        type: Number,
       
    },
    Isvoucherstatus: {
        type: Number,
       
    }

});

const Country = mongoose.model("Country", CountrySchema);

// module.exports = Country;