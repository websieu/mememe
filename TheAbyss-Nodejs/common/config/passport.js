/**
*Module dependencies
*/
var passport = require('passport');
const User = require('../model/User');
const UserPresenter = require('../../Presenter/UserPresenter');
const DatabaseUtility = require('../../DAO/DatabaseUtility');

/**
*Module variables
*/
var LocalStrategy = require('passport-local').Strategy;

/**
*Configuration and Settings
*/

// used to serialize the user for the session
passport.serializeUser(function (user, done) {
    return done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser(async function (id, done) {
    try {
        var user = await UserPresenter.findById(id);
        return done(null, user);
    } catch (error) {
        return done(error, null);
    }
});

/**
*Strategies
*/
//---------------------------Local Strategy-------------------------------------

passport.use('signup', new LocalStrategy({
    usernameField: 'token',
    passwordField: 'token',
    passReqToCallback: true
}, async function (req, username, password, done) {
    //Get connection
    var connection = DatabaseUtility.getConnection();

    //Open connection
    await connection.open();

    try {
        //Begin transaction
        var trans = await connection.beginTransaction();
        {
            var user = await UserPresenter.findByPasswordResetToken(username);
            if (user == null)
                if (user == null)
                    throw new Error('Link truy cập không gắn với email nào.');

            user.removePasswordResetToken();
            let result = await UserPresenter.update(connection, user);

            //Commit transaction
            await trans.commit();

            //Close connection
            connection.close();

            return done(null, user);
        }
    } catch (error) {
        //Rollback transaction
        await trans.rollBack();
        //Close connection
        connection.close();

        return done(error, null);
    }
}));

passport.use('login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async function (req, username, password, done) {
    //Get connection
    var connection = DatabaseUtility.getConnection();

    //Open connection
    await connection.open();

    //Begin transaction
    var trans = await connection.beginTransaction();
    try {

        var user = await UserPresenter.findByEmail(username);
        if (user === null) {
            throw new Error('User is not register. Please register to login.');
        }

        let result = await user.validatePassword(password);

        if (result === false) {
            throw new Error('Login invalid. Please recheck info.');
        }

        //Commit transaction
        await trans.commit();

        //Close connection
        connection.close();

        return done(null, user);
    } catch (error) {
        //Rollback transaction
        await trans.rollBack();
        //Close connection
        connection.close();

        return done(error, null);
    }
}));

/**
*Export Module
*/
module.exports = passport;