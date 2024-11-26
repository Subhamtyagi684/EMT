const {createToken,verifyToken} = require("../helper/jwt");
const userModel = require("../database/Schemas/User");
const moduleModel  = require("../database/Schemas/Modules");
const roleModel = require("../database/Schemas/Roles")
const {ApiResponse,FunctionResponse} = require("../Response");
const {userStatusEnum,rolesAndPermissionStatusEnum} = require("../configs/constants");
const {generatePassword,encryptPassword} = require("../helper/generatePassword")
const bcrypt = require("bcrypt");

exports.login = async function(req,res,next){
    let userDetails = {},
    allMenuModuleIds = [];
    try{
        let {email,password} = req.body;
        userModel.findOne({
            email,
            status: userStatusEnum.active
        })
        .populate({
            path:"role",
            match: { status: rolesAndPermissionStatusEnum.active },
            select: ('permissions.updatedOn userType -_id name permissions.moduleId permissions.actions'),
            populate: [
                {
                    path: "permissions.moduleId",
                    select: ("-_id actions name displayName updatedOn")      // Exclude the _id field if not needed
                },
                {
                    path: "permissions.actions",
                    select: ("-_id name displayName updatedOn api")      // Exclude the _id field if not needed
                }
            ]
        })
        // .populate([
        //     {
        //         path:"permissions.deny.moduleId",
        //         select: ("-_id actions name displayName updatedOn")
        //     },
        //     {
        //         path:"permissions.deny.actions",
        //         select: ("_id name displayName updatedOn") 
        //     },
        //     {
        //         path:"permissions.allow.moduleId",
        //         select: ("-_id actions name displayName updatedOn")
        //     },
        //     {
        //         path:"permissions.allow.actions",
        //         select: ("_id name displayName updatedOn") 
        //     }
        // ])
        // .select('_id password role roles userType permissions.updatedOn permissions.moduleId permissions.actions permissions.moduleId.name')
        .lean()
        .then((userData)=>{
            if(!userData){
                throw new Error("No user found with this email")
            }
            userDetails = userData;
            return bcrypt.compare(password,userData.password)
        })
        .then((isMatched)=>{
            if(!isMatched){
                throw new Error("Password Mismatch")
            }
            // return verifyRolesAndPermissionByAggregation(allMenuModuleIds)
            return verifyRolesAndPermission(userDetails)
            
        })
        .then((permissions = {})=>{
            userDetails.allowedmoduleWithActions = permissions.uiPermissions;
            return createToken({
                userId: userDetails._id.toString(),
                userType: userDetails.userType,
                userRoles: permissions.tokenPermissions
            })
        })
        .then((token)=>{
            let apiResponse = new ApiResponse();
            apiResponse.setStatus(200);
            apiResponse.setMessage("Successfully Authenticated");
            apiResponse.result = {
                token:token,
                firstName: userDetails.firstName,
                lastName: userDetails.lastName,
                email: userDetails.email,
                status: userDetails.status,
                userType: userDetails.userType,
                allowedmoduleWithActions:userDetails.allowedmoduleWithActions
            }
            return res.send(apiResponse);
        })
        .catch((err)=>{
            let apiResponse = new ApiResponse();
            apiResponse.setStatus(400);
            apiResponse.setMessage(err.message || "Something went wrong");
            return res.send(apiResponse);
        })
    }catch(err){
        let apiResponse = new ApiResponse();
        apiResponse.setStatus(400);
        apiResponse.setMessage("Something went wrong");
        return res.send(apiResponse);
    }
}

exports.register = async function(req,res,next){
    let userDetails = {}, allRoleDetails = {};
    try{
        encryptPassword(req.body.password)
        .then((hashedPasswordObj)=>{
            if(!hashedPasswordObj || !hashedPasswordObj.hash){
                throw new Error("Password creation error")
            }
            req.body.password = hashedPasswordObj.hash;
            userDetails = req.body;
            return roleModel.findOne({userType:userDetails.userType}).populate([
                {
                    path: "permissions.moduleId",
                    select: ("-_id actions name displayName updatedOn")      // Exclude the _id field if not needed
                },
                {
                    path: "permissions.actions",
                    select: ("-_id name displayName updatedOn api")      // Exclude the _id field if not needed
                }
            ]).lean()
        })

        .then((roleDetail)=>{
            console.log(roleDetail)
            if(!roleDetail){
                throw new Error("Role type doesn't match")
            }

            allRoleDetails = roleDetail;
            userDetails.role = roleDetail._id;
            return userModel.create(userDetails)
        })
        .then((createdObj)=>{
            if(createdObj.errors){
                throw new Error("User creation failed")
            }
            console.log(createdObj)
            userDetails.role = allRoleDetails;
            return verifyRolesAndPermission(userDetails)
        })
        .then((permissions)=>{
            userDetails.allowedmoduleWithActions = permissions.uiPermissions;
            let apiResponse = new ApiResponse();
            apiResponse.setStatus(201);
            apiResponse.setMessage("User Created");
            apiResponse.result = {
                firstName: userDetails.firstName,
                lastName: userDetails.lastName,
                email: userDetails.email,
                status: userStatusEnum.active,
                userType: userDetails.userType,
                allowedmoduleWithActions:userDetails.allowedmoduleWithActions
            }
            return res.send(apiResponse);
        })
        .catch((err)=>{
            let apiResponse = new ApiResponse();
            apiResponse.setStatus(400);
            if(err.code==11000){
                apiResponse.setMessage(`${Object.keys(err.keyValue)[0]} already exists`)
            }else{
                apiResponse.setMessage(err.message || "Something went wrong");
            }
            return res.send(apiResponse);
        })
    }catch(err){
        let apiResponse = new ApiResponse();
        apiResponse.setStatus(400);
        apiResponse.setMessage("Something went wrong");
        return res.send(apiResponse);
    }
}

function verifyRolesAndPermission(userDetails){
    let uiPermissions= {},tokenPermissions= {};
    try{
        if(!userDetails.roles){
            userDetails.roles = []
        }
        let allRoles = [userDetails.role,...userDetails.roles];
        // throw new Error("Fix the roles")
        

        let allowedmoduleWithActions = {}
        let deniedmoduleWithActions = {}
        allRoles.filter((item, index, array) => {
                return array.findIndex(i => i.name === item.name) === index ;
            }
        ).map(i=>i.permissions).flatMap(i=>i).forEach((i=> {
            uiPermissions[i.moduleId.displayName] = i.actions.map(j=>{
                return {
                    name: j.displayName,
                    api: j.api,
                    widget: j.name
                }
            });

            tokenPermissions[i.moduleId.name] = i.actions.map(j=>j.name);

        }))

        return {uiPermissions,tokenPermissions}
        
    }catch(err){
        return {uiPermissions:{},tokenPermissions:{}}
    }
}


function verifyRolesAndPermissionByAggregation(allModule = []){
    try{
        return new Promise(function(resolve,reject){
            moduleModel.aggregate([
                {
                    $match:{
                        isMain:false,
                        parentModuleId: { $in: allModule }
                    }
                },
                {
                    $group: {
                        _id: "$parentModuleId",
                        subModules: {
                            $push: {
                                name: "$name",
                                api: "$api",
                                displayName: "$displayName"
                            }
                        }
                    }
                },
                {
                    $lookup: {
                        from: "modules", // Collection name for the `role` reference
                        localField: "_id",
                        foreignField: "_id",
                        as: "parentModuleId"
                    }
                },
                {
                    $unwind: "$parentModuleId"
                }
            ])
            .then((modules)=>{
                if(!modules.length){
                    resolve({})
                }else{
                    let permissionsObject = {};
                    let tokenPermissionObject = {};
                    modules.forEach((module)=>{
                        permissionsObject[module.parentModuleId.displayName] = module.subModules.map(i=> { 
                            return {
                                name: i.displayName,
                                api: i.api,
                                widget: i.name
                            }
                        });
                        tokenPermissionObject[module.parentModuleId.name] = module.subModules.map(i=> i.name);
                    })

                    resolve({
                        uiPermissions: permissionsObject,
                        tokenPermissions: tokenPermissionObject
                    })
                }
            })
            .catch((err)=>{
                reject({
                    uiPermissions: {},
                    tokenPermissions: {}
                })
            })
        })

    }catch(err){
        return {
            uiPermissions: {},
            tokenPermissions: {}
        }
    }
}