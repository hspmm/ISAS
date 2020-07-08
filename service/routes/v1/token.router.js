/* Declare required npm packages */
var express = require('express');
var router = express.Router();

/* Declare Validators */
var commonValidator = require('../../validators/common.validator');

/* Declare Controllers */
var tokenController = require('../../controllers/token.controller');

/* Get New Token From Refresh Token API */
/* ---------------------------------------------------------------------------- 
NTC

Request :  
    {
        newtokenrequest: {
        refreshtoken:""
        }
    }

Response: 
    {
        TokenResponse:
        {
            ErrorCode:0,
            ErrorText:"",
            AccessToken: "",
            RefreshToken: "",
            AccessToken_ExpiresIn: 0,
            RefreshToken_ExpiresIn:0
            TokenType: "",
            ExpiryTimeUnit: ""
        }
    }
--------------------------------------------------------------------------------*/
router.post('/GetNewToken', [commonValidator.CheckHostRequest ,commonValidator.ValidateApplicationSecret, commonValidator.ConvertJsonBodyKeysToLower, tokenController.GetNewTokenFromRefreshToken]);

/* Get Token Information from Access Token API */
//router.post('/GetInformation', [commonValidator.ConvertJsonBodyKeysToLower, tokenController.RegisterApplication]);


/* Get User Role and Privilege Information from token  */
/* ---------------------------------------------------------------------------- 
NTC

Request :  
    {
        introspectrequest: {
            accesstoken:"",
            siteid:1
        }
    }

Response: 
    {
        IntrospectResponse:
        {
            ErrorCode:0,
            ErrorText:"",
            UserDetails:{
                Username:""            
            },
            MappedPrivileges: [
                {
                    Privilege:{
                        Key:1,
                        Name:""
                    }
                }
            ]
        }
    }
--------------------------------------------------------------------------------*/
router.post('/Introspect', [commonValidator.CheckHostRequest,commonValidator.ValidateApplicationSecret, commonValidator.ConvertJsonBodyKeysToLower, tokenController.GetUserInfoFromAccessToken]);

module.exports = router;