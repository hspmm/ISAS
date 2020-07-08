/* Declare required npm packages */
var express = require('express');
var router = express.Router();

/* Declare Validators */
var commonValidator = require('../../validators/common.validator');

/* Declare Controllers */
var commonController = require('../../controllers/common.controller');

/* Get All Application List API */

/* ---------------------------------------------------------------------------- 
Response: 
    ApplicationDetailsResponse:
    {
        ErrorCode:0,
        ErrorText:"",
        Applications: [
            {   
                Application:
                {
                    ApplicationId:1,
                    ApplicationName:"",
                    ApplicationVersionId:1,
                    ApplicationCode:"",
                    VersionNumber:"",
                    ApplicationDescription:"",
                    AdminName:"",
                    AdminEmailId:"",
                    IsAdminApplication:true/false,
                    IsActive:true/false
                }
            }
        ]
    }
--------------------------------------------------------------------------------*/
router.get('/Applications', [ commonController.GetAllApplications]);

/* Get All Roles List API */

/* ---------------------------------------------------------------------------- 
Response: 
    RoleDetailsResponse:
    {
        ErrorCode:0,
        ErrorText:"",
        Roles: [
            {   
                Role:
                {
                    RoleId:1,
                    RoleName:"",
                    RoleDescription:""
                }
            }
        ]
    }
--------------------------------------------------------------------------------*/
router.get('/Roles', [commonController.GetAllRoles]);

/* Get All Users List API */

/* ---------------------------------------------------------------------------- 
Response: 
    UserDetailsResponse:
    {
        ErrorCode:0,
        ErrorText:"",
        Users: [
            {   
                User:
                {
                    UserId:1,
                    UserName:"",
                    FirstName:"",
                    MiddleName:"",
                    LastName:"",
                    EmailAddress:"",
                    PhoneNumber:
                }
            }
        ]
    }
--------------------------------------------------------------------------------*/
router.get('/Users', [commonController.GetAllUsers]);

/* Get User Information API */

/* ---------------------------------------------------------------------------- 
Request :  
{
    userinforequest: {
        userid: 1        
    }
}
    

Response: 
    UserInformationResponse:
    {
        ErrorCode:0,
        ErrorText:"",
        UserInfo:{

         UserDetails:
            {
                UserName:"",
                FirstName:"",
                MiddleName:"",
                LastName:"",
                PhoneNumber:
                EmailAddress:""
                Password: --------------------------------> Will Remove soon
                IsEmailSelected:true/false
                IsAccountLocked:true/false
                IsDisabled:true/false
            },
            Roles:{
                AvailableRoles:[
                    {
                        Role:{
                            RoleId:1
                            RoleName:""
                            RoleDescription:""
                        }
                    }
                ],
                MappedRoles:[
                    {
                        Role:{
                            RoleId:1
                            RoleName:""
                            RoleDescription:""
                        }
                    }
                ]
             }
        }
    }
--------------------------------------------------------------------------------*/
router.post('/UserInfo', [commonValidator.ConvertJsonBodyKeysToLower,commonController.GetUserInfo]);

/* Get Application Privileges */

/* ---------------------------------------------------------------------------- 
Response: 
{
ApplicationPrivilegeResponse:
    {
        ErrorCode:0,
        ErrorText:"",
        Applications:[
            {
                ApplicationPrivileges:{
                    Application:{
                        ApplicationId:1
                        ApplicationName:""
                        ApplicationVersionId:1
                        ApplicationVersion:""
                        ApplicationCode:""
                    },
                    Privileges:[
                        {
                            Privilege:{
                                PrivilegeId:1
                                PrivilegeName:""
                            }
                        }
                    ]
                }
            }
        ]
    }
}
    
--------------------------------------------------------------------------------*/
router.get('/ApplicationPrivileges',[commonController.GetAllApplicationsPrivileges])

/* Get Role Privileges */

/* ---------------------------------------------------------------------------- 
Request :  
{
    roleprivilegerequest: {
        role:[
            roleid:1
        ]        
    }
}
    

Response: 
{
RolePrivilegesResponse:
    {
        ErrorCode:0,
        ErrorText:"",
        RolePrivileges:[
            {
                SitePrivileges:{
                    SiteId:1,
                    ApplicationPrivilegeId:1
                }
            }
        ]
    }
}
    
--------------------------------------------------------------------------------*/
router.post('/RolesPrivileges',[commonValidator.ConvertJsonBodyKeysToLower,commonController.GetRolesPrivileges])

/* Get Role Information API */

/* ---------------------------------------------------------------------------- 
Request :
{
    roleinforequest: {
            roleid:1
    }
}  
    

Response:
{
RoleInformationResponse:
    {
        ErrorCode:0,
        ErrorText:"",
        Role:{
                RoleDetails:{
                    RoleId:1,
                    RoleName:"",
                    RoleDescription:""
                },
                MappedPrivileges:[
                    {
                        PrivilegeId:1
                    }
                ],
                MappedGroups:[
                    {
                        LdapId:1,
                        GroupId:1
                    }
                ],
                MappedSites:[
                    {
                        SiteId:1
                    }
                ],
                MappedUsers:[
                    {
                        User:{
                            UserId:1,
                            UserName:""
                        }
                    }
                ]
            }        
    }
}     
--------------------------------------------------------------------------------*/
router.post('/RoleInfo', [commonValidator.ConvertJsonBodyKeysToLower,commonController.GetRoleInfo]);

/* Get LDAP Groups */

/* ---------------------------------------------------------------------------- 
Response: 
{
  LdapGroupDetailsResponse:
    {
        ErrorCode:0,
        ErrorText:"",
        LdapGroups:[
            {
                Ldap:{
                        LdapId:1,
                        DomainName:"",
                        LdapGroups:[
                            Group:{
                                GroupId:1,
                                GroupName:""            
                            }
                            
                        ]
                    }
            }               
        ]
    }
}
 
--------------------------------------------------------------------------------*/
router.get('/LdapGroups',[commonController.GetLdapInfo]);

/* Get Site Role Information */

/* ---------------------------------------------------------------------------- 
Response: 
{
    SiteRolesResponse:
    {
        ErrorCode:0,
        ErrorText:"",
        SiteRoles:[
            {
               siterole:{
                   RoleId:1,
                   RoleName:"",
                   SiteId:1
               }
            }
        ]
    }
}
    
--------------------------------------------------------------------------------*/
router.get('/SiteRoleInfo',[commonController.GetAllSiteRoles]);

/* Get Site User Information */

/* ---------------------------------------------------------------------------- 
Response: 
{
    SiteUsersResponse:
    {
        ErrorCode:0,
        ErrorText:"",
        SiteUsers:[
            {
               SiteUser:{
                   UserId:1,
                   UserName:"",
                   SiteId:1
               }
            }
        ]
    }
}
    
--------------------------------------------------------------------------------*/
router.get('/SiteUserInfo',[commonController.GetAllSiteUsers]);

/* Get Site LDAP Group Information */

/* ---------------------------------------------------------------------------- 
Response: 
{
    SiteLdapGroupsResponse:
    {
        ErrorCode:0,
        ErrorText:"",
        SiteLdapGroups:[
            {
               SiteLdapGroup:{
                   LdapGroupId:1,
                   LdapGroupName:"",
                   Domain:"",
                   SiteId:1
               }
            }
        ]
    }
}
--------------------------------------------------------------------------------*/
router.get('/SiteLdapGroupInfo',[commonController.GetAllSiteLdapGroups]);

/* Get Privilege Roles */

/* ---------------------------------------------------------------------------- 
Request : 
{
    privilegerolerequest: {
        privilege:[
            {
                privilegeid:1
            }
        ]
    }
} 
    
Response: 
{
PrivilegeRolesResponse:
    {
        ErrorCode:0,
        ErrorText:"",
        SiteRoles:[
            {
               SiteRole:{
                   SiteId:1,
                   RoleId:1,
                   RoleName:""
               }
            }
        ]
    }
}
    
--------------------------------------------------------------------------------*/
router.post('/PrivilegesRoles',[commonValidator.ConvertJsonBodyKeysToLower,commonController.GetPrivilegesRoles]);

/* Get Privilege Users */

/* ---------------------------------------------------------------------------- 
Request :  
{
    privilegeuserrequest: {
        privilege:[
            {
                privilegeid:1
            }
        ]
    }
}
    

Response: 
{
    PrivilegeUsersResponse:
    {
        ErrorCode:0,
        ErrorText:"",
        SiteUsers:[
            {
               SiteUser:{
                   SiteId:1,
                   UserId:1,
                   UserName:""
               }
            }
        ]
    }
}
    
--------------------------------------------------------------------------------*/
router.post('/PrivilegesUsers',[commonValidator.ConvertJsonBodyKeysToLower,commonController.GetPrivilegesUsers]);

/* Get Privilege Ldap Groups */

/* ---------------------------------------------------------------------------- 
Request :  
{
    privilegeldaprequest: {
        privilege:[
            {
                privilegeid:1
            }
        ]
    }
}
    

Response: 
{
 PrivilegeLdapGroupsResponse:
    {
        ErrorCode:0,
        ErrorText:"",
        SiteLdapGroups:[
            {
               SiteLdapGroup:{
                   SiteId:1,
                   LdapGroupId:1,
                   LdapGroupName:"",
                   Domain:""
               }
            }
        ]
    }
}
   
--------------------------------------------------------------------------------*/
router.post('/PrivilegesLdapGroups',[commonValidator.ConvertJsonBodyKeysToLower,commonController.GetPrivilegesLdapGroups]);

/* Get Site Information */

/* ---------------------------------------------------------------------------- 
Response: 
    SiteResponse:
    {
        ErrorCode:0,
        ErrorText:"",
        Sites:[
            {
                NodeId:1,
                NodeName:"",
                ParentId:1,
                NodeType:"",
                ApplicationVersionId:1,
                Children:[]                
            }
        ]
    }
--------------------------------------------------------------------------------*/
router.get('/SiteInfo',[commonController.GetAllSite]);

/* Get LDAP Information */

/* ---------------------------------------------------------------------------- 
Response: 
    {
        LdapDetailsResponse:
        {
            ErrorCode:0,
            ErrorText:"",
            LdapDetails:[
                {
                    Ldap:{
                        LdapConfigId:1,
                        Domain:"",
                        ServerHostName:"",
                        ServerPort:123,
                        AdminUserName:"",
                        IsSslSelected:true
                    }                          
                }
            ]
        }
    }
--------------------------------------------------------------------------------*/
router.get('/LdapInfo',[commonController.GetAllLdapInfo]);

/* Get Imprivata Information */

/* ---------------------------------------------------------------------------- 
Response: 
{
ImprivataDetailsResponse:
    {
        ErrorCode:0,
        ErrorText:"",
        ImprivataDetails:[
            {
                Imprivata:{
                    ImprivataConfigId:1,
                    ImprivataConfigName:"",
                    ServerHostName:"",
                    ServerPort:123,
                    ApiPath:"",
                    ApiVersion:"",
                    ProductCode:""
                }                          
            }
        ]
    }
}
    
--------------------------------------------------------------------------------*/
router.get('/ImprivataInfo',[commonController.GetAllImprivataInfo]);

/* Get LDAP Group Information */

/* ---------------------------------------------------------------------------- 
Request :  
{
ldapgrouprequest: {
        ldapconfigid:1           
    }
}
    

Response: 
{
LdapGroupDetailsResponse:
    {
        ErrorCode:0,
        ErrorText:"",
        LdapDetails:[
            {
                Ldap:{
                        LdapId:1,
                        DomainName:"",
                        LdapGroups:[
                            Group:{
                                GroupId:1,
                                GroupName:""
                            }                            
                        ]
                    }
            }               
        ]
    }
}
     
--------------------------------------------------------------------------------*/
router.post('/LdapGroupInfo',[commonValidator.ConvertJsonBodyKeysToLower,commonController.GetLdapGroupsById]);

/* Get LDAP Group User Information */

/* ---------------------------------------------------------------------------- 
Request :  
{
    ldapgroupuserrequest: {
        ldapconfigid:1,
        groupname:"",
        filter:""          
    }
}
   

Response: 
{
    LdapGroupUsersDetailsResponse:
    {
        ErrorCode:0,
        ErrorText:"",
        Ldap:{
            LdapId:1,
            DomainName:"",
            GroupName:"",
            Users:[]
        }
    }
}
    
--------------------------------------------------------------------------------*/
router.post('/LdapGroupUserInfo',[commonValidator.CheckSessionInformation,commonValidator.ConvertJsonBodyKeysToLower,commonController.GetLdapGroupUsers]);

/* Get Security Model Info */

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
router.get('/SecurityModelInfo',[commonController.GetSecurityModelInfo]);

/* Update Security Model Info */

/* ---------------------------------------------------------------------------- 
Request :  
{
    securitymodelupdaterequest: {
        securitymodel:"LDAP"   
    }
}
    

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
router.post('/UpdateSecurityModelInfo',[commonValidator.CheckSessionInformation,commonValidator.ConvertJsonBodyKeysToLower,commonController.UpdateSecurityModelInfo]);

/* ISAS Config Info */

/* ---------------------------------------------------------------------------- 
NTC - for EC

Request :  
    configinforequest: {
        baseurl:"",
        port:3000
    }

Response: 
    ConfigInfoResponse:
    {
        ErrorCode:0,
        ErrorText:"",
        ConfigInfo:{}
    }
--------------------------------------------------------------------------------*/
router.post('/ConfigInfo',[commonValidator.ConvertJsonBodyKeysToLower,commonController.GetConfigInfo]);

/* Get Site tree Information from EC */

/* ---------------------------------------------------------------------------- 

Request :  
{
    siteinforequest: {
        accesstoken:""
    }
}   

Response: 
{
    SiteResponse:
    {
        ErrorCode:0,
        ErrorText:"",
        Sites:[
            {
                NodeId:1,
                NodeName:"",
                ParentNodeId:1,
                NodeType:"",
                ApplicationVersionId:1,
                Children:[]                
            }
        ]
    }
}
    
--------------------------------------------------------------------------------*/
router.post('/SiteInfo',[commonValidator.CheckSessionInformation,commonValidator.ConvertJsonBodyKeysToLower,commonController.GetEnterpriseSites]);


/* ---------------------------------------------------------------------------- 
Response: 
    {
        LockoutDetailsResponse:
        {
            ErrorCode:0,
            ErrorText:"",
            LockoutDetails:[
                {
                    LockoutIP:{
                        IPAddress:127.0.0.0,
                        LockedDateTime:""
                    }                          
                }
            ]
        }
    }
--------------------------------------------------------------------------------*/
router.get('/LockoutInfo',[commonController.GetLockoutInfo]);



/* ---------------------------------------------------------------------------- 
Response: 
    {
        GeneralConfigResponse:
        {
            ErrorCode:0,
            ErrorText:"",
            GeneralConfig:
                {
                    LockoutPeriod:1,
                    MaxRetires:1,
                    MaxLoginAttempts:1               
                }
            
        }
    }
--------------------------------------------------------------------------------*/
router.get('/GeneralConfig',[commonController.GetGeneralConfig]);



/* ---------------------------------------------------------------------------- 
Response:

NTC
    {
        LdapDetailsResponse:
        {
            ErrorCode:0,
            ErrorText:"",
            LdapDetails:[
                {
                    Ldap:{
                        LdapConfigId:1,
                        Domain:"",
                        ServerHostName:"",
                        ServerPort:123,
                        AdminUserName:""
                    }                          
                }
            ]
        }
    }
--------------------------------------------------------------------------------*/
router.get('/ValidateSession',[commonController.ValidateSessionId]);


/* Update General Config */

/* ---------------------------------------------------------------------------- 
Request :  
{
    generalconfigupdaterequest: {
        LockoutPeriod:1,
        MaxRetires:1,
        MaxLoginAttempts:1  
    }
}
    

Response: 
{
    GeneralConfigUpdateResponse:
    {
        ErrorCode:0,
        ErrorText:"",
        GeneralConfig:{
            LockoutPeriod:1,
            MaxRetires:1,
            MaxLoginAttempts:1
        }
    }
}
    
--------------------------------------------------------------------------------*/
router.post('/UpdateGeneralConfig',[commonValidator.CheckSessionInformation,commonValidator.ConvertJsonBodyKeysToLower,commonController.UpdateGeneralConfig]);

/* Update General Config */

/* ---------------------------------------------------------------------------- 
Request :  
{
    validateapplicationrequest: {
        applicationtoken:""
    }
}
    

Response: 
{
    ValidateApplicationResponse:
    {
        ErrorCode:0,
        ErrorText:"",
        IsValidApplication:true or false
    }
}
    
--------------------------------------------------------------------------------*/
router.post('/ValidateApplication',[commonValidator.ValidateApplicationSecret,commonValidator.ConvertJsonBodyKeysToLower,commonController.ValidateApplication]);

/* ---------------------------------------------------------------------------- 
Response: 
    {
        KeyInformationResponse:
        {
            ErrorCode:0,
            ErrorText:"",
            Key:""
        }
    }
--------------------------------------------------------------------------------*/
router.post('/KeyInfo',[commonValidator.CheckSessionInformation,commonValidator.ConvertJsonBodyKeysToLower,commonController.GetKeyInfo]);

/* Update General Config */

/* ---------------------------------------------------------------------------- 
Request :  
{
    updatekeyinforequest: {
        key:""
    }
}
    

Response: 
{
    UpdateKeyInfoResponse:
    {
        ErrorCode:0,
        ErrorText:"",
        Status:true or false
    }
}
    
--------------------------------------------------------------------------------*/
//router.post('/UpdateKeyInfo',[commonValidator.ValidateAdminApplicationSecret,commonValidator.ConvertJsonBodyKeysToLower,commonController.UpdateKeyInfo]);


/* POST Site Information */

/* ---------------------------------------------------------------------------- 
Request :  
{
    data: {
        hierarchyTree:[
            
        ],
        singleInstancePlugins:[]        
    }
}
    

Response: 
{
SiteInfoResponse:
    {
        ErrorCode:0,
        ErrorText:"",
        Status: Success
    }
}
    
--------------------------------------------------------------------------------*/
router.post('/ECSiteInfo',[commonValidator.ValidateApplicationSecret,commonController.ReceiveEnterpriseSites]);

/* ---------------------------------------------------------------------------- 
Response: 
    {
        NotificationInfoResponse:
        {
            ErrorCode:0,
            ErrorText:"",
            NotificationUrl:""
            
        }
    }
--------------------------------------------------------------------------------*/
router.get('/NotificationInfo',[commonValidator.CheckSessionInformation,commonController.GetNotificationInfo]);


module.exports = router;