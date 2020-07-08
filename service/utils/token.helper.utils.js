/* Declare required npm packages */
var jwt = require('jsonwebtoken');

/* Custom Error */
var customError = require('../errors/custom.error');

var tokenDbAccess = require('../dataaccess/token.dbaccess');

var fs = require('fs');

/* Include Global Variables */
var refreshTokenList = {};

/* Constant Values */
// var ACCESSTOKENSECRET = "123456";
// var REFRESHTOKENSECRET = "654321";


/*
<summary> Helps to Generate Access Token for LDAP based User Authentication </summary>
<param name="userDetails"> User Details object </param>
<param name="groupDetails"> Group Details object </param>
<returns> Return User Access token  </returns>
*/
async function generateAccessAndRefreshToken(userDetails, groupDetails, authenticationDetails, tokenValidity, applicationId) {
    try {
        let data = {
            "UserId": userDetails.UserId,
            "Username": userDetails.Username,
            "DomainName": userDetails.DomainName,
            "GroupDetails": groupDetails.map(ldapGroup => {
                return ldapGroup.LdapGroupsId;
            }),
            "AuthenticationType": authenticationDetails.AuthenticationType,
            "AuthenticationMethod": authenticationDetails.AuthenticationMethod,
            "CreatedDateTime": new Date().toUTCString()
        };


        var accessJWTToken = jwt.sign(data, Buffer.from(process.env.accesstokensecret,'base64').toString(), {
            expiresIn: tokenValidity
        });

        // var accessPrivateKey = fs.readFileSync('certificates/private/access_private.pem');
        // var accessJWTToken = jwt.sign(data, {
        //     key: accessPrivateKey,
        //     passphrase: process.env.AccessToken_PrivateKey
        // }, {
        //     algorithm: 'RS256',
        //     expiresIn: tokenValidity
        // });

        let accessDecoded = jwt.decode(accessJWTToken);

        let accessTokenExpiry = new Date(accessDecoded.exp * 1000).toUTCString();

        let accessToken = Buffer.from(accessJWTToken).toString('base64');

        var refreshJWTToken = jwt.sign(data, Buffer.from(process.env.refreshtokensecret,'base64').toString(), {
            expiresIn: 60 * 10
        });

        // var refreshPrivateKey = fs.readFileSync('certificates/private/refresh_private.pem');
        // var refreshJWTToken = jwt.sign(data, {
        //     key: refreshPrivateKey,
        //     passphrase: process.env.RefreshToken_PrivateKey
        // }, {
        //     algorithm: 'RS256',
        //     expiresIn: tokenValidity + 600
        // });

        let refreshDecoded = jwt.decode(refreshJWTToken);

        let refreshTokenExpiry = new Date(refreshDecoded.exp * 1000).toUTCString();

        let refreshToken = Buffer.from(refreshJWTToken).toString('base64');

        refreshTokenList[refreshToken] = userDetails.Username;

        let tokenInfo = {
            AccessToken: accessToken,
            RefreshToken: refreshToken,
            AccessExpiry: accessTokenExpiry,
            RefreshExpiry: refreshTokenExpiry,
            ApplicationId: applicationId,
            Username: userDetails.Username,
            UserId: userDetails.UserId,
            IsRefreshToken: false
        };
        let insertedTokenInfo = await tokenDbAccess.InsertTokenDetails(tokenInfo);

        return [accessToken, refreshToken, accessTokenExpiry, refreshTokenExpiry];
    } catch (error) {
        throw new customError.ApplicationError(error);
    }
}

/*
<summary> Helps to Validate Access Token </summary>
<param name="accessToken"> Access Token </param>
<returns> Return User Details </returns>
*/
function validateAccessToken(accessToken) {
    try {
        return new Promise(
            function (resolve, reject) {
                let accessJWTToken = Buffer.from(accessToken, 'base64').toString();
                var userDetails = {};
                //var publicKey = fs.readFileSync('certificates/public/access_public.pem');
                
                    //jwt.verify(accessJWTToken, publicKey, {
                       // algorithm: 'RS256'
                    jwt.verify(accessJWTToken, Buffer.from(process.env.accesstokensecret,'base64').toString(), (err, decoded) => {
                        try {
                            if (err) {
                                throw new customError.ApplicationError(err.toString(), 422);
                            } else {
                                userDetails = decoded;
                                resolve(userDetails);
                            }
                        } catch (error) {
                            reject(new customError.ApplicationError(error));
                        }
                    });
            });
    } catch (error) {
        throw new customError.ApplicationError(error);
    }
}

/*
<summary> Helps to Validate Refresh Token </summary>
<param name="refreshToken"> Refresh Token </param>
<returns> Return new Access Token and Refresh Token </returns>
*/
async function validateRefreshToken(refreshToken, tokenValidity, applicationId) {
    try {
        let refreshJWTToken = Buffer.from(refreshToken, 'base64').toString();
        let newTokens = [];      
        //var publicKey = fs.readFileSync('certificates/public/refresh_public.pem');
        //jwt.verify(refreshJWTToken, publicKey, {
           // algorithm: 'RS256'
        jwt.verify(refreshJWTToken, Buffer.from(process.env.refreshtokensecret,'base64').toString(), (err, decoded) => {        
            if (err) {
                // if (refreshToken in refreshTokenList) {
                //     delete refreshTokenList[refreshToken];
                // }
                throw new customError.ApplicationError(err.toString(), 422);
            } else {
                let userDetails = decoded;
                newTokens = generateNewAccessAndRefreshToken(userDetails, refreshToken, tokenValidity, applicationId);
            }
        });
        return newTokens;
    } catch (error) {
        throw new customError.ApplicationError(error);
    }
}

/*
<summary> Helps to New Generate Access Token from Refreshtoken </summary>
<param name="tokenDetails"> Old Token Information </param>
<param name="oldRefreshToken"> Existing Refresh Token </param>
<returns> Return new User Access token and Refresh Token  </returns>
*/
async function generateNewAccessAndRefreshToken(tokenDetails, oldRefreshToken, tokenValidity, applicationId) {
    try {
        let data = {
            "UserId": tokenDetails.UserId,
            "Username": tokenDetails.Username,
            "DomainName": tokenDetails.DomainName,
            "GroupDetails": tokenDetails.GroupDetails,
            "AuthenticationType": tokenDetails.AuthenticationType,
            "AuthenticationMethod": tokenDetails.AuthenticationMethod,
            "CreatedDateTime": new Date().toUTCString()
        };

        let refreshTokenInfo = {
            RefreshToken: oldRefreshToken,
            IsRefreshToken: true
        };
        let validTokens = await tokenDbAccess.CheckTokenExpiry(refreshTokenInfo);

        if (validTokens.length > 0) {
            // var accessPrivateKey = fs.readFileSync('certificates/private/access_private.pem');

            // var accessJWTToken = jwt.sign(data, {
            //     key: accessPrivateKey,
            //     passphrase: '1234567890'
            // }, {
            //     algorithm: 'RS256',
            //     expiresIn: tokenValidity
            // });

            var accessJWTToken = jwt.sign(data, Buffer.from(process.env.accesstokensecret,'base64').toString(), {
                expiresIn: tokenValidity
            });

            let accessDecoded = jwt.decode(accessJWTToken);

            let accessTokenExpiry = new Date(accessDecoded.exp * 1000).toUTCString();

            let accessToken = Buffer.from(accessJWTToken).toString('base64');

            // var refreshPrivateKey = fs.readFileSync('certificates/private/refresh_private.pem');

            // var refreshJWTToken = jwt.sign(data, {
            //     key: refreshPrivateKey,
            //     passphrase: '0987654321'
            // }, {
            //     algorithm: 'RS256',
            //     expiresIn: tokenValidity + 600
            // });

            var refreshJWTToken = jwt.sign(data, Buffer.from(process.env.refreshtokensecret,'base64').toString(), {
                expiresIn: 60 * 10
            });
            
            let refreshDecoded = jwt.decode(refreshJWTToken);

            let refreshTokenExpiry = new Date(refreshDecoded.exp * 1000).toUTCString();

            let refreshToken = Buffer.from(refreshJWTToken).toString('base64');


            let tokenInfo = {
                AccessToken: accessToken,
                RefreshToken: refreshToken,
                AccessExpiry: accessTokenExpiry,
                RefreshExpiry: refreshTokenExpiry,
                ApplicationId: applicationId,
                Username: tokenDetails.Username,
                UserId: tokenDetails.UserId,
                IsRefreshToken: true,
                OldRefreshToken: oldRefreshToken
            };
            let insertedTokenInfo = await tokenDbAccess.InsertTokenDetails(tokenInfo);

            return [accessToken, refreshToken, accessTokenExpiry, refreshTokenExpiry];
        } else {
            throw new customError.ApplicationError("Invalid Token.", 422);
        }
        // if ((oldRefreshToken in refreshTokenList) && (refreshTokenList[oldRefreshToken] == tokenDetails.Username)) {
        //     delete refreshTokenList[oldRefreshToken];

        //     var accessPrivateKey = fs.readFileSync('certificates/private/access_private.pem');

        //     // var accessJWTToken = jwt.sign(data, ACCESSTOKENSECRET, {
        //     //     expiresIn: 60 * 5
        //     // });
        //     var accessJWTToken = jwt.sign(data, { key: accessPrivateKey, passphrase: '1234567890' }, { algorithm: 'RS256',expiresIn:tokenValidity});

        //     let accessDecoded= jwt.decode(accessJWTToken);

        //     let accessTokenExpiry= new Date(accessDecoded.exp*1000).toUTCString();

        //     let accessToken = Buffer.from(accessJWTToken).toString('base64');

        //     var refreshPrivateKey = fs.readFileSync('certificates/private/refresh_private.pem');
        //     // var refreshJWTToken = jwt.sign(data, REFRESHTOKENSECRET, {
        //     //     expiresIn: 60 * 10
        //     // });

        //     var refreshJWTToken = jwt.sign(data, { key: refreshPrivateKey, passphrase: '0987654321' }, { algorithm: 'RS256',expiresIn:tokenValidity+600});

        //     let refreshDecoded= jwt.decode(refreshJWTToken);

        //     let refreshTokenExpiry= new Date(refreshDecoded.exp*1000).toUTCString();

        //     let refreshToken = Buffer.from(refreshJWTToken).toString('base64');

        //     refreshTokenList[refreshToken] = tokenDetails.Username;


        //     let tokenInfo={
        //         AccessToken:accessToken,
        //         RefreshToken:refreshToken,
        //         AccessExpiry:accessTokenExpiry,
        //         RefreshExpiry:refreshTokenExpiry,
        //         ApplicationId: applicationId,
        //         Username: tokenDetails.Username,
        //         UserId:tokenDetails.UserId,
        //         IsRefreshToken: true,
        //         OldRefreshToken:oldRefreshToken
        //     };
        //     let insertedTokenInfo= await tokenDbAccess.InsertTokenDetails(tokenInfo);

        //     return [accessToken, refreshToken,accessTokenExpiry,refreshTokenExpiry];
        // } else {
        //     throw new customError.ApplicationError("Invalid Token.",422);
        // }
    } catch (error) {
        throw new customError.ApplicationError(error);
    }
}


module.exports = {
    GenerateAccessAndRefreshToken: generateAccessAndRefreshToken,
    ValidateAccessToken: validateAccessToken,
    ValidateRefreshToken: validateRefreshToken
};