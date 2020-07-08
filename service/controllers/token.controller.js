/* Declare required npm packages */

/* Declare Common functions */
var helperUtil = require('../utils/helper.utils');
var tokenUtil = require('../utils/token.helper.utils');

/* Declare Validators */
var tokenValidator = require('../validators/token.validator');

/* Declare Model class */
var tokenModel = require('../models/token.model');

/* Custom Error */
var customError = require('../errors/custom.error');

/* Database Access */
var ldapDbAccess = require('../dataaccess/ldap.dbaccess');
var userDbAccess = require('../dataaccess/user.dbaccess');
var tokenDbAccess = require('../dataaccess/token.dbaccess');

/* Logging */
var logger = require('../utils/logger.utils');

/*
<summary> Helps to Get New token from Refresh Token </summary>
<param name="req"> Request object </param>
<param name="res"> Response object </param>
<returns> Return User Access token  </returns>
*/
async function getNewTokenFromRefreshToken(req, res) {
    try {
        var bodyContent = JSON.stringify(req.body);
        if (req.body) {
            logger.info({
                label: "GET Token from Refresh token",
                message: "STARTED"
            });
            const result = tokenValidator.RefreshTokenInfo.validate(req.body);
            if (result != "") {
                let errorMessage = new customError.ApplicationError(result.toString(), 422);
                logger.error({
                    label: "GET Token from Refresh token",
                    message: errorMessage.Error.Message
                });
                let tokenResponse = new tokenModel.RefreshTokenResponse(errorMessage, null);
                helperUtil.GenerateJSONAndXMLResponse(req, res, tokenResponse, errorMessage.Status);
            } else {
                bodyContent = JSON.parse(bodyContent);

                let refreshtoken = bodyContent.newtokenrequest.refreshtoken;
                let jwtToken = await tokenUtil.ValidateRefreshToken(refreshtoken, req.tokenValidity, req.applicationId);
                if (jwtToken.length > 0 && jwtToken.length == 4) {
                    let tokenDetails = {
                        "AccessToken": jwtToken[0],
                        "RefreshToken": jwtToken[1],
                        "AccessToken_ExpiryTime": jwtToken[2],
                        "RefreshToken_ExpiryTime": jwtToken[3]
                    };
                    let authenticationResponse = new tokenModel.RefreshTokenResponse(null, tokenDetails);
                    logger.info({
                        label: "GET Token from Refresh token",
                        message: "SUCCESS"
                    });
                    helperUtil.GenerateJSONAndXMLResponse(req, res, authenticationResponse, 200);
                } else {
                    let errorMessage = new customError.ApplicationError("Internal Application Error!!");
                    logger.error({
                        label: "GET Token from Refresh token",
                        message: errorMessage.Error.Message
                    });
                    let tokenResponse = new tokenModel.RefreshTokenResponse(errorMessage, null);
                    helperUtil.GenerateJSONAndXMLResponse(req, res, tokenResponse, errorMessage.Status);
                }
                // jwtToken.then(function (result) {
                //     if (result.length > 0 && result.length == 2) {
                //         let tokenDetails = {
                //             "AccessToken": result[0],
                //             "RefreshToken": result[1],
                //             "ExpiresIn": 60
                //         };
                //         let authenticationResponse = new tokenModel.RefreshTokenResponse(null, tokenDetails);
                //         helperUtil.GenerateJSONAndXMLResponse(req, res, authenticationResponse, 200);
                //     } else {
                //         let errorMessage = new customError.ApplicationError("Internal Application Error!!", 500);
                //         let tokenResponse = new tokenModel.RefreshTokenResponse(errorMessage, null);
                //         helperUtil.GenerateJSONAndXMLResponse(req, res, tokenResponse, errorMessage.Status);
                //     }
                // }, function (err) {
                //     let errorMessage = new customError.ApplicationError(err, 422);
                //     let tokenResponse = new tokenModel.RefreshTokenResponse(errorMessage, null);
                //     helperUtil.GenerateJSONAndXMLResponse(req, res, tokenResponse, errorMessage.Status);
                // });
            }
        } else {
            let errorMessage = new customError.ApplicationError("Request Body is Empty!!", 422);
            logger.error({
                label: "GET Token from Refresh token",
                message: errorMessage.Error.Message
            });
            let tokenResponse = new tokenModel.RefreshTokenResponse(errorMessage, null);
            helperUtil.GenerateJSONAndXMLResponse(req, res, tokenResponse, errorMessage.Status);
        }
    } catch (error) {
        let errorMessage = new customError.ApplicationError(error);
        logger.error({
            label: "GET Token from Refresh token",
            message: errorMessage.Error.Message
        });
        let tokenResponse = new tokenModel.RefreshTokenResponse(errorMessage, null);
        helperUtil.GenerateJSONAndXMLResponse(req, res, tokenResponse, errorMessage.Status);
    }
}

/*
<summary> Helps to Get User Roles and Privileges Information from Access token </summary>
<param name="req"> Request object </param>
<param name="res"> Response object </param>
<returns> Return User Roles and Privileges  </returns>
*/
async function getUserInfoFromAccessToken(req, res) {
    try {
        var bodyContent = JSON.stringify(req.body);
        if (req.body) {
            logger.info({
                label: "GET User Information from Token",
                message: "STARTED"
            });
            const result = tokenValidator.IntrospectInfo.validate(req.body);
            if (result != "") {
                let errorMessage = new customError.ApplicationError(result.toString(), 422);
                logger.error({
                    label: "GET User Information from Token",
                    message: errorMessage.Error.Message
                });
                let tokenResponse = new tokenModel.IntrospectResponse(errorMessage, null);
                helperUtil.GenerateJSONAndXMLResponse(req, res, tokenResponse, errorMessage.Status);
            } else {
                bodyContent = JSON.parse(bodyContent);

                let accessToken = bodyContent.introspectrequest.accesstoken;
                let siteId = bodyContent.introspectrequest.siteid;
                if (isNaN(siteId)) {
                    let errorMessage = new customError.ApplicationError("Site Id must be a Number", 422);
                    let tokenResponse = new tokenModel.IntrospectResponse(errorMessage, null);
                    logger.error({
                        label: "GET User Information from Token",
                        message: errorMessage.Error.Message
                    });
                    helperUtil.GenerateJSONAndXMLResponse(req, res, tokenResponse, errorMessage.Status);
                } else {
                    let accessTokenInfo = {
                        AccessToken: accessToken,
                        IsAccessToken: true
                    };
                    let validTokens = await tokenDbAccess.CheckTokenExpiry(accessTokenInfo);
                    if (validTokens.length > 0) {
                        let userDetails = tokenUtil.ValidateAccessToken(accessToken);
                        userDetails.then(async (result) => {
                            try{
                                let userId = result.UserId;
                                let username = result.Username;
                                let userGroups = result.GroupDetails;
                                let mappedRolesAndPrivileges = [];
                                let mappedRoles = [];
                                let mappedPrivileges = [];
                                let authenticationType = result.AuthenticationType;
                                if (authenticationType === "ISAS") {
                                    if (userId === 0) {
                                        let errorMessage = new customError.ApplicationError("Invalid User!!", 422);
                                        logger.error({
                                            label: "GET User Information from Token",
                                            message: errorMessage.Error.Message
                                        });
                                        let tokenResponse = new tokenModel.IntrospectResponse(errorMessage, null);
                                        helperUtil.GenerateJSONAndXMLResponse(req, res, tokenResponse, 422);
                                    } else {
                                        mappedRolesAndPrivileges = await userDbAccess.GetRolesAndPrivilegesByUserId(userId, siteId, req.applicationId);
                                    }
                                } else {
                                    if (userGroups.length > 0) {
                                        mappedRolesAndPrivileges = await ldapDbAccess.GetRolesAndPrivilegesByGroupId(userGroups.join(','), siteId, req.applicationId);
                                    }
                                }

                                // mappedRoles = mappedRolesAndPrivileges.map((role) => {
                                //     return role.RoleName;
                                // });
                                mappedPrivileges = mappedRolesAndPrivileges.map((privilege) => {
                                    return {
                                        Privilege: {
                                            Key: privilege.PrivilegeKey,
                                            Name: privilege.PrivilegeName
                                        }
                                    };
                                });

                                let userMappingInfo = {
                                    //MappedRoles: mappedRoles,
                                    MappedPrivileges: mappedPrivileges
                                };
                                let userDetails = {
                                    Username: username
                                };
                                let authenticationResponse = new tokenModel.IntrospectResponse(null, userMappingInfo, userDetails);
                                logger.info({
                                    label: "GET User Information from Token",
                                    message: "SUCCESS"
                                });
                                helperUtil.GenerateJSONAndXMLResponse(req, res, authenticationResponse, 200);
                            }catch(error){
                                let errorMessage = new customError.ApplicationError(error);
                                logger.error({
                                    label: "GET User Information from Token",
                                    message: errorMessage.Error.Message
                                });
                                let tokenResponse = new tokenModel.IntrospectResponse(errorMessage, null, null);
                                helperUtil.GenerateJSONAndXMLResponse(req, res, tokenResponse, errorMessage.Status);
                            }
                            },
                            function (err) {
                                let errorMessage = new customError.ApplicationError(err);
                                logger.error({
                                    label: "GET User Information from Token",
                                    message: errorMessage.Error.Message
                                });
                                let tokenResponse = new tokenModel.IntrospectResponse(errorMessage, null, null);
                                helperUtil.GenerateJSONAndXMLResponse(req, res, tokenResponse, errorMessage.Status);
                            });
                    } else {
                        let errorMessage = new customError.ApplicationError("Invalid Token!!", 422);
                        logger.error({
                            label: "GET User Information from Token",
                            message: errorMessage.Error.Message
                        });
                        let tokenResponse = new tokenModel.IntrospectResponse(errorMessage, null, null);
                        helperUtil.GenerateJSONAndXMLResponse(req, res, tokenResponse, errorMessage.Status);
                    }
                }
            }
        } else {
            let errorMessage = new customError.ApplicationError("Request Body is Empty!!", 400);
            logger.error({
                label: "GET User Information from Token",
                message: errorMessage.Error.Message
            });
            let tokenResponse = new tokenModel.IntrospectResponse(errorMessage, null, null);
            helperUtil.GenerateJSONAndXMLResponse(req, res, tokenResponse, errorMessage.Status);
        }
    } catch (error) {
        let errorMessage = new customError.ApplicationError(error);
        logger.error({
            label: "GET User Information from Token",
            message: errorMessage.Error.Message
        });
        let tokenResponse = new tokenModel.IntrospectResponse(errorMessage, null, null);
        helperUtil.GenerateJSONAndXMLResponse(req, res, tokenResponse, errorMessage.Status);
    }
}


module.exports = {
    GetNewTokenFromRefreshToken: getNewTokenFromRefreshToken,
    GetUserInfoFromAccessToken: getUserInfoFromAccessToken
};