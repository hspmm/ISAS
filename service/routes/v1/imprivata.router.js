/* Declare required npm packages */
var express = require('express');
var router = express.Router();

/* Declare Validators */
var commonValidator = require('../../validators/common.validator');

/* Declare Controllers */
var imprivataController = require('../../controllers/imprivata.controller');

/* Imprivata Registration */
/* ---------------------------------------------------------------------------- 
Request :  
   {
    "imprivataregistration": {
        "configname": "1",
        "serverhostname": "1",
        "serverport": 3000,
        "apipath": "1",
        "apiversion": "1",
        "productcode": "1"
    }
}

Response: 
    {
        ImprivataRegistrationResponse:
        {
            ErrorCode:0,
            ErrorText:"",
            ImprivataDetails:{
                ImprivataConfigId:1,
                ImprivataConfigName:"",
                ServerHostName:"",
                ServerPort:3000,
                ApiPath:"",
                ApiVersion:"",
                ProductCode:""
            }
        }
    }
--------------------------------------------------------------------------------*/
router.post('/Registration', [commonValidator.CheckSessionInformation,commonValidator.ConvertJsonBodyKeysToLower, imprivataController.RegisterImprivata]);

/* Imprivata Update */
/* ---------------------------------------------------------------------------- 
Request :  
    {
        imprivataupdate: {
            imprivataconfigid:1
            configname:"",
            serverhostname:"",
            serverport:3000,
            apipath:"",
            apiversion:"",
            productcode:""
        }
    }
   

Response: 
    ImprivataUpdateResponse:
    {
        ErrorCode:0,
        ErrorText:"",
        ImprivataDetails:{
            ImprivataConfigId:1,
            ImprivataConfigName:"",
            ServerHostName:"",
            ServerPort:3000,
            ApiPath:"",
            ApiVersion:"",
            ProductCode:""
        }
    }
--------------------------------------------------------------------------------*/
router.post('/Update',[commonValidator.CheckSessionInformation,commonValidator.ConvertJsonBodyKeysToLower, imprivataController.UpdateImprivata]);

/* Imprivata Delete */

/* ---------------------------------------------------------------------------- 
Request :  
    {
        imprivatadelete:
         {
            imprivataconfigid:1
         }
    }

Response: 
    {
        ImprivataDeleteResponse:
        {
            ErrorCode:0,
            ErrorText:"",
            ImprivataId:1
        }
    }
--------------------------------------------------------------------------------*/
router.post('/Delete',[commonValidator.CheckSessionInformation,commonValidator.ConvertJsonBodyKeysToLower, imprivataController.DeleteImprivata]);

module.exports = router;