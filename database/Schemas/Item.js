const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
 
  itemcode: {
    type: String,
    required: true,
  },
  purchasevalue: {
    type: String,
    required: true,
  },
  purchasecode: {
    type: String,
    required: true,
  },
  brandvalue: {
    type: String,
    required: true,
  },
  stockmin: {
    type: String,
    required: true,
  },
  stockmax: {
    type: String,
    required: true,
  },
  recordertype: {
    type: String,
    required: true,
  },
  shelflifemonth: {
    type: String,
    required: true,
  },
  shelflifeyear: {
    type: String,
    required: true,
  },
  serialnumber: {
    type: String,
    required: true,
  },
  iscomposite: {
    type: String,
    required: true,
  },
  hsncode: {
    type: String,
    required: true,
  },
  minimumDaysStockRequired: {
    type: String,
    required: true,
  },
  itemweight: {
    type: String,
    required: true,
  },
  itemlength: {
    type: String,
    required: true,
  },
  itemheight: {
    type: String,
    required: true,
  },
  itemwidth: {
    type: String,
    required: true,
  },
  leadtime: {
    type: String,
    required: true,
  },
  rules: {
    type: String,
    required: true,
  },
  activityvalue: {
    type: String,
    required: true,
  },
  activitycode: {
    type: String,
    required: true,
  },
  inclusivetax: {
    type: String,
    required: true,
  },
  uomcode: {
    type: String,
    required: true,
  },
  uomvalue: {
    type: String,
    required: true,
  },
  allowcreditsale: {
    type: String,
    required: true,
  },
  allowpromotions: {
    type: String,
    required: true,
  },
  termscondition: {
    type: String,
    required: true,
  },
  batchno: {
    type: String,
    required: true,
  },
  allowsalesreturn: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  distsource: {
    type: String,
    required: true,
  },
  requesttype: {
    type: String,
    required: true,
  },
  loggedinuserid: {
    type: String,
    required: true,
  },
  loggedinroleid: {
    type: String,
    required: true,
  },
  loggedinrolename: {
    type: String,
    required: true,
  },
  loggedinusername: {
    type: String,
    required: true,
  },
  servicerequestid: {
    type: String,
    required: true,
  },
  loggeddistributorid: {
    type: String,
    required: true,
  },
  tokennumber: {
    type: String,
    required: true,
  },
  countrycode: {
    type: String,
    required: true,
  },
  itemtypecode: {
    type: String,
    required: true,
  },
  itemtypevalue: {
    type: String,
    required: true,
  },
  allowexport: {
    type: String,
    required: true,
  },
  parentcode: {
    type: String,
    required: true,
  },
  namepoprint: {
    type: String,
    required: true,
  },
  taxpostcategorycode: {
    type: String,
    required: true,
  },
  taxpostcategoryvalue: {
    type: String,
    required: true,
  },
  allowsale: {
    type: String,
    required: true,
  },
  maxquantityallowed: {
    type: String,
    required: true,
  },
  launchdate: {
    type: String,
    required: true,
  },
  createddate: {
    type: String,
    required: true,
  },
  updateddate: {
    type: String,
    required: true,
  },
  createdby: {
    type: String,
    required: true,
  },
  updatedby: {
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
  udf4: {
    type: String,
    required: true,
  },
  udf5: {
    type: String,
    required: true,
  },
  hsn_tax: {
    type: String,
    required: true,
  },
  quantity: {
    type: String,
    required: true,
  },
  itemid: {
    type: String,
    required: true,
  },
  packsize: {
    type: String,
    required: true,
  },
  itemimage: {
    type: String,
    required: true,
  },
  virtualitem: {
    type: String,
    required: true,
  },
});

const Item = mongoose.model("Item", ItemSchema);

// module.exports = Item;
