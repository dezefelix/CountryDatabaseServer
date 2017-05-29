/**
 * Created by Felix on 29-5-2017.
 */

//core modules
var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');

//my modules
var config = require('./config.json');

//create application
var app = express();

//set application configurations
app.set('PORT', config.webPort);
app.set('SECRET_KEY', config.secretKey);

//get application port
var port = process.env.PORT || app.get('PORT');

//routes
app.use('/api/country', require('./routes/country.js'));
app.use('/api/user', require('./routes/user.js'));

//-------
app.use(express.static(__dirname + 'public'));

//log request header data
app.all('*', function(req, res, next) {
    console.log(req.method + " " + req.url);
    next();
});

//run application
app.listen(port, function() {
    console.log("Server listening on port " + port + "...");
});

// module.exports = app;