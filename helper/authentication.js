// let jwt = require("jsonwebtoken");
const secret = process.env.secret;
const { ErrorHandler } = require("./error_mgmt/errorHandler");
const log = require("./error_mgmt/logger");
const { v1: uuidv1 } = require("uuid");
var jwt = require('jsonwebtoken')
var randtoken = require('rand-token')

var refreshTokens = {}
var SECRET = process.env.secretTk;
var refreshTokens = {};
const passport = require("passport");
var CryptoJS = require("crypto-js");
const secretKey = process.env.CRKEY;
const DISTADDRESSINDEX = process.env.ESDISTADDRESSINDEX;
const { returnSearchResult } = require("../database/elasticSearch");

const generateToken = async (user, res) => {
  var token = jwt.sign(user, SECRET, { expiresIn: process.env.EXPIRETIME })
  var refreshToken = randtoken.uid(256)
  refreshTokens[refreshToken] = user.userid;
  let access = { token: token, refreshToken: refreshToken };
  // return access
  return getAddress(user.userid, res).then(resppp => {
    console.log(resppp);
    const sendObj = {
      token: access,
      addressList: resppp
    }
    return sendObj
  });

};

const getAddress = async (distributorId, res) => {

  const searchQuery = {
    "from": 0,
    "track_total_hits": true,
    "sort": [
      {
        "created_on": "desc"
      }
    ],
    "query": {
      "bool": {
        "must": [
          {
            "match": {
              "distributor_id": distributorId
            }
          },
          {
            "match": {
              "is_deleted": false
            }
          }
        ],
      }
    }
  };
  const req = '';

  return returnSearchResult(req, res, DISTADDRESSINDEX, searchQuery).then(async (listReponse) => {
    const blankArray = []
    console.log(listReponse.hits.hits);
    if (listReponse.hits.total.value > 0) {
      const addressList = await listReponse.hits.hits.map(item => {
        return item._source
      })
      return addressList
    } else {
      return blankArray;
    }


  }).catch(err => {
    return blankArray
  })

}



const rejectToken = (refreshToken) => {

  var refreshToken = refreshToken;
  if (refreshToken in refreshTokens) {
    delete refreshTokens[refreshToken]
  }

  return true;
};

const refreshToken = async (req, res, next) => {
  var userid = req.body.userid
  var refreshToken = req.body.refreshToken
  console.log(refreshToken, refreshTokens, refreshTokens[refreshToken]);
  if ((refreshToken in refreshTokens) && (refreshTokens[refreshToken] == userid)) {
    var user = {
      'userid': userid
    }
    var token = jwt.sign(user, SECRET, { expiresIn: 900 })


    var refreshToken = randtoken.uid(256)
    refreshTokens[refreshToken] = user.userid;
    let access = { token: token, refreshToken: refreshToken };

    res.json({ token: access })
  }
  else {
    res.sendStatus(401)
  }
};



/**
 * @description Function to compare password from request with the password fetched from database 
 * @param { string } dbPassword 
 * @param { string } reqPassword 
 */

const validatePassword = (dbPassword, reqPassword) => {
  if (dbPassword.trim() === reqPassword.trim()) {
    return true;
  } else {
    return false;
  }
};


const verifyRequest = async (req, res, next) => {

  let token = req.headers["x-access-token"] || req.headers["authorization"];

  if (token) {
    if (token.startsWith("Bearer ") || token.startsWith("bearer ")) {
      token = token.slice(7, token.length);
    }
    await jwt.verify(token, SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({
          success: false,
          message: "Access Denied: Invalid token provided with request"
        });
      } else {
        // console.log(token);
        // console.log("heeerrr" , decoded);
        req['userID'] = decoded.userid
        next();
      }
    });

  } else {
    log.error("Auth token is not supplied");
    //throw new ErrorHandler(401, "Access Denied: Invalid token provided with request");
    return res.status(401).json({
      success: false,
      message: "Access Denied: Invalid token provided with request"
    });
  }
};


function verifyTokenInRequest(passport) {
  function checkForToken(req, res, next) {
    passport.authenticate('jwt', function (err, user, info) {
      if (err) return next(err)
      if (!user) {
        return res.status(401).send({
          "error": {
            "code": "INVALID_AUTHORIZATION_CODE",
            "message": "Invalid authorization code"
          }
        });
      } else {
        let token = req.headers["x-access-token"] || req.headers["authorization"];
        if (token) {
          let checkToken = token.replace('Bearer ', '');
          console.log(heeerrr);
          req.user = user
          next();

        }

      }

    })(req, res, next);
  }

  return checkForToken
}



const generatePassword = (password) => {
  const nonEnPassword = password.trim()
  var encoddedPasskey = CryptoJS.AES.encrypt(nonEnPassword, secretKey).toString();
  // console.log(nonEnPassword, encoddedPasskey);
  return encoddedPasskey
};


const decryptPassword = (password) => {
  var bytes = CryptoJS.AES.decrypt(password, secretKey);
  var decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);
  return decryptedPassword
};




module.exports = {
  generateToken,
  rejectToken,
  refreshToken,
  validatePassword,
  verifyRequest,
  verifyTokenInRequest,
  generatePassword,
  decryptPassword
};
