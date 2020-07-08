/* Declare required npm packages */

/* Declare Common functions */
var helperUtil = require('../utils/helper.utils');
var imprivataUtil = require('../utils/imprivata.utils');

/* Declare Validators */
var imprivataValidator = require('../validators/imprivata.validator');

/* Declare Model class */
var imprivataModel = require('../models/imprivata.model');

/* Custom Error */
var customError = require('../errors/custom.error');

/* Database Access */
var imprivataDbAccess = require('../dataaccess/imprivata.dbaccess');

/* Logging */
var logger=require('../utils/logger.utils');


/*
<summary> Helps to Register Imprivata Information </summary>
<param name="req"> Request object </param>
<param name="res"> Response object </param>
<returns> Return Imprivata Registration Response  </returns>
*/
async function registerImprivata(req, res) {
    try {
        if (req.body) {
            logger.info({label:"Register Imprivata",message:"STARTED"});
            let bodyContent = JSON.stringify(req.body);
            var result = imprivataValidator.ImprivataRegistration.validate(req.body);
            if (result != "") {
                let errorMessage = new customError.ApplicationError(result.toString(), 422);
                let imprivataRegistrationResponse = new imprivataModel.ImprivataRegistrationResponse(errorMessage,null);
                logger.error({label:"Register Imprivata",message:errorMessage.Error.Message});
                helperUtil.GenerateJSONAndXMLResponse(req, res, imprivataRegistrationResponse, errorMessage.Status);
            } else {
                let imprivataBodyDetails = JSON.parse(bodyContent);
                if (isNaN(imprivataBodyDetails.imprivataregistration.serverport)) {
                    let errorMessage = new customError.ApplicationError("Server Port must be a Number", 422);
                    let imprivataRegistrationResponse = new imprivataModel.ImprivataRegistrationResponse(errorMessage,null);
                    logger.error({label:"Register Imprivata",message:errorMessage.Error.Message});
                    helperUtil.GenerateJSONAndXMLResponse(req, res, imprivataRegistrationResponse, errorMessage.Status);
                } else {
                // Configuration Name                
                let configName= imprivataBodyDetails.imprivataregistration.configname;  
                // Server Host Name                
                let serverHostname= imprivataBodyDetails.imprivataregistration.serverhostname;  
                // Server Port                
                let serverPort= imprivataBodyDetails.imprivataregistration.serverport;   
                // API Path               
                let apiPath= imprivataBodyDetails.imprivataregistration.apipath; 
                // API Version               
                let apiVersion= imprivataBodyDetails.imprivataregistration.apiversion; 
                // Product Code              
                let productCode= imprivataBodyDetails.imprivataregistration.productcode;  
                // SSL Selected
                let isSslSelected = imprivataBodyDetails.imprivataregistration.issslselected;                 
                // Protocol
                let protocol = (isSslSelected==='true')?'https://':'http://';
                let imprivataDetails = {
                    url: protocol + serverHostname + ":" + serverPort + apiPath + apiVersion,
                    productCode: productCode,
                    configName:configName,
                    serverHostname: serverHostname,
                    serverPort: serverPort,
                    apiPath:apiPath,
                    apiVersion:apiVersion,
                    isSslSelected:isSslSelected
                };
               // console.log("Url-",imprivataDetails.url);
                let success=0;
                let imprivataValidation= await imprivataUtil.ValidateImprivataInformation(imprivataDetails).then((result) => {
                    success=1;
                }).catch((err)=>{
                    let errorMessage = new customError.ApplicationError("Not able to connect with "+ configName +" Configuration!!",422);
                    //console.log("errorMessage-",errorMessage);
                    logger.error({label:"Register Imprivata",message:errorMessage.Error.Message});
                    let imprivataRegistrationResponse = new imprivataModel.ImprivataRegistrationResponse(errorMessage,null);
                    helperUtil.GenerateJSONAndXMLResponse(req, res, imprivataRegistrationResponse, errorMessage.Status);
                });
                if(success){
                    let existingImprivataDetails = await imprivataDbAccess.GetImprivataDetails(imprivataDetails);
                    if (existingImprivataDetails) {
                        let errorMessage = new customError.ApplicationError("Imprivata Configuration already available!!", 422);
                        logger.error({label:"Register Imprivata",message:errorMessage.Error.Message});
                        let imprivataRegistrationResponse = new imprivataModel.ImprivataRegistrationResponse(errorMessage,null);
                        helperUtil.GenerateJSONAndXMLResponse(req, res, imprivataRegistrationResponse, errorMessage.Status);
                    } else {                        
                        let insertedImprivataDetails = await imprivataDbAccess.InsertImprivataDetails(imprivataDetails,req.username);
                        if (insertedImprivataDetails) {
                            var result = new imprivataModel.ImprivataRegistrationResponse(null,insertedImprivataDetails);
                            logger.info({label:"Register Imprivata",message:"SUCCESS"});
                            helperUtil.GenerateJSONAndXMLResponse(req, res, result, 200);
                        } else {
                            let errorMessage = new customError.ApplicationError("Imprivata Details Not Saved Successfully. Please Try again Later.");
                            logger.error({label:"Register Imprivata",message:errorMessage.Error.Message});
                            let imprivataRegistrationResponse = new imprivataModel.ImprivataRegistrationResponse(errorMessage,null);
                            helperUtil.GenerateJSONAndXMLResponse(req, res, imprivataRegistrationResponse, 500);
                        }
                    }
                }
            }
          }
        } else {
            let errorMessage = new customError.ApplicationError("Request Body is Empty!!",400);
            logger.error({label:"Register Imprivata",message:errorMessage.Error.Message});
            let imprivataRegistrationResponse = new imprivataModel.ImprivataRegistrationResponse(errorMessage,null);
            helperUtil.GenerateJSONAndXMLResponse(req, res, imprivataRegistrationResponse, errorMessage.Status);
        }
    } catch (error) {
        let errorMessage = new customError.ApplicationError(error.toString());
        logger.error({label:"Register Imprivata",message:errorMessage.Error.Message});
        let imprivataRegistrationResponse = new imprivataModel.ImprivataRegistrationResponse(errorMessage,null);
        helperUtil.GenerateJSONAndXMLResponse(req, res, imprivataRegistrationResponse, errorMessage.Status);
    }
}

/*
<summary> Helps to Update Imprivata Information </summary>
<param name="req"> Request object </param>
<param name="res"> Response object </param>
<returns> Return Imprivata Updation Response  </returns>
*/
async function updateImprivata(req, res) {
    try {
        if (req.body) {
            logger.info({label:"Update Imprivata",message:"STARTED"});
            let bodyContent = JSON.stringify(req.body);
            var result = imprivataValidator.ImprivataUpdation.validate(req.body);
            if (result != "") {                
                let errorMessage = new customError.ApplicationError(result.toString(), 422);
                let imprivataUpdateResponse = new imprivataModel.ImprivataUpdateResponse(errorMessage,null);
                logger.error({label:"Update Imprivata",message:errorMessage.Error.Message});
                helperUtil.GenerateJSONAndXMLResponse(req, res, imprivataUpdateResponse, errorMessage.Status);
            } else {
                let imprivataBodyDetails = JSON.parse(bodyContent);
                if (isNaN(imprivataBodyDetails.imprivataupdate.imprivataconfigid)) {
                    let errorMessage = new customError.ApplicationError("Imprivata Config Id must be a Number", 422);
                    let imprivataUpdateResponse = new imprivataModel.ImprivataUpdateResponse(errorMessage,null);
                    logger.error({label:"Update Imprivata",message:errorMessage.Error.Message});
                    helperUtil.GenerateJSONAndXMLResponse(req, res, imprivataUpdateResponse, errorMessage.Status);
                } else if(isNaN(imprivataBodyDetails.imprivataupdate.serverport)){
                    let errorMessage = new customError.ApplicationError("Server Port must be a Number", 422);
                    let imprivataUpdateResponse = new imprivataModel.ImprivataUpdateResponse(errorMessage,null);
                    logger.error({label:"Update Imprivata",message:errorMessage.Error.Message});
                    helperUtil.GenerateJSONAndXMLResponse(req, res, imprivataUpdateResponse, errorMessage.Status);
                } else { 
                // Imprivata Config Id                
                let imprivataConfigId= imprivataBodyDetails.imprivataupdate.imprivataconfigid; 
                // Configuration Name                
                let configName= imprivataBodyDetails.imprivataupdate.configname;  
                // Server Host Name                
                let serverHostname= imprivataBodyDetails.imprivataupdate.serverhostname;  
                // Server Port                
                let serverPort= imprivataBodyDetails.imprivataupdate.serverport;   
                // API Path               
                let apiPath= imprivataBodyDetails.imprivataupdate.apipath; 
                // API Version               
                let apiVersion= imprivataBodyDetails.imprivataupdate.apiversion; 
                // Product Code              
                let productCode= imprivataBodyDetails.imprivataupdate.productcode;  
                // SSL Selected
                let isSslSelected = imprivataBodyDetails.imprivataupdate.issslselected;                 
                // Protocol
                let protocol = (isSslSelected==='true')?'https://':'http://';
                let imprivataDetails = {
                    url: protocol + serverHostname + ":" + serverPort + apiPath + apiVersion,
                    productCode: productCode,
                    configName:configName,
                    serverHostname: serverHostname,
                    serverPort: serverPort,
                    apiPath:apiPath,
                    apiVersion:apiVersion,
                    imprivataConfigId:imprivataConfigId,
                    isSslSelected:isSslSelected
                };

                let success=0;
                let imprivataValidation= await imprivataUtil.ValidateImprivataInformation(imprivataDetails).then((result) => {
                    success=1;
                }).catch((err)=>{
                    let errorMessage = new customError.ApplicationError("Not able to connect with "+ configName +" Configuration!!",422);
                    logger.error({label:"Update Imprivata",message:errorMessage.Error.Message});
                    let imprivataUpdateResponse = new imprivataModel.ImprivataUpdateResponse(errorMessage,null);
                    helperUtil.GenerateJSONAndXMLResponse(req, res, imprivataUpdateResponse, errorMessage.Status);
                });                
                if(success){
                    let existingImprivataDetails = await imprivataDbAccess.CheckImprivataDetails(imprivataDetails);                    
                    if (existingImprivataDetails) {
                        let errorMessage = new customError.ApplicationError("Imprivata Configuration already available!!", 422);
                        logger.error({label:"Update Imprivata",message:errorMessage.Error.Message});
                        let imprivataUpdateResponse = new imprivataModel.ImprivataUpdateResponse(errorMessage,null);
                        helperUtil.GenerateJSONAndXMLResponse(req, res, imprivataUpdateResponse, errorMessage.Status);
                    } else {                     
                        let updatedImprivataDetails = await imprivataDbAccess.UpdateImprivataDetails(imprivataDetails,req.username);
                        if (updatedImprivataDetails) {
                            var result = new imprivataModel.ImprivataUpdateResponse(null,updatedImprivataDetails);
                            logger.info({label:"Update Imprivata",message:"SUCCESS"});
                            helperUtil.GenerateJSONAndXMLResponse(req, res, result, 200);
                        } else {                           
                            let errorMessage = new customError.ApplicationError("Imprivata Details Not Updated Successfully. Please Try again Later.");                           
                            logger.error({label:"Update Imprivata",message:errorMessage.Error.Message});
                            let imprivataUpdateResponse = new imprivataModel.ImprivataUpdateResponse(errorMessage,null);
                            helperUtil.GenerateJSONAndXMLResponse(req, res, imprivataUpdateResponse, 500);                            
                        }
                    }
                }             
            }
        }
        } else {
            let errorMessage = new customError.ApplicationError("Request Body is Empty!!",400);
            logger.error({label:"Update Imprivata",message:errorMessage.Error.Message});
            let imprivataUpdateResponse = new imprivataModel.ImprivataUpdateResponse(errorMessage,null);
            helperUtil.GenerateJSONAndXMLResponse(req, res, imprivataUpdateResponse, errorMessage.Status);
        }
    } catch (error) {
        let errorMessage = new customError.ApplicationError(error);
        logger.error({label:"Update Imprivata",message:errorMessage.Error.Message});
        let imprivataUpdateResponse = new imprivataModel.ImprivataUpdateResponse(errorMessage,null);
        helperUtil.GenerateJSONAndXMLResponse(req, res, imprivataUpdateResponse, errorMessage.Status);
    }
}

/*
<summary> Helps to Delete Imprivata Information </summary>
<param name="req"> Request object </param>
<param name="res"> Response object </param>
<returns> Return Imprivata Deleted Response  </returns>
*/
async function deleteImprivata(req, res) {
    try {
        if (req.body) {            
            logger.info({label:"Delete Imprivata",message:"STARTED"});
            let bodyContent = JSON.stringify(req.body);
            var result =  imprivataValidator.ImprivataDelete.validate(req.body);
            if (result != "") {
                let errorMessage = new customError.ApplicationError(result.toString(), 422);
                let imprivataDeleteResponse = new imprivataModel.ImprivataDeleteResponse(errorMessage,null);
                logger.error({label:"Delete Imprivata",message:errorMessage.Error.Message});
                helperUtil.GenerateJSONAndXMLResponse(req, res, imprivataDeleteResponse, errorMessage.Status);
            } else {
                let imprivataBodyDetails = JSON.parse(bodyContent);
                if (isNaN(imprivataBodyDetails.imprivatadelete.imprivataconfigid)) {
                    let errorMessage = new customError.ApplicationError("Imprivata Config Id must be a Number", 422);
                    let imprivataDeleteResponse = new imprivataModel.ImprivataDeleteResponse(errorMessage,null);
                    logger.error({label:"Update Imprivata",message:errorMessage.Error.Message});
                    helperUtil.GenerateJSONAndXMLResponse(req, res, imprivataDeleteResponse, errorMessage.Status);
                } else{
                // Imprivata Config Id                
                let imprivataConfigId= imprivataBodyDetails.imprivatadelete.imprivataconfigid; 

                let deletedImprivataDetails = await imprivataDbAccess.DeleteImprivataDetails(imprivataConfigId,req.username);
               
                if (deletedImprivataDetails) {
                    var result = new imprivataModel.ImprivataDeleteResponse(null,deletedImprivataDetails);
                    logger.info({label:"Delete Imprivata",message:"SUCCESS"});
                    helperUtil.GenerateJSONAndXMLResponse(req, res, result, 200);
                } else {
                    let errorMessage = new customError.ApplicationError("Imprivata Configuration Not Deleted. Please Try again Later.");
                    logger.error({label:"Delete Imprivata",message:errorMessage.Error.Message});
                    let imprivataDeleteResponse = new imprivataModel.ImprivataDeleteResponse(errorMessage,null);
                    helperUtil.GenerateJSONAndXMLResponse(req, res, imprivataDeleteResponse, 500);                     
                }                         
            }
        }
        } else {
            let errorMessage = new customError.ApplicationError("Request Body is Empty!!");
            logger.error({label:"Delete Imprivata",message:errorMessage.Error.Message});
            let imprivataDeleteResponse = new imprivataModel.ImprivataDeleteResponse(errorMessage,null);
            helperUtil.GenerateJSONAndXMLResponse(req, res, imprivataDeleteResponse, errorMessage.Status);
        }
    } catch (error) {
        let errorMessage = new customError.ApplicationError(error);
        logger.error({label:"Delete Imprivata",message:errorMessage.Error.Message});
        let imprivataDeleteResponse = new imprivataModel.ImprivataDeleteResponse(errorMessage,null);
        helperUtil.GenerateJSONAndXMLResponse(req, res, imprivataDeleteResponse, errorMessage.Status);
    }
}


module.exports = {
    RegisterImprivata: registerImprivata,
    UpdateImprivata: updateImprivata,
    DeleteImprivata: deleteImprivata
};