const mongoose = require("mongoose");
// id, lkupcode, brandcode, brandname, status, sortorder
const CitySchema = new mongoose.Schema({
    id: {
    type: String,
    required: true,
    unique:true,
  },
  
  citycode: {
    type: String,
    // required: true,
  },
  cityname: {
    type: String,
    required: true,
  },
  stateid: {
    type: String,
    required: true,
    // default:0
  },
  sortorder: {
    type: String,
    required: true,
  },
  status: {
    type: Number,
    required: true,
  },
});

const City = mongoose.model("City", CitySchema);

// module.exports = City;