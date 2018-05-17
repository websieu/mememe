const ConfigDb = require('../Database/ConfigDb')

class ConfigPresenter {
    static get mInstance() { return { ConfigDb: new ConfigDb() }; }

    static findAll() {
        return this.mInstance.ConfigDb.findAll();
    }

    static findByConfigNames(names) {
        return this.mInstance.ConfigDb.findByConfigNames(names);
    }


    static insert(connection, data) {
        return this.mInstance.ConfigDb.insert(connection, data);
    }

    static update(connection, data) {
        return this.mInstance.ConfigDb.update(connection, data);
    }
}

module.exports = ConfigPresenter;