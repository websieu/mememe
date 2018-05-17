const UserDb = require('../Database/UserDb')

class UserPresenter {
    static get mInstance() { return { UserDb: new UserDb() }; }

    static findAll() {
        return this.mInstance.UserDb.findAll();
    }

    static findById(id) {
        return this.mInstance.UserDb.findById(id);
    }

    static findByUsername(username) {
        return this.mInstance.UserDb.findByUsername(username);
    }

    static findByEmail(email) {
        return this.mInstance.UserDb.findByEmail(email);
    }

    static findByUsernameAdmin(username) {
        return this.mInstance.UserDb.findByUsernameAdmin(username);
    }

    static findByPasswordResetToken(username) {
        return this.mInstance.UserDb.findByPasswordResetToken(username);
    }

    static insert(connection, data) {
        return this.mInstance.UserDb.insert(connection, data);
    }

    static update(connection, data) {
        return this.mInstance.UserDb.update(connection, data);
    }
}

module.exports = UserPresenter;