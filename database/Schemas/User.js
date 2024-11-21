const mongoose = require("mongoose");
// const credentialModel = require("./Credential")
const {
    generatePassword
} = require("../../helper/generatePassword");
const {
    userStatusEnum,
    userTypesEnum
} = require("../../configs/constants");
// const { required } = require("joi");
// id, lkupcode, brandcode, brandname, status, sortorder
const ObjectId = mongoose.Types.ObjectId;

const ModuleActionSchema = require("./ModuleActions");

const userSchema = new mongoose.Schema({

    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String
    },
    userType:{
        type: Number,
        required:true
    },
    role: {
        type: ObjectId,
        ref: "Role",
        required: true,
        unique: false
    },
    email: {
        type: String,
        unique:true,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    createdOn: {
        type: Date,
        default: function () {
            return new Date()
        }
    },

    roles: [{
        type: ObjectId,
        ref: "Role",
        required: true,
        unique: false
    }],
    permissions: {
        allow: [ModuleActionSchema],
        deny: [ModuleActionSchema]
    },
    updatedOn: {
        type: Date,
        default: function () {
            return new Date()
        }
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    status: {
        type: Number,
        default: userStatusEnum.active
    },

    emailSentAtRegistration: {
        default: false,
        type: Boolean
    }

});

// status -
// 1:"active"
// 2:"inactive"
// 3:"deactivated"
// 4:"hold"



module.exports = mongoose.model("User", userSchema);

// let Model = mongoose.model("User", userSchema);
// let x = new Model({
//     firstName:"Aman",
//     lastName:"Bansal",
//     role:new ObjectId("673af3ccb3dfa1c5e135608f"),
//     roles:[
//         new ObjectId("673af3ccb3dfa1c5e1356092")
//     ],
//     email:"aman.bansal@trangile.com",
//     permissions:{
//         deny: [
//             {
//                 moduleId:new ObjectId("673aef96439bb543ad846107"),
//                 actions:[
//                     new ObjectId("673aede405c6669e559db7dd")
//                 ]
//             }
//         ]
//     }
// });

// generatePassword("987654321")
// .then((pass)=>{
//     x.password = pass.hash;
//     return x.save()
// })
// .then(()=>{
//     console.log("Role created")
// })
// .catch((err)=>{
//     console.log(err)
// })