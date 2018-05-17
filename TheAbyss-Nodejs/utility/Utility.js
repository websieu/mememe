var uuidv1 = require('uuid/v1');
var WAValidator = require('wallet-address-validator');                                  //https://github.com/ognus/wallet-address-validator
var fs = require('fs');
var path = require('path');


class Utility {
    //Return guid
    static guid() {
        return uuidv1(); // ⇨ 'f64f2940-fae4-11e7-8c5f-ef356f279131'
    }

    static pathJoin(...paths) {
        return path.join(...paths);
    }

    static readFilesInFolder(pathFolder) {
        var self = this;
        return new Promise((resolve, reject) => {
            try {
                var listFile = [];
                fs.readdir(pathFolder, async (error, files) => {
                    if (error) {
                        Sanita.error(error.message);
                        resolve([]);
                    } else {
                        for (var i = 0; i < files.length; ++i) {
                            var fileName = files[i];
                            if (fileName) {
                                var pathFile = pathFolder + '/' + fileName;
                                if (pathFile.includes('.sol')) {
                                    listFile.push(pathFile);
                                } else {
                                    var listAnother = await self.readFilesInFolder(pathFile);
                                    if (listAnother)
                                        listFile.push(...listAnother);
                                }
                            }
                        }
                        resolve(listFile);
                    }
                })
            } catch (error) {
                Sanita.error(error.message);
                resolve([]);
            }
        });
    }

    static error(message = '', data = {}) {
        return {
            'error': 'error',
            'status': 'error',
            'message': message,
            'data': data
        };
    }

    static success(message = '', data = {}) {
        return {
            'status': 'success',
            'message': message,
            'data': data
        };
    }

    // http://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
    static sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    static formatDataSql(data) {
        if (typeof data === 'string')
            return escape(data);
        else if (data == null)
            return 'NULL';
        else if (typeof data === 'number')
            return data;
        else
            return escape(data);
    }

    static randString(length = 10) {
        if (typeof length !== 'number')
            throw new Error('First parameter ' + length + ' must be an number.');

        if (length < 1)
            throw new Error('First parameter ' + length + ' must be greater than 0');

        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        var randomString = "";
        for (var i = 0; i < length; i++) randomString += possible.charAt(Math.floor(Math.random() * possible.length));
        return randomString;
    }

    static randStringHash(length = 10) {
        if (typeof length !== 'number')
            throw new Error('First parameter ' + length + ' must be an number.');

        if (length < 1)
            throw new Error('First parameter ' + length + ' must be greater than 0');

        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var randomString = "";
        for (var i = 0; i < length; i++) randomString += possible.charAt(Math.floor(Math.random() * possible.length));
        return randomString;
    }

    static validateEmail(email) {
        return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
    }

    static validateAdressEth(address) {
        return WAValidator.validate(address, 'ethereum');
    }

    static checkOnlyAlphaNumeric(str) {
        return /^[a-z0-9]+$/i.test(str); //return true/false
    }

    static checkOnlyNumeric(str) {
        return /^[0-9]+$/i.test(str); //return true/false
    }

    static time() {
        return Math.floor(Date.now() / 1000);
    }

    static getUserIP(request) {
        return request.headers['x-forwarded-for'] || request.connection.remoteAddress;
    }

    static formatNumber(number, decimals) {
        //Định dạng dữ liệu
        //Ví dụ: 1000000.0000 => 1000,000.0000
        if (number == null) return null;
        number = String(number).split('.');
        var x = number[0];
        {
            x = x.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
        }
        var y = number[1];
        if (y && decimals) {
            y = y.slice(0, decimals);
            return x + '.' + this.toZeroAppend(y, decimals);
        } else
            return x;
    }

    static toZeroFill(e, t) {
        if (e == null) return null;
        return e = String(e), e.length !== t ? this.toZeroFill('0' + e, t) : e
    }

    static toZeroAppend(e, t) {
        if (e == null) return null;
        return e = String(e), e.length !== t ? this.toZeroAppend(e + '0', t) : e
    }

    static getCurrentTime() {
        return this.formatDate(new Date().getTime(), 'H:i:s d/m/Y');
    }

    static formatDate(time, format) {
        if (time == null)
            return null;

        if (format == null)
            format = "H:i:s - d/m/Y";

        //Example: format as string "H:i:s - d/m/Y"
        //time has unit that is miliseconds
        var date = new Date(time);

        var ss = this.toZeroFill(date.getSeconds(), 2);
        var ii = this.toZeroFill(date.getMinutes(), 2);
        var hh = this.toZeroFill(date.getHours(), 2);
        var dd = this.toZeroFill(date.getDate(), 2);
        var mm = this.toZeroFill(date.getMonth() + 1, 2);
        var yy = this.toZeroFill(date.getFullYear(), 4);

        return format.replace(/h+/i, hh).replace(/i+/i, ii).replace(/s+/i, ss).replace(/d+/i, dd).replace(/m+/i, mm).replace(/y+/i, yy);
    }

}

module.exports = Utility;