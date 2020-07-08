/* Declare required npm packages */
var express = require('express');
var router = express.Router();

/* Declare Validators */
var commonValidator = require('../../validators/common.validator');

/* Declare Controllers */
var privilegeController = require('../../controllers/privilege.controller');

/* Role Registration API */
/* ---------------------------------------------------------------------------- 
Request :  
    privilegeregistration: {
        privilege:[
            {
                name:"",
                description:"",
                key:""
            }
        ]
    }

Response: 
    PrivilegeRegistrationResponse:
    {
        ErrorCode:0,
        ErrorText:"",
        Privileges:[
            {
                Privilege:{
                    PrivilegeId:1,
                    PrivilegeName:"",
                    PrivilegeDescription:"",
                    PrivilegeKey:""
                }
            }
        ]
    }
--------------------------------------------------------------------------------*/
router.post('/Registration', [commonValidator.CheckHostRequest,commonValidator.ValidateApplicationSecret,commonValidator.ConvertJsonBodyKeysToLower, privilegeController.RegisterPrivilege]);

module.exports = router;