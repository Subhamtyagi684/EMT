const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
// const credentialModel = require("./Credential")
// const getPassword = require("../../../helper/generatePassword");
// const {expirePasswordInDays} = require("../../../configs/constants");
// id, lkupcode, brandcode, brandname, status, sortorder
const modulesSchema = new mongoose.Schema({
   
    name:{
        type:String,
        unique:true,
        uppercase: true,
        required: true
    },
    displayName:{
        type:String,
        unique:true,
        required: true
    },
    description:{
        type:String
    },
    actions:[
        {
            type: ObjectId,
            ref: "Action",
            required: true,
            // unique: true
        }
    ],
    updatedOn: {
        type: Date,
        default: function(){
            return new Date()
        }
    },
    createdOn: {
        type: Date,
        default: function(){
            return new Date()
        }
    }
   
});

// status -
// 1:"active"
// 2:"inactive"
// 3:"deactivated"
// 4:"hold"



module.exports = mongoose.model("Module", modulesSchema);

// let Model= mongoose.model("Module", modulesSchema);

// let x = new Model({
//     "name": "CALL_SUMMARY",
//     "displayName": "Call Summary",
//     "actions": [
//         new ObjectId("673aede405c6669e559db7dd"),
//         new ObjectId("673aede405c6669e559db7de")
//     ]
//   }
// )

// let y = new Model({
//     "name": "audits",
//     "displayName": "audits",
//     "actions": [
//         new ObjectId("673aede405c6669e559db7dd")
//     ]
//   }
// )

// // x.save()
// Promise.all([x.save(),y.save()])
// .then(()=>{
//     console.log("Data saved")
// })
// .catch((err)=>{
//     console.log(err.message)
// })