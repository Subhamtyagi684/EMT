const bcrypt = require('bcrypt');
const saltRounds = 10;
const generator = require('generate-password');
// const credentialModel=require("../database/Models/auth/Credential");
const {expirePasswordInDays,expirePasswordInManualDays} = require("../configs/constants")

function generatePassword(customText){
    return new Promise(function(resolve,reject){
        let text = generator.generate({
            length: 10,
            numbers: true
        });
        encryptPassword(customText || text)
        .then((obj)=>{
            resolve(obj);
            return;
        })
        .catch((err)=>{
            reject(err);
            return;
        })
    })
}

function encryptPassword(plainPassword){
    return new Promise(function(resolve,reject){
        bcrypt.hash(plainPassword, saltRounds, function(err, hash) {
            if(err){
                reject(err);
                return;
            }
            resolve({plainPassword,hash});
        });
    })
    
}

function createOrUpdatePassowrdInDB(action,obj){
    return new Promise(function(resolve,reject){
        if(action=="create"){
            generatePassword()
                .then(async (passObj)=>{
                    let expireDate = new Date();
                    expireDate.setDate(expireDate.getDate() + expirePasswordInDays);
                    let cred = new credentialModel({
                        userId:obj.id,
                        password:passObj.hash,
                        distributorId:obj.distributorId,
                        expireAt: expireDate
                    });
                    await cred.save();
                    passObj.model = obj.model;
                    resolve(passObj);
                })
                .catch((err)=>{
                    reject(err);
                })
        }else if(action=="generate"){
            if(!obj.distributorId){
                reject("No distributor Id")
            }

            credentialModel.findOne({distributorId:obj.distributorId,firstTimeLogin:true}).populate("userId")
                .then(async (doc)=>{
                    if(!doc){
                        reject({message:"Object not found in database"})
                        return;
                    }
                    if(new Date()>doc.expireAt){
                        let passObj = await fetchPassword();
                        doc.password = passObj.hash;
                        let expireDate = new Date();
                        expireDate.setDate(expireDate.getDate() + expirePasswordInDays);
                        doc.expireAt = expireDate;
                        doc.passObj = passObj;
                        return doc.save()
                    }else{
                        reject({message:"Password not expired yet or password already generated"});
                        return;
                    }
                })
                .then((passObj)=>{
                    if(!passObj){
                        reject();
                        return;
                    }
                    resolve(passObj);
                    return;
                })
                .catch((err)=>{
                    reject(err);
                })
        }else if(action=="update"){
            credentialModel.findOne({
                distributorId:obj.distributorId
            })
            .then((doc)=>{
                if(!doc){
                    reject({message:"Object not found in database"})
                    return;
                }
                return bcrypt.compare(obj.oldPassword,doc.password)
            })
            .then((result)=>{
                if(result){
                    return encryptPassword(obj.newPassword)
                }else{
                    reject({message:"Password mismatch"})
                }
            })
            .then((passObj)=>{
                let expireDate = new Date();
                expireDate.setDate(expireDate.getDate() + expirePasswordInManualDays);
                return credentialModel.updateOne({
                    distributorId:obj.distributorId
                },{
                    password:passObj.hash,
                    resetAt: new Date(),
                    expireAt:expireDate,
                    userGeneratedPassword:true
                }).lean();
            })
            .then((outputObj)=>{
                if(outputObj.modifiedCount){
                    resolve(true)
                }
                reject(outputObj);
                return;
            })
            .catch((err)=>{
                reject(err);
                return;
            })
            
        }else if(action=="reset"){
            encryptPassword(obj.password)
            .then((passObj)=>{
                let expireDate = new Date();
                expireDate.setDate(expireDate.getDate() + expirePasswordInManualDays);
                return credentialModel.updateOne({
                    distributorId:obj.distributorId,
                    userGeneratedPassword:true,
                    firstTimeLogin:true
                },{
                    password:passObj.hash,
                    resetAt: new Date(),
                    expireAt:expireDate,
                    firstTimeLogin:false
                })
            })
            .then((outputObj)=>{
                if(outputObj.modifiedCount){
                    resolve(true)
                }
                reject({message:"Object not found in database or validate OTP first"});
                return;
            })
            .catch((err)=>{
                reject(err);
                return;
            })
        }else{
            reject(null)
        }
    })
    
    
}

module.exports = {
    createOrUpdatePassowrdInDB,
    generatePassword,
    encryptPassword
};