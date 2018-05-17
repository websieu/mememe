/**
 * Some config for application
 */
module.exports = {
  mailer: {
    class: "sweelixpostmarkMailer",
    token: "bc211b16-79f2-4804-959b-9871d56d8cb0"
  },
  db_options: {
    host: 'localhost',
    user: "postgres",
    password: "Thu12345!",
    database: "smartcontract",
    max: 20,
    port: 5432,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
  },
  _SERVER: {
    PHP_SELF: "",
    argv: "",
    argc: "",
    GATEWAY_INTERFACE: "CGI/1.1",
    SERVER_ADDR: "127.0.0.1",
    SERVER_NAME: "localhost",
    SERVER_SOFTWARE: "",
    SERVER_PROTOCOL: "HTTP/1.0",
    REQUEST_METHOD: "GET",
    REQUEST_TIME: "",
    QUERY_STRING: "",
    DOCUMENT_ROOT: "",
    HTTP_ACCEPT: "",
    HTTP_ACCEPT_CHARSET: "iso-8859-1,*,utf-8",
    HTTP_ACCEPT_ENCODING: "gzip",
    HTTP_ACCEPT_LANGUAGE: "en",
    HTTP_CONNECTION: "Keep-Alive",
    HTTP_HOST: "",
    HTTP_REFERER: "",
    HTTP_USER_AGENT: "Mozilla/4.5 [en] (X11, U, Linux 2.2.9 i586).",
    HTTPS: "",
    REMOTE_ADDR: "",
    REMOTE_HOST: "",
    REMOTE_PORT: "",
    SCRIPT_FILENAME: "",
    SERVER_ADMIN: "",
    SERVER_PORT: "80",
    SERVER_SIGNATURE: "",
    PATH_TRANSLATED: "",
    SCRIPT_NAME: "",
    REQUEST_URI: "/index.html",
    PHP_AUTH_DIGEST: "",
    PHP_AUTH_USER: "",
    PHP_AUTH_PW: "",
    AUTH_TYPE: "",
    PATH_INFO: "",
    ORIG_PATH_INFO: ""
  }
};
