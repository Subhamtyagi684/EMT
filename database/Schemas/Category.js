const mongoose = require("mongoose");
// id, lkupcode, subcategoycode, categoryid, subcategoryname, subcategoryprimaryimage, subcategorysecondaryimage, thumbnail, udf1, udf2, sortorder, status, subcategoryprimaryfiletype, dubcategorysecondaryfiletype, categorycode
const CategorySchema = new mongoose.Schema({
    id: {
    type: String,
    required: true,
  },
  lkupcode: {
    // type: mongoose.Types.ObjectId,
    // ref:'brands',
    // required: true,
    type: String,
    required: true,
  },
  categorycode: {
    type: String,
    required: true,
  },
  categoryname: {
    type: String,
    required: true,
  },
  catprimaryimage: {
    type: String,
    required: true,
    
  },
  catsecondaryimage: {
    type: String,
    required: true,
  },
  catthumbimage: {
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
  udf3: {
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
  categoryprimaryfiletype: {
    type: String,
    required: true,
  },
  categorysecondaryfiletpe: {
    type: String,
    required: true,
  },
  
});

const Category = mongoose.model("Category", CategorySchema);

// module.exports = Category;