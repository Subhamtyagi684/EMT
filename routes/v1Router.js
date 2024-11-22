var express = require('express');
var router = express.Router();
const {loginWithPasswordValidation,registerValidation} = require("../validators/v1Router/validations");
const {} = require("../middlewares/auth/middleware");
const { login, register } = require('../controllers/authentication');

/* GET home page. */
router.post('/authenticate', loginWithPasswordValidation,  login);

router.post('/register', registerValidation, register);

module.exports = router;

// authenticateToken,
// (req, res, next) => {
//     req.body = payload;
//     (req.body.access_module = "ADMISSION"), (req.body.access_action = "SAVE");
//     next();
//   },
// authorizeToken,