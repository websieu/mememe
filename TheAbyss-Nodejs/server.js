/**
*Module dependencies
*/
var appWeb = require('./frontend/main');
var http = require('http');
var path = require('path');

//==============================================================================
// constant config
//==============================================================================

global.appRoot = path.resolve(__dirname);
global.appWeb = path.join(__dirname, 'web');
var portWeb = 3333;
//==============================================================================
/**
*Create server instance
*/
var serverWeb = http.createServer(appWeb);

/**
*Bind server to port
*/
//==============================================================================
serverWeb.listen(portWeb, function () {
    return console.log('Web server fontend listening on port: ' + portWeb);
});