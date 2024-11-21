const {createToken,verifyToken} = require("../helper/jwt");
const userModel = require("../database/Schemas/User");
const moduleModel  = require("../database/Schemas/Modules")
const {ApiResponse,FunctionResponse} = require("../Response");
const {userStatusEnum,rolesAndPermissionStatusEnum} = require("../configs/constants");
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
            select: ('permissions.moduleId')
        })
        // .populate({
        //     path:"roles",
        //     match: { status: rolesAndPermissionStatusEnum.active },
        //     select: ('permissions.updatedOn userType -_id name permissions.moduleId permissions.actions'),
        //     populate: [
        //         {
        //             path: "permissions.moduleId",
        //             select: ("-_id actions name displayName updatedOn")      // Exclude the _id field if not needed
        //         },
        //         {
        //             path: "permissions.actions",
        //             select: ("_id name displayName updatedOn")      // Exclude the _id field if not needed
        //         }
        //     ]
        // })
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
            allMenuModuleIds = userDetails.role.permissions.map(i=>i.moduleId);
            return bcrypt.compare(password,userData.password)
        })
        .then((isMatched)=>{
            if(!isMatched){
                throw new Error("Password Mismatch")
            }
            return verifyRolesAndPermissionByAggregation(allMenuModuleIds)
            
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
                email: userDetails.emal,
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

function verifyRolesAndPermission(userDetails){
    try{
        let allRoles = [userDetails.role,...userDetails.roles];
        // throw new Error("Fix the roles")

        let allowedmoduleWithActions = {}
        let deniedmoduleWithActions = {}
        allRoles  = allRoles.filter((item, index, array) => {
                return array.findIndex(i => i.name === item.name) === index ;
            }
        ).map(i=>i.permissions).flatMap(i=>i).forEach((i=> {
            if(allowedmoduleWithActions[i.moduleId.name]){
                allowedmoduleWithActions[i.moduleId.name] = allowedmoduleWithActions[i.moduleId.name].concat(i.actions.map(i=>i.name));
            }else{
                allowedmoduleWithActions[i.moduleId.name] = i.actions.map(i=>i.name);
            }
        }))

        userDetails.permissions.allow.forEach((i=> {
            if(allowedmoduleWithActions[i.moduleId.name]){
                allowedmoduleWithActions[i.moduleId.name] = allowedmoduleWithActions[i.moduleId.name].concat(i.actions.map(i=>i.name));
            }else{
                allowedmoduleWithActions[i.moduleId.name] = i.actions.map(i=>i.name);
            }
        }))

        userDetails.permissions.deny.forEach((i=> {
            if(deniedmoduleWithActions[i.moduleId.name]){
                deniedmoduleWithActions[i.moduleId.name] = deniedmoduleWithActions[i.moduleId.name].concat(i.actions.map(i=>i.name));
            }else{
                deniedmoduleWithActions[i.moduleId.name] = i.actions.map(i=>i.name);
            }
        }));

        for(let i in deniedmoduleWithActions){
            if(allowedmoduleWithActions[i]){
                allowedmoduleWithActions[i] = allowedmoduleWithActions[i].filter(item => !(deniedmoduleWithActions[i].includes(item)));
            }
        }
        userDetails.allowedmoduleWithActions = allowedmoduleWithActions

        return allowedmoduleWithActions
    }catch(err){
        return {}
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