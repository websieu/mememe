const { Pool } = require('pg');
const Sanita = require('../log/Sanita');

var config = {
    host: 'localhost',
    user: "postgres",
    password: "Thu12345!",
    database: "smartcontract",
    max: 20,
    port: 5432,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    conString: ''
};
var pool;

class DatabaseUtility {
    constructor() {
        this.client = null;
    }

    static getConnectionString() {
        return "postgres://" + config.user + ":" + config.password + "@" + config.host + ":" + config.port + "/" + config.database;
    }

    static getConnectionConfig(){
        config.conString = this.getConnectionString();
        return config;
    }

    static getConnection() {
        return new DatabaseUtility();
    }

    rollBack() {
        return this.rollback();
    }

    Open() {
        return this.open();
    }

    Close() {
        return this.Close();
    }

    BeginTransaction() {
        return this.beginTransaction();
    }

    Query(sql, values) {
        return this.query(sql, values);
    }

    async beginTransaction() {
        await this.client.query('BEGIN');
        return this;
    }

    async commit() {
        await this.client.query('COMMIT');
        return this;
    }

    async rollback() {
        await this.client.query('ROLLBACK');
        return this;
    }

    async query(sql, values) {
        var data = await this.client.query(sql, values);
        return data;
    }

    async open() {
        try {

            if (!pool) {
                pool = await new Pool(config);

                Sanita.log('Create a pool.');

                // the pool with emit an error on behalf of any idle clients
                // it contains if a backend error or network partition happens
                pool.on('error', (err, client) => {
                    Sanita.error('Unexpected error on idle client', err);
                    process.exit(-1);
                });
            }

            this.client = await pool.connect();
            Sanita.log('Total count of connect in pool is: ' + pool.totalCount);

            return this;
        } catch (error) {
            Sanita.error(error);
            throw error;
        }
    }

    close() {
        try {
            this.client.release();
            return this;
        } catch (error) {
            Sanita.error(error);
            throw error;
        }
    }
}

module.exports = DatabaseUtility;