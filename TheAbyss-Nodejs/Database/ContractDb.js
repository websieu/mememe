const Utility = require('../utility/Utility');
const Sanita = require('../log/Sanita');

class ContractDb {
    static get table() {
        return 'contract';
    }

    static get params() {
        return ['id', 'name', 'address', 'abi', 'bytecode', 'active'];
    }

    static get paramsSign() {
        return ['$1', '$2', '$3', '$4', '$5', '$6'];
    }

    static async findAll() {
        try {
            var sql = 'SELECT * FROM ' + this.table + ';';
            const { rows } = await client.query(sql);
            return rows;
        } catch (error) {
            Sanita.error(error);
            throw error;
        }
    }

    static async findByName(client, name) {
        try {
            var sql =
                'SELECT * FROM ' + this.table +
                ' WHERE name = $1' + ';';

            var values = [name];

            const { rows } = await client.query(sql, values);
            return rows;
        } catch (error) {
            Sanita.error(error);
            throw error;
        }
    }

    static async insert(client, data) {
        try {
            var paramsData = this.params.map(x => data[x]);
            var sql = 'INSERT INTO ' + this.table + ' (' + this.params.join(', ') + ') VALUES(' + this.paramsSign.join(', ') + ');';

            const { rowCount } = await client.query(sql, paramsData);

            if (rowCount > 0) {
                Sanita.log('Insert ' + JSON.stringify(data, null, 4) + 'to ' + this.table + ' success.');
                return true;
            } else {
                Sanita.log('Insert ' + JSON.stringify(data, null, 4) + 'to ' + this.table + ' fail.');
                return false;
            }
        } catch (error) {
            Sanita.error(error);
            throw error;
        }
    }

}

module.exports = ContractPresenter;
