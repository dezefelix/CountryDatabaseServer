/**
 * Created by Felix on 29-5-2017.
 */

//core modules
var express = require('express');
var router = express.Router();

//my modules
var pool = require('../db/connector');
var auth = require('../auth/authentication');

//token required everywhere, but at /login
router.all(new RegExp("[^(\/login)]"), function (req, res, next) {

    console.log("VALIDATE TOKEN");

    var token = (req.header('X-Access-Token')) || '';

    auth.decodeToken(token, function (err, payload) {
        if (err) {
            console.log('Error handler: ' + err.message);
            res.status((err.status || 401 )).json({error: new Error("Not authorised").message});
        } else {
            next();
        }
    });
});

//login feature using post
router.route('/login').post(function (req, res) {

    //get user input
    var username = req.body.username || '';
    var password = req.body.password || '';
    var query = "SELECT * FROM user where username = '" + username + "';";
    var result = '';

    console.log("User input: " + username + " | " + password);

    //get db value
    pool.getConnection(function (err, connection) {
        if (err) {
            console.log(err);
        } else {
            connection.query(query, function (err, rows) {
                connection.release();

                console.log("Query result: " + rows[0].Username + " | " + rows[0].Password);

                //get user data if username and password are correct
                result = rows.filter(function (user) {
                    if (user.Username === username && user.Password === password) {
                        return (user);
                    }
                });

                console.log("result: " + JSON.stringify(result[0]));

                if (result[0]) {
                    res.status(200).json({"token": auth.encodeToken(username), "username": username});
                } else {
                    res.status(401).json({"error": "Credentials not valid. Laters."})
                }

            })
        }
    })
});

//search user by username
router.get('/:username?', function (req, res) {

    var username = req.params.username;
    var query = "";

    if (username) {
        query = "SELECT * FROM user WHERE username = '" + username + "';";
    } else {
        query = "SELECT * FROM user";
    }

    pool.getConnection(function (err, connection) {
        connection.query(query, function (err, rows) {
            connection.release();
            if (err) {
                console.log(err);
            } else {
                res.status(200).json(rows);
            }
        })
    })
});

//if invalid URL, show 404
router.get('*', function (request, response) {
    response.status(404);
    response.json({
        "description": "404 - Page not found. So sorry."
    });
});

module.exports = router;