const {ApiResponse} = require("../Response")
const userModel = require("../database/Schemas/User")

exports.fetchUserList = async function(req, res, next) {
    let apiResponse = new ApiResponse();
    let page = req.body.page || 1, limit = req.body.limit || 10
    try{
      userModel.find({userType:{$ne: 1}})
      .skip((page-1)*limit)
      .select("-_id firstName lastName userType email createdOn")
      .limit(limit)
      .lean()
      .then((userList)=>{
        apiResponse.setStatus(200),
        apiResponse.setMessage("Fetched Successfully")
        apiResponse.setResult(userList)
        return res.send(apiResponse)
      })
      .catch((err)=>{
        apiResponse.setStatus(400);
        apiResponse.setMessage("Error while fetching user list");
        return res.send(apiResponse)
      })
    }catch(err){
      apiResponse.setStatus(400);
      apiResponse.setMessage("Something went wrong");
      return res.send(apiResponse)
    }
  }