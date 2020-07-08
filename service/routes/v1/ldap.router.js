/* Declare required npm packages */
var express = require('express');
var router = express.Router();

/* Declare Validators */
var commonValidator = require('../../validators/common.validator');

/* Declare Controllers */
var ldapController = require('../../controllers/ldap.controller');

/* LDAP Registration */
/* ---------------------------------------------------------------------------- 
Request :  
{
    ldapregistration: {
        serverhostname:"",
        serverport:3000,
        domain:"",
        adminusername:"",
        adminpassword:""
    }
}
    

Response: 
{
    LdapRegistrationResponse:
    {
        ErrorCode:0,
        ErrorText:"",
        LdapDetails:{
            LdapConfigId:1,
            ServerHostName:"",
            ServerPort:3000,
            Domain:"",
            BindDn:"",
            AdminUserName:""               
        }
    }
}
   
--------------------------------------------------------------------------------*/
router.post('/Registration', [commonValidator.CheckSessionInformation,commonValidator.ConvertJsonBodyKeysToLower, ldapController.RegisterLdap]);

/* LDAP Update */

/* ---------------------------------------------------------------------------- 
Request :  
{
  ldapupdate: {
        ldapconfigid:1,
        serverhostname:"",
        serverport:3000,
        domain:"",
        adminusername:"",
        adminpassword:""
    }
}
  

Response: 
{
    LdapUpdationResponse:
    {
        ErrorCode:0,
        ErrorText:"",
        LdapDetails:{
            LdapConfigId:1,
            ServerHostName:"",
            ServerPort:3000,
            Domain:"",
            BindDn:"",
            AdminUserName:""
        }
    }
}
    
--------------------------------------------------------------------------------*/
router.post('/Update',[commonValidator.CheckSessionInformation,commonValidator.ConvertJsonBodyKeysToLower, ldapController.UpdateLdap]);

/* LDAP Delete */

/* ---------------------------------------------------------------------------- 
Request :  
{
    ldapdelete: {
        ldapconfigid:1
    }
}
    

Response: 
{
  LdapDeleteResponse:
    {
        ErrorCode:0,
        ErrorText:"",
        LdapId:1
    }
}
    
--------------------------------------------------------------------------------*/
router.post('/Delete',[commonValidator.CheckSessionInformation,commonValidator.ConvertJsonBodyKeysToLower, ldapController.DeleteLdap]);

module.exports = router;