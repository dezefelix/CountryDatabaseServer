/**
 * Created by Felix on 29-5-2017.
 */

//core modules
var express = require('express');
var router = express.Router();

//my modules
var pool = require('../db/connector.js');

// router.route('/login').post(function (req, res) {
//
//     //get user input
//     var username = req.body.username || '';
//     var password = req.body.password || '';
//     var query = "SELECT * FROM user where username = '" + username + "';";
//     var result = '';
//
//     console.log("User input: " + username + " | " + password);
//
//     //get db value
//     pool.getConnection(function (err, connection) {
//         connection.query(query, function (err, rows) {
//             connection.release();
//
//             console.log("Query result: " + rows[0].Username + " | " + rows[0].Password);
//
//             result = rows.filter(function (user) {
//                 if (user.Username === username && user.Password === password) {
//                     return (user);
//                 }
//             })
//
//         });
//     })
// });

//select all countries or one country by name
router.get('/:countryName?', function (req, res) {

    var countryName = req.params.countryName;
    var query = "";

    if (countryName) {
        query = "SELECT * FROM country WHERE name = '" + countryName + "';";
    } else {
        query = "SELECT * FROM country";
    }

    pool.getConnection(function (err, connection) {
        if (err) {
            console.log(err);
        } else {
            connection.query(query, function (err, rows) {
                connection.release();
                if (err) {
                    console.log(err);
                } else {
                    res.status(200).json({"countries": rows});
                }
            })
        }
    })
});

//delete country (by country code)
router.delete('/countries/delete/:code', function (req, res) {

    var code = req.params.code;

    var query = 'DELETE FROM `country` WHERE `country`.`code` = "' + code + '";';

    pool.getConnection(function (err, connection) {
        connection.query(query, function (err, rows) {
            if (err) {
                throw err;
            } else {
                res.status(200).json(rows);
                console.log('Country with code ' + code + ' has been deleted from the database.');
            }
        });
    });
});

//if invalid URL, show 404
router.get('*', function (request, response) {
    response.status(404);
    response.json({
        "description": "404 - Page not found. So sorry."
    });
});

module.exports = router;