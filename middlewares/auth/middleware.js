const {ApiResponse} = require("../../Response");
const {verifyToken} = require("../../helper/jwt");
// const tokenModel = require("../../database/Models/auth/Token");
// const roleModel = require("../../database/Models/auth/Role");
// const permissionModel = require("../../database/Models/auth/Permission");
// const userModel = require("../../database/Models/auth/User");

module.exports.loginMiddleware = function(request,response,next){
    let token= request.headers.token
    if(!token){
        response.status(403);
        return response.json(
            errorFunction(true,"Please pass token key in header")
        );
    }
    
    verifyToken(token)
    .then((decodedPayload)=>{
        if(decodedPayload && decodedPayload.distributorId){
            request.docodedToken = decodedPayload;
            return tokenModel.findOne({distributorId:decodedPayload.distributorId,token:token,status:1}).lean()
        }
        return;
    })
    .then((data)=>{
        if(data){
            request.authorizationObject = data;
            next()
        }else{
            response.status(403);
            return response.json(
                errorFunction(true,`Error while authenticating user: Invalid token`)
            );
        }
    })
    .catch((err)=>{
        response.status(403);
        return response.json(
            errorFunction(true,`Error while authenticating user: ${err?err.message:"Something went wrong"}`)
        );
    })
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

exports.authenticateToken = async function(req,res,next){
    try{    
        
    }catch(err){
        let response = new ApiResponse();
        response.setStatus(401);
        response.message = "Invalid Credenitals"
        return res.send(response)
    }
}