const jwt = require('jsonwebtoken');

// Math.floor(Date.now() / 1000) + (60 * 60)  --> 1 hr

module.exports.createToken = function(payload,options){
    return new Promise(function(resolve,reject){
        jwt.sign(
            payload,
            process.env.JWT_PRIVATE_KEY,
            { expiresIn: options?.expiry || process.env.JWT_EXPIRE_TIME },
            function(err,token){
                if(err){
                    reject(err);
                    return;
                }
                resolve(token);
                return;
            }
        )
        
    })
}

module.exports.verifyToken = function(token){
    return new Promise(function(resolve,reject){
        jwt.verify(token, process.env.JWT_PRIVATE_KEY, function(err, decoded) {
            if(err){
                reject(err);
                return;
            }
            resolve(decoded);
            return;
        });
    })
}