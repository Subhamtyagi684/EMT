const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
// const credentialModel = require("./Credential")
// const getPassword = require("../../../helper/generatePassword");
const {rolesAndPermissionStatusEnum} = require("../../configs/constants");
// id, lkupcode, brandcode, brandname, status, sortorder
const actionsSchema = new mongoose.Schema({
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
    api:{
        type:String,
    },
    actions:[
        {
            type: ObjectId,
            ref: "Action",
            required: false
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
    },
    status:{
        type: Number,
        required:true,
        default: rolesAndPermissionStatusEnum.active
    }

   
});

// status -
// 1:"active"
// 2:"inactive"
// 3:"deactivated"
// 4:"hold"



module.exports = mongoose.model("Action", actionsSchema);

// let Model = mongoose.model("Action", actionsSchema);;

// let x= new Model({
//     name: "GET",
//     displayName:"GET"
// })

// let y= new Model({
//     name: "SAVE",
//     displayName:"SAVE"
// })

// Promise.all([x.save(),y.save()])
// .then(()=>{
//     console.log("actions saved")
// })
// .catch((err)=>{
//     console.log("error")
// })