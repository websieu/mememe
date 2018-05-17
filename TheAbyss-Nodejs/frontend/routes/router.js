var express = require('express');
var multer = require('multer');

var router = express.Router();
var upload = multer();
var passport = require('../../common/config/passport');

/**
* Middleware
*/
router.use(passport.initialize());
router.use(passport.session());


/**
 * Require controller modules.
 */
var UserController = require('../controller/UserController');

/**
 * User API
 */
router.post('/user/login', UserController.actionLogin);
router.post('/user/register', UserController.actionRegister);
router.get('/user/process/:token([a-z0-9_]+)', UserController.actionProcessRegister);
router.get('/user/data-init', UserController.actionGetDataInit);

//exports router
module.exports = router;