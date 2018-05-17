const UtilityValidate = require('../../utility/UtilityValidate');
const Utility = require('../../utility/Utility');
const DatabaseUtility = require('../../DAO/DatabaseUtility');
const User = require('../../common/model/User');
const UserPresenter = require('../../Presenter/UserPresenter');

const DataTypeModel = require('../../common/model/DataTypeModel');

class LoginModel {
    constructor() {
        this.email = '';
        this.password = '';
        this.rememberMe = false;
        this.captcha = '';
    }

    set attributes(obj) {
        if (obj == null) {
            return null;
        }
        return Object.assign(this, obj)
    }

    validate() {
        try {
            if (UtilityValidate.validateEmail(this.email) === false) {
                throw new Error('Email is invalid.');
            }

            return Utility.success();
        } catch (error) {
            return Utility.error(error.message);
        }
    }
}

module.exports = LoginModel;