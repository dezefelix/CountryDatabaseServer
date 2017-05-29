/**
 * Created by Felix on 29-5-2017.
 */

var mysql = require('mysql');
var config = require('../../../nodejs/CountryDatabaseServer/config.json');

var connector = mysql.createPool({
    host : config.dbHost,
    user : config.dbUsername,
    pass : config.dbPassword,
    db : config.dbName
    });

module.exports = connector;