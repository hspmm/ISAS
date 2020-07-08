/* Declare required npm packages */

/* Declare Common functions */
var helperUtil = require('../utils/helper.utils');

/* Declare Validators */
var privilegeDetails = require('../validators/privilege.validator');

/* Declare Model class */
var privilegeModel = require('../models/privilege.model');

/* Custom Error */
var customError = require('../errors/custom.error');

/* Database Access */
var privilegeDbAccess = require('../dataaccess/privilege.dbaccess');

/* Logging */
var logger = require('../utils/logger.utils');

/*
<summary> Helps to Register Privilege </summary>
<param name="req"> Request object </param>
<param name="res"> Response object </param>
<returns> Return Privilege Registration Response  </returns>
*/
// async function registerPrivilege(req, res) {
//     try {
//         if (req.body) {
//             logger.info({
//                 label: "Register Privileges",
//                 message: "STARTED"
//             });
//             let bodyContent = JSON.stringify(req.body);
//             var result = privilegeDetails.PrivilegeArrayRegistration.validate(req.body);
//             result = (result != "") ? privilegeDetails.PrivilegeRegistration.validate(JSON.parse(bodyContent)) : result;
//             if (result != "") {
//                 let errorMessage = new customError.ApplicationError(result.toString(), 422);
//                 logger.error({
//                     label: "Register Privileges",
//                     message: errorMessage.Error.Message
//                 });
//                 privilegeRegistrationResponse = new privilegeModel.RegistrationResponse(errorMessage, null);
//                 helperUtil.GenerateJSONAndXMLResponse(req, res, privilegeRegistrationResponse, errorMessage.Status);
//             } else {
//                 let privilegeDetails = JSON.parse(bodyContent);
//                 let privilegeBody = privilegeDetails.Privilegeregistration;
//                 if (privilegeBody === undefined) {
//                     let errorMessage = new customError.ApplicationError("Privilege is Empty!!", 422);
//                     logger.error({
//                         label: "Register Privileges",
//                         message: errorMessage.Error.Message
//                     });
//                     privilegeRegistrationResponse = new privilegeModel.RegistrationResponse(errorMessage, null);
//                     helperUtil.GenerateJSONAndXMLResponse(req, res, privilegeRegistrationResponse, errorMessage.Status);
//                 } else {
//                     let isPrivilegeArray = Array.isArray(privilegeBody);
//                     let validationResult = "";
//                     let privilegeToInsert = [];

//                     if (isPrivilegeArray) {
//                         if (privilegeBody.length === 0) {
//                             validationResult = "Privilege is Empty";
//                         } else {
//                             privilegeToInsert = privilegeBody;
//                         }
//                     } else {
//                         privilegeToInsert.push(privilegeBody);
//                     }
//                     if (validationResult != "") {
//                         let errorMessage = new customError.ApplicationError(validationResult.toString(), 422);
//                         applicationResponse = new privilegeModel.RegistrationResponse(errorMessage, null);
//                         logger.error({
//                             label: "Register Privileges",
//                             message: errorMessage.Error.Message
//                         });
//                         helperUtil.GenerateJSONAndXMLResponse(req, res, applicationResponse, errorMessage.Status);
//                     } else {
//                         let privilegeResponse = [];
//                         for (let index = 0; index < privilegeToInsert.length; index++) {
//                             let privilege = privilegeToInsert[index];
//                             let insertedPrivilegeDetails = await privilegeDbAccess.InsertPrivilegeDetails(privilege, req.applicationId);
//                             privilegeResponse.push(insertedPrivilegeDetails);
//                         }
//                         var result = new privilegeModel.RegistrationResponse(null, privilegeResponse);
//                         logger.info({
//                             label: "Register Privileges",
//                             message: "SUCCESS"
//                         });
//                         helperUtil.GenerateJSONAndXMLResponse(req, res, result, 200);
//                     }
//                 }
//             }
//         } else {
//             let errorMessage = new customError.ApplicationError("Request Body is Empty!!", 400);
//             logger.error({
//                 label: "Register Privileges",
//                 message: errorMessage.Error.Message
//             });
//             privilegeRegistrationResponse = new privilegeModel.RegistrationResponse(errorMessage, null);
//             helperUtil.GenerateJSONAndXMLResponse(req, res, privilegeRegistrationResponse, errorMessage.Status);
//         }
//     } catch (error) {
//         console.log(error);
//         let errorMessage = new customError.ApplicationError(error);
//         logger.error({
//             label: "Register Privileges",
//             message: errorMessage.Error.Message
//         });
//         privilegeRegistrationResponse = new privilegeModel.RegistrationResponse(errorMessage, null);
//         helperUtil.GenerateJSONAndXMLResponse(req, res, privilegeRegistrationResponse, errorMessage.Status);
//     }
// }


async function registerPrivilege(req, res) {
    try {
        if (req.body) {
            logger.info({
                label: "Register Privileges",
                message: "STARTED"
            });
            let bodyContent = JSON.stringify(req.body);
            let requestBody = req.body.privilegeregistration;
            let privilegeBody = (requestBody!=undefined)?req.body.privilegeregistration.privilege:undefined;
            if (privilegeBody === undefined || requestBody===undefined) {
                let errorMessage = new customError.ApplicationError("Request body is Empty!!", 422);
                logger.error({
                    label: "Register Privileges",
                    message: errorMessage.Error.Message
                });
                privilegeRegistrationResponse = new privilegeModel.RegistrationResponse(errorMessage, null);
                helperUtil.GenerateJSONAndXMLResponse(req, res, privilegeRegistrationResponse, errorMessage.Status);
            } else {
                let isPrivilegeArray = Array.isArray(privilegeBody);
                let validationResult = "";
                if (isPrivilegeArray) {
                    if (privilegeBody.length === 0) {
                        validationResult = "Privilege is Empty";
                    } else {
                        validationResult = privilegeDetails.PrivilegeArrayRegistration.validate(req.body);
                    }
                } else {
                    validationResult = privilegeDetails.PrivilegeRegistration.validate(req.body);
                }

                if (validationResult != "") {
                    let errorMessage = new customError.ApplicationError(validationResult.toString(), 422);
                    logger.error({
                        label: "Register Privileges",
                        message: errorMessage.Error.Message
                    });
                    privilegeRegistrationResponse = new privilegeModel.RegistrationResponse(errorMessage, null);
                    helperUtil.GenerateJSONAndXMLResponse(req, res, privilegeRegistrationResponse, errorMessage.Status);
                } else {
                    let privilegeDetails = JSON.parse(bodyContent);
                    let privilegeBody = privilegeDetails.privilegeregistration.privilege;

                    let isPrivilegeArray = Array.isArray(privilegeBody);

                    let privilegeToInsert = [];

                    if (isPrivilegeArray) {
                        privilegeToInsert = privilegeBody;
                    } else {
                        privilegeToInsert.push(privilegeBody);
                    }

                    let privilegeResponse = [];
                    for (let index = 0; index < privilegeToInsert.length; index++) {
                        let privilege = privilegeToInsert[index];
                        let insertedPrivilegeDetails = await privilegeDbAccess.InsertPrivilegeDetails(privilege, req.applicationId);
                        privilegeResponse.push(insertedPrivilegeDetails);
                    }
                    var result = new privilegeModel.RegistrationResponse(null, privilegeResponse);
                    logger.info({
                        label: "Register Privileges",
                        message: "SUCCESS"
                    });
                    helperUtil.GenerateJSONAndXMLResponse(req, res, result, 200);
                }
            }
        } else {
            let errorMessage = new customError.ApplicationError("Request Body is Empty!!", 400);
            logger.error({
                label: "Register Privileges",
                message: errorMessage.Error.Message
            });
            privilegeRegistrationResponse = new privilegeModel.RegistrationResponse(errorMessage, null);
            helperUtil.GenerateJSONAndXMLResponse(req, res, privilegeRegistrationResponse, errorMessage.Status);
        }
    } catch (error) {
        let errorMessage = new customError.ApplicationError(error);
        logger.error({
            label: "Register Privileges",
            message: errorMessage.Error.Message
        });
        privilegeRegistrationResponse = new privilegeModel.RegistrationResponse(errorMessage, null);
        helperUtil.GenerateJSONAndXMLResponse(req, res, privilegeRegistrationResponse, errorMessage.Status);
    }
}

module.exports = {
    RegisterPrivilege: registerPrivilege
};