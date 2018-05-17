var Sanita = require('../log/Sanita');
var DatabaseUtility = require('./DatabaseUtility');

class DatabaseDao {
    static async doSelectOne(sql, values) {
        try {
            var connection = new DatabaseUtility();

            //Wait open connection
            await connection.open();

            const { rows } = await connection.query(sql, values);

            //Close connection
            connection.close();

            if (rows.length === 0) {
                return null;
            }

            return rows[0];
        } catch (error) {
            //Close connection
            connection.close();

            Sanita.error(error);
            throw error;
        }
    }

    static async doSelectAll(sql, values) {
        try {
            var connection = new DatabaseUtility();

            //Wait open connection
            await connection.open();

            const { rows } = await connection.query(sql, values);

            //Close connection
            connection.close();

            if (rows.length === 0) {
                return null;
            }

            return rows;
        } catch (error) {
            //Close connection
            connection.close();

            Sanita.error(error);
            throw error;
        }
    }

    static async doInsert(connection, sql, values) {
        try {
            const data = await connection.query(sql, values);
            const { rowCount } = data;

            if (rowCount > 0) {
                Sanita.log('Query', sql, values.join(', '), 'success');
                return true;
            } else {
                Sanita.error('Query', sql, values.join(', '), 'fail');
                return false;
            }
        } catch (error) {
            Sanita.error(error);
            throw error;
        }
    }

    static async doInsertPromise(connection, sql, values) {
        try {
            return new Promise((resolve, reject) => {
                connection.client.query(sql, values, function (error, data) {
                    if (error)
                        reject(error);
                    const { rowCount } = data;

                    if (rowCount > 0) {
                        Sanita.log('Query', sql, values.join(', '), 'success');
                        resolve(true);
                    } else {
                        Sanita.error('Query', sql, values.join(', '), 'fail');
                        resolve(false);
                    }
                })
            });
        } catch (error) {
            Sanita.error(error);
            throw error;
        }
    }

    static async doUpdate(connection, sql, values) {
        try {
            const { rowCount } = await connection.query(sql, values);

            if (rowCount > 0) {
                Sanita.log('Query', sql, 'success');
                return true;
            } else {
                Sanita.error('Query', sql, 'fail');
                return false;
            }
        } catch (error) {
            Sanita.error(error);
            throw error;
        }
    }

    //Return model User
    static makeRow(data, model) {
        if (data == null) {
            return null;
        }

        Object.keys(model).map(key => {
            model[key] = data[key.toLowerCase()];
        });

        return model;
    }

    //Return list model User
    static makeTable(list, model) {
        if (list == null || list.length === 0) {
            return null;
        }

        var self = this;
        list = list.map(data => self.makeRow(data, model));
        return list;
    }
}

module.exports = DatabaseDao;