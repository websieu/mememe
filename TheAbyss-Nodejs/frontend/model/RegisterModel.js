const fs = require('fs');
var postmark = require("postmark");
const UtilityValidate = require('../../utility/UtilityValidate');
const Utility = require('../../utility/Utility');
const DataTypeModel = require('../../common/model/DataTypeModel');
const DatabaseUtility = require('../../DAO/DatabaseUtility');
const ConfigPresenter = require('../../Presenter/ConfigPresenter');
const mainLocal = require('../../common/config/main-local');
const User = require('../../common/model/User');
const UserPresenter = require('../../Presenter/UserPresenter');

class RegisterModel {
    constructor() {
        this.email = '';
        this.password = '';
        this.passwordConfirm = '';
        this.userIP = '';
    }

    set attributes(obj) {
        if (obj == null) {
            return null;
        }
        return Object.assign(this, obj)
    }

    get validate() {
        try {
            var self = this;
            //required
            ['email', 'password', 'passwordConfirm'].forEach(element => {
                if (!self[element])
                    throw new Error(element + ' is required!');
            });

            this.email = this.email.trim();

            if (UtilityValidate.validateEmail(this.email) === false) {
                throw new Error('Email is invalid.');
            }

            //email with maxLength = 255
            if (UtilityValidate.validateString(this.email, 1, 255) === false) {
                throw new Error('Email is length with max 255!');
            }

            //password is string with length 8-50
            if (UtilityValidate.validateString(this.password, 8, 50) === false) {
                throw Error('Password with length from 8-50 character');
            }

            if (this.password !== this.passwordConfirm) {
                throw new Error('Password and PasswordConfirm not match.');
            }

            return Utility.success();
        } catch (error) {
            return Utility.error(error.message);
        }
    }

    async register() {
        //Validate data
        if (this.validate.status === DataTypeModel.ERROR) {
            return Utility.error('Invalid data');
        }

        //Get connection
        var connection = DatabaseUtility.getConnection();

        //Wait open connection
        await connection.open();

        //Begin transaction
        var trans = await connection.beginTransaction();
        {
            try {
                var user = await UserPresenter.findByEmail(this.email);
                {
                    if (user === null) {
                        //Nếu người dùng chưa đăng ký, tạo tài khoản mới
                        user = new User();
                        user.id = Utility.guid();
                        user.userIP = this.userIP;
                        user.username = this.email;
                        user.email = this.email;
                        await user.setPassword(this.password);
                        user.generateAuthKey();
                        user.generatePasswordResetToken();
                        user.updated_at = Utility.time();
                        user.created_at = Utility.time();
                        let result = await UserPresenter.insert(connection, user);
                        if (result === false) {
                            //Rollback transaction
                            await trans.rollBack();
                            //Close connection
                            connection.close();
                            return Utility.error('No insert user to database', user);
                        }
                    } else {
                        //Rollback transaction
                        await trans.rollBack();
                        //Close connection
                        connection.close();
                        return Utility.error('Email is exist. Please use another email.', this.email);
                    }
                }

                var sendEmail = await this.sendEmail(user);

                if (!sendEmail) {
                    //Rollback transaction
                    await trans.rollback();

                    //Close connection
                    connection.close();

                    return Utility.error('No send email');
                }

                //Commit transaction
                await trans.commit();

                //Close connection
                connection.close();

                return Utility.success('Please check email to complete register!');
            } catch (error) {
                //Rollback transaction
                await trans.rollback()

                //Close connection
                connection.close();

                return Utility.error(error.message);
            }
        }
    }

    sendEmail(user) {
        var self = this;
        return new Promise((resolve, reject) => {
            var linkFile = Utility.pathJoin(global.appRoot, 'common/mail/mailConfirmRegister.html');
            fs.readFile(linkFile, "utf8", function (error, html) {
                if (error)
                    reject(false);
                var linkActive = 'http://smartcontract.thu/user/process/' + user.passwordResetToken;
                html = html.replace(/\${linkActive}/g, linkActive);
                var client = new postmark.Client(mainLocal.mailer.token);

                client.sendEmail({
                    "From": 'no-reply@buyselleth.com',
                    "To": self.email,
                    "Subject": 'Confirm Register',
                    "HtmlBody": html
                }, function (error, result) {
                    if (error) {
                        console.error("Unable to send via postmark: " + error.message);
                        reject(false);
                    }
                    resolve(true);
                });
            });

        });
    }
}

module.exports = RegisterModel;