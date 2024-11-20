const mongoose = require("mongoose");
// id, lkupcode, brandcode, brandname, status, sortorder
const BrandSchema = new mongoose.Schema({
    id: {
    type: String,
    required: true,
  },
  lkupcode: {
    type: mongoose.Types.ObjectId,
    ref:'Category',
    required: true,
  },
  brandcode: {
    type: String,
    required: true,
  },
  brandname: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    // default:0
  },
  sortorder: {
    type: String,
    required: true,
  },
});

const Brand = mongoose.model("Brand", BrandSchema);

// module.exports = Brand;