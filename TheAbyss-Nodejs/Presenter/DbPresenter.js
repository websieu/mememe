const Utility = require('../utility/Utility');
const Sanita = require('../log/Sanita');

class DbPresenter {
    constructor() {
    }

    static get table() {
        return '';
    }

    static get params() {
        return [];
    }

    static get paramsSign() {
        return [];
    }

    static options(orderBy, limit, forUpdate) {
        var ORDERBY = orderBy && (typeof orderBy === 'string') ? ' order by ' + orderBy : '';

        var LIMIT = limit && (typeof limit === 'number') ? ' LIMIT ' + limit : '';

        var FORUPDATE = forUpdate && (typeof forUpdate === 'boolean') ? ' for update ' : '';

        return ORDERBY + LIMIT + FORUPDATE;
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

module.exports = DbPresenter;
