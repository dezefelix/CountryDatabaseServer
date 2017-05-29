/**e
 * Created by Felix on 29-5-2017.
 */

var mysql = require('mysql');
var config = require('./../config.json');

var connector = mysql.createPool({
    connectionLimit: config.dbConnectionLimit,
    host: config.dbHost,
    user: config.dbUsername,
    password: config.dbPassword,
    database: config.dbName
});

module.exports = connector;