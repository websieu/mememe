var WAValidator = require('wallet-address-validator');                                  //https://github.com/ognus/wallet-address-validator

class UtilityValidate {
    //Return guid
    static validateEmail(email) {
        return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
    }

    static validateAdressEth(address) {
        return WAValidator.validate(address, 'ethereum');
    }

    static validateOnlyAlphaNumeric(str) {
        return /^[a-z0-9]+$/i.test(str); //return true/false
    }

    static validateOnlyNumeric(str) {
        return /^[0-9]+$/i.test(str); //return true/false
    }

    static validateString(str, lengthMin, lengthMax) {
        if (typeof str !== 'string' || str.length > lengthMax || str.length < lengthMin) {
            return false;
        }

        return true;
    }

    static validateNumber(num) {
        if (typeof num === 'number') {
            return true;
        }

        return false;
    }

    static validateBoolean(val) {
        if (typeof val === 'boolean')
            return true;
        return false;
    }

}

module.exports = UtilityValidate;