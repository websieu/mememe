const { Pool } = require('pg');
const Sanita = require('../log/Sanita');

const config = {
    host: 'localhost',
    user: "postgres",
    password: "Thu12345!",
    database: "smartcontract",
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
};
var pool;

async function createClient() {
    try {       
        
        if (!pool) {
            pool = await new Pool(config);

            // the pool with emit an error on behalf of any idle clients
            // it contains if a backend error or network partition happens
            pool.on('error', (err, client) => {
                Sanita.error('Unexpected error on idle client', err);
                process.exit(-1);
            });            
        }

        var client = await pool.connect();
        Sanita.log('Total count of connect in pool is: ' + pool.totalCount);

        return client;
    } catch (error) {
         Sanita.error(error);
        throw error;
    }
}

module.exports = createClient;