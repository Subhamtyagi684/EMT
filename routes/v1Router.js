var express = require('express');
var router = express.Router();
const {loginWithPasswordValidation,registerValidation} = require("../validators/v1Router/validations");
const {authenticateToken,authorizeToken} = require("../middlewares/auth/middleware");
const { login, register } = require('../controllers/authentication');
const {moduleNames,actionNames} = require("../configs/constants")
const usersRouter = require("./users")
/* GET home page. */
router.post('/authenticate', loginWithPasswordValidation,  login);

router.post('/register', registerValidation,authenticateToken,
    (req,res,next)=>{
        req.moduleName = moduleNames.USER_MANAGEMENT;
        req.actionName = actionNames.CREATE_USER;
        next();
    } 
,authorizeToken,register);


router.use('/user',authenticateToken,usersRouter);

module.exports = router;

// authenticateToken,
// (req, res, next) => {
//     req.body = payload;
//     (req.body.access_module = "ADMISSION"), (req.body.access_action = "SAVE");
//     next();
//   },
// authorizeToken,