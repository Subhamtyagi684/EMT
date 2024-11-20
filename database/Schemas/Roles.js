const mongoose = require("mongoose");
const {rolesAndPermissionStatusEnum} = require("../../configs/constants");
const ObjectId = mongoose.Types.ObjectId;
const ModuleActionSchema = require("./ModuleActions")

const rolesSchema = new mongoose.Schema({
   
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
    userType:{
        type: Number,
        sparse:true,
        unique:true,
        default:null
    }, 
    createdOn: {
        type: Date,
        default: function(){
            return new Date()
        }
    },
    permissions: [ModuleActionSchema],
    deny: [ModuleActionSchema],
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




module.exports = mongoose.model("Role", rolesSchema);

// let Model = mongoose.model("Role", rolesSchema);

// let x = new Model({
//     name: "agent",
//     displayName:"agent",
//     userType:3,
//     permissions:[
//         {
//             moduleId: new ObjectId("673aef96439bb543ad846106"),
//             actions:[
//                 new ObjectId("673aede405c6669e559db7dd")
//             ]
//         },
//         {
//             moduleId: new ObjectId("673aef96439bb543ad846107"),
//             actions:[
//                 new ObjectId("673aede405c6669e559db7dd")
//             ]
//         },
//     ]
// })

// let y = new Model({
//     name: "manager",
//     displayName:"manager",
//     userType:2,
//     permissions:[
//         {
//             moduleId: new ObjectId("673aef96439bb543ad846106"),
//             actions:[
//                 new ObjectId("673aede405c6669e559db7de")
//             ]
//         }
//     ]
// })

// Promise.all([x.save(),y.save()])
// .then(()=>{
//     console.log("role created")
// })
// .catch((err)=>{
//     console.log(err.message)
// })