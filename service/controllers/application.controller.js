/* Declare required npm packages */

/* Declare Common functions */
var helperUtil = require('../utils/helper.utils');

/* Declare Validators */
var applicationDetails = require('../validators/application.validator');

/* Declare Model class */
var applicationModel = require('../models/application.model');

/* Custom Error */
var customError = require('../errors/custom.error');

/* Database Access */
var applicationDbAccess = require('../dataaccess/application.dbaccess');
var privilegeDbAccess = require('../dataaccess/privilege.dbaccess');

/* Logging */
var logger = require('../utils/logger.utils');

const axios = require("axios");

var fs=require('fs');

const dotenv = require('dotenv');



/* UUID */
const {
    v1: uuidv1
} = require('uuid');

/*
<summary> Helps to Register Application </summary>
<param name="req"> Request object </param>
<param name="res"> Response object </param>
<returns> Return Application Registration Response  </returns>
*/
// function registerApplication(req, res) {
//     try {
//         logger.info({label:"Application Registration",message:"STARTED"});
//         var bodyContent = JSON.stringify(req.body);
//         if (req.body) {            
//             var result = applicationDetails.ApplicationRegistration.validate(req.body);           
//             if (result != "") {
//                 let errorMessage = new customError.ApplicationError(result.toString(),422);
//                 applicationResponse = new applicationModel.RegistrationResponse(errorMessage,null,null,null);
//                 logger.error({label:"Application Registration",message:errorMessage.Error.Message});
//                 helperUtil.GenerateJSONAndXMLResponse(req, res, applicationResponse, errorMessage.Status);
//             } else {               
//                 bodyContent = JSON.parse(bodyContent);
//                 let requestBody=JSON.stringify(bodyContent);
//                 if(bodyContent.applicationregistration.privilegedetails){
//                 console.log("bodyContent.applicationregistration.privilegedetails-",bodyContent.applicationregistration.privilegedetails);
//                 let requestValidation= applicationDetails.PrivilegeArrayDetails.validate(bodyContent.applicationregistration.privilegedetails);
//                 console.log("Validation error1-",requestValidation);
//                 console.log("Validation body-",bodyContent.applicationregistration.privilegedetails);
//                 requestValidation = (requestValidation != "") ? applicationDetails.PrivilegeDetails.validate(JSON.parse(requestBody).applicationregistration.privilegedetails) : requestValidation;
//                  console.log("Validation error-",requestValidation);
//                 if (requestValidation != "") {
//                     let errorMessage = new customError.ApplicationError(requestValidation.toString(), 422);
//                     logger.error({label:"Register Privileges",message:errorMessage.Error.Message});
//                     applicationResponse = new applicationModel.RegistrationResponse(errorMessage, null);
//                     helperUtil.GenerateJSONAndXMLResponse(req, res, applicationResponse, errorMessage.Status);
//                 } else {
//                     var applicationId;
//                     var applicationSecret;
//                     var isNewApplication;
//                     (async () => {
//                         try {
//                             console.log("request-",requestBody);
//                             console.log("request body-",req.body);
//                             let existingAppDetails = await applicationDbAccess.GetAppDetailsByNameAndVersion(req.body.applicationregistration.applicationname, req.body.applicationregistration.applicationversion);

//                             if (existingAppDetails.recordset.length > 0) {
//                                 isNewApplication = false;
//                                 let appDetails = existingAppDetails.recordset[0];
//                                 applicationResponse = new applicationModel.RegistrationResponse(null,appDetails.ApplicationCode, appDetails.ApplicationSecret, isNewApplication);
//                                 logger.info({label:"Application Registration",message:"Success"});
//                                 helperUtil.GenerateJSONAndXMLResponse(req, res, applicationResponse, 200);
//                             } else {
//                                 var hash = helperUtil.CreateApplicationSecret(req.body, 'abcdefg');
//                                 applicationId = req.body.applicationregistration.applicationname + "_" + req.body.applicationregistration.applicationversion;
//                                 applicationSecret = hash;
//                                 isNewApplication = true;
//                                 let insertedAppDetails = await applicationDbAccess.InsertApplicationDetails(req.body, applicationId, applicationSecret);
//                                 if (insertedAppDetails.recordset.length > 0) {
//                                     let appDetails = insertedAppDetails.recordset[0];
//                                     applicationResponse = new applicationModel.RegistrationResponse(null,appDetails.ApplicationCode, appDetails.ApplicationSecret, isNewApplication);
//                                     logger.info({label:"Application Registration",message:"SUCCESS"});
//                                     helperUtil.GenerateJSONAndXMLResponse(req, res, applicationResponse, 200);
//                                 }
//                             }
//                         } catch (err) {
//                             let errorMessage = new customError.ApplicationError(err);
//                             applicationResponse = new applicationModel.RegistrationResponse(errorMessage,null,null,null);
//                             logger.error({label:"Application Registration",message:errorMessage.Error.Message});
//                             helperUtil.GenerateJSONAndXMLResponse(req, res, applicationResponse, errorMessage.Status);
//                         }
//                     })();
//                 }          
//                 }
//                 else{
//                     let errorMessage = new customError.ApplicationError("Privilege Details Required!!", 422);
//                     logger.error({label:"Register Privileges",message:errorMessage.Error.Message});
//                     applicationResponse = new applicationModel.RegistrationResponse(errorMessage, null);
//                     helperUtil.GenerateJSONAndXMLResponse(req, res, applicationResponse, errorMessage.Status);
//                 }                      
//             }
//         } else {
//             let errorMessage  = new customError.ApplicationError("Request Body is Empty!!",422);
//             applicationResponse = new applicationModel.RegistrationResponse(errorMessage,null,null,null);
//             logger.error({label:"Application Registration",message:errorMessage.Error.Message});
//             helperUtil.GenerateJSONAndXMLResponse(req, res, applicationResponse,  errorMessage.Status);
//         }
//     } catch (error) {
//         //throw new customError.ApplicationError(error);
//         console.log("Error-",error);
//         let errorMessage = new customError.ApplicationError(error);
//         applicationResponse = new applicationModel.RegistrationResponse(errorMessage,null,null,null);
//         logger.error({label:"Application Registration",message:errorMessage.Error.Message});
//         helperUtil.GenerateJSONAndXMLResponse(req, res, applicationResponse, errorMessage.Status);
//     }
// }



function registerApplication(req, res) {
    try {
        logger.info({
            label: "Application Registration",
            message: "STARTED"
        });
        
        if (req.body) {
            var bodyContent = JSON.stringify(req.body);
            let result = applicationDetails.ApplicationRegistrationSchema.validate(req.body);
            if (result != "") {
                let errorMessage = new customError.ApplicationError(result.toString(), 422);
                applicationResponse = new applicationModel.RegistrationResponse(errorMessage, null, null);
                logger.error({
                    label: "Application Registration",
                    message: errorMessage.Error.Message
                });
                helperUtil.GenerateJSONAndXMLResponse(req, res, applicationResponse, errorMessage.Status);
            } else {
                bodyContent = JSON.parse(bodyContent);
                let privilegeBody = bodyContent.applicationregistration.privilegedetails.privilege;
                let isPrivilegeArray = Array.isArray(privilegeBody);
                let validationResult = "";
                let privilegeToInsert = [];
                if (isPrivilegeArray) {
                    if (privilegeBody.length === 0) {
                        validationResult = "Privilege is Empty";
                    } else {
                        validationResult = applicationDetails.PrivilegeArrayDetails.validate(bodyContent.applicationregistration.privilegedetails);
                    }
                } else {
                    validationResult = applicationDetails.PrivilegeDetails.validate(privilegeBody);
                }
                if (validationResult != "") {
                    let errorMessage = new customError.ApplicationError(validationResult.toString(), 422);
                    applicationResponse = new applicationModel.RegistrationResponse(errorMessage, null, null);
                    logger.error({
                        label: "Application Registration",
                        message: errorMessage.Error.Message
                    });
                    helperUtil.GenerateJSONAndXMLResponse(req, res, applicationResponse, errorMessage.Status);
                } else {
                    var applicationId;
                    var applicationSecret;
                    var isNewApplication;
                    (async () => {
                        try {
                            let applicationName= req.body.applicationregistration.applicationname;
                            let applicationVersion= req.body.applicationregistration.applicationversion;
                            let adminEmail= req.body.applicationregistration.adminemail;
                            let adminName= req.body.applicationregistration.adminname;

                            applicationName=applicationName.trim().toLowerCase().split(" ").map(word => word.charAt(0).toUpperCase()+ word.slice(1)).join(" ");
                            applicationVersion=applicationVersion.trim().toLowerCase().split(" ").map(word => word.charAt(0).toUpperCase()+ word.slice(1)).join(" ");

                            let existingAppDetails = await applicationDbAccess.GetAppDetailsByNameAndVersion(applicationName, applicationVersion);

                            if (existingAppDetails.recordset.length > 0) {
                                isNewApplication = false;
                                let appDetails = existingAppDetails.recordset[0];
                                applicationResponse = new applicationModel.RegistrationResponse(null, appDetails, isNewApplication);
                                logger.info({
                                    label: "Application Registration",
                                    message: "Success"
                                });
                                helperUtil.GenerateJSONAndXMLResponse(req, res, applicationResponse, 200);
                            } else { 
                                applicationId = applicationName+ "_" + applicationVersion;

                                var hash = helperUtil.CreateApplicationSecret(applicationName,applicationVersion, process.env.applicationsecret);
                                applicationSecret = hash;
                                isNewApplication = true;
                                let insertedAppDetails = await applicationDbAccess.InsertApplicationDetails(applicationName,applicationVersion, applicationId, applicationSecret, uuidv1(),adminEmail,adminName);
                                if (insertedAppDetails.recordset.length > 0) {
                                    let appDetails = insertedAppDetails.recordset[0];
                                    /* Insert Privileges */
                                    if (Array.isArray(bodyContent.applicationregistration.privilegedetails.privilege)) {
                                        privilegeToInsert = bodyContent.applicationregistration.privilegedetails.privilege;
                                    } else {
                                        privilegeToInsert.push(bodyContent.applicationregistration.privilegedetails.privilege);
                                    }
                                    let privilegeResponse = [];
                                    for (let index = 0; index < privilegeToInsert.length; index++) {
                                        let privilege = privilegeToInsert[index];
                                        let insertedPrivilegeDetails = await privilegeDbAccess.InsertPrivilegeDetails(privilege, appDetails.ApplicationVersionId);
                                        privilegeResponse.push(insertedPrivilegeDetails);
                                    }
                                    //console.log("process.env.NM_Application_Code-",process.env.NM_Application_Code);
                                    if(process.env.NM_Application_Code===""){
                                        //registerNotification(appDetails);
                                        process.env.NM_Application_Code= appDetails.ApplicationCode;
                                        process.env.NM_Application_Secret= appDetails.ApplicationSecret;
                                        let envConfig = dotenv.parse(fs.readFileSync('.env'));
                                        let fileContent='';
                                        for (let key in envConfig) {
                                            envConfig[key] = process.env[key];
                                            fileContent=fileContent+key +"="+envConfig[key] +"\n";
                                        }
                                        const data = fs.writeFileSync('.env', fileContent);  
                                    }
                                    applicationResponse = new applicationModel.RegistrationResponse(null, appDetails, isNewApplication);
                                    logger.info({
                                        label: "Application Registration",
                                        message: "SUCCESS"
                                    });
                                    helperUtil.GenerateJSONAndXMLResponse(req, res, applicationResponse, 200);
                                }
                            }
                        } catch (err) {
                            let errorMessage = new customError.ApplicationError(err);
                            applicationResponse = new applicationModel.RegistrationResponse(errorMessage, null, null);
                            logger.error({
                                label: "Application Registration",
                                message: errorMessage.Error.Message
                            });
                            helperUtil.GenerateJSONAndXMLResponse(req, res, applicationResponse, errorMessage.Status);
                        }
                    })();
                }
            }
        } else {
            let errorMessage = new customError.ApplicationError("Request Body is Empty!!", 422);
            applicationResponse = new applicationModel.RegistrationResponse(errorMessage, null, null);
            logger.error({
                label: "Application Registration",
                message: errorMessage.Error.Message
            });
            helperUtil.GenerateJSONAndXMLResponse(req, res, applicationResponse, errorMessage.Status);
        }
    } catch (error) {
        let errorMessage = new customError.ApplicationError(error);
        applicationResponse = new applicationModel.RegistrationResponse(errorMessage, null, null);
        logger.error({
            label: "Application Registration",
            message: errorMessage.Error.Message
        });
        helperUtil.GenerateJSONAndXMLResponse(req, res, applicationResponse, errorMessage.Status);
    }
}

/*
<summary> Helps to Set Application Token Validity </summary>
<param name="req"> Request object </param>
<param name="res"> Response object </param>
<returns> Return Status  </returns>
*/
async function updateTokenValidity(req, res) {
    try {
        logger.info({
            label: "Update Token Validity",
            message: "STARTED"
        });
        
        if (req.body) {
            var bodyContent = JSON.stringify(req.body);
            let result = applicationDetails.UpdateTokenValidity.validate(req.body);
            if (result != "") {
                let errorMessage = new customError.ApplicationError(result.toString(), 422);
                tokenUpdateResponse = new applicationModel.TokenUpdateResponse(errorMessage, null);
                logger.error({
                    label: "Update Token Validity",
                    message: errorMessage.Error.Message
                });
                helperUtil.GenerateJSONAndXMLResponse(req, res, tokenUpdateResponse, errorMessage.Status);
            } else {
                bodyContent = JSON.parse(bodyContent);
                let applicationId=req.applicationId;
                let tokenValidity= parseInt(bodyContent.tokenvalidityrequest.validity);
                let updatedValidity=await applicationDbAccess.UpdateTokenValidity(tokenValidity,applicationId);
                if(updatedValidity.length>0)
                {
                    tokenUpdateResponse = new applicationModel.TokenUpdateResponse(null, true);
                    logger.info({
                        label: "Update Token Validity",
                        message: "SUCCESS"
                    });
                    helperUtil.GenerateJSONAndXMLResponse(req, res, tokenUpdateResponse, 200);
                }
                else{
                    let errorMessage = new customError.ApplicationError("Not able to update Token Validity!!", 422);
                    tokenUpdateResponse = new applicationModel.TokenUpdateResponse(errorMessage, null);
                    logger.error({
                        label: "Update Token Validity",
                        message: errorMessage.Error.Message
                    });
                    helperUtil.GenerateJSONAndXMLResponse(req, res, tokenUpdateResponse, errorMessage.Status);
                }

            }
               
        } else {
            let errorMessage = new customError.ApplicationError("Request Body is Empty!!", 422);
            tokenUpdateResponse = new applicationModel.TokenUpdateResponse(errorMessage, null);
            logger.error({
                label: "Update Token Validity",
                message: errorMessage.Error.Message
            });
            helperUtil.GenerateJSONAndXMLResponse(req, res, tokenUpdateResponse, errorMessage.Status);
        }
    } catch (error) {
        let errorMessage = new customError.ApplicationError(error);
        tokenUpdateResponse = new applicationModel.TokenUpdateResponse(errorMessage, null);
        logger.error({
            label: "Update Token Validity",
            message: errorMessage.Error.Message
        });
        helperUtil.GenerateJSONAndXMLResponse(req, res, tokenUpdateResponse, errorMessage.Status);
    }
}


module.exports = {
    RegisterApplication: registerApplication,
    UpdateTokenValidity:updateTokenValidity
};