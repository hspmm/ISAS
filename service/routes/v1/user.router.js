/* Declare required npm packages */
var express = require('express');
var router = express.Router();

/* Declare Validators */
var commonValidator = require('../../validators/common.validator');

/* Declare Controllers */
var userController = require('../../controllers/user.controller');
var commonController = require('../../controllers/common.controller');

/* User Authentication API */
/* ---------------------------------------------------------------------------- 
Request :  
    {
        authenticationrequest: {
        authenticationtype:"",
        authenticationmethod:"",
        authenticationparameters:{
            username:"",
            password:"",
            domainname:""
        }
    }
}

Response: 
    {
        AuthenticationResponse:
    {
        ErrorCode:0,
        ErrorText:"",
        AccessToken: "",
        RefreshToken: "",
        AccessToken_ExpiresIn: 0,
        RefreshToken_ExpiresIn:0
        TokenType: ""
    }
}
--------------------------------------------------------------------------------*/
router.post('/Authentication', [commonValidator.CheckHostRequest,commonValidator.ValidateApplicationSecret,commonValidator.ConvertJsonBodyKeysToLower, userController.UserAuthentication]);

/* User Registration API */
/* ---------------------------------------------------------------------------- 

Request :  
    {
        userregistration: {
        userdetails:{
            firstname:"",
            middlename:"",
            lastname:"",
            mobilenumber:"",
            emailid:"",
            isemailselected:"",
            loginid:"",
            password:"",
            isaccountlocked:"",
            isaccountdisabled:""
        },
        roledetails:[
            {
                role:{
                    roleid:1
                }
            }
        ]
    }
}

Response: 
    {
        RegistrationResponse:
        {
            ErrorCode:0,
            ErrorText:"",
            UserInformation:{
                UserName: "",
                UserId: "",
                EmailAddress: "",
                isNewUser: ""
            }
        }
}
--------------------------------------------------------------------------------*/
router.post('/Registration', [commonValidator.CheckSessionInformation,commonValidator.ConvertJsonBodyKeysToLower, userController.UserRegistration]);

/* User Update API */
/* ---------------------------------------------------------------------------- 
Request :  
    {
        userupdate: {
        userdetails:{
            userid:1,
            firstname:"",
            middlename:"",
            lastname:"",
            mobilenumber:"",
            emailid:"",
            isemailselected:"",
            loginid:"",
            password:"",
            isaccountlocked:"",
            isaccountdisabled:""
        },
        roledetails:[
            {
                role:{
                    roleid:1
                }
            }
        ]
    }
}

Response: 
    UpdateResponse:
    {
        ErrorCode:0,
        ErrorText:"",
        UserInformation:{
            UserName: "",
            UserId: "",
            EmailAddress: "",
            isNewUser: ""
        }
    }
--------------------------------------------------------------------------------*/
router.post('/Update', [commonValidator.CheckSessionInformation,commonValidator.ConvertJsonBodyKeysToLower, userController.UserUpdate]);

/* User Delete  */

/* ---------------------------------------------------------------------------- 

Request :  
    {
        userdeleterequest: {
        userid:1
    }
}


Response: 
    {
        UserDeleteResponse:
    {
        ErrorCode:0,
        ErrorText:"",
        UserId:1
    }
}
--------------------------------------------------------------------------------*/
router.post('/Delete',[commonValidator.CheckSessionInformation,commonValidator.ConvertJsonBodyKeysToLower, userController.UserDelete]);

/* Find LDAP User Details  */
/* ---------------------------------------------------------------------------- 
NTC

Request :  
    ldapuserinforequest: {
        username:""
    }

Response: 
    LdapUsersDetailsResponse:
    {
        ErrorCode:0,
        ErrorText:"",
        LdapUsers:[
            {
                LdapUser:{
                    username:"",
                    domain:"",
                    principalname:""
                    assignedroles:[
                        "testrole"
                    ]

                }
            }
        ]
    }
--------------------------------------------------------------------------------*/
router.post('/FindLdapUser',[commonValidator.ConvertJsonBodyKeysToLower, userController.FindLdapUserDetails]);


/* User Logout API */
/* ---------------------------------------------------------------------------- 
Request :  
    {
        logoutrequest: {
            accesstoken:""
         }
    }

Response: 
    {
        LogoutResponse:
        {
            ErrorCode:0,
            ErrorText:"",
            Status: "Success"/ "Failure"
        }
    }
--------------------------------------------------------------------------------*/
router.post('/Logout', [commonValidator.CheckHostRequest,commonValidator.ValidateApplicationSecret,commonValidator.ConvertJsonBodyKeysToLower, userController.UserLogout]);


/* ---------------------------------------------------------------------------- 
Response: 
{
    SecurityModelDetailsResponse:
    {
        ErrorCode:0,
        ErrorText:"",
        SecurityModel:""
    }
}
    
--------------------------------------------------------------------------------*/
router.get('/GetSecurityModel',[commonValidator.CheckHostRequest,commonValidator.ValidateApplicationSecret,commonController.GetSecurityModelInfo]);

/* Default User Registration API */
/* ---------------------------------------------------------------------------- 

Request :  
    {
        defaultuserrequest:{
            nodeinfo:{
                uid:"",
                nodeid:"",
                nodename:"",
                nodetype:""
            }
        }
    }

Response: 
    {
        DefaultUserResponse:
        {
            ErrorCode:0,
            ErrorText:"",
            UserInformation:{
                UserName: ""
            }
        }
}
--------------------------------------------------------------------------------*/
router.post('/DefaultUser', [commonValidator.CheckHostRequest,commonValidator.ValidateApplicationSecret,commonValidator.ConvertJsonBodyKeysToLower, userController.RegisterDefaultUser]);

/* Default User PAssword Reset API */
/* ---------------------------------------------------------------------------- 

Request :  
    {
        passwordresetrequest:{
            currentpassword:"",
            newpassword:""
        }
    }

Response: 
    {
        PasswordResetResponse:
        {
            ErrorCode:0,
            ErrorText:"",
            Status: "Success" or "Failure"
        }
}
--------------------------------------------------------------------------------*/
router.post('/PasswordReset', [commonValidator.CheckSessionInformation,commonValidator.ConvertJsonBodyKeysToLower, userController.ResetUserPassword]);


module.exports = router;