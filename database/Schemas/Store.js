const mongoose = require("mongoose")
const storeSchema  = new mongoose.Schema(
    {
        id: { type: String},
        addressline1: { type: String, required: true },
        addressline2: { type: String, required: true },
        addressline3: { type: String, required: true },
        citycode: { type: String, required: true },
        cityvalue: { type: String, required: true },
        countrycode: { type: String, required: true },
        countryvalue: { type: String, required: true },
        disablelogin: { type: Boolean },
        disablesale: { type: Boolean },
        disablesto: { type: String, required: true },
        distributorid: { type: String, required: true },
        owneraddress1: { type: String, required: true },
        owneraddress2: { type: String, required: true },
        ownercitycode: { type: String, required: true },
        ownercityvalue: { type: String, required: true },
        ownercountrycode: { type: String, required: true },
        ownercountryvalue: { type: String, required: true },
        owneremail: { type: String, required: true },
        ownerfirstname: { type: String, required: true },
        ownerlastname: { type: String, required: true },
        ownermobileno: { type: String, required: true },
        ownerphoneno: { type: String, required: true },
        ownerpincode: { type: String, required: true },
        ownerstatecode: { type: String, required: true },
        ownerstatevalue: { type: String, required: true },
        ownerstatus: { type: String, required: true },
        ownertitlecode: { type: String, required: true },
        ownertitlevalue: { type: String, required: true },
        email: { type: String, required: true },
        gst: { type: String, required: true },
        locationcode: { type: String, required: true },
        locationname: { type: String, required: true },
        locationtypecode: { type: String, required: true },
        locationtypevalue: { type: String, required: true },
        loggedInUserId: { type: String, required: true },
        mobile: { type: String, required: true },
        phone: { type: String, required: true },
        pincode: { type: String, required: true },
        prefix: { type: String, required: true },
        replocationcode: { type: String, required: true },
        replocationvalue: { type: String, required: true },
        reportinglocationcode: { type: String, required: true },
        reportinglocationvalue: { type: String, required: true },
        registeredlocationcode: { type: String, required: true },
        registeredlocationvalue: { type: String, required: true },
        shortname: { type: String, required: true },
        statecode: { type: String, required: true },
        statevalue: { type: String, required: true },
        status: { type: String, required: true },
        taxjurisdictioncode: { type: String, required: true },
        taxjurisdictionvalue: { type: String, required: true },
        thirdparty: { type: String, required: true },
        timingendtime: { type: String, required: true },
        timingstarttime: { type: String, required: true },
        weekdata: { type: String, required: true },
        createdby: { 
            type: Date,
            default: function(){
                return new Date()
            }
        },
        modifiedby: { 
            type: Date,
            default: function(){
                return new Date()
            }
        },
        createddate: { 
            type: Date,
            default: function(){
                return new Date()
            }
         },
        modifieddate: { 
            type: Date,
            default: function(){
                return new Date()
            }
        },
        invconsiderationdate: {
            type: Date,
            default: function(){
                return new Date()
            }
        },
        startingamount: { type: Number, required: true },
        userlongitude: { type: String, required: true },
        userlatitude: { type: String, required: true },
        inventoryvisible: { type: String, required: true },
        timezonename: { type: String, required: true },
        enableDynBill: { type: Boolean },
        latitude: { type: String, required: true },
        longitude: { type: String, required: true },
        contactno: { type: String, required: true },
        personname: { type: String, required: true },
        isdefaultwarelocationcode: { type: Boolean },
        isdefaultwarelocationvalue: { type: Boolean },
        iscashactive: { type: Boolean },
        is_online_payment: { type: Boolean,default:false}
      }
)

// module.exports = new mongoose.model("Store",storeSchema);
