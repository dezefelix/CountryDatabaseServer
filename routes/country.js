/**
 * Created by Felix on 29-5-2017.
 */

//core modules
var express = require('express');
var router = express.Router();

//my modules
var pool = require('../db/connector.js');

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

//create new country
router.post('/create/:code/:name/:continent/:region/:localName/:surfaceArea/:population/:lifeExpectancy', function (req, res) {

    var code = req.params.code;
    var name = req.params.name;
    var continent = req.params.continent;
    var region = req.params.region;
    var localName = req.params.localName;
    var surfaceArea = req.params.surfaceArea;
    var population = req.params.population;
    var lifeExpectancy = req.params.lifeExpectancy;

    var query = "INSERT INTO country (code, name, continent, region, localName, surfaceArea, population, lifeExpectancy) " +
        "VALUES (" +
        "'" + code + "', " +
        "'" + name + "', " +
        "'" + continent + "', " +
        "'" + region + "', " +
        "'" + localName + "', " +
        + surfaceArea + ", " +
        + population + ", " +
        + lifeExpectancy +
        ");";

    console.log(query);

    pool.getConnection(function (err, connection) {
        connection.query(query, function (err, rows) {
            if (err) {
                throw err;
            } else {
                res.status(200).json(rows);
                console.log('New country with code "' + code + '" has been created.');
            }
        });
    });
});

//update country values
router.put('/update/:codeIdentifier/:code/:name/:continent/:region/:localName/:surfaceArea/:population/:lifeExpectancy', function (req, res) {

    var codeIdentifier = req.params.codeIdentifier;
    var code = req.params.code;
    var name = req.params.name;
    var continent = req.params.continent;
    var region = req.params.region;
    var localName = req.params.localName;
    var surfaceArea = req.params.surfaceArea;
    var population = req.params.population;
    var lifeExpectancy = req.params.lifeExpectancy;

    var query = "UPDATE country " +
        "SET code = '" + code + "', " +
        "name = '" + name + "', " +
        "continent = '" + continent + "', " +
        "region = '" + region + "', " +
        "localName = '" + localName + "', " +
        "surfaceArea = " + surfaceArea + ", " +
        "population = " + population + ", " +
        "lifeExpectancy = " + lifeExpectancy +
        " WHERE code = '" + codeIdentifier + "';";

    console.log(query);

    pool.getConnection(function (err, connection) {
        connection.query(query, function (err, rows) {
            if (err) {
                throw err;
            } else {
                res.status(200).json(rows);
                console.log('Country with code ' + codeIdentifier + ' has been updated.');
            }
        });
    });
});


//delete country (by country code)
router.delete('/delete/:code', function (req, res) {

    var code = req.params.code;

    var query = 'DELETE FROM `country` WHERE `country`.`code` = "' + code + '";';

    pool.getConnection(function (err, connection) {
        connection.query(query, function (err, rows) {
            if (err) {
                throw err;
            } else {
                res.status(200).json(rows);
                console.log('Country with code "' + code + '" has been deleted from the database.');
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