const Sanita = require('../../log/Sanita');
const Utility = require('../../utility/Utility');
const RegisterModel = require('../model/RegisterModel');
const DataTypeModel = require('../../common/model/DataTypeModel');
const User = require('../../common/model/User');
var passport = require('../../common/config/passport');
const LoginModel = require('../model/LoginModel');

exports.actionGetDataInit = async function (req, res, next) {
    try {
        var result = {};
        if (!req.isAuthenticated()) {
            result = {
                id: '',
                email: '',
                isGuest: true
            };
        } else {
            result = {
                id: req.user.id,
                email: req.user.email,
                isGuest: false
            }
        }

        return res.json(Utility.success('', result));
    } catch (error) {
        return Utility.error(error.message, null);
    }
};

exports.actionLogin = async function (req, res, next) {
    try {
        //If login done
        if (req.isAuthenticated()) {
            return res.json(Utility.success('Login success', {}));
        }

        var mLoginModel = new LoginModel();
        mLoginModel.attributes = req.body;

        //Validate
        if (mLoginModel.validate.status == DataTypeModel.ERROR) {
            return res.json(Utility.error(mLoginModel.validate.message, req.body));
        }

        await savePassportLogin(req);
        return res.json(Utility.success('Login success', {}));
    } catch (error) {
        Sanita.error(error);
        return res.json(Utility.error(error.message, null));
    }
}

exports.actionRegister = async function (req, res, next) {
    try {
        Sanita.log('Call function register');
        //Get request
        var mRegisterModel = new RegisterModel();
        mRegisterModel.attributes = req.body;

        //Validate
        if (mRegisterModel.validate.status == DataTypeModel.ERROR) {
            return res.json(Utility.error(mRegisterModel.validate.message, req.body));
        }

        //Check captcha
        //TODO: something

        //Register user
        var result = await mRegisterModel.register();

        if (result.status === DataTypeModel.ERROR) {
            throw new Error(result.message);
        }

        return res.json(Utility.success('Register success', {}));
    } catch (error) {
        Sanita.error(error);
        return res.json(Utility.error('Error occurs. Please try again.', null));
    }
}

function savePassport(req) {
    return new Promise((resolve, reject) => {
        /**
         * Đăng nhập và lưu thông tin người dùng trong req bằng middleware passport
         */
        passport.authenticate('signup', function (error, user, info) {
            if (error)
                reject(error);
            req.login(user, function (error) {
                if (error)
                    reject(error);
                req.session.save(function () {
                    resolve(true);
                })
            });
        })(req);
    });
}

function savePassportLogin(req) {
    return new Promise((resolve, reject) => {
        /**
         * Đăng nhập và lưu thông tin người dùng trong req bằng middleware passport
         */
        passport.authenticate('login', function (error, user, info) {
            if (error)
                reject(error);
            req.login(user, function (error) {
                if (error)
                    reject(error);
                req.session.save(function () {
                    resolve(true);
                })
            });
        })(req);
    });
}

exports.actionProcessRegister = async function (req, res, next) {
    try {
        //Get token from url
        var token = req.params.token;
        {
            if (!token)
                throw new Error('Link truy cập không hợp lệ.');
            if (!User.isPasswordResetTokenValid(token))
                throw new Error('Link truy cập đã hết hạn.');
        }

        /**
         * passport nhận thông tin dưới dạng POST thông qua req.body
         */

        req.body = req.params;
        let result = await savePassport(req);
        return res.redirect('http://mytheabyss.thu');

    } catch (error) {
        Sanita.error(error);
        return res.json(Utility.error(error.message, error));
    }
};

