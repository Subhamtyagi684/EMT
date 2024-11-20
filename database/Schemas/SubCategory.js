const mongoose = require("mongoose");
// id, lkupcode, subcategoycode, categoryid, subcategoryname, subcategoryprimaryimage, subcategorysecondaryimage, thumbnail, udf1, udf2, sortorder, status, subcategoryprimaryfiletype, dubcategorysecondaryfiletype, categorycode
const SubCategorySchema = new mongoose.Schema({
    id: {
    type: String,
    // required: true,
  },
  lkupcode: {
    type: String,
    required: true,
  },
  subcategoycode: {
    type: String,
    required: true,
  },
  categoryid: {
    type: mongoose.Types.ObjectId,
    ref: "collection_name",
    required: true,
  },
  subcategoryname: {
    type: String,
    required: true,
    
  },
  subcategoryprimaryimage: {
    type: String,
    required: true,
  },
  subcategorysecondaryimage: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  udf1: {
    type: String,
    required: true,
  },
  udf2: {
    type: String,
    required: true,
  },
  sortorder: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  subcategoryprimaryfiletype: {
    type: String,
    required: true,
  },
  dubcategorysecondaryfiletype: {
    type: String,
    required: true,
  },
  categorycode: {
    type: String,
    required: true,
  },
  
});


// .aggregate()

// .find().populate("categoryid")

const SubCategory = mongoose.model("SubCategory", SubCategorySchema);

// module.exports = SubCategory;