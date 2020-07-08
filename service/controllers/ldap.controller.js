/* Declare required npm packages */

/* Declare Common functions */
var helperUtil = require('../utils/helper.utils');
var ldapUtil = require('../utils/ldap.utils');

/* Declare Validators */
var ldapValidator = require('../validators/ldap.validator');

/* Declare Model class */
var ldapModel = require('../models/ldap.model');

/* Custom Error */
var customError = require('../errors/custom.error');

/* Database Access */
var ldapDbAccess = require('../dataaccess/ldap.dbaccess');

/* Logging */
var logger=require('../utils/logger.utils');

var fs=require('fs');

var tls = require('tls');



/*
<summary> Helps to Register LDAP Information </summary>
<param name="req"> Request object </param>
<param name="res"> Response object </param>
<returns> Return LDAP Registration Response  </returns>
*/
async function registerLdap(req, res) {
    try {
        if (req.body) {
            logger.info({label:"Register LDAP",message:"STARTED"});
            let bodyContent = JSON.stringify(req.body);
            var result = ldapValidator.LdapRegistration.validate(req.body);
            if (result != "") {
                let errorMessage = new customError.ApplicationError(result.toString(), 422);
                let ldapRegistrationResponse = new ldapModel.LdapRegistrationResponse(errorMessage,null);
                logger.error({label:"Register LDAP",message:errorMessage.Error.Message});
                helperUtil.GenerateJSONAndXMLResponse(req, res, ldapRegistrationResponse, errorMessage.Status);
            } else {
                let ldapBodyDetails = JSON.parse(bodyContent);
                if (isNaN(ldapBodyDetails.ldapregistration.serverport)) {
                    let errorMessage = new customError.ApplicationError("Server Port must be a Number", 422);
                    let ldapRegistrationResponse = new ldapModel.LdapRegistrationResponse(errorMessage,null);
                    logger.error({label:"Register LDAP",message:errorMessage.Error.Message});
                    helperUtil.GenerateJSONAndXMLResponse(req, res, ldapRegistrationResponse, errorMessage.Status);
                } else {
                // Server Host Name                
                let serverHostname= ldapBodyDetails.ldapregistration.serverhostname;  
                // Server Port                
                let serverPort= ldapBodyDetails.ldapregistration.serverport;   
                // Domain               
                let domain= ldapBodyDetails.ldapregistration.domain.trim(); 
                // Admin Username               
                let adminUsername= ldapBodyDetails.ldapregistration.adminusername; 
                // Admin Password               
                let adminPassword= ldapBodyDetails.ldapregistration.adminpassword;  
                // SSL Selected               
                let isSslSelected= ldapBodyDetails.ldapregistration.issslselected;  


                let bindDN="dc="+domain.split(".").join(",dc=");
                let protocol = (isSslSelected.toLowerCase()==="true")?"ldaps://":"ldap://";
                let ldapDetails = {
                    url: protocol + serverHostname + ":" + serverPort,
                    //url: "ldaps://" + serverHostname + ":" + serverPort,
                    baseDN: bindDN,
                    username: adminUsername,
                    password: adminPassword,
                   // ca: [fs.readFileSync('certificates/ldap/LDAPS1.cer'),fs.readFileSync('certificates/ldap/LDAPS.cer')]
                 
                    // tlsOptions:{
                    //     ca: [fs.readFileSync('certificates/ldap/LDAPS3.cer')],
                    //     requestCert: true, 
                    //     rejectUnauthorized: true
                    // } 
                };
                let success=0;
                let ldapValidation= await ldapUtil.ValidateLdapInformation(ldapDetails).then((result) => {                  
                    success=1;
                }).catch((err)=>{
                    let errorMessage = new customError.ApplicationError("Not able to connect with "+ domain +"!!",422);
                    logger.error({label:"Register LDAP",message:errorMessage.Error.Message});
                    let ldapRegistrationResponse = new ldapModel.LdapRegistrationResponse(errorMessage,null);
                    helperUtil.GenerateJSONAndXMLResponse(req, res, ldapRegistrationResponse, errorMessage.Status);
                });

                if(success){
                    let existingLdapDetails = await ldapDbAccess.GetLdapDetailsByDomainName(domain);                  
                    if (existingLdapDetails) {
                        let errorMessage = new customError.ApplicationError("LDAP Domain already available!!", 422);
                        logger.error({label:"Register LDAP",message:errorMessage.Error.Message});
                        let ldapRegistrationResponse = new ldapModel.LdapRegistrationResponse(errorMessage,null);
                        helperUtil.GenerateJSONAndXMLResponse(req, res, ldapRegistrationResponse, errorMessage.Status);
                    } else {
                        let ldapDetails= {
                            serverHostName:serverHostname,
                            serverPort: parseInt(serverPort),
                            domain:domain,
                            adminUsername:adminUsername,
                            adminPassword:helperUtil.EncryptData(adminPassword),
                            bindDN:bindDN,
                            isSslSelected:isSslSelected
                        };
                        let insertedLdapDetails = await ldapDbAccess.InsertLdapDetails(ldapDetails,req.username);
                        if (insertedLdapDetails) {
                            var result = new ldapModel.LdapRegistrationResponse(null,insertedLdapDetails);
                            logger.info({label:"Register LDAP",message:"SUCCESS"});
                            helperUtil.GenerateJSONAndXMLResponse(req, res, result, 200);
                        } else {
                            let errorMessage = new customError.ApplicationError("LDAP Details Not Saved Successfully. Please Try again Later.");
                            logger.error({label:"Register LDAP",message:errorMessage.Error.Message});
                            let ldapRegistrationResponse = new ldapModel.LdapRegistrationResponse(errorMessage,null);
                            helperUtil.GenerateJSONAndXMLResponse(req, res, ldapRegistrationResponse, 500);
                        }
                    }
                }                
            }
        }
        } else {
            let errorMessage = new customError.ApplicationError("Request Body is Empty!!",400);
            logger.error({label:"Register LDAP",message:errorMessage.Error.Message});
            let ldapRegistrationResponse = new ldapModel.LdapRegistrationResponse(errorMessage,null);
            helperUtil.GenerateJSONAndXMLResponse(req, res, ldapRegistrationResponse, errorMessage.Status);
        }
    } catch (error) {
        let errorMessage  = new customError.ApplicationError(error);
        logger.error({label:"Register LDAP",message:errorMessage.Error.Message});
        let ldapRegistrationResponse = new ldapModel.LdapRegistrationResponse(errorMessage,null);
        helperUtil.GenerateJSONAndXMLResponse(req, res, ldapRegistrationResponse, errorMessage.Status);
    }
}

/*
<summary> Helps to Update LDAP Information </summary>
<param name="req"> Request object </param>
<param name="res"> Response object </param>
<returns> Return LDAP Updation Response  </returns>
*/
async function updateLdap(req, res) {
    try {
        if (req.body) {
            logger.info({label:"Update LDAP",message:"STARTED"});
            let bodyContent = JSON.stringify(req.body);
            var result = ldapValidator.LdapUpdation.validate(req.body);
            if (result != "") {
                let errorMessage = new customError.ApplicationError(result.toString(), 422);
                let ldapUpdateResponse = new ldapModel.LdapUpdateResponse(errorMessage,null);
                logger.error({label:"Update LDAP",message:errorMessage.Error.Message});
                helperUtil.GenerateJSONAndXMLResponse(req, res, ldapUpdateResponse, errorMessage.Status);              
            } else {
                let ldapBodyDetails = JSON.parse(bodyContent);
                if (isNaN(ldapBodyDetails.ldapupdate.ldapconfigid)) {
                    let errorMessage = new customError.ApplicationError("LDAP Config Id must be a Number", 422);
                    let ldapUpdateResponse = new ldapModel.LdapUpdateResponse(errorMessage,null);
                    logger.error({label:"Update LDAP",message:errorMessage.Error.Message});
                    helperUtil.GenerateJSONAndXMLResponse(req, res, ldapUpdateResponse, errorMessage.Status);
                } else if (isNaN(ldapBodyDetails.ldapupdate.serverport)) {
                    let errorMessage = new customError.ApplicationError("Server Port must be a Number", 422);
                    let ldapUpdateResponse = new ldapModel.LdapUpdateResponse(errorMessage,null);
                    logger.error({label:"Update LDAP",message:errorMessage.Error.Message});
                    helperUtil.GenerateJSONAndXMLResponse(req, res, ldapUpdateResponse, errorMessage.Status);
                }else{

                // LDAP Config ID 
                let ldapConfigId= ldapBodyDetails.ldapupdate.ldapconfigid;  
                // Server Host Name                
                let serverHostname= ldapBodyDetails.ldapupdate.serverhostname;  
                // Server Port                
                let serverPort= ldapBodyDetails.ldapupdate.serverport;   
                // Domain               
                let domain= ldapBodyDetails.ldapupdate.domain.trim(); 
                // Admin Username               
                let adminUsername= ldapBodyDetails.ldapupdate.adminusername; 
                // Admin Password               
                let adminPassword= ldapBodyDetails.ldapupdate.adminpassword;  
                // SSL Selected               
                let isSslSelected= ldapBodyDetails.ldapupdate.issslselected;  

                let bindDN="dc="+domain.split(".").join(",dc=");
                let protocol = (isSslSelected.toLowerCase()==="true")?"ldaps://":"ldap://";

                let ldapDetails = {
                    url: protocol + serverHostname + ":" + serverPort,
                    baseDN: bindDN,
                    username: adminUsername,
                    password: adminPassword
                };
                let success=0;
                let ldapValidation= await ldapUtil.ValidateLdapInformation(ldapDetails).then((result) => {               
                    success=1;
                }).catch((err)=>{
                    let errorMessage = new customError.ApplicationError("Not able to connect with "+ domain +"!!",422);
                    logger.error({label:"Update LDAP",message:errorMessage.Error.Message});
                    let ldapUpdateResponse = new ldapModel.LdapUpdateResponse(errorMessage,null);
                    helperUtil.GenerateJSONAndXMLResponse(req, res, ldapUpdateResponse, errorMessage.Status);
                });

                if(success){
                    let existingLdapDetails = await ldapDbAccess.CheckLdapDetailsByDomainName(domain,ldapConfigId); 
                    if (existingLdapDetails) {
                        let errorMessage = new customError.ApplicationError("LDAP Domain already available!!", 422);
                        logger.error({label:"Update LDAP",message:errorMessage.Error.Message});
                        let ldapUpdateResponse = new ldapModel.LdapUpdateResponse(errorMessage,null);
                        helperUtil.GenerateJSONAndXMLResponse(req, res, ldapUpdateResponse, errorMessage.Status);
                    } else {
                        let ldapDetails= {
                            ldapConfigId:ldapConfigId,
                            serverHostName:serverHostname,
                            serverPort: parseInt(serverPort),
                            domain:domain,
                            adminUsername:adminUsername,
                            adminPassword:helperUtil.EncryptData(adminPassword),
                            bindDN:bindDN,
                            isSslSelected:isSslSelected
                        };
                        let updatedLdapDetails = await ldapDbAccess.UpdateLdapDetails(ldapDetails,req.username);
                        if (updatedLdapDetails) {
                            var result = new ldapModel.LdapUpdateResponse(null,updatedLdapDetails);
                            logger.info({label:"Update LDAP",message:"SUCCESS"});
                            helperUtil.GenerateJSONAndXMLResponse(req, res, result, 200);
                        } else {
                            let errorMessage = new customError.ApplicationError("LDAP Details Not Updated Successfully. Please Try again Later.");
                            logger.error({label:"Update LDAP",message:errorMessage.Error.Message});
                            let ldapUpdateResponse = new ldapModel.LdapUpdateResponse(errorMessage,null);
                            helperUtil.GenerateJSONAndXMLResponse(req, res, ldapUpdateResponse,errorMessage.Status);
                        }
                    }
                }              
            }
        }
        } else {
            let errorMessage = new customError.ApplicationError("Request Body is Empty!!",400);
            logger.error({label:"Update LDAP",message:errorMessage.Error.Message});
            let ldapUpdateResponse = new ldapModel.LdapUpdateResponse(errorMessage,null);
            helperUtil.GenerateJSONAndXMLResponse(req, res, ldapUpdateResponse, errorMessage.Status);
        }
    } catch (error) {
        console.log("Error-",error);
        let errorMessage  = new customError.ApplicationError(error);
        logger.error({label:"Update LDAP",message:errorMessage.Error.Message});
        let ldapUpdateResponse = new ldapModel.LdapUpdateResponse(errorMessage,null);
        helperUtil.GenerateJSONAndXMLResponse(req, res, ldapUpdateResponse, errorMessage.Status);
    }
}

/*
<summary> Helps to Delete LDAP Information </summary>
<param name="req"> Request object </param>
<param name="res"> Response object </param>
<returns> Return LDAP Deleted Response  </returns>
*/
async function deleteLdap(req, res) {
    try {
        if (req.body) {           
            logger.info({label:"Delete LDAP",message:"STARTED"});
            let bodyContent = JSON.stringify(req.body);
            var result = ldapValidator.LdapDelete.validate(req.body);
            if (result != "") {
                let errorMessage = new customError.ApplicationError(result.toString(), 422);
                let ldapDeleteResponse = new ldapModel.LdapDeleteResponse(errorMessage,null);
                logger.error({label:"Delete LDAP",message:errorMessage.Error.Message});
                helperUtil.GenerateJSONAndXMLResponse(req, res, ldapDeleteResponse, errorMessage.Status);  
            } else {
                let ldapBodyDetails = JSON.parse(bodyContent);

                if (isNaN(ldapBodyDetails.ldapdelete.ldapconfigid)) {
                    let errorMessage = new customError.ApplicationError("LDAP Config Id must be a Number", 422);
                    let ldapDeleteResponse = new ldapModel.LdapDeleteResponse(errorMessage,null);
                    logger.error({label:"Delete LDAP",message:errorMessage.Error.Message});
                    helperUtil.GenerateJSONAndXMLResponse(req, res, ldapDeleteResponse, errorMessage.Status);
                } else {
                // LDAP Config ID 
                let ldapConfigId= ldapBodyDetails.ldapdelete.ldapconfigid; 

                let deletedLdapDetails = await ldapDbAccess.DeleteLdapDetails(ldapConfigId,req.username);
               
                if (deletedLdapDetails) {
                    var result = new ldapModel.LdapDeleteResponse(null,deletedLdapDetails);
                    logger.info({label:"Delete LDAP",message:"SUCCESS"});
                    helperUtil.GenerateJSONAndXMLResponse(req, res, result, 200);
                } else {
                    let errorMessage = new customError.ApplicationError("LDAP Not Deleted. Please Try again Later.");
                    logger.error({label:"Delete LDAP",message:errorMessage.Error.Message});
                    let ldapDeleteResponse = new ldapModel.LdapDeleteResponse(errorMessage,null);
                    helperUtil.GenerateJSONAndXMLResponse(req, res, ldapDeleteResponse, 500);
                }                         
            }
        }
        } else {
            let errorMessage = new customError.ApplicationError("Request Body is Empty!!",400);
            logger.error({label:"Delete LDAP",message:errorMessage.Error.Message});
            let ldapDeleteResponse = new ldapModel.LdapDeleteResponse(errorMessage,null);
            helperUtil.GenerateJSONAndXMLResponse(req, res, ldapDeleteResponse, errorMessage.Status);
        }
    } catch (error) {
        let errorMessage = new customError.ApplicationError(error);
        logger.error({label:"Delete LDAP",message:errorMessage.Error.Message});
        let ldapDeleteResponse = new ldapModel.LdapDeleteResponse(errorMessage,null);
        helperUtil.GenerateJSONAndXMLResponse(req, res, ldapDeleteResponse, errorMessage.Status);
    }
}


module.exports = {
    RegisterLdap: registerLdap,
    UpdateLdap: updateLdap,
    DeleteLdap: deleteLdap
};