const {createToken,verifyToken} = require("../helper/jwt");
const userModel = require("../database/Schemas/User");
const {ApiResponse,FunctionResponse} = require("../Response");
const {userStatusEnum,rolesAndPermissionStatusEnum} = require("../configs/constants");
const bcrypt = require("bcrypt");

exports.login_shop = async function(request,response,next){
    try{
        let output = {token:null,expired:false,success:false,firstTime:false};
        let fetchUserFromCredential = await userModel.aggregate([
            {
                $match:{
                    distributorId:request.body.distributorId
                }
            },
            {
                $lookup:{
                    from:"credentials",
                    localField:"distributorId",
                    foreignField:"distributorId",
                    as: "credential"
                }
            }
        ])

        if(!fetchUserFromCredential || !fetchUserFromCredential.length){
            return sendResponse(response,"Authentication Failed: No distributorId found",output,null);
        }

        fetchUserFromCredential = fetchUserFromCredential[0];

        if(!fetchUserFromCredential.passwordCreatedAtRegistration || !fetchUserFromCredential.credential.length){
            return sendResponse(response,"Authentication Failed:Password not created yet",output,null);
        }

        if(!fetchUserFromCredential.emailSentAtRegistration){
            return sendResponse(response,"Authentication Failed:Password not sent yet to mail",output,null);
        }

        let credentials = fetchUserFromCredential.credential[0];
        // check expiry of password
        if(new Date() > credentials.expireAt){
            if(credentials.firstTimeLogin){
                output.firstTime = true;
            }
            output.expired = true;
            output["expiredAt"] =  credentials.expireAt;
            return sendResponse(response,"Authentication Failed: Password expired",output,null);
        }


        bcrypt.compare(request.body.password,credentials.password)
        .then(async (result)=>{
            if(result){
                output.success=false;
                if(credentials.firstTimeLogin){
                    output.firstTime = true;
                    //sendOtp with type=firstReset
                    let otpVal = generateOtp();
                    let htmlPath = path.join(__dirname,"../../helper/emailTemplates/firstTimeReset.html")
                    let obj = {
                        recipient:fetchUserFromCredential.email,
                        subject:emailSubject.firstTimeReset,
                        html: generateHtmlForEmail(htmlPath,{
                            type:otpTypes.firstReset,
                            value:otpVal
                        }),
                        userId:fetchUserFromCredential._id
                    }
                    await sendMail(obj);
                    let date = new Date();
                    let expireTime = date.getTime() + (expireOtpInSeconds * 1000);
                    return otpModel.create({ distributorId: fetchUserFromCredential.distributorId,type:otpTypes.firstReset,value:otpVal,expireAt:expireTime })
                }else{
                    let payloadObj = {distributorId:fetchUserFromCredential.distributorId,email:fetchUserFromCredential.email};
                    return createToken(payloadObj,{expiry:expireJWTToken});
                }
                
            }else{
                return sendResponse(response,"Authentication Failed: Password mismatch",output,null);
            }
        })
        .then((token)=>{
            if(token && !output.firstTime){
                output.success=true;
                output.token=token;
                return tokenModel.updateOne({
                    distributorId:fetchUserFromCredential.distributorId
                },{
                    token:token
                },{
                    upsert:true
                })
            }
            
            return;
        })
        .then(()=>{
            if(output.firstTime){
                sendResponse(response,"Otp sent successfully",null,output);
            }else{
                sendResponse(response,"Authentication successfull",null,output);
            }
        })
        .catch((err)=>{
            return sendResponse(response,"Authentication Failed: Something went wrong or not data found",err,null);
        })
    }catch(err){
        return sendResponse(response,"Authentication Failed: Something went wrong or not data found",err,null);
    }
}

exports.login = async function(req,res,next){
    let userDetails = {};
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
                    select: ("_id name displayName updatedOn")      // Exclude the _id field if not needed
                }
            ]
        })
        .populate({
            path:"roles",
            match: { status: rolesAndPermissionStatusEnum.active },
            select: ('permissions.updatedOn userType -_id name permissions.moduleId permissions.actions'),
            populate: [
                {
                    path: "permissions.moduleId",
                    select: ("-_id actions name displayName updatedOn")      // Exclude the _id field if not needed
                },
                {
                    path: "permissions.actions",
                    select: ("_id name displayName updatedOn")      // Exclude the _id field if not needed
                }
            ]
        })
        .populate([
            {
                path:"permissions.deny.moduleId",
                select: ("-_id actions name displayName updatedOn")
            },
            {
                path:"permissions.deny.actions",
                select: ("_id name displayName updatedOn") 
            },
            {
                path:"permissions.allow.moduleId",
                select: ("-_id actions name displayName updatedOn")
            },
            {
                path:"permissions.allow.actions",
                select: ("_id name displayName updatedOn") 
            }
        ])
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
            return verifyRolesAndPermission(userDetails)
            
        })
        .then((permissions)=>{
            userDetails.allowedmoduleWithActions = permissions;
            return createToken({
                userId: userDetails._id.toString(),
                userType: userDetails.role?.name,
                userRoles: permissions
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
                allowedmoduleWithActions:{
                    "Dashboard": [
                        {
                            name: "Number of Calls Handled",
                            api: "https://www.google.com"
                        },
                        {
                            name: "Call Ratings",
                            api: "https://www.google.com"
                        }
                    ],
                    "Call Summary": [
                        {
                            name: "Calls List",
                            api: "https://www.google.com"
                        }
                    ]
                }
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