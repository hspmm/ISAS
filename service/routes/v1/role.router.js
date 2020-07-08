/* Declare required npm packages */
var express = require('express');
var router = express.Router();

/* Declare Validators */
var commonValidator = require('../../validators/common.validator');

/* Declare Controllers */
var roleController = require('../../controllers/role.controller');

/* Role Registration API - only for API based Registration */
// router.post('/Registration', [commonValidator.ValidateApplicationSecret,commonValidator.ConvertJsonBodyKeysToLower, roleController.RegisterRole]);

/* Role Registration with Site and LDAP Groups API - only for UI based Registration  */

/* ---------------------------------------------------------------------------- 
Request :  
    {
        roleregistration: {
        role:{
            name:"",
            roledescription:""
        },
        securitymodel:"",
        site:[
            {
                siteid:1
            }
        ],
        privilege:[
            {
                privilegeid:1,
                privilegename:""
            }
        ],
        group:[
            {
                groupid:1
            }
        ],
        user:[
            {
                userid:1
            }
        ]
    }
}

Response: 
    {
        RoleRegistrationResponse:
        {
            ErrorCode:0,
            ErrorText:"",
            RoleDetails:
                {
                    RoleId:1,
                    RoleName:"",
                    RoleDescription:""
                }
        }
    }
--------------------------------------------------------------------------------*/
router.post('/InfoRegistration',[commonValidator.CheckSessionInformation,commonValidator.ConvertJsonBodyKeysToLower, roleController.RegisterRoleInfo]);

/* Role Update with Site and LDAP Groups API - only for UI based Registration  */
/* ---------------------------------------------------------------------------- 
Request :  
    {
        roleupdate: {
        role:{
            id:1,
            name:"",
            roledescription:""
        },
        securitymodel:"",
         site:[
            {
                siteid:1
            }
        ],
        privilege:[
            {
                privilegeid:1,
                privilegename:""
            }
        ],
        group:[
            {
                groupid:1
            }
        ],
        user:[
            {
                userid:1
            }
        ]
    }
}

Response: 
   {
     RoleRegistrationResponse:
    {
        ErrorCode:0,
        ErrorText:"",
        RoleDetails:
            {
                RoleId:1,
                RoleName:"",
                RoleDescription:""
            }
    }
}
--------------------------------------------------------------------------------*/
router.post('/Update',[commonValidator.CheckSessionInformation,commonValidator.ConvertJsonBodyKeysToLower, roleController.UpdateRoleInfo]);

/* Role Delete  */
/* ---------------------------------------------------------------------------- 

Request :  
    {
        roledeleterequest: {
        roleid:1
        }
    }

Response: 
    {
        RoleDeleteResponse:
        {
            ErrorCode:0,
            ErrorText:"",
            RoleId:1
        }
    }
--------------------------------------------------------------------------------*/
router.post('/Delete',[commonValidator.CheckSessionInformation,commonValidator.ConvertJsonBodyKeysToLower, roleController.DeleteRoleInfo]);

module.exports = router;