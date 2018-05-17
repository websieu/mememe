const Utility = require('../utility/Utility');
const Sanita = require('../log/Sanita');
const Config = require('../common/model/Config');
const DatabaseDao = require('../DAO/DatabaseDao');
const DataTypeModel = require('../common/model/DataTypeModel');

class ConfigDb {
    get table() {
        return 'tbconfig';
    }

    get params() {
        return [
            'configName',
            'configValue'
        ];
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

    async findByConfigNames(names) {
        try {
            if (names.length === 0)
                return null;

            var params = names.map((x, i) => 'configName = ' + this.getKey(i + 1));

            var sql = '';
            sql += 'SELECT * FROM ' + this.table;
            sql += params.join(' OR ');
            sql += ';';

            var values = names;

            var data = await DatabaseDao.doSelectOne(sql, values);

            return this.makeRow(data);
        } catch (error) {
            Sanita.error(error);
            throw error;
        }
    }

    async insert(connection, data) {
        try {
            var self = this;
            var values = this.params.map(x => data[x]);
            var paramsSign = this.params.map((x, i) => self.getKey(i + 1));
            var sql = 'INSERT INTO ' + this.table + ' (' + this.params.join(', ') + ') VALUES(' + paramsSign.join(', ') + ');';

            var result = await DatabaseDao.doInsert(connection, sql, values);

            return result;

        } catch (error) {
            Sanita.error(error);
            throw error;
        }
    }

    async update(connection, data) {
        try {
            var self = this;
            var values = this.params.map(x => data[x]);
            var paramsData = this.params.map((x, i) => x + ' = ' + self.getKey(i + 1));

            values.push(data['configName']);

            var sql = '';
            sql += 'UPDATE ' + this.table;
            sql += '    SET                     ' + paramsData.join(', ');
            sql += '    WHERE   configName =    ' + self.getKey(values.length);
            sql += ';';

            var result = await DatabaseDao.doUpdate(connection, sql, values);

            return result;

        } catch (error) {
            Sanita.error(error);
            throw error;
        }
    }

    makeTable(list) {
        return DatabaseDao.makeTable(list, new Config());
    }

    makeRow(data) {
        return DatabaseDao.makeRow(data, new Config());
    }

    getKey(i) {
        return "$" + i;
    }
}

module.exports = ConfigDb;
