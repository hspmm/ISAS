/* Declare required npm packages */
var express = require('express');
var router = express.Router();

/* Declare Validators */
var commonValidator = require('../../validators/common.validator');

/* Declare Controllers */
var applicationController = require('../../controllers/application.controller');

/* Application Registration API */

/* ---------------------------------------------------------------------------- 

Request :  
{
    applicationregistration: {
        applicationname: "",
        applicationversion:"",
        adminname: "",
        adminemail: "",
        privilegedetails:{
            privilege:{
                name:"",
                description:"",
                key:""
            }
        }
    }
}
    

Response: 
{
    RegistrationResponse:{
        ErrorCode:0,
        ErrorText:"",
        Application_Id:"",
        Application_Secret:"",
        Application_Uuid:"",
        IsNewApplication:true/false/null
    }
}
   

--------------------------------------------------------------------------------*/
router.post('/Registration', [commonValidator.CheckHostRequest,commonValidator.ConvertJsonBodyKeysToLower, applicationController.RegisterApplication]);


/* ---------------------------------------------------------------------------- 

Request :  
{
    tokenvalidityrequest: {
        validity:600
    }
}
    

Response: 
{
    TokenValidityReponse:{
        ErrorCode:0,
        ErrorText:"",
        Status:"Success" or "Failure"
    }
}
   

--------------------------------------------------------------------------------*/
router.post('/TokenValidity', [commonValidator.CheckHostRequest,commonValidator.ValidateApplicationSecret,commonValidator.ConvertJsonBodyKeysToLower, applicationController.UpdateTokenValidity]);


module.exports = router;