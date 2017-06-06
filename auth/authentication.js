/**
 * Created by Felix on 23-5-2017.
 */

const moment = require('moment');
const jwt = require('jwt-simple');

var settings = require('../config.json');

//encode (van username naar token)
function encodeToken(username) {
    const playload = {
        exp: moment().add(10, 'days').unix(),
        iat: moment().unix(),
        sub: username
    };
    return jwt.encode(playload, settings.secretKey);
}

//decode (van token naar username)
function decodeToken(token, cb) {

    try {
        const payload = jwt.decode(token, settings.secretKey);

        // Check if the token has expired. To do: Trigger issue in db ..
        const now = moment().unix();

        // Check if the token has expired
        if (now > payload.exp) {
            console.log('Token has expired.');
        }

        // Return
        cb(null, payload);

    } catch(err) {
        cb(err, null);
    }
}

module.exports = {
    encodeToken,
    decodeToken
};