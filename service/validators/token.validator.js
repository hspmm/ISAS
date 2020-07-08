/* Declare required npm packages */
var schema = require('validate');

/* Token Details Schema */
const refreshTokenInfo = new schema({
    newtokenrequest: {
        refreshtoken: {
            type: String,
            required: true,
            message: {
                type: 'Refresh Token must be a string.',
                required: 'Refresh Token is required.'
            }
        }
    }
});

/* Introspect Schema */
const introspectInfo = new schema({
    introspectrequest: {
        accesstoken: {
            type: String,
            required: true,
            message: {
                type: 'Access Token must be a string.',
                required: 'Access Token is required.'
            }
        },
        siteid: {
            // type: String,
            required: true,
            match: /^[0-9]+$/,
            message: {
                // type: 'Site Id must be a string.',
                required: 'Site Id is required.',
                match: 'Invalid Site Id.'
            }
        }
    }
});

module.exports = {
    RefreshTokenInfo: refreshTokenInfo,
    IntrospectInfo: introspectInfo
};