var clientPool = require('./clientPool');
const Utility = require('../utility/Utility');
const Sanita = require('../log/Sanita');
const DataTypeModel = require('../common/model/DataTypeModel');

class DatabaseManageUtility {
    async createTable() {
        try {

            // var client = await clientPool();

            var sql = ''

            //#region table contract
            sql +=
                `
                    /*DROP TABLE IF EXISTS contract;*/
                    CREATE TABLE contract
                    (
                        id                      VARCHAR(50)     PRIMARY KEY, 
                        name                    VARCHAR(100)    ,
                        address                 VARCHAR(100)    not null, 
                        bytecode                TEXT            not null,
                        abi                     TEXT            not null,
                        active                  INT             DEFAULT 1
                    );
                    comment on column contract.active is '1: active    0: no active';
                `;

            //#endregion table contract

            sql +=
                `
                    DROP TABLE IF EXISTS tbuser;
                    CREATE TABLE tbuser
                    (
                        id                              VARCHAR(50)     PRIMARY KEY , 
                        username                        VARCHAR(100)    not null    ,
                        authKey                         VARCHAR(100)                ,
                        googleAuth                      VARCHAR(100)                ,
                        email                           VARCHAR(50)     not null    , 
                        passwordHash                    VARCHAR(100)    not null    , 
                        passwordResetToken              VARCHAR(100)                , 
                        ethWallet                       VARCHAR(100)                , 
                        phoneNumber                     VARCHAR(15)                 , 
                        status                          INT             DEFAULT 10  , 
                        createdAt                       INT                         ,
                        updatedAt                       INT                         ,
                        role                            INT             DEFAULT 0   ,
                        cookie                          TEXT                        ,
                        balance                         INT             DEFAULT 0   ,
                        subcribeEmail                   INT             DEFAULT 0   ,
                        lastSentSub                     INT             DEFAULT 0   ,
                        affUser                         TEXT                        ,
                        userIP                          VARCHAR(100)                ,
                        active                          INT             DEFAULT 10
                    );                    
                `;

            sql +=
                `
                    /*DROP TABLE IF EXISTS tbconfig;*/
                    CREATE TABLE tbconfig
                    (                       
                        configName                      TEXT                        ,
                        configValue                     TEXT                        
                    );
                `;

            sql +=
                `
                    CREATE TABLE "session" (
                        "sid" varchar NOT NULL COLLATE "default",
                              "sess" json NOT NULL,
                              "expire" timestamp(6) NOT NULL
                      )
                      WITH (OIDS=FALSE);
                      
                      ALTER TABLE "session" ADD CONSTRAINT "session_pkey" 
                      PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
                    `;


            // await client.query(sql);

            // // tell the pool to destroy this client
            // client.release();

            return Utility.success(DataTypeModel.UPDATE_DATABASE_SUCCESS, null);
        } catch (error) {
            // tell the pool to destroy this client
            //client.release();

            Sanita.error(error);
            return Utility.error(error.message, null);
        }
    }
}

module.exports = new DatabaseManageUtility();