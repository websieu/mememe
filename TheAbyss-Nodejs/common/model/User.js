var bcrypt = require('bcrypt'); //for hashing and salting passwords

// var UserPresenter = require('../../Presenter/UserPresenter');
var Utility = require('../../utility/Utility');
const DataTypeModel = require('../../common/model/DataTypeModel');

const passwordResetTokenExpire = 3600;

class User {
    constructor() {
        this.id = null;
        this.username = null;
        this.authKey = null;
        this.googleAuth = null;
        this.passwordHash = null;
        this.passwordResetToken = null;
        this.email = null;
        this.ethWallet = null;
        this.phoneNumber = null;
        this.status = DataTypeModel.USER_ACTIVE;
        this.createdAt = null;
        this.updatedAt = null;
        this.role = 0;
        this.cookie = null;
        this.balance = 0;
        this.subcribeEmail = DataTypeModel.INACTIVE;
        this.lastSentSub = 0;
        this.affUser = null;
        this.userIP = null;
    }

    set attributes(obj) {
        if (data == null) {
            return null;
        }
        return Object.assign(this, obj)
    }

    validate() {
        try {
            if (this.status < DataTypeModel.USER_DELETED || this.status > DataTypeModel.USER_ACTIVE)
                throw new Error('status is in range ' + DataTypeModel.USER_DELETED + ' - ' + DataTypeModel.USER_ACTIVE);

            ['ethWallet', 'phoneNumber', 'googleAuth'].forEach(element => {
                if (typeof this[element] !== 'string')
                    throw new Error(element + ' must be string!');
            });

            ['balance', 'lastSentSub'].forEach(element => {
                if (typeof this[element] !== 'number')
                    throw new Error(element + ' must be number!');
            });

            if (this.subcribeEmail != DataTypeModel.ACTIVE || this.subcribeEmail != DataTypeModel.INACTIVE) {
                throw new Error('subcribeEmail must be ' + DataTypeModel.ACTIVE + ' or ' + DataTypeModel.INACTIVE + '!');
            }

            return true;
        } catch (error) {
            return false;
        }
    }

    static findIdentityByAccessToken(token, type = null) {
        throw new Error('"findIdentityByAccessToken" is not implemented.');
    }

    /**
     * Finds out if password reset token is valid
     */
    static isPasswordResetTokenValid(token) {
        try {
            if (!token)
                return false;

            var timestamp = parseInt(token.slice(token.lastIndexOf('_') + 1));

            return timestamp + passwordResetTokenExpire >= Utility.time();
        } catch (error) {
            throw error;
        }
    }

    static isValidAprroveLink(link) {
        if (!link)
            return false;

        var dataLink = link.split('__');

        if (dataLink.length < 3)
            return false;

        var time = parseInt(dataLink[2]);
        var expire = passwordResetTokenExpire;
        return time + expire >= Utility.time();
    }

    generateApproveLink() {
        this.passwordResetToken = Utility.randStringHash(32) + "__" + this.userIP + "__" + Utility.time();
    }

    /**
     * Validates password
     */
    validatePassword(password) {
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, this.passwordHash, function (error, result) {
                if (error)
                    reject(error)
                else
                    resolve(result);
            });
        });
    }

    /**
     * Generates password hash from password and sets it to the model
     *
     * @param string password
     */
    setPassword(password) {
        return new Promise((resolve, reject) => {
            bcrypt.hash(String(password), 13, function (error, hash) {
                if (error)
                    reject(error);
                else {
                    this.passwordHash = hash;
                    resolve(hash);
                }
            }.bind(this))
        });
    }

    /**
     * Generates "remember me" authentication key
     */
    generateAuthKey() {
        this.authKey = Utility.randStringHash(32);
    }

    /**
     * Generates new password reset token
     */
    generatePasswordResetToken() {
        this.passwordResetToken = Utility.randStringHash(32) + '_' + Utility.time();
    }

    /**
     * Removes password reset token
     */
    removePasswordResetToken() {
        this.passwordResetToken = null;
    }

    static isGuest(req) {
        try {
            if (req.isAuthenticated())
                return false;
            return true;
        } catch (error) {
            return true;
        }
    }
}

module.exports = User;