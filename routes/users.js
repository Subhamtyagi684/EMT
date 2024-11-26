var express = require('express');
var router = express.Router();
const {fetchUserList} = require("../controllers/userHandler");
const {authenticateToken,authorizeToken} = require("../middlewares/auth/middleware");
const {moduleNames,actionNames} = require("../configs/constants")

/* GET users listing. */
router.post('/list',
    (req,res,next)=>{
        req.moduleName = moduleNames.USER_MANAGEMENT;
        req.actionName = actionNames.USER_LIST;
        next();
    } 
    ,authorizeToken, 
    fetchUserList
);

module.exports = router;
