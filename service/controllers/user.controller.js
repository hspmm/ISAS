/* Declare required npm packages */
var parseString = require('xml2js').parseString;


/* Declare Common functions */
var helperUtil = require('../utils/helper.utils');
var ldapUtil = require('../utils/ldap.utils');
var tokenUtil = require('../utils/token.helper.utils');
var imprivataUtil = require('../utils/imprivata.utils');

/* Declare Validators */
var userAuthenticationDetails = require('../validators/user.validator');

/* Declare Model class */
var userModel = require('../models/user.model');
var ldapModel= require('../models/ldap.model');


/* Custom Error */
var customError = require('../errors/custom.error');

/* Database Access */
var userDbAccess = require('../dataaccess/user.dbaccess');
var ldapDbAccess = require('../dataaccess/ldap.dbaccess');
var commonDbAccess=require('../dataaccess/common.dbaccess');
var tokenDbAccess=require('../dataaccess/token.dbaccess');

var fs=require('fs');
const dotenv = require('dotenv').config();

/* Logging */
var logger=require('../utils/logger.utils');

/*
<summary> Helps to Authenticate User </summary>
<param name="req"> Request object </param>
<param name="res"> Response object </param>
<returns> Return User Access token  </returns>
*/
async function userAuthentication(req, res) {
    try {
        logger.info({label:"User Authentication",message:"STARTED"});
        var bodyContent = JSON.stringify(req.body);
        if (req.body) {
            const result = userAuthenticationDetails.UserAuthentication.validate(req.body);
            if (result != "") {
                let errorMessage = new customError.ApplicationError(result.toString(), 422);
                logger.error({label:"User Authentication",message:errorMessage.Error.Message});
                let authenticationResponse = new userModel.AuthenticationResponse(errorMessage, null);
                helperUtil.GenerateJSONAndXMLResponse(req, res, authenticationResponse, errorMessage.Status);
            } else {
                bodyContent = JSON.parse(bodyContent);
                let requestValidation;
                let authenticationDetails = {
                    "AuthenticationType": req.body.authenticationrequest.authenticationtype,
                    "AuthenticationMethod": req.body.authenticationrequest.authenticationmethod.toLowerCase().trim()
                };
                let selectedSecurityModel = process.env.Selected_SecurityModel;
                if(process.env.encryptionkey!=""){
                    if (req.body.authenticationrequest.authenticationtype == "LDAP" && selectedSecurityModel==="LDAP" ) {
                        requestValidation = userAuthenticationDetails.LdapRequiredDetails.validate(bodyContent.authenticationrequest.authenticationparameters);
                        if (requestValidation != "") {
                            let errorMessage = new customError.ApplicationError(requestValidation.toString(), 422);
                            logger.error({label:"User Authentication",message:errorMessage.Error.Message});
                            let authenticationResponse = new userModel.AuthenticationResponse(errorMessage, null);
                            helperUtil.GenerateJSONAndXMLResponse(req, res, authenticationResponse, errorMessage.Status);
                        } else {
                            let username = bodyContent.authenticationrequest.authenticationparameters.username;
                            let password = bodyContent.authenticationrequest.authenticationparameters.password;
                            //let domainname = bodyContent.authenticationrequest.authenticationparameters.domainname;
                            let userDetails = {
                                "UserId":0,
                                "Username": username,
                                "Password": password,
                                "DomainName": ""
                            };
                            var authenticationToken = await ldapAuthentication(userDetails, authenticationDetails, req.tokenValidity, req.applicationId);
                            if (authenticationToken.length > 0 && authenticationToken.length == 4) {
                                let authenticationDetails = {
                                    "AccessToken": authenticationToken[0],
                                    "RefreshToken": authenticationToken[1],
                                    "AccessToken_ExpiryTime": authenticationToken[2],
                                    "RefreshToken_ExpiryTime":authenticationToken[3]
                                };
                                let authenticationResponse = new userModel.AuthenticationResponse(null, authenticationDetails);
                                logger.info({label:"User Authentication",message:"SUCCESS"});
                                helperUtil.GenerateJSONAndXMLResponse(req, res, authenticationResponse, 200);
                            }
                        }
                    } 
                    else if (req.body.authenticationrequest.authenticationtype == "Imprivata" && selectedSecurityModel==="Imprivata" ) {
                        if (req.body.authenticationrequest.authenticationmethod.toLowerCase().trim() === "password") {
                            requestValidation = userAuthenticationDetails.ImprivataPasswordRequiredDetails.validate(bodyContent.authenticationrequest.authenticationparameters);
                            if (requestValidation != "") {
                                let errorMessage = new customError.ApplicationError(requestValidation.toString(), 422);
                                logger.error({label:"User Authentication",message:errorMessage.Error.Message});
                                let authenticationResponse = new userModel.AuthenticationResponse(errorMessage, null);
                                helperUtil.GenerateJSONAndXMLResponse(req, res, authenticationResponse, errorMessage.Status);
                            } else {
                                let username = bodyContent.authenticationrequest.authenticationparameters.username;
                                let password = bodyContent.authenticationrequest.authenticationparameters.password;
                                //let domainname = bodyContent.authenticationrequest.authenticationparameters.domainname;
                                let userDetails = {
                                    "UserId":0,
                                    "Username": username,
                                    "Password": password,
                                   // "DomainName": domainname
                                };
                                var authenticationToken = await imprivataPasswordAuthentication(userDetails, authenticationDetails, req.tokenValidity, req.applicationId);
                                if (authenticationToken.length > 0 && authenticationToken.length == 4) {
                                    let authenticationDetails = {
                                        "AccessToken": authenticationToken[0],
                                        "RefreshToken": authenticationToken[1],
                                        "AccessToken_ExpiryTime": authenticationToken[2],
                                        "RefreshToken_ExpiryTime":authenticationToken[3]
                                    };
                                    let authenticationResponse = new userModel.AuthenticationResponse(null, authenticationDetails);
                                    logger.info({label:"User Authentication",message:"SUCCESS"});
                                    helperUtil.GenerateJSONAndXMLResponse(req, res, authenticationResponse, 200);
                                }
                            }
                        } else if (req.body.authenticationrequest.authenticationmethod.toLowerCase().trim() === "proximity card") {
                            requestValidation = userAuthenticationDetails.ImprivataCardRequiredDetails.validate(bodyContent.authenticationrequest.authenticationparameters);
                            if (requestValidation != "") {
                                let errorMessage = new customError.ApplicationError(requestValidation.toString(), 422);
                                logger.error({label:"User Authentication",message:errorMessage.Error.Message});
                                let authenticationResponse = new userModel.AuthenticationResponse(errorMessage, null);
                                helperUtil.GenerateJSONAndXMLResponse(req, res, authenticationResponse, errorMessage.Status);
                            } else {
                                let uniqueId = bodyContent.authenticationrequest.authenticationparameters.uniqueid;
                                let cardDetails = {
                                    "UniqueId": uniqueId
                                };
                                var authenticationToken = await imprivataCardAuthentication(cardDetails, authenticationDetails, req.tokenValidity,req.applicationId);
                                if (authenticationToken.length > 0 && authenticationToken.length == 4) {
                                    let authenticationDetails = {
                                        "AccessToken": authenticationToken[0],
                                        "RefreshToken": authenticationToken[1],
                                        "AccessToken_ExpiryTime":  authenticationToken[2],
                                        "RefreshToken_ExpiryTime": authenticationToken[3]
                                    };
                                    let authenticationResponse = new userModel.AuthenticationResponse(null, authenticationDetails);
                                    logger.info({label:"User Authentication",message:"SUCCESS"});
                                    helperUtil.GenerateJSONAndXMLResponse(req, res, authenticationResponse, 200);
                                }
                            }
                        }
                    }
                    else if (req.body.authenticationrequest.authenticationtype == "ISAS" && selectedSecurityModel==="ISAS") {
                        requestValidation = userAuthenticationDetails.IsasRequiredDetails.validate(bodyContent.authenticationrequest.authenticationparameters);
                        if (requestValidation != "") {
                            let errorMessage = new customError.ApplicationError(requestValidation.toString(), 422);
                            logger.error({label:"User Authentication",message:errorMessage.Error.Message});
                            let authenticationResponse = new userModel.AuthenticationResponse(errorMessage, null);
                            helperUtil.GenerateJSONAndXMLResponse(req, res, authenticationResponse, errorMessage.Status);
                        } else {
                            let username = bodyContent.authenticationrequest.authenticationparameters.username;
                            let password = bodyContent.authenticationrequest.authenticationparameters.password;
                            let userDetails = {
                                "UserId":0,
                                "Username": username,
                                "Password": password,
                                "DomainName": ""
                            };
                            let authenticationResponse= await isasAuthentication(userDetails, authenticationDetails, req.tokenValidity, req.applicationId);
                            let requestedUser= authenticationResponse.UserId; 
                            let authenticationToken = authenticationResponse.JWTToken;
                            if (authenticationToken.length > 0 && authenticationToken.length == 4) {
                                let authenticationDetails = {
                                    "AccessToken": authenticationToken[0],
                                    "RefreshToken": authenticationToken[1],
                                    "AccessToken_ExpiryTime": authenticationToken[2],
                                    "RefreshToken_ExpiryTime":authenticationToken[3]
                                };
                                let requestInfo={
                                    ApplicationVersionId:req.applicationId,
                                    EndPoint:req.baseUrl,
                                    EndpointType:"POST"
                                };
                                let responseInfo={
                                    ResponseCode:200,
                                    ResponseMessage:"Successfully Authenticated!!"
                                };
                                let transactionDetails = await userDbAccess.SaveUserTransaction(requestedUser,requestInfo,responseInfo);
                                let authenticationResponse = new userModel.AuthenticationResponse(null, authenticationDetails);
                                logger.info({label:"User Authentication",message:"SUCCESS"});
                                helperUtil.GenerateJSONAndXMLResponse(req, res, authenticationResponse, 200);
                            }
                        }
                    }
                    else{
                        let errorMessage = new customError.ApplicationError("Not able to Authenticate. Check Security Model!!", 422);
                        logger.error({label:"User Authentication",message:errorMessage.Error.Message});
                        let authenticationResponse = new userModel.AuthenticationResponse(errorMessage, null);
                        helperUtil.GenerateJSONAndXMLResponse(req, res, authenticationResponse, errorMessage.Status);
                    }
                }
                else{
                    if(req.isAdminApplication){
                        let errorMessage = new customError.ApplicationError("Key is Missing. Not able to Authenticate!!", 503 );
                        logger.error({label:"User Authentication",message:errorMessage.Error.Message});
                        let authenticationResponse = new userModel.AuthenticationResponse(errorMessage, null);
                        helperUtil.GenerateJSONAndXMLResponse(req, res, authenticationResponse, errorMessage.Status);
                    }
                    else{
                        let errorMessage = new customError.ApplicationError("Internal Server Error", 500 );
                        logger.error({label:"User Authentication",message:errorMessage.Error.Message});
                        let authenticationResponse = new userModel.AuthenticationResponse(errorMessage, null);
                        helperUtil.GenerateJSONAndXMLResponse(req, res, authenticationResponse, errorMessage.Status);
                    }
                }                 
            }
        } else {
            let errorMessage = new customError.ApplicationError("Request Body is Empty!!", 422);
            logger.error({label:"User Authentication",message:errorMessage.Error.Message});
            let authenticationResponse = new userModel.AuthenticationResponse(errorMessage, null);
            helperUtil.GenerateJSONAndXMLResponse(req, res, authenticationResponse, errorMessage.Status);
        }
    } catch (error) {
        let errorMessage = new customError.ApplicationError(error);
        logger.error({label:"User Authentication",message:errorMessage.Error.Message});
        let authenticationResponse = new userModel.AuthenticationResponse(errorMessage, null);
        helperUtil.GenerateJSONAndXMLResponse(req, res, authenticationResponse, errorMessage.Status);
    }
}

/*
<summary> Helps to Authenticate User with LDAP </summary>
<param name="req"> Request object </param>
<param name="res"> Response object </param>
<returns> Return User Access token  </returns>
*/
async function ldapAuthentication(userDetails, authenticationDetails, tokenValidity, applicationId) {
    try {
        logger.info({label:"LDAP Authentication",message:"STARTED"});
        let groupList = [];
        let response = [];
        let mappedGroupId = [];
        let index=userDetails.Username.indexOf('@');    
        let domainName=userDetails.Username.slice(index+1,userDetails.Username.length);
        userDetails.DomainName=domainName;
        let ldapDetails = await ldapDbAccess.GetLdapDetailsByDomainName(domainName);
        if (ldapDetails) {
            // SSL Selected               
            let isSslSelected= ldapDetails.IsSslSelected;  

            let protocol = (isSslSelected===true)?"ldaps://":"ldap://";

            let ldapConfig = {
                url: protocol + ldapDetails.ServerHostName + ":" + ldapDetails.ServerPort,
                //url: "ldaps://" + ldapDetails.ServerHostName + ":636",
                baseDN: ldapDetails.BindDn,
                username: ldapDetails.AdminUserName,
                password: helperUtil.DecryptData(ldapDetails.AdminPassword),
                //tlsOptions:{
                   // ca: fs.readFileSync('C:/Users/60028442/Desktop/cert/test2.cer'),
                    //requestCert: true, 
                    //rejectUnauthorized: true
                //}              
            };
            //process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
            response = await ldapUtil.ValidateLDAPUserCredentials(userDetails, ldapConfig);
            if (response.length > 0) {
                response = JSON.parse(response);
                response.forEach(element => {
                    groupList.push(element.cn);
                });
            }
           
            if (groupList.length > 0) {
                mappedGroupId = await ldapDbAccess.GetLdapGroupIdByName(ldapDetails.LdapConfigId, groupList.map((group) => {return "'"+ group + "'"}).join(','));
            }
            let jwtToken = await tokenUtil.GenerateAccessAndRefreshToken(userDetails, mappedGroupId, authenticationDetails, tokenValidity, applicationId);
                   

            return jwtToken;
        } else {
            logger.error({label:"LDAP Authentication",message:"Invalid Domain"});
            throw new customError.ApplicationError("Invalid Domain!!",200);
        }

    } catch (error) {
        logger.error({label:"LDAP Authentication",message:error});
        throw new customError.ApplicationError(error);
    }
}

/*
<summary> Helps to Authenticate User with Imprivata password based </summary>
<param name="req"> Request object </param>
<param name="res"> Response object </param>
<returns> Return User Access token  </returns>
*/
async function imprivataPasswordAuthentication(userDetails, authenticationDetails, tokenValidity, applicationId) {
    try {
        logger.info({label:"Imprivata Authentication",message:"STARTED"});
        let groupList = [];

        let index=userDetails.Username.indexOf('@');    
        let domainName=userDetails.Username.slice(index+1,userDetails.Username.length); 

        let imprivataDetails= await getMatchedImprivataConfig(domainName);
        if(imprivataDetails.length>0){
            let response = await imprivataUtil.ValidatePasswordUserCredentials(userDetails,imprivataDetails[0]);
            let responseDisp = '';
            let responseDisplayName = '';
            let responseUsername = '';
            let responseDomain = '';
            let responseError = '';
    
            if (response.length > 0) {
                parseString(response, function (error, result) {
                    if (error === null) {
                        responseDisp = result['Response']['AuthState'][0]['$'].disp;
                        if (responseDisp === '0') {
                            responseDisplayName = result['Response']['Principal'][0]['$'].displayName;
                            responseUsername = result['Response']['Principal'][0].UserIdentity[0].Username[0];
                            responseDomain = result['Response']['Principal'][0].UserIdentity[0].Domain[0]._;
                        } else {
                            responseError = result['Response']['AuthState'][0]['$'].errorText;
                        }
                    } else {
                        logger.error({label:"Imprivata Authentication",message:error});
                        throw new customError.ApplicationError(error);
                    }
                });
                if (responseDisp === '0' && responseError === '') {
                    userDetails = {
                        "Username": userDetails.Username,
                        "Password": userDetails.Password,
                        "DomainName": ""
                    };
                    var authenticationToken = await ldapAuthentication(userDetails, authenticationDetails, tokenValidity, applicationId);
                    logger.info({label:"Imprivata Authentication",message:"SUCCESS"});
                    return authenticationToken;
                } else {
                    logger.error({label:"Imprivata Authentication",message:responseError});
                    throw new customError.ApplicationError(responseError);
                }
            }
        }
        else{
            logger.error({label:"Imprivata Authentication",message:"Invalid Domain"});
            throw new customError.ApplicationError("Invalid Domain!!",200);
        }        
    } catch (error) {
        logger.error({label:"Imprivata Authentication",message:error});
        throw new customError.ApplicationError(error);
    }
}

/*
<summary> Helps to Authenticate User with Imprivata Card based </summary>
<param name="req"> Request object </param>
<param name="res"> Response object </param>
<returns> Return User Access token  </returns>
*/
async function imprivataCardAuthentication(cardDetails, authenticationDetails, tokenValidity, applicationId) {
    try {
        logger.info({label:"Imprivata Authentication",message:"STARTED"});
        let imprivataConfig = await commonDbAccess.GetAllImprivataDetails();
        let responseDisp = '';
        let responseDisplayName = '';
        let responseUsername = '';
        let responsePassword = '';
        let responseDomain = '';
        let responseError = '';
        let authTicket = '';
        let authenticationToken="";
        for(let i=0;i<imprivataConfig.length;i++){
            let response = await imprivataUtil.ValidateCardUserCredentials(cardDetails,imprivataConfig[i]);          
    
            if (response.length > 0) {            
                parseString(response, function (error, result) {
                    if (error === null) {
                        responseDisp = result['Response']['AuthState'][0]['$'].disp;
                        if (responseDisp === '0') {
                            responseDisplayName = result['Response']['Principal'][0]['$'].displayName;
                            responseUsername = result['Response']['Principal'][0].UserIdentity[0].Username[0];
                            responseDomain = result['Response']['Principal'][0].UserIdentity[0].Domain[0]._;
                            authTicket = result['Response']['Principal'];
                            responsePassword=result['Response']['ResourceResponse'][0].Response[0].UserIdentityPassword[0]._;
                        } else {
                            responseError = result['Response']['AuthState'][0]['$'].errorText;
                        }
                    } else {
                        logger.error({label:"Imprivata Authentication",message:error});
                        throw new customError.ApplicationError(error);
                    }
                });
    
                if (responseDisp === '0' && responseError === '') {
                    userDetails = {
                        "UserId":0,
                        "Username": responseUsername+"@"+responseDomain,
                        "Password": responsePassword,
                        "DomainName": ""
                    };
                    authenticationToken = await ldapAuthentication(userDetails, authenticationDetails, tokenValidity, applicationId);
                    break;
                   // return authenticationToken;
                } 
                // else {
                //     logger.error({label:"Imprivata Authentication",message:responseError});
                //     throw new customError.ApplicationError(responseError, 200);
                // }
            }
        }
        if(authenticationToken!=""){
                return authenticationToken;
        }   
        else{
            logger.error({label:"Imprivata Authentication",message:responseError});
            throw new customError.ApplicationError(responseError, 200);
        }    
    } catch (error) {
        logger.error({label:"Imprivata Authentication",message:error});
        throw new customError.ApplicationError(error);
    }
}

/*
<summary> Helps to Update User </summary>
<param name="req"> Request object </param>
<param name="res"> Response object </param>
<returns> Return User Registration Response  </returns>
*/
async function updateUser(req, res) {
    try {
        if (req.body) {
            logger.info({label:"Update User",message:"STARTED"});
            let bodyContent = JSON.stringify(req.body);
            var result = userAuthenticationDetails.UserAndRoleArrayUpdation.validate(req.body);
            result = (result != "") ? userAuthenticationDetails.UserAndRoleUpdation.validate(JSON.parse(bodyContent)) : result;
            if (result != "") {
                let errorMessage = new customError.ApplicationError(result.toString(), 422);
                logger.error({label:"Update User",message:errorMessage.Error.Message});
                let userUpdateResponse = new userModel.UserUpdateResponse(errorMessage,null);
                helperUtil.GenerateJSONAndXMLResponse(req, res, userUpdateResponse, errorMessage.Status);
            } else {
                let userDetails = JSON.parse(bodyContent);
                let isNewUser = false;

                // var hash = helperUtil.CreateEncryptedPassword(req.body.userregistration.Password);
                // encryptedPassword = hash;
                let existingUserDetails = await userDbAccess.CheckUsernameAndEmailDetails(userDetails.userupdate.userdetails);
                if (existingUserDetails.User.length > 0) {
                    let errorMessage = new customError.ApplicationError("User ID already exists!!", 422);
                    logger.error({label:"Update User",message:errorMessage.Error.Message});
                    let userUpdateResponse = new userModel.UserUpdateResponse(errorMessage,null);
                    helperUtil.GenerateJSONAndXMLResponse(req, res, userUpdateResponse, errorMessage.Status);
                } else {
                    let isNewUser = true;
                    let updatedUserDetails = await userDbAccess.UpdateUserDetails(userDetails.userupdate.userdetails,req.username);
                    let userMappedRoles = [];
                    if (userDetails.userupdate.roledetails) {
                        if (Array.isArray(userDetails.userupdate.roledetails.role)) {
                            userMappedRoles = userDetails.userupdate.roledetails.role;
                        } else {
                            userMappedRoles.push(userDetails.userupdate.roledetails.role);
                        }
                    }
                    //userMappedRoles.push(userDetails.userupdate.roledetails);
                    let updatedRoleDetails = await userDbAccess.InsertUserRolesDetails(userMappedRoles, updatedUserDetails.User[0].UserId, req.username);
                    if (updatedUserDetails.User.length > 0) {
                        logger.info({label:"Update User",message:"SUCCESS"});
                        let userUpdateResponse = new userModel.UserUpdateResponse(null,updatedUserDetails.User[0]);
                        helperUtil.GenerateJSONAndXMLResponse(req, res, userUpdateResponse, 200);
                    } else {
                        let errorMessage = new customError.ApplicationError("User Not Updated Successfully. Please Try again Later.");
                        logger.error({label:"Update User",message:errorMessage.Error.Message});
                        let userUpdateResponse = new userModel.UserUpdateResponse(errorMessage,null);
                        helperUtil.GenerateJSONAndXMLResponse(req, res, userUpdateResponse, errorMessage.Status);
                    }
                }
            }
        } else {
            let errorMessage = new customError.ApplicationError("Request Body is Empty!!",400);
            logger.error({label:"Update User",message:errorMessage.Error.Message});
            let userUpdateResponse = new userModel.UserUpdateResponse(errorMessage,null);
            helperUtil.GenerateJSONAndXMLResponse(req, res, userUpdateResponse, errorMessage.Status);
        }
    } catch (error) {
        let errorMessage = new customError.ApplicationError(error);
        logger.error({label:"Update User",message:errorMessage.Error.Message});
        let userUpdateResponse = new userModel.UserUpdateResponse(errorMessage,null);
        helperUtil.GenerateJSONAndXMLResponse(req, res, userUpdateResponse, errorMessage.Status);
    }
}

/*
<summary> Helps to Register User </summary>
<param name="req"> Request object </param>
<param name="res"> Response object </param>
<returns> Return User Registration Response  </returns>
*/
async function registerUser(req, res) {
    try {
        if (req.body) {
            logger.info({label:"Register User",message:"STARTED"});
            let bodyContent = JSON.stringify(req.body);
            var result = userAuthenticationDetails.UserAndRoleArrayRegistration.validate(req.body);
            result = (result != "") ? userAuthenticationDetails.UserAndRoleRegistration.validate(JSON.parse(bodyContent)) : result;
            if (result != "") {
                let errorMessage = new customError.ApplicationError(result.toString(), 422);
                logger.error({label:"Register User",message:errorMessage.Error.Message});
                let userRegistrationResponse = new userModel.UserRegistrationResponse(errorMessage,null);
                helperUtil.GenerateJSONAndXMLResponse(req, res, userRegistrationResponse, errorMessage.Status);
            } else {
                let userDetails = JSON.parse(bodyContent);
                let isNewUser = true;
                //console.log("User-",userDetails.userregistration.userdetails);
                let existingUserDetails = await userDbAccess.CheckUserDetails(userDetails.userregistration.userdetails);
                if (existingUserDetails.User.length > 0) {
                    isNewUser = false;
                    let errorMessage = new customError.ApplicationError("User ID already exists!!", 422);
                    logger.error({label:"Register User",message:errorMessage.Error.Message});
                    let userRegistrationResponse= new userModel.UserRegistrationResponse(errorMessage,null);
                    helperUtil.GenerateJSONAndXMLResponse(req, res, userRegistrationResponse, errorMessage.Status);
                } else {
                    // var hash = helperUtil.CreateEncryptedPassword(req.body.userregistration.Password);
                    // encryptedPassword = hash;
                    let passwordData= helperUtil.SaltHashPassword(userDetails.userregistration.userdetails.password);
                    let insertedUserDetails = await userDbAccess.InsertUserDetails(userDetails.userregistration.userdetails, req.username, passwordData);
                    let userMappedRoles = [];
                    if (userDetails.userregistration.roledetails) {
                        if (Array.isArray(userDetails.userregistration.roledetails.role)) {
                            userMappedRoles = userDetails.userregistration.roledetails.role;
                        } else {
                            userMappedRoles.push(userDetails.userregistration.roledetails.role);
                        }
                    }

                   // userMappedRoles.push(userDetails.userregistration.roledetails);
                    let insertedRoleDetails = await userDbAccess.InsertUserRolesDetails(userMappedRoles, insertedUserDetails.User[0].UserId, req.username);
                    if (insertedUserDetails.User.length > 0) {
                        let userRegistrationResponse = new userModel.UserRegistrationResponse(null,insertedUserDetails.User[0], isNewUser);
                        logger.info({label:"Register User",message:"SUCCESS"});
                        helperUtil.GenerateJSONAndXMLResponse(req, res, userRegistrationResponse, 200);
                    } else {
                        let errorMessage = new customError.ApplicationError("User Not Saved Successfully. Please Try again Later.");
                        logger.error({label:"Register User",message:errorMessage.Error.Message});
                        let userRegistrationResponse = new userModel.UserRegistrationResponse(errorMessage,null);
                        helperUtil.GenerateJSONAndXMLResponse(req, res, userRegistrationResponse, errorMessage.Status);
                    }
                }
            }
        } else {
            let errorMessage = new customError.ApplicationError("Request Body is Empty!!",400);
            logger.error({label:"Register User",message:errorMessage.Error.Message});
            let userRegistrationResponse = new userModel.UserRegistrationResponse(errorMessage,null);
            helperUtil.GenerateJSONAndXMLResponse(req, res, userRegistrationResponse, errorMessage.Status);
        }
    } catch (error) {
        let errorMessage = new customError.ApplicationError(error);
        logger.error({label:"Register User",message:errorMessage.Error.Message});
        let userRegistrationResponse = new userModel.UserRegistrationResponse(errorMessage,null);
        helperUtil.GenerateJSONAndXMLResponse(req, res, userRegistrationResponse, errorMessage.Status);
    }
}


/*
<summary> Helps to Delete USer Information </summary>
<param name="req"> Request object </param>
<param name="res"> Response object </param>
<returns> Return USer Deleted Response  </returns>
*/
async function deleteUserInfo(req, res) {
    try {
        if (req.body) {
            logger.info({label:"Delete User",message:"STARTED"});
            let bodyContent = JSON.stringify(req.body);
            var result = userAuthenticationDetails.UserInfoDeletion.validate(req.body);
            if (result != "") {
                let errorMessage = new customError.ApplicationError(result.toString(), 422);
                logger.error({label:"Delete User",message:errorMessage});
                helperUtil.GenerateJSONAndXMLResponse(req, res, errorMessage, errorMessage.Status);
            } else {
                let userBodyDetails = JSON.parse(bodyContent);

                let userId = userBodyDetails.userdeleterequest.userid;
                if (isNaN(userId)) {
                    let errorMessage = new customError.ApplicationError("User Id must be a Number", 422);
                    let userDeleteResponse = new userModel.UserDeleteResponse(errorMessage,null);
                    logger.error({label:"Delete User",message:errorMessage.Error.Message});
                    helperUtil.GenerateJSONAndXMLResponse(req, res, userDeleteResponse, errorMessage.Status);
                } else {
                let deletedUserDetails = await userDbAccess.DeleteUserDetails(userId,req.username);
                if (deletedUserDetails) {
                    var result = new userModel.UserDeleteResponse(null,deletedUserDetails);
                    logger.info({label:"Delete User",message:"SUCCESS"});
                    helperUtil.GenerateJSONAndXMLResponse(req, res, result, 200);
                } else {
                    let errorMessage = new customError.ApplicationError("User Not Deleted. Please Try again Later.");
                    logger.error({label:"Delete User",message:errorMessage.Error.Message});
                    let userDeleteResponse = new userModel.UserDeleteResponse(errorMessage,null);
                    helperUtil.GenerateJSONAndXMLResponse(req, res, userDeleteResponse, errorMessage.Status);
                }
            }
        }
        } else {
            let errorMessage = new customError.ApplicationError("Request Body is Empty!!",400);
            logger.error({label:"Delete User",message:errorMessage.Error.Message});
            let userDeleteResponse = new userModel.UserDeleteResponse(errorMessage,null);
            helperUtil.GenerateJSONAndXMLResponse(req, res, userDeleteResponse, errorMessage.Status);
        }
    } catch (error) {
        let errorMessage = new customError.ApplicationError(error);
        logger.error({label:"Delete User",message:errorMessage.Error.Message});
        let userDeleteResponse = new userModel.UserDeleteResponse(errorMessage,null);
        helperUtil.GenerateJSONAndXMLResponse(req, res, userDeleteResponse, errorMessage.Status);
    }
}

/*
<summary> Helps to Find LDAP User Information </summary>
<param name="req"> Request object </param>
<param name="res"> Response object </param>
<returns> Return LDAP User Information  </returns>
*/
async function findLdapUserInfo(req, res) {    
    try {
        if (req.body) {
            let bodyContent = JSON.stringify(req.body);
            var result = userAuthenticationDetails.LdapUserInfoRequest.validate(req.body);
            if (result != "") {
                let errorMessage = new customError.ApplicationError(result.toString(), 422);
                helperUtil.GenerateJSONAndXMLResponse(req, res, errorMessage, errorMessage.Status);
            } else {            
                let userBodyDetails = JSON.parse(bodyContent);
                let username = userBodyDetails.ldapuserinforequest.username;
                
                let ldapAllDetails = await commonDbAccess.GetAllLdapDetails();
                ldapUserDetails=[];
                if (ldapAllDetails.length > 0) {  
                    for(const element of ldapAllDetails){
                        // SSL Selected               
                        let isSslSelected= element.IsSslSelected;  

                        let protocol = (isSslSelected===true)?"ldaps://":"ldap://";
                        let ldapDetails = {
                            url: protocol + element.ServerHostName + ":" + element.ServerPort,
                            baseDN: element.BindDn,
                            username: element.AdminUserName,
                            password: helperUtil.DecryptData(element.AdminPassword)
                        };
                        let ldapUsers =await ldapUtil.GetLDAPUsers(ldapDetails, element.LdapConfigId,username).then(async (result) => {
                            if(result.length>0){
                                //ldapUsers.forEach(async user=>{
                                for(const user of result){
                                        let ldapGroups=[];
                                        user.groups.forEach(element => {
                                            ldapGroups.push(element.cn);
                                        });
                                    let mappedRoles=[];
                                        if(user.groups.length>0){
                                            mappedRoles=await userDbAccess.GetRolesByLdapGroups(ldapGroups.join("','"),element.LdapConfigId);
                                           
                                        }
                                    let ldapUserInfo = {
                                       // username: user.displayName,
                                        username: (user.sAMAccountName)?user.sAMAccountName:"",
                                        domain: element.Domain,
                                        //ldapgroups: user.groups,
                                        assignedroles:mappedRoles,
                                        principalname: (user.userPrincipalName)?user.userPrincipalName:""
                                    };
                                   
                                    ldapUserDetails.push(ldapUserInfo);
                                }
                               // });                        
                            }  
                        }).catch((err) =>{
                        });
                        // if(ldapUsers.length>0){
                        //     //ldapUsers.forEach(async user=>{
                        //         for(const user of ldapUsers){
                        //            
                        //             let ldapGroups=[];
                        //             user.groups.forEach(element => {
                        //                 ldapGroups.push(element.cn);
                        //             });
                        //         let mappedRoles=[];
                        //             if(user.groups.length>0){
                        //                 mappedRoles=await userDbAccess.GetRolesByLdapGroups(ldapGroups.join(','),element.LdapConfigId);
                        //                 
                        //             }
                        //         let ldapUserInfo = {
                        //            // username: user.displayName,
                        //             username: user.sAMAccountName,
                        //             domain: element.Domain,
                        //             //ldapgroups: user.groups,
                        //             assignedroles:mappedRoles,
                        //             principalname: user.userPrincipalName
                        //         };
                        //         ldapUserDetails.push(ldapUserInfo);
                        //     }
                        //    
                        //    // });                        
                        // }  
                    } 
                    let ldapUsersResponse = new ldapModel.LdapUsersDetailsResponse(ldapUserDetails);
                    helperUtil.GenerateJSONAndXMLResponse(req, res, ldapUsersResponse, 200);
                } else {
                    let ldapUsersResponse = new ldapModel.LdapUsersDetailsResponse(ldapUserDetails);
                    helperUtil.GenerateJSONAndXMLResponse(req, res, ldapUsersResponse, 200);
                }
            }
        } else {
            ldapUsersResponse = new customError.ApplicationError("Request Body is Empty!!");
            helperUtil.GenerateJSONAndXMLResponse(req, res, ldapUsersResponse, ldapUsersResponse.Status);
        }
    } catch (error) {
        ldapUsersResponse = new customError.ApplicationError(error);
        helperUtil.GenerateJSONAndXMLResponse(req, res, ldapUsersResponse, ldapUsersResponse.Status);
    }
}


/*
<summary> Helps to Authenticate User with ISAS </summary>
<param name="req"> Request object </param>
<param name="res"> Response object </param>
<returns> Return User Access token  </returns>
*/
async function isasAuthentication(userDetails, authenticationDetails, tokenValidity,applicationId) {
    try {
        logger.info({label:"ISAS Authentication",message:"STARTED"});
        let mappedUserId = 0;
        let mappedGroupId=[];
        let passwordSalt = await userDbAccess.GetUserPasswordSalt(userDetails.Username);
        if(passwordSalt.length>0 && passwordSalt[0].AccountLocked===false){
            let passwordData= helperUtil.GetPasswordHash(userDetails.Password,helperUtil.DecryptData(passwordSalt[0].PasswordSalt));
            let encryptedPassword = helperUtil.GetPasswordEncryptData(passwordSalt[0].Password,passwordData.passwordHash);
            userDetails= {
                Username: userDetails.Username,
                Password: encryptedPassword
            };
            let userInfo = await userDbAccess.CheckUsernameAndPasswordDetails(userDetails);
            if (userInfo.User && userInfo.User.length>0) {          
                mappedUserId=userInfo.User[0].UserId;
                userDetails.UserId= mappedUserId;    
                //console.log("IsNotificationRegistered",process.env.IsNotificationRegistered);
                if(process.env.IsNotificationRegistered==="false"){
                    let notificationRegistration=await helperUtil.RegisterNotification();
                    //console.log("NM Register");
                    //console.log("NM Register Status",notificationRegistration);
                    //console.log("IsNotificationRegistered",process.env.IsNotificationRegistered);
                    if(notificationRegistration===true){
                        let notification=await helperUtil.SendNotification("User Login Success.Username -"+userDetails.Username);     
                    }
                }   
                else{
                    let notification=await helperUtil.SendNotification("User Login Success.Username -"+userDetails.Username,"");
                }     
                
                let jwtToken = await tokenUtil.GenerateAccessAndRefreshToken(userDetails, mappedGroupId, authenticationDetails, tokenValidity,applicationId);
                logger.info({label:"ISAS Authentication",message:"SUCCESS"});
                return {
                    JWTToken:jwtToken,
                    UserId:mappedUserId
                };
            } else {
                logger.error({label:"ISAS Authentication",message:"Invalid Username or Password!!"});
                throw new customError.ApplicationError("Invalid Username or Password!!",422);
            }
        }
        else if(passwordSalt.length>0 && passwordSalt[0].AccountLocked===true){
            if(process.env.IsNotificationRegistered==="true"){
                let notification=await helperUtil.SendNotification("User Account Locked.Username -"+userDetails.Username,"CRITICAL");
            }            
            logger.error({label:"ISAS Authentication",message:"Account Locked. Contact Administrator."});
            throw new customError.ApplicationError("Account Locked. Contact Administrator.",422);
        }
        else{
            logger.error({label:"ISAS Authentication",message:"Invalid Username or Password!!"});
            throw new customError.ApplicationError("Invalid Username or Password!!",422);
        }        
    } catch (error) {
        logger.error({label:"ISAS Authentication",message:error});
        throw new customError.ApplicationError(error);
    }
}

/* Get Imprivata configuration */
async function getMatchedImprivataConfig(domainName){
  let imprivataConfig= await commonDbAccess.GetAllImprivataDetails();
  let matchedConfiguration=[];
  for(let i=0;i<imprivataConfig.length;i++){
        let response= await imprivataUtil.GetDomainNameFromImprivata(imprivataConfig[i]);
        let domainList= [];
        if (response.length > 0) {
            parseString(response, function (error, result) {
                if (error === null) {
                    responseDomain = result['Response']['Domain'];
                    if (responseDomain.length >0) {
                        for(let i=0;i<responseDomain.length;i++){
                            let adIndex=responseDomain[i].UserDirType.indexOf('AD');
                            if(adIndex>=0){
                                let element= responseDomain[i].Name.find((domain) => domain._.toLowerCase()===domainName.toLowerCase());
                                domainList.push(element);
                            }
                        }
                    }                                     
                } else {
                    logger.error({label:"Imprivata Authentication",message:error});
                    throw new customError.ApplicationError(error);
                }
            });
           
        }
        if(domainList.length>0){
            matchedConfiguration.push(imprivataConfig[i]);
            break;
        }       
  }
  return matchedConfiguration;
}

/*
<summary> Helps to Logout User </summary>
<param name="req"> Request object </param>
<param name="res"> Response object </param>
<returns> Return Status  </returns>
*/
async function userLogout(req, res) {
    try {
        logger.info({label:"User Logout",message:"STARTED"});        
        if (req.body) {
            var bodyContent = JSON.stringify(req.body);
            const result = userAuthenticationDetails.UserLogoutSchema.validate(req.body);
            if (result != "") {
                let errorMessage = new customError.ApplicationError(result.toString(), 422);
                logger.error({label:"User Logout",message:errorMessage.Error.Message});
                let authenticationResponse = new userModel.LogoutResponse(errorMessage, null);
                helperUtil.GenerateJSONAndXMLResponse(req, res, authenticationResponse, errorMessage.Status);
            } else {
                bodyContent = JSON.parse(bodyContent);
                let accessToken=bodyContent.logoutrequest.accesstoken;
                let applicationId=req.applicationId;
                let logoutStatus= await tokenDbAccess.UpdateLogoutDetails(accessToken,applicationId);
                
                if(logoutStatus.LogoutStatus===true){
                    logger.info({label:"User Logout",message:"SUCCESS"});     
                    let logoutResponse = new userModel.LogoutResponse(null, logoutStatus.LogoutStatus);
                    helperUtil.GenerateJSONAndXMLResponse(req, res, logoutResponse, 200);
                }
                else{   
                    let errorMessage = new customError.ApplicationError("Invalid Token", 422);
                    logger.error({label:"User Logout",message:errorMessage.Error.Message});
                    let authenticationResponse = new userModel.LogoutResponse(errorMessage, null);
                    helperUtil.GenerateJSONAndXMLResponse(req, res, authenticationResponse, errorMessage.Status);
                }
            }
        } else {
            let errorMessage = new customError.ApplicationError("Request Body is Empty!!", 422);
            logger.error({label:"User Logout",message:errorMessage.Error.Message});
            let authenticationResponse = new userModel.LogoutResponse(errorMessage, null);
            helperUtil.GenerateJSONAndXMLResponse(req, res, authenticationResponse, errorMessage.Status);
        }
    } catch (error) {
        let errorMessage = new customError.ApplicationError(error);
        logger.error({label:"User Logout",message:errorMessage.Error.Message});
        let authenticationResponse = new userModel.LogoutResponse(errorMessage, null);
        helperUtil.GenerateJSONAndXMLResponse(req, res, authenticationResponse, errorMessage.Status);
    }
}

/*
<summary> Helps to Register Default User </summary>
<param name="req"> Request object </param>
<param name="res"> Response object </param>
<returns> Return Default User Registration Response  </returns>
*/
async function registerDefaultUser(req, res) {
    try {
        if (req.body) {
            logger.info({label:"Register Default User",message:"STARTED"});
            let bodyContent = JSON.stringify(req.body);
            var result = userAuthenticationDetails.DefaultUserRequestSchema.validate(req.body);          
            if (result != "") {
                let errorMessage = new customError.ApplicationError(result.toString(), 422);
                logger.error({label:"Register Default User",message:errorMessage.Error.Message});
                let userRegistrationResponse = new userModel.DefaultUserResponse(errorMessage,null);
                helperUtil.GenerateJSONAndXMLResponse(req, res, userRegistrationResponse, errorMessage.Status);
            } else {
                let nodeContent = JSON.parse(bodyContent);
                 /* Insert User Details
                       Insert Role Details
                       Map User with Role
                       Insert Site Details and Map with Role
                       Default Model is Standalone Model
                       Map All Application Privileges to Role

                    */
                let uid= nodeContent.defaultuserrequest.nodeinfo.uid;
                let nodeId= nodeContent.defaultuserrequest.nodeinfo.nodeid;
                let nodeName= nodeContent.defaultuserrequest.nodeinfo.nodename;
                let nodeType= nodeContent.defaultuserrequest.nodeinfo.nodetype;
                let passwordData= helperUtil.SaltHashPassword("Icumed@1");

                let userDetails={
                    UserBasicDetails:{
                        Username:'Admin',
                        FirstName:helperUtil.EncryptData('Admin'),
                        LastName:helperUtil.EncryptData('User'),
                        Password:helperUtil.EncryptData(passwordData.passwordHash),
                        PasswordSalt:helperUtil.EncryptData(passwordData.salt),
                        EmailAddress: helperUtil.EncryptData('Admin@testicumed.com'),
                        PhoneNumber:helperUtil.EncryptData('0987654321'),
                        IsEmailSelected: false,
                        IsAccountLocked:false,
                        IsDisabled:false,
                        CreatedBy:'Admin'
                    },
                    RoleDetails:{
                        RoleName:"AdminRole",
                        Description:"Default Role to EC"
                    },
                    ApplicationVersionId: req.applicationId,
                    SiteInfo:{
                        Uid:uid,
                        NodeId:nodeId,
                        NodeName:nodeName,
                        NodeType:nodeType
                    }
                };

                let insertedUserDetails = await userDbAccess.InsertDefaultUser(userDetails);
                if(insertedUserDetails.User.NewUser){
                    logger.error({label:"Register Default User",message:"Success"});
                    let userRegistrationResponse = new userModel.DefaultUserResponse(null,insertedUserDetails.User.UserName);
                    helperUtil.GenerateJSONAndXMLResponse(req, res, userRegistrationResponse, 200);
                }
                else{
                    let errorMessage = new customError.ApplicationError("User already available!!",422);
                    logger.error({label:"Register Default User",message:errorMessage.Error.Message});
                    let userRegistrationResponse = new userModel.DefaultUserResponse(errorMessage,null);
                    helperUtil.GenerateJSONAndXMLResponse(req, res, userRegistrationResponse, errorMessage.Status);
                }
            }
        } else {
            let errorMessage = new customError.ApplicationError("Request Body is Empty!!",400);
            logger.error({label:"Register Default User",message:errorMessage.Error.Message});
            let userRegistrationResponse = new userModel.DefaultUserResponse(errorMessage,null);
            helperUtil.GenerateJSONAndXMLResponse(req, res, userRegistrationResponse, errorMessage.Status);
        }
    } catch (error) {
        let errorMessage = new customError.ApplicationError(error);
        logger.error({label:"Register Default User",message:errorMessage.Error.Message});
        let userRegistrationResponse = new userModel.DefaultUserResponse(errorMessage,null);
        helperUtil.GenerateJSONAndXMLResponse(req, res, userRegistrationResponse, errorMessage.Status);
    }
}

/*
<summary> Helps to Reset User Password </summary>
<param name="req"> Request object </param>
<param name="res"> Response object </param>
<returns> Return Status  </returns>
*/
async function resetUserPassword(req, res) {
    try {
        if (req.body) {
            logger.info({label:"Reset User Password",message:"STARTED"});
            let bodyContent = JSON.stringify(req.body);
            var result = userAuthenticationDetails.ResetUserPasswordSchema.validate(req.body);          
            if (result != "") {
                let errorMessage = new customError.ApplicationError(result.toString(), 422);
                logger.error({label:"Reset User Password",message:errorMessage.Error.Message});
                let passwordResetResponse = new userModel.PasswordResetResponse(errorMessage,null);
                helperUtil.GenerateJSONAndXMLResponse(req, res, passwordResetResponse, errorMessage.Status);
            } else {
                let requestBody = JSON.parse(bodyContent);
               
                let userId = requestBody.passwordresetrequest.userid;
                let passwordSalt = await userDbAccess.GetUserPasswordSaltById(userId);

                if(passwordSalt.length>0){
                    let passwordData= helperUtil.GetPasswordHash( requestBody.passwordresetrequest.currentpassword,helperUtil.DecryptData(passwordSalt[0].PasswordSalt));
                    let decryptedPassword = helperUtil.DecryptData(passwordSalt[0].Password);
                    if(passwordData.passwordHash===decryptedPassword){
                        let newPassword= helperUtil.SaltHashPassword(requestBody.passwordresetrequest.newpassword);
                        let passwordDetails= {
                            UserId: requestBody.passwordresetrequest.userid,
                            PasswordHash:helperUtil.EncryptData(newPassword.passwordHash),
                            PasswordSalt:helperUtil.EncryptData(newPassword.salt),
                            UpdatedBy:req.username
                        };
                        let updatedUserDetails = await userDbAccess.UpdateUserPasswordSalt(passwordDetails);
                        if (updatedUserDetails && updatedUserDetails.length>0) { 
                            logger.error({label:"Reset User Password",message:"Success"});
                            let passwordResetResponse = new userModel.PasswordResetResponse(null,"Success");
                            helperUtil.GenerateJSONAndXMLResponse(req, res, passwordResetResponse, 200);         
                            
                        } else {
                            let errorMessage = new customError.ApplicationError("Not able to Update",422);
                            logger.error({label:"Reset User Password",message:errorMessage.Error.Message});
                            let passwordResetResponse = new userModel.PasswordResetResponse(errorMessage,null);
                            helperUtil.GenerateJSONAndXMLResponse(req, res, passwordResetResponse, errorMessage.Status);
                        }
                    }
                   else{
                    let errorMessage = new customError.ApplicationError("Incorrect Password!!",422);
                    logger.error({label:"Reset User Password",message:errorMessage.Error.Message});
                    let passwordResetResponse = new userModel.PasswordResetResponse(errorMessage,null);
                    helperUtil.GenerateJSONAndXMLResponse(req, res, passwordResetResponse, errorMessage.Status);
                   }
                }
                else{
                    let errorMessage = new customError.ApplicationError("Invalid User!!",422);
                    logger.error({label:"Reset User Password",message:errorMessage.Error.Message});
                    let passwordResetResponse = new userModel.PasswordResetResponse(errorMessage,null);
                    helperUtil.GenerateJSONAndXMLResponse(req, res, passwordResetResponse, errorMessage.Status);
                }
            }
        } else {
            let errorMessage = new customError.ApplicationError("Request Body is Empty!!",400);
            logger.error({label:"Reset User Password",message:errorMessage.Error.Message});
            let passwordResetResponse = new userModel.PasswordResetResponse(errorMessage,null);
            helperUtil.GenerateJSONAndXMLResponse(req, res, passwordResetResponse, errorMessage.Status);
        }
    } catch (error) {
        let errorMessage = new customError.ApplicationError(error);
        logger.error({label:"Reset User Password",message:errorMessage.Error.Message});
        let passwordResetResponse = new userModel.PasswordResetResponse(errorMessage,null);
        helperUtil.GenerateJSONAndXMLResponse(req, res, passwordResetResponse, errorMessage.Status);
    }
}


module.exports = {
    UserAuthentication: userAuthentication,
    UserRegistration: registerUser,
    UserUpdate: updateUser,
    UserDelete: deleteUserInfo,
    FindLdapUserDetails:findLdapUserInfo,
    UserLogout:userLogout,
    RegisterDefaultUser:registerDefaultUser,
    ResetUserPassword:resetUserPassword
};