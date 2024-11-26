const {ApiResponse} = require("../../Response");
const {verifyToken} = require("../../helper/jwt");
// const tokenModel = require("../../database/Models/auth/Token");
// const roleModel = require("../../database/Models/auth/Role");
// const permissionModel = require("../../database/Models/auth/Permission");
// const userModel = require("../../database/Models/auth/User");
exports.authenticateToken= async function(req,res,next){
    try{
        let token = req.headers["x-access-token"] || req.headers["authorization"];
        //console.log(`Token ${token}`);
        if(!token){
            let apiResponse = new ApiResponse();
            apiResponse.setStatus(401);
            apiResponse.setMessage("Authentication failed")
            return res.send(apiResponse)
        }
        if (token.startsWith("Bearer ") || token.startsWith("bearer ")) {
            token = token.slice(7, token.length);
        }
        verifyToken(token)
        .then((tokenDetails)=>{
            if(tokenDetails){
                req.tokenDetails = tokenDetails;
                next();
            }else{
                throw new Error("Error")
            }
        })
        .catch((err)=>{
            let apiResponse = new ApiResponse();
            apiResponse.setStatus(401);
            apiResponse.setMessage("Authentication failed")
            return res.send(apiResponse)
        })
    }catch(err){
        let apiResponse = new ApiResponse();
        apiResponse.setStatus(401);
        apiResponse.setMessage("Authentication failed")
        return res.send(apiResponse)
    }
}

exports.authorizeToken = async function (req,res,next){
    try{
        let tokenDetails = req.tokenDetails;
        if(tokenDetails.userRoles[req.moduleName]  &&  tokenDetails.userRoles[req.moduleName].includes(req.actionName)){
            next();
        }else{
            let apiResponse = new ApiResponse();
            apiResponse.setStatus(403);
            apiResponse.setMessage("Authorization failed")
            return res.send(apiResponse)
        }
    }catch(err){
        let apiResponse = new ApiResponse();
        apiResponse.setStatus(403);
        apiResponse.setMessage("Authorization failed")
        return res.send(apiResponse)
    }
}

module.exports.canAccess = async function(request,response,next){
    let roleFromToken = request.authorizationObject;
    if(!roleFromToken || !request.accessPremissions || !(roleFromToken.roles.length || roleFromToken.permissions.length) ){
        response.status(403);
        return response.json(
            errorFunction(true,`Error while authenticating user: Unauthorised`)
        );
    }
    let userPermissions = [];
    
    if(roleFromToken.permissions?.length){
        userPermissions = [...roleFromToken.permissions]
    }

    if(roleFromToken.roles.length){
        let userRoles = await roleModel.find({_id:{$in:[roleFromToken.roles]}}).lean();
        if(userRoles?.length){
            userRoles.forEach((item)=>{
                if(!item.permissions?.length){
                    return;
                }
                item.permissions.forEach((perm)=>userPermissions.push(perm));
            })
        }
    }

    if(!userPermissions.length){
        response.status(403);
        return response.json(
            errorFunction(true,`Error while authenticating user: No permissions found`)
        );
    }
    let permissionIdFromDb = await permissionModel.aggregate([
        {
            $match:{
                moduleName: request.accessPremissions.moduleName,
                routingUrl: request.url
            }
        },
        {
            $project: {
              currentAccessId: {
                $filter: {
                  input: '$canAccess',
                  as: 'item',
                  cond: { $eq: [`$$item.${request.accessPremissions.action}`, true] }
                }
              },
              fullAccessId: {
                $filter: {
                  input: '$canAccess',
                  as: 'item',
                  cond: { $eq: [`$$item.fullAccess`, true] }
                }
              }

            }
        },
        {
            $limit: 1
        }
    ])

    if(!permissionIdFromDb.length){
        response.status(403);
        return response.json(
            errorFunction(true,`Error while authenticating user: No such permissions found in database`)
        );
    }
    permissionIdFromDb = permissionIdFromDb[0];

    let findPerm = userPermissions.find((item)=>{
        return item.permissionId.toString()==permissionIdFromDb._id.toString() &&
        (
            permissionIdFromDb.currentAccessId[0]?._id.toString() == item.accessId.toString() ||
            permissionIdFromDb.fullAccessId[0]?._id.toString() == item.accessId.toString()
        )
    })
    if(!findPerm){
        response.status(403);
        return response.json(
            errorFunction(true,`Error while authenticating user: Unauthorized`)
        );
    }
    next();
}
