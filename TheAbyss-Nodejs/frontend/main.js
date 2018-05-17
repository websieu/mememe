/**
 * Required Module:
 sudo npm install pg
 sudo npm i pg-pool pg
 sudo npm install uuid
 sudo npm install body-parser --save
 sudo npm install express-session --save
 sudo npm install cookie-parser --save
 sudo npm install connect-flash --save
 sudo npm install wallet-address-validator
 ***************************************
 sudo root
 sudo npm install web3
 */
/**
 * https://www.npmjs.com/package/uuid
 */
var express = require('express'); //Call module express to make the application run
var fileUpload = require('express-fileupload');
var bodyParser = require('body-parser'); //for parsing incoming requests
var session = require('express-session'); //to handle sessions
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');
var PostgreSqlStore = require('connect-pg-simple')(session);

var routes = require('./routes/router'); //Route for application
const DatabaseUtility = require('../DAO/DatabaseUtility');

var app = express(); //call express module


// default options
app.use(fileUpload());
app.use(cookieParser());

//parse incoming requests
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

var sessionStore = new PostgreSqlStore(DatabaseUtility.getConnectionConfig());

//use sessions for tracking logins
app.use(session({
    secret: 'ssshhhhh',
    saveUninitialized: true,
    resave: true,
    key: 'user',
    store: sessionStore,
    cookie: {
        //secure: true,
        maxAge: 2 * 3600 * 1000
    }
}));

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://mytheabyss.thu');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    if ('OPTIONS' == req.method) {
        res.send(200);
    } else {
        next();
    }
});

//routes should be called at last
//include routes
app.use('/', routes);


//catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('File Not Found');
    err.status = 404;
    next(err);
});

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json(err.message);
});

/**
*Export Module
*/
module.exports = app;