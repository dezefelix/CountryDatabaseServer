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

app.set('PORT', config.webPort);
app.set('SECRET_KEY', config.secretKey);

var port = process.env.PORT || app.get('PORT');

