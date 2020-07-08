/* Custom Error */
var customError = require('../errors/custom.error');

/* Declare Common functions */
var helperUtil = require('../utils/helper.utils');
var tokenUtil = require('../utils/token.helper.utils');

/* Database Access */
var tokenDbAccess = require('../dataaccess/token.dbaccess');
let settingsDbAccess= require('../dataaccess/common.dbaccess');

const axios = require("axios");

const requestIp = require('request-ip');


/*
<summary> Helps to convert the JSON object Key string values to lower case </summary>
<param name="req"> Request object </param>
<param name="res"> Response object </param>
<param name="next"> next middleware function </param>
<returns> Change requested JSON object key to lower case </returns>
*/
function convertBodyKeysToLower(req, res, next) {

    try {
        // if (req.body) {
        //     var key, keys = Object.keys(req.body);
        //     var n = keys.length;
        //     var newobj = {}
        //     while (n--) {
        //         key = keys[n];
        //         newobj[key.toLowerCase()] = req.body[key];
        //     }
        //     req.body = newobj;
        //     next();
        // } else {
        //     next();
        // }
        if (req.body) {
            req.body = keysToLowerCase(req.body);
            next();
        } else {
            next();
        }

    } catch (error) {
        //throw new customError.ApplicationError(error);
        let errorResponse = new customError.ApplicationError(error);
        helperUtil.GenerateJSONAndXMLResponse(req, res, errorResponse, errorResponse.Status);
    }
}

function keysToLowerCase(obj) {
    
    if (!typeof (obj) === "object" || typeof (obj) === "string" || typeof (obj) === "number" || typeof (obj) === "boolean" || !typeof (obj) === "null" || !typeof (obj) === "undefined") {       
        if(typeof (obj) === "string"){
            return obj.trim();
        }
        return obj;
    }
    if(obj!=undefined && obj!=null)
    {
        var keys = Object.keys(obj);
        var n = keys.length;
        var lowKey;
        // while (n--) {
        //     var key = keys[n];
        //     lowKey=key.toLowerCase();
        //     if (key === (lowKey = key.toLowerCase()))
        //         continue;
        //     obj[lowKey] = keysToLowerCase(obj[key]);
        //     delete obj[key];
        // }
    
        while (n--) {
            var key = keys[n];
            lowKey=key.toLowerCase();
            if (key === lowKey)
            { 
                obj[key] = keysToLowerCase(obj[key]);
            }
            else{
                obj[lowKey] = keysToLowerCase(obj[key]);
                delete obj[key];
            }      
        }
    }  
   
    return (obj);
}

/*
<summary> Helps to validate the Application Secret</summary>
<param name="req"> Request object </param>
<param name="res"> Response object </param>
<param name="next"> next middleware function </param>
<returns> Validate application secret and If valid - Allow to next middleware; If not valid - return error response  </returns>
*/
function validateApplicationSecret(req, res, next) {
    try {
        let authorizationHeader = req.headers.authorization;
        if (!authorizationHeader || authorizationHeader.indexOf('Basic ') === -1) {
            let errorResponse = new customError.ApplicationError("Unauthorized Access", 401);
            helperUtil.GenerateJSONAndXMLResponse(req, res, errorResponse, errorResponse.Status);
        } else {
            let base64Credentials = authorizationHeader.split(' ')[1];
            const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
            const token = credentials.split(':');
            let applicationCode = "";
            let requestTime = "";
            let hashValue = "";
            if (token.length >= 3) {
                applicationCode = token[0];
                hashValue = token[token.length - 1];
                requestTime = token.slice(1, token.length - 1).join(':');
            } else {
                let errorResponse = new customError.ApplicationError("Unauthorized Access", 401);
                helperUtil.GenerateJSONAndXMLResponse(req, res, errorResponse, errorResponse.Status);
            }
            //const [applicationCode, requestTime, hashValue] = credentials.split(':');
            if (applicationCode != 'undefined' && requestTime != 'undefined' && hashValue != 'undefined') {
                (async () => {
                    try {
                        let applicationDetails = await helperUtil.ValidateApplicationSecret(applicationCode, requestTime, hashValue, false);
                        let applicationVersionId = applicationDetails.ApplicationVersionId;
                        let tokenValidity = applicationDetails.TokenValidity;
                        let isAdminApplication = applicationDetails.IsAdminApplication;
                        if (applicationVersionId !== 0) {
                            req.applicationId = applicationVersionId;
                            req.tokenValidity = tokenValidity;
                            req.isAdminApplication = isAdminApplication;
                            next();
                        } else {
                            let errorResponse = new customError.ApplicationError("Unauthorized Access", 401);
                            helperUtil.GenerateJSONAndXMLResponse(req, res, errorResponse, errorResponse.Status);
                        }
                    } catch (err) {
                        let errorResponse = new customError.ApplicationError("Unauthorized Access", 401);
                        helperUtil.GenerateJSONAndXMLResponse(req, res, errorResponse, errorResponse.Status);
                    }
                })();
            } else {
                let errorResponse = new customError.ApplicationError("Unauthorized Access", 401);
                helperUtil.GenerateJSONAndXMLResponse(req, res, errorResponse, errorResponse.Status);
            }
        }
    } catch (error) {
        let errorResponse = new customError.ApplicationError(error);
        helperUtil.GenerateJSONAndXMLResponse(req, res, errorResponse, errorResponse.Status);
    }
}


/*
<summary> Helps to validate the Admin Application Secret</summary>
<param name="req"> Request object </param>
<param name="res"> Response object </param>
<param name="next"> next middleware function </param>
<returns> Validate application secret and If valid - Allow to next middleware; If not valid - return error response  </returns>
*/
function validateAdminApplicationSecret(req, res, next) {
    try {
        let authorizationHeader = req.headers.authorization;
        if (!authorizationHeader || authorizationHeader.indexOf('Basic ') === -1) {
            let errorResponse = new customError.ApplicationError("Unauthorized Access", 401);
            helperUtil.GenerateJSONAndXMLResponse(req, res, errorResponse, errorResponse.Status);
        } else {
            let base64Credentials = authorizationHeader.split(' ')[1];
            const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
            const base64Value= Buffer.from(applicationToken, 'base64').toString('base64');
            const token = credentials.split(':');
            let applicationCode = "";
            let requestTime = "";
            let hashValue = "";
            if(base64Credentials===base64Value){
                if (token.length >= 3) {
                    applicationCode = token[0];
                    hashValue = token[token.length - 1];
                    requestTime = token.slice(1, token.length - 1).join(':');
                } else {
                    let errorResponse = new customError.ApplicationError("Unauthorized Access", 401);
                    helperUtil.GenerateJSONAndXMLResponse(req, res, errorResponse, errorResponse.Status);
                }
            } else {
                let errorResponse = new customError.ApplicationError("Unauthorized Access", 401);
                helperUtil.GenerateJSONAndXMLResponse(req, res, errorResponse, errorResponse.Status);
            }
            
            //const [applicationCode, requestTime, hashValue] = credentials.split(':');
            if (applicationCode != 'undefined' && requestTime != 'undefined' && hashValue != 'undefined') {
                (async () => {
                    try {
                        let validationResult = await helperUtil.ValidateApplicationSecret(applicationCode, requestTime, hashValue, true);
                        let applicationVersionId = validationResult.ApplicationVersionId;
                        let tokenValidity = validationResult.TokenValidity;
                        if (applicationVersionId !== 0) {
                            req.applicationId = applicationVersionId;
                            req.tokenValidity = tokenValidity;
                            next();
                        } else {
                            let errorResponse = new customError.ApplicationError("Unauthorized Access", 401);
                            helperUtil.GenerateJSONAndXMLResponse(req, res, errorResponse, errorResponse.Status);
                        }
                    } catch (err) {
                        let errorResponse = new customError.ApplicationError("Unauthorized Access", 401);
                        helperUtil.GenerateJSONAndXMLResponse(req, res, errorResponse, errorResponse.Status);
                    }
                })();
            } else {
                let errorResponse = new customError.ApplicationError("Unauthorized Access", 401);
                helperUtil.GenerateJSONAndXMLResponse(req, res, errorResponse, errorResponse.Status);
            }
        }
    } catch (error) {
        let errorResponse = new customError.ApplicationError(error);
        helperUtil.GenerateJSONAndXMLResponse(req, res, errorResponse, errorResponse.Status);
    }
}

/*
<summary> Helps to validate the User Access Token</summary>
<param name="req"> Request object </param>
<param name="res"> Response object </param>
<param name="next"> next middleware function </param>
<returns> Validate user Access token from header and If valid - Allow to next middleware; If not valid - return error response  </returns>
*/
async function validateUserAccessToken(req, res, next) {
    try {
        let authorizationHeader = req.headers.authorization;
        if (!authorizationHeader || authorizationHeader.indexOf('Bearer ') === -1) {
            let errorResponse = new customError.ApplicationError("Unauthorized Access", 401);
            helperUtil.GenerateJSONAndXMLResponse(req, res, errorResponse, errorResponse.Status);
        } else {
            let base64Credentials = authorizationHeader.split(' ')[1];
            let accessTokenInfo = {
                AccessToken: accessToken,
                IsAccessToken: true
            };
            let validTokens = await tokenDbAccess.CheckTokenExpiry(accessTokenInfo);
            if (validTokens.length > 0) {
                let userDetails = tokenUtil.ValidateAccessToken(base64Credentials);
                userDetails.then(function (result) {
                }, function (err) {
                    let errorResponse = new customError.ApplicationError("Unauthorized Access", 401);
                    helperUtil.GenerateJSONAndXMLResponse(req, res, errorResponse, errorResponse.Status);
                });   
            }
            else{
                let errorResponse = new customError.ApplicationError("Unauthorized Access", 401);
                helperUtil.GenerateJSONAndXMLResponse(req, res, errorResponse, errorResponse.Status);
            }         
        }
    } catch (error) {
        let errorResponse = new customError.ApplicationError(error);
        helperUtil.GenerateJSONAndXMLResponse(req, res, errorResponse, errorResponse.Status);
    }
}


/*
<summary> Helps to check session Information </summary>
<param name="req"> Request object </param>
<param name="res"> Response object </param>
<param name="next"> next middleware function </param>
<returns> Session Information get from EC </returns>
*/
function checkSessionInformation(req, res, next) {
    try {
        if (req.headers) {
            if(req.headers.sessionid && req.headers.sessionid!="")
            {
                axios.get(process.env.EC_Base_URL+':'+ process.env.EC_Port+process.env.EC_Session_Path, {
                    headers: {
                        'accesstoken': req.headers.sessionid
                    }
                }).then((async (response) => {                   
                    if (response.data.data) {
                        let username = response.data.data.userName;
                        req.username= username;                           
                        next();                 
                    } 
                })).catch((error) => {
                    if(error.response.data.message){
                        let errorResponse = new customError.ApplicationError(error.response.data.message,422);
                        helperUtil.GenerateJSONAndXMLResponse(req, res, errorResponse, errorResponse.Status);
                    }
                    else{
                        let errorResponse = new customError.ApplicationError("Invalid Session",422);
                    helperUtil.GenerateJSONAndXMLResponse(req, res, errorResponse, errorResponse.Status);
                    }                    
                });                
            }
            else{
                let errorResponse = new customError.ApplicationError("Session Id Required.");
                helperUtil.GenerateJSONAndXMLResponse(req, res, errorResponse, errorResponse.Status);
            }           
        } else {
            let errorResponse = new customError.ApplicationError("Session Id Required.");
            helperUtil.GenerateJSONAndXMLResponse(req, res, errorResponse, errorResponse.Status);
        }
    } catch (error) {
        let errorResponse = new customError.ApplicationError(error);
        helperUtil.GenerateJSONAndXMLResponse(req, res, errorResponse, errorResponse.Status);
    }
}

/*
<summary> Helps to validate the Host request</summary>
<param name="req"> Request object </param>
<param name="res"> Response object </param>
<param name="next"> next middleware function </param>
<returns> Validate Host Request againt the   </returns>
*/
async function checkHostRequest(req, res, next) {
    try {
         //if(process.env.Max_Retires!=null && process.env.Max_Retires.trim()!=""){
        if(process.env.Max_Retires!=0 ){
          if(process.env.Max_Retires>req.rateLimit.current){      
            next();
          }
          else{
            const clientIp = requestIp.getClientIp(req);
            let fullIPAddress=clientIp.split(':');
            let ipAddress= (fullIPAddress[fullIPAddress.length-1]==='1')?'127.0.0.0':fullIPAddress[fullIPAddress.length-1];
            // let isExists= blacklistIP.filter(ip => ip===ipAddress);
            // if(isExists.length===0){
            //    console.log("Not Exists");        
               let insertedIPDetails= await settingsDbAccess.InsertLockoutInfo(ipAddress);         
            // }             
            next();
          }
        }
        else{
          next();
        }
    } catch (error) {
        let errorResponse = new customError.ApplicationError(error);
        helperUtil.GenerateJSONAndXMLResponse(req, res, errorResponse, errorResponse.Status);
    }
}


module.exports = {
    ConvertJsonBodyKeysToLower: convertBodyKeysToLower,
    ValidateApplicationSecret: validateApplicationSecret,
    ValidateAdminApplicationSecret: validateAdminApplicationSecret,
    ValidateUserAccessToken: validateUserAccessToken,
    CheckSessionInformation: checkSessionInformation,
    CheckHostRequest:checkHostRequest
};