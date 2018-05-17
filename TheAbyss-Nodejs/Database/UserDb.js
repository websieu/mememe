var Utility = require('../utility/Utility');
var Sanita = require('../log/Sanita');
var DatabaseDao = require('../DAO/DatabaseDao');
var DataTypeModel = require('../common/model/DataTypeModel');
var User = require('../common/model/User');

class UserDb {
    get table() {
        return 'tbuser';
    }

    get params() {
        return [
            'id',
            'username',
            'authKey',
            'googleAuth',
            'passwordHash',
            'passwordResetToken',
            'email',
            'ethWallet',
            'phoneNumber',
            'status',
            'createdAt',
            'updatedAt',
            'role',
            'cookie',
            'balance',
            'subcribeEmail',
            'lastSentSub',
            'affUser'];
    }

    get model() {
        return new User();
    }

    async findAll() {
        try {
            var sql = 'SELECT * FROM ' + this.table + ';';
            var list = await DatabaseDao.doSelectAll(sql, null);
            return this.makeTable(list);
        } catch (error) {
            Sanita.error(error);
            throw error;
        }
    }

    async findById(id) {
        try {
            var sql = '';
            sql += 'SELECT * FROM ' + this.table;
            sql += '    WHERE   id          = $1';
            sql += '    AND     status      = $2';
            sql += ';';

            var values = [id, DataTypeModel.USER_ACTIVE];

            var data = await DatabaseDao.doSelectOne(sql, values);

            return this.makeRow(data);
        } catch (error) {
            Sanita.error(error);
            throw error;
        }
    }

    async findByUsername(username) {
        try {
            var sql = '';
            sql += 'SELECT * FROM ' + this.table;
            sql += '    WHERE   username      = $1';
            sql += '    AND     status        = $2';
            sql += ';';

            var values = [username, DataTypeModel.USER_ACTIVE];

            var data = await DatabaseDao.doSelectOne(sql, values);

            return this.makeRow(data);
        } catch (error) {
            Sanita.error(error);
            throw error;
        }
    }

    async findByEmail(email) {
        try {
            var sql = '';
            sql += 'SELECT * FROM ' + this.table;
            sql += '    WHERE   email         = $1';
            sql += '    AND     status        = $2';
            sql += ';';

            var values = [email, DataTypeModel.USER_ACTIVE];

            var data = await DatabaseDao.doSelectOne(sql, values);

            return this.makeRow(data);
        } catch (error) {
            Sanita.error(error);
            throw error;
        }
    }

    async findByUsernameAdmin(username) {
        try {
            var sql = '';
            sql += 'SELECT * FROM ' + this.table;
            sql += '    WHERE   username      = $1';
            sql += '    AND     role          = $2';
            sql += ';';

            var values = [username, DataTypeModel.ROLE_ADMIN];

            var data = await DatabaseDao.doSelectOne(sql, values);

            return this.makeRow(data);
        } catch (error) {
            Sanita.error(error);
            throw error;
        }
    }

    async findByPasswordResetToken(passwordResetToken) {
        try {
            var sql = '';
            sql += 'SELECT * FROM ' + this.table;
            sql += '    WHERE   passwordResetToken      = $1';
            sql += '    AND     status                  = $2';
            sql += ';';

            var values = [passwordResetToken, DataTypeModel.USER_ACTIVE];

            var data = await DatabaseDao.doSelectOne(sql, values);

            return this.makeRow(data);
        } catch (error) {
            Sanita.error(error);
            throw error;
        }
    }

    async insert(connection, data) {
        try {
            if (data == null)
                return false;

            var self = this;
            var values = this.params.map(x => data[x]);
            var paramsSign = this.params.map((x, i) => self.getKey(i + 1));
            var sql = 'INSERT INTO ' + this.table + ' (' + this.params.join(', ') + ') VALUES(' + paramsSign.join(', ') + ');';

            var result = await DatabaseDao.doInsertPromise(connection, sql, values);

            return result;

        } catch (error) {
            Sanita.error(error);
            throw error;
        }
    }

    async update(connection, data) {
        try {
            if (data == null)
                return false;

            var self = this;
            var values = this.params.map(x => data[x]);
            var paramsData = this.params.map((x, i) => x + ' = ' + self.getKey(i + 1));

            values.push(data['id']);

            var sql = '';
            sql += 'UPDATE ' + this.table;
            sql += '    SET             ' + paramsData.join(', ');
            sql += '    WHERE   id =    ' + self.getKey(values.length);
            sql += ';';

            var result = await DatabaseDao.doUpdate(connection, sql, values);

            return result;

        } catch (error) {
            Sanita.error(error);
            throw error;
        }
    }


    makeTable(list) {
        return DatabaseDao.makeTable(list, this.model);
    }

    makeRow(data) {
        return DatabaseDao.makeRow(data, this.model);
    }

    getKey(i) {
        return "$" + i;
    }
}

module.exports = UserDb;
