/* Declare required npm packages */
var lodash = require('lodash');

/* Declare Common functions */
var helperUtil = require('../utils/helper.utils');
var ldapUtil = require('../utils/ldap.utils');

/* Declare Validators */
var userValidator = require('../validators/user.validator');
var roleValidator = require("../validators/role.validator");
var privilegeValidator = require("../validators/privilege.validator");
var ldapValidator = require("../validators/ldap.validator");
var settingsValidator = require("../validators/settings.validator");
var applicationValidator = require("../validators/application.validator");

/* Declare Model class */
var applicationModel = require('../models/application.model');
var roleModel = require('../models/role.model');
var userModel = require('../models/user.model');
var privilegeModel = require('../models/privilege.model');
var ldapModel = require('../models/ldap.model');
var settingsModel = require('../models/settings.model');
var sessionModel = require('../models/session.model');

/* Custom Error */
var customError = require('../errors/custom.error');

/* Database Access */
var commonDbAccess = require('../dataaccess/common.dbaccess');
var applicationDbAccess = require('../dataaccess/application.dbaccess');

/* Config File */
var configFile = require('../config/app.config');

/* Logging */
var logger = require('../utils/logger.utils');

//var trustClient = require('wstrust-client');

const axios = require("axios");

var fs=require('fs');

const dotenv = require('dotenv');

var moment = require('moment');

var finalTreeData = [];

/*
<summary> Helps to Get All Registered Applications </summary>
<param name="req"> Request object </param>
<param name="res"> Response object </param>
<returns> Return All Registered Applications </returns>
*/
function getAllApplications(req, res) {
    (async () => {
        try {
            logger.info({
                label: "GET Applications",
                message: "STARTED"
            });
            let applicationsDetails = await commonDbAccess.GetAllApplicationDetails();
            applicationResponse = new applicationModel.ApplicationDetailsResponse(null, applicationsDetails);
            logger.info({
                label: "GET Applications",
                message: "SUCCESS"
            });
            helperUtil.GenerateJSONAndXMLResponse(req, res, applicationResponse, 200);
        } catch (err) {
            let errorMessage = new customError.ApplicationError(err);
            logger.error({
                label: "GET Applications",
                message: errorMessage.Error.Message
            });
            let applicationResponse = new applicationModel.ApplicationDetailsResponse(errorMessage, null);
            helperUtil.GenerateJSONAndXMLResponse(req, res, applicationResponse, errorMessage.Status);
        }
    })();
}


/*
<summary> Helps to Get All Registered Roles </summary>
<param name="req"> Request object </param>
<param name="res"> Response object </param>
<returns> Return All Registered Roles </returns>
*/
function getAllRoles(req, res) {
    (async () => {
        try {
            logger.info({
                label: "GET Roles",
                message: "STARTED"
            });
            let rolesDetails = await commonDbAccess.GetAllRoleDetails();
            let roleResponse = new roleModel.RoleDetailsResponse(null, rolesDetails);
            logger.info({
                label: "GET Roles",
                message: "SUCCESS"
            });
            helperUtil.GenerateJSONAndXMLResponse(req, res, roleResponse, 200);
        } catch (err) {
            let errorMessage = new customError.ApplicationError(err);
            logger.error({
                label: "GET Roles",
                message: errorMessage.Error.Message
            });
            let roleResponse = new roleModel.RoleDetailsResponse(errorMessage, null);
            helperUtil.GenerateJSONAndXMLResponse(req, res, roleResponse, errorMessage.Status);
        }
    })();
}


/*
<summary> Helps to Get All Registered Users </summary>
<param name="req"> Request object </param>
<param name="res"> Response object </param>
<returns> Return All Registered Users </returns>
*/
function getAllUsers(req, res) {
    (async () => {
        try {
            logger.info({
                label: "GET Users",
                message: "STARTED"
            });
            let usersDetails = await commonDbAccess.GetAllUserDetails();
            let userResponse = new userModel.UserDetailsResponse(null, usersDetails);
            logger.info({
                label: "GET Users",
                message: "SUCCESS"
            });
            helperUtil.GenerateJSONAndXMLResponse(req, res, userResponse, 200);
        } catch (err) {
            let errorMessage = new customError.ApplicationError(err);
            logger.error({
                label: "GET Users",
                message: errorMessage.Error.Message
            });
            let userResponse = new userModel.UserDetailsResponse(errorMessage, null);
            helperUtil.GenerateJSONAndXMLResponse(req, res, userResponse, errorMessage.Status);
        }
    })();
}

/*
<summary> Helps to Get User Information </summary>
<param name="req"> Request object </param>
<param name="res"> Response object </param>
<returns> Return User Information </returns>
*/
function getUserInfo(req, res) {
    (async () => {
        try {
            if (req.body) {
                logger.info({
                    label: "GET User Information",
                    message: "STARTED"
                });
                var result = userValidator.UserInformation.validate(req.body);

                if (result != "") {
                    let errorMessage = new customError.ApplicationError(result.toString(), 422);
                    let userRolesResponse = new userModel.UserInfoResponse(errorMessage, null);
                    logger.error({
                        label: "GET User Information",
                        message: errorMessage.Error.Message
                    });
                    helperUtil.GenerateJSONAndXMLResponse(req, res, userRolesResponse, errorMessage.Status);
                } else {
                    if (isNaN(req.body.userinforequest.userid)) {
                        let errorMessage = new customError.ApplicationError("User ID must be a Number", 422);
                        let userRolesResponse = new userModel.UserInfoResponse(errorMessage, null);
                        logger.error({
                            label: "GET User Information",
                            message: errorMessage.Error.Message
                        });
                        helperUtil.GenerateJSONAndXMLResponse(req, res, userRolesResponse, errorMessage.Status);
                    } else {
                        let userMappedRolesDetails = await commonDbAccess.GetUserMappedRoleDetails(req.body.userinforequest.userid);
                        let allRolesDetails = await commonDbAccess.GetAllRoleDetails();
                        let availableRoles = lodash.xorWith(allRolesDetails, userMappedRolesDetails, lodash.isEqual);
                        let activeRoles = lodash.without(userMappedRolesDetails, allRolesDetails);
                        let userDetails = await commonDbAccess.GetUserDetails(req.body.userinforequest.userid);
                        userDetails = [{
                            UserName: userDetails.UserName,
                            FirstName:helperUtil.DecryptData(userDetails.FirstName),
                            MiddleName:(userDetails.MiddleName!=null)?helperUtil.DecryptData(userDetails.MiddleName):userDetails.MiddleName,
                            LastName:helperUtil.DecryptData(userDetails.LastName),
                            PhoneNumber:helperUtil.DecryptData(userDetails.PhoneNumber),
                            EmailAddress:helperUtil.DecryptData(userDetails.EmailAddress),
                            Password:userDetails.Password,
                            IsEmailSelected:userDetails.IsEmailSelected,
                            IsAccountLocked:userDetails.IsAccountLocked,
                            IsAccountDisabled:userDetails.IsAccountDisabled
                        }];
                        let logDetails = await commonDbAccess.GetUserLogDetails(req.body.userinforequest.userid);
                        let userActivity = logDetails[0].concat(logDetails[1]).sort((activity1, activity2) => {
                            let firstActivity = new Date(activity1.DateTime);
                            let secondActivity = new Date(activity2.DateTime);
                            return secondActivity - firstActivity;
                        });
                        userActivity = (userActivity.length > 10) ? userActivity.slice(0, 10) : userActivity;
                        let userRolesResponse = new userModel.UserInfoResponse(null, userDetails, availableRoles, activeRoles, userActivity);
                        logger.info({
                            label: "GET Roles",
                            message: "SUCCESS"
                        });
                        helperUtil.GenerateJSONAndXMLResponse(req, res, userRolesResponse, 200);
                    }
                }
            } else {
                let errorMessage = new customError.ApplicationError("Request Body is Empty!!", 400);
                let userRolesResponse = new userModel.UserInfoResponse(errorMessage, null);
                logger.error({
                    label: "GET User Information",
                    message: errorMessage.Error.Message
                });
                helperUtil.GenerateJSONAndXMLResponse(req, res, userRolesResponse, errorMessage.Status);
            }

        } catch (err) {
            let errorMessage = new customError.ApplicationError(err);
            let userRolesResponse = new userModel.UserInfoResponse(errorMessage, null);
            logger.error({
                label: "GET User Information",
                message: errorMessage.Error.Message
            });
            helperUtil.GenerateJSONAndXMLResponse(req, res, userRolesResponse, errorMessage.Status);
        }
    })();
}

/*
<summary> Helps to Get All Applications Privileges </summary>
<param name="req"> Request object </param>
<param name="res"> Response object </param>
<returns> Return All Applications Privileges </returns>
*/
function getAllApplicationsPrivileges(req, res) {
    (async () => {
        try {
            logger.info({
                label: "GET Application Privileges",
                message: "STARTED"
            });
            let applicationPrivileges = await commonDbAccess.GetAllApplicationsPrivileges();
            let applicationPrivilegeResponse = new privilegeModel.ApplicationPrivilegeResponse(null, applicationPrivileges);
            logger.info({
                label: "GET Application Privileges",
                message: "SUCCESS"
            });
            helperUtil.GenerateJSONAndXMLResponse(req, res, applicationPrivilegeResponse, 200);
        } catch (err) {
            let errorMessage = new customError.ApplicationError(err);
            logger.error({
                label: "GET Application Privileges",
                message: errorMessage.Error.Message
            });
            let applicationPrivilegeResponse = new privilegeModel.ApplicationPrivilegeResponse(errorMessage, null);
            helperUtil.GenerateJSONAndXMLResponse(req, res, applicationPrivilegeResponse, errorMessage.Status);
        }
    })();
}


/*
<summary> Helps to Get Roles Privileges </summary>
<param name="req"> Request object </param>
<param name="res"> Response object </param>
<returns> Return Roles Privileges </returns>
*/
function getRolesPrivileges(req, res) {
    (async () => {
        try {
            if (req.body) {
                logger.info({
                    label: "GET Roles Privileges",
                    message: "STARTED"
                });
                let bodyContent = JSON.stringify(req.body);
                var result = roleValidator.RolePrivilegeArrayRequest.validate(req.body);
                result = (result != "") ? roleValidator.RolePrivilegeRequest.validate(JSON.parse(bodyContent)) : result;
                if (result != "") {
                    let errorMessage = new customError.ApplicationError(result.toString(), 422);
                    let rolePrivilegeResponse = new roleModel.RolePrivilegesResponse(errorMessage, null);
                    logger.error({
                        label: "GET Roles Privileges",
                        message: errorMessage.Error.Message
                    });
                    helperUtil.GenerateJSONAndXMLResponse(req, res, rolePrivilegeResponse, errorMessage.Status);
                } else {
                    let roleDetails = JSON.parse(bodyContent);
                    let arrayRoleId = [];
                    if (roleDetails.roleprivilegerequest.role.length > 0) {
                        arrayRoleId = roleDetails.roleprivilegerequest.role.map(role => role.roleid);
                    } else {
                        arrayRoleId.push(roleDetails.roleprivilegerequest.role.roleid);
                    }

                    let roleMappedPrivilegesDetails = await commonDbAccess.GetRolesPrivileges(arrayRoleId.join());
                    let rolePrivilegeResponse = new roleModel.RolePrivilegesResponse(null, roleMappedPrivilegesDetails);
                    logger.info({
                        label: "GET Roles Privileges",
                        message: "SUCCESS"
                    });
                    helperUtil.GenerateJSONAndXMLResponse(req, res, rolePrivilegeResponse, 200);
                }
            } else {
                let errorMessage = new customError.ApplicationError("Request Body is Empty!!", 400);
                logger.error({
                    label: "GET Roles Privileges",
                    message: errorMessage.Error.Message
                });
                let rolePrivilegeResponse = new roleModel.RolePrivilegesResponse(errorMessage, null);
                helperUtil.GenerateJSONAndXMLResponse(req, res, rolePrivilegeResponse, 422);
            }
        } catch (err) {
            let errorMessage = new customError.ApplicationError(err);
            logger.error({
                label: "GET Roles Privileges",
                message: errorMessage.Error.Message
            });
            let rolePrivilegeResponse = new roleModel.RolePrivilegesResponse(errorMessage, null);
            helperUtil.GenerateJSONAndXMLResponse(req, res, rolePrivilegeResponse, 422);
        }
    })();
}

/*
<summary> Helps to Get Role Information </summary>
<param name="req"> Request object </param>
<param name="res"> Response object </param>
<returns> Return Role Information </returns>
*/
function getRoleInfo(req, res) {
    (async () => {
        try {
            if (req.body) {
                logger.info({
                    label: "GET Role Information",
                    message: "STARTED"
                });
                var result = roleValidator.RoleInformation.validate(req.body);

                if (result != "") {
                    let errorMessage = new customError.ApplicationError(result.toString(), 422);
                    let roleInfoResponse = new roleModel.RoleInfoResponse(errorMessage, null);
                    logger.error({
                        label: "GET Roles Information",
                        message: errorMessage.Error.Message
                    });
                    helperUtil.GenerateJSONAndXMLResponse(req, res, roleInfoResponse, errorMessage.Status);
                } else {
                    if (isNaN(req.body.roleinforequest.roleid)) {
                        let errorMessage = new customError.ApplicationError("Role ID must be a Number", 422);
                        let roleInfoResponse = new roleModel.RoleInfoResponse(errorMessage, null);
                        logger.error({
                            label: "GET Roles Information",
                            message: errorMessage.Error.Message
                        });
                        helperUtil.GenerateJSONAndXMLResponse(req, res, roleInfoResponse, errorMessage.Status);
                    } else {
                        let roleDetails = await commonDbAccess.GetRoleDetailsById(req.body.roleinforequest.roleid);

                        let roleInfoResponse = new roleModel.RoleInfoResponse(null, roleDetails.roleBasicDetails, roleDetails.roleMappedSitesDetails, roleDetails.roleMappedPrivilegesDetails, roleDetails.roleMappedLdapGroupsDetails, roleDetails.roleMappedUsersDetails);
                        logger.info({
                            label: "GET Role Information",
                            message: "SUCCESS"
                        });
                        helperUtil.GenerateJSONAndXMLResponse(req, res, roleInfoResponse, 200);
                    }
                }
            } else {
                let errorMessage = new customError.ApplicationError("Request Body is Empty!!", 400);
                let roleInfoResponse = new roleModel.RoleInfoResponse(errorMessage, null);
                logger.error({
                    label: "GET Roles Information",
                    message: errorMessage.Error.Message
                });
                helperUtil.GenerateJSONAndXMLResponse(req, res, roleInfoResponse, errorMessage.Status);
            }

        } catch (err) {
            let errorMessage = new customError.ApplicationError(err);
            let roleInfoResponse = new roleModel.RoleInfoResponse(errorMessage, null);
            logger.error({
                label: "GET Roles Information",
                message: errorMessage.Error.Message
            });
            helperUtil.GenerateJSONAndXMLResponse(req, res, roleInfoResponse, errorMessage.Status);
        }
    })();
}

/*
<summary> Helps to Get All LDAP and related Groups  </summary>
<param name="req"> Request object </param>
<param name="res"> Response object </param>
<returns> Return All Registered LDAP and Groups </returns>
*/
function getAllLdapGroups(req, res) {
    (async () => {
        try {
            logger.info({
                label: "GET LDAP Groups",
                message: "STARTED"
            });
            let response = [];
            let ldapConfigDetails = await commonDbAccess.GetAllLdapDetails();
            if (ldapConfigDetails.length > 0) {
                for (let element of ldapConfigDetails) {
                      // SSL Selected               
                    let isSslSelected= element.IsSslSelected;  

                    let protocol = (isSslSelected===true)?"ldaps://":"ldap://";
                    let ldapDetails = {
                        url: protocol + element.ServerHostName + ":" + element.ServerPort,
                        baseDN: element.BindDn,
                        username: element.AdminUserName,
                        password: helperUtil.DecryptData(element.AdminPassword)
                    };
                    let ldapGroups = await ldapUtil.GetLDAPGroups(ldapDetails, element.LdapConfigId).then(async (result) => {
                        let ldapInfo = {
                            LdapId: element.LdapConfigId,
                            DomainName: element.Domain,
                            LdapGroups: result
                        };
                        response.push(ldapInfo);
                    }).catch((err) => {
                        logger.error({
                            label: "GET LDAP Groups",
                            message: err
                        });
                        let ldapInfo = {
                            LdapId: element.LdapConfigId,
                            DomainName: element.Domain,
                            LdapGroups: []
                        };
                        response.push(ldapInfo);
                    });
                }
                let ldapGroupDetailsResponse = new ldapModel.LdapGroupDetailsResponse(null, response);
                logger.info({
                    label: "GET LDAP Groups",
                    message: "SUCCESS"
                });
                helperUtil.GenerateJSONAndXMLResponse(req, res, ldapGroupDetailsResponse, 200);
            } else {
                let ldapGroupDetailsResponse = new ldapModel.LdapGroupDetailsResponse(null, response);
                logger.error({
                    label: "GET LDAP Groups",
                    message: "SUCCESS"
                });
                helperUtil.GenerateJSONAndXMLResponse(req, res, ldapGroupDetailsResponse, 200);
            }
        } catch (err) {
            let errorResponse = new customError.ApplicationError(err);
            logger.error({
                label: "GET LDAP Groups",
                message: errorResponse.Error.Message
            });
            let ldapGroupDetailsResponse = new ldapModel.LdapGroupDetailsResponse(errorResponse, null);
            helperUtil.GenerateJSONAndXMLResponse(req, res, ldapGroupDetailsResponse, errorResponse.Status);
        }
    })();
}


/*
<summary> Helps to Get All Site and Role Information  </summary>
<param name="req"> Request object </param>
<param name="res"> Response object </param>
<returns> Return All Mapped Site and Role information  </returns>
*/
function getAllSiteRoles(req, res) {
    (async () => {
        try {
            logger.info({
                label: "GET Site Roles",
                message: "STARTED"
            });
            let siteRoles = await commonDbAccess.GetAllSiteRoles();
            let siteRolesResponse = new roleModel.SiteRolesResponse(null, siteRoles);
            logger.info({
                label: "GET Site Roles",
                message: "SUCCESS"
            });
            helperUtil.GenerateJSONAndXMLResponse(req, res, siteRolesResponse, 200);
        } catch (err) {
            let errorMessage = new customError.ApplicationError(err);
            logger.error({
                label: "GET Site Roles",
                message: errorMessage.Error.Message
            });
            let siteRolesResponse = new roleModel.SiteRolesResponse(errorMessage, null);
            helperUtil.GenerateJSONAndXMLResponse(req, res, siteRolesResponse, errorMessage.Status);
        }
    })();
}

/*
<summary> Helps to Get All Site and User Information  </summary>
<param name="req"> Request object </param>
<param name="res"> Response object </param>
<returns> Return All Mapped Site and User information  </returns>
*/
function getAllSiteUsers(req, res) {
    (async () => {
        try {
            logger.info({
                label: "GET Site Users",
                message: "STARTED"
            });
            let siteUsers = await commonDbAccess.GetAllSiteUsers();
            let siteUsersResponse = new roleModel.SiteUsersResponse(null, siteUsers);
            logger.info({
                label: "GET Site Users",
                message: "SUCCESS"
            });
            helperUtil.GenerateJSONAndXMLResponse(req, res, siteUsersResponse, 200);
        } catch (err) {
            let errorMessage = new customError.ApplicationError(err);
            logger.error({
                label: "GET Site Users",
                message: errorMessage.Error.Message
            });
            let siteUsersResponse = new roleModel.SiteUsersResponse(errorMessage, null);
            helperUtil.GenerateJSONAndXMLResponse(req, res, siteUsersResponse, errorMessage.Status);
        }
    })();
}


/*
<summary> Helps to Get All Site and LDAP Groups Information  </summary>
<param name="req"> Request object </param>
<param name="res"> Response object </param>
<returns> Return All Mapped Site and Ldap Groups information  </returns>
*/
function getAllSiteLdapGroups(req, res) {
    (async () => {
        try {
            logger.info({
                label: "GET Site LDAP Groups",
                message: "STARTED"
            });
            let siteLdapGroups = await commonDbAccess.GetAllSiteLdapGroups();
            let siteLdapGroupsResponse = new roleModel.SiteLdapGroupsResponse(null, siteLdapGroups);
            logger.info({
                label: "GET Site LDAP Groups",
                message: "SUCCESS"
            });
            helperUtil.GenerateJSONAndXMLResponse(req, res, siteLdapGroupsResponse, 200);
        } catch (err) {
            let errorMessage = new customError.ApplicationError(err);
            logger.error({
                label: "GET Site LDAP Groups",
                message: errorMessage.Error.Message
            });
            let siteLdapGroupsResponse = new roleModel.SiteLdapGroupsResponse(errorMessage, null);
            helperUtil.GenerateJSONAndXMLResponse(req, res, siteLdapGroupsResponse, errorMessage.Status);
        }
    })();
}

/*
<summary> Helps to Get Privileges Roles </summary>
<param name="req"> Request object </param>
<param name="res"> Response object </param>
<returns> Return Privileges Roles </returns>
*/
function getPrivilegesRoles(req, res) {
    (async () => {
        try {
            if (req.body) {
                logger.info({
                    label: "GET Privileges Roles",
                    message: "STARTED"
                });
                let bodyContent = JSON.stringify(req.body);
                var result = privilegeValidator.PrivilegeRoleArrayRequest.validate(req.body);
                result = (result != "") ? privilegeValidator.PrivilegeRoleRequest.validate(JSON.parse(bodyContent)) : result;
                if (result != "") {
                    let errorMessage = new customError.ApplicationError(result.toString(), 422);
                    let privilegeRolesResponse = new privilegeModel.PrivilegeRolesResponse(errorMessage, null);
                    logger.error({
                        label: "GET Privileges Roles",
                        message: errorMessage.Error.Message
                    });
                    helperUtil.GenerateJSONAndXMLResponse(req, res, privilegeRolesResponse, errorMessage.Status);
                } else {
                    let privilegeDetails = JSON.parse(bodyContent);
                    let arrayPrivilegeId = [];
                    if (privilegeDetails.privilegerolerequest.privilege.length > 0) {
                        arrayPrivilegeId = privilegeDetails.privilegerolerequest.privilege.map(privilege => privilege.privilegeid);
                    } else {
                        arrayPrivilegeId.push(privilegeDetails.privilegerolerequest.privilege.privilegeid);
                    }
                    let privilegeMappedRolesDetails = await commonDbAccess.GetPrivilegesRoles(arrayPrivilegeId.join(','));
                    let privilegeRolesResponse = new privilegeModel.PrivilegeRolesResponse(null, privilegeMappedRolesDetails);
                    logger.info({
                        label: "GET Privileges Roles",
                        message: "SUCCESS"
                    });
                    helperUtil.GenerateJSONAndXMLResponse(req, res, privilegeRolesResponse, 200);
                }
            } else {
                let errorMessage = new customError.ApplicationError("Request Body is Empty!!", 400);
                let privilegeRolesResponse = new privilegeModel.PrivilegeRolesResponse(errorMessage, null);
                logger.error({
                    label: "GET Privileges Roles",
                    message: errorMessage.Error.Message
                });
                helperUtil.GenerateJSONAndXMLResponse(req, res, privilegeRolesResponse, errorMessage.Status);
            }
        } catch (err) {
            let errorMessage = new customError.ApplicationError(err);
            let privilegeRolesResponse = new privilegeModel.PrivilegeRolesResponse(errorMessage, null);
            logger.error({
                label: "GET Privileges Roles",
                message: errorMessage.Error.Message
            });
            helperUtil.GenerateJSONAndXMLResponse(req, res, privilegeRolesResponse, errorMessage.Status);
        }
    })();
}

/*
<summary> Helps to Get Privileges Users </summary>
<param name="req"> Request object </param>
<param name="res"> Response object </param>
<returns> Return Privileges Users </returns>
*/
function getPrivilegesUsers(req, res) {
    (async () => {
        try {
            if (req.body) {
                logger.info({
                    label: "GET Privileges Users",
                    message: "STARTED"
                });
                let bodyContent = JSON.stringify(req.body);
                var result = privilegeValidator.PrivilegeUserArrayRequest.validate(req.body);
                result = (result != "") ? privilegeValidator.PrivilegeUserRequest.validate(JSON.parse(bodyContent)) : result;
                if (result != "") {
                    let errorMessage = new customError.ApplicationError(result.toString(), 422);
                    let privilegeUsersResponse = new privilegeModel.PrivilegeUsersResponse(errorMessage, null);
                    logger.error({
                        label: "GET Privileges Users",
                        message: errorMessage.Error.Message
                    });
                    helperUtil.GenerateJSONAndXMLResponse(req, res, privilegeUsersResponse, errorMessage.Status);
                } else {
                    let privilegeDetails = JSON.parse(bodyContent);
                    let arrayPrivilegeId = [];
                    if (privilegeDetails.privilegeuserrequest.privilege.length > 0) {
                        arrayPrivilegeId = privilegeDetails.privilegeuserrequest.privilege.map(privilege => privilege.privilegeid);
                    } else {
                        arrayPrivilegeId.push(privilegeDetails.privilegeuserrequest.privilege.privilegeid);
                    }
                    let privilegeMappedUsersDetails = await commonDbAccess.GetPrivilegesUsers(arrayPrivilegeId.join(','));
                    let privilegeUsersResponse = new privilegeModel.PrivilegeUsersResponse(null, privilegeMappedUsersDetails);
                    logger.info({
                        label: "GET Privileges Users",
                        message: "SUCCESS"
                    });
                    helperUtil.GenerateJSONAndXMLResponse(req, res, privilegeUsersResponse, 200);
                }
            } else {
                let errorMessage = new customError.ApplicationError("Request Body is Empty!!", 400);
                let privilegeUsersResponse = new privilegeModel.PrivilegeUsersResponse(errorMessage, null);
                logger.error({
                    label: "GET Privileges Users",
                    message: errorMessage.Error.Message
                });
                helperUtil.GenerateJSONAndXMLResponse(req, res, privilegeUsersResponse, errorMessage.Status);
            }
        } catch (err) {
            let errorMessage = new customError.ApplicationError(err);
            let privilegeUsersResponse = new privilegeModel.PrivilegeUsersResponse(errorMessage, null);
            logger.error({
                label: "GET Privileges Users",
                message: errorMessage.Error.Message
            });
            helperUtil.GenerateJSONAndXMLResponse(req, res, privilegeUsersResponse, errorMessage.Status);
        }
    })();
}

/*
<summary> Helps to Get Privileges LDAP Groups </summary>
<param name="req"> Request object </param>
<param name="res"> Response object </param>
<returns> Return Privileges LDAP Groups </returns>
*/
function getPrivilegesLdapGroups(req, res) {
    (async () => {
        try {
            if (req.body) {
                logger.info({
                    label: "GET Privileges LDAP Groups",
                    message: "STARTED"
                });
                let bodyContent = JSON.stringify(req.body);
                var result = privilegeValidator.PrivilegeLdapArrayRequest.validate(req.body);
                result = (result != "") ? privilegeValidator.PrivilegeLdapRequest.validate(JSON.parse(bodyContent)) : result;
                if (result != "") {
                    let errorMessage = new customError.ApplicationError(result.toString(), 422);
                    let privilegeLdapResponse = new privilegeModel.PrivilegeLdapGroupsResponse(errorMessage, null);
                    logger.error({
                        label: "GET Privileges LDAP Groups",
                        message: errorMessage.Error.Message
                    });
                    helperUtil.GenerateJSONAndXMLResponse(req, res, privilegeLdapResponse, errorMessage.Status);
                } else {
                    let privilegeDetails = JSON.parse(bodyContent);
                    let arrayPrivilegeId = [];
                    if (privilegeDetails.privilegeldaprequest.privilege.length > 0) {
                        arrayPrivilegeId = privilegeDetails.privilegeldaprequest.privilege.map(privilege => privilege.privilegeid);
                    } else {
                        arrayPrivilegeId.push(privilegeDetails.privilegeldaprequest.privilege.privilegeid);
                    }
                    let privilegeMappedLdapDetails = await commonDbAccess.GetPrivilegesLdapGroups(arrayPrivilegeId.join(','));
                    let privilegeLdapResponse = new privilegeModel.PrivilegeLdapGroupsResponse(null, privilegeMappedLdapDetails);
                    logger.info({
                        label: "GET Privileges LDAP Groups",
                        message: "SUCCESS"
                    });
                    helperUtil.GenerateJSONAndXMLResponse(req, res, privilegeLdapResponse, 200);
                }
            } else {
                let errorMessage = new customError.ApplicationError("Request Body is Empty!!", 400);
                let privilegeLdapResponse = new privilegeModel.PrivilegeLdapGroupsResponse(errorMessage, null);
                logger.error({
                    label: "GET Privileges LDAP Groups",
                    message: errorMessage.Error.Message
                });
                helperUtil.GenerateJSONAndXMLResponse(req, res, privilegeLdapResponse, errorMessage.Status);
            }
        } catch (err) {
            let errorMessage = new customError.ApplicationError(err);
            let privilegeLdapResponse = new privilegeModel.PrivilegeLdapGroupsResponse(errorMessage, null);
            logger.error({
                label: "GET Privileges LDAP Groups",
                message: errorMessage.Error.Message
            });
            helperUtil.GenerateJSONAndXMLResponse(req, res, privilegeLdapResponse, errorMessage.Status);
        }
    })();
}


/*
<summary> Helps to Get All Site Information  </summary>
<param name="req"> Request object </param>
<param name="res"> Response object </param>
<returns> Return All Site information  </returns>
*/
async function getAllSite(req, res) {
    try {
        logger.info({
            label: "GET Sites",
            message: "STARTED"
        });
        let siteInfo = await commonDbAccess.GetAllSite();
        // let siteTree = await GenerateSiteTree(siteInfo);

        let finalTree = [];
        if (siteInfo[0].length > 0) {
            let parentNode = siteInfo[0].filter(site => site.ParentNodeId === null);
            for (let i = 0; i < parentNode.length; i++) {
                let siteTree = await GenerateNode([parentNode[i]], siteInfo[0]);
                finalTree.push(siteTree);
            }
        }
        let siteResponse = new roleModel.SiteResponse(null, finalTree);
        logger.info({
            label: "GET Sites",
            message: "SUCCESS"
        });
        helperUtil.GenerateJSONAndXMLResponse(req, res, siteResponse, 200);
    } catch (err) {
        let errorMessage = new customError.ApplicationError(err);
        logger.error({
            label: "GET Sites",
            message: errorMessage.Error.Message
        });
        let siteResponse = new roleModel.SiteResponse(errorMessage, null);
        helperUtil.GenerateJSONAndXMLResponse(req, res, siteResponse, errorMessage.Status);
    }
}

/* Helps to Generate Site Tree */
// async function GenerateSiteTree(totalNodes) {
//     try {
//         let finalTree = [];
//         while (totalNodes.length > 0) {
//             // let parentId = totalNodes[0].ParentNodeId;
//             // if (parentId != null) {
//             //     let filteredNodes = totalNodes.filter(node => node.ParentNodeId === parentId).map((filteredData) => {
//             //         return filteredData;
//             //     });
//             //     let insertNodes = await GenerateNode(filteredNodes,totalNodes);
//             //     finalTree.push(insertNodes);
//             //     let deletedNodes = totalNodes.filter(node => node.ParentNodeId === parentId).map((filteredData) => {
//             //         let index = totalNodes.findIndex(value => value.NodeId === filteredData.NodeId);
//             //         totalNodes.splice(index, 1);
//             //         return filteredData;
//             //     });
//             // } else {
//             let insertNodes = await GenerateNode([totalNodes[0]], totalNodes);
//             finalTree.push(insertNodes);
//             totalNodes.splice(0, 1);
//             // }
//         }
//         return await finalTree;
//     } catch (err) {
//         throw new customError.ApplicationError(err);
//     }
// }

async function GenerateNode(nodeData, totalNodeData) {
    try {
        logger.info({
            label: "Generate Node",
            message: "STARTED"
        });
        let finalNodeTree = [];
        nodeData.forEach(async nodeValue => {
            let node = {};
            node['NodeId'] = nodeValue.NodeId;
            node['NodeName'] = nodeValue.NodeName;
            node['ParentId'] = nodeValue.ParentNodeId;
            node['NodeType'] = nodeValue.NodeType;
            node['ApplicationVersionId'] = nodeValue.ApplicationVersionId;
            node['Children'] = await GenerateNode(totalNodeData.filter(value => value.ParentNodeId === nodeValue.NodeId), totalNodeData);
            await finalNodeTree.push(node);
        });
        logger.info({
            label: "Generate Node",
            message: "SUCCESS"
        });
        return await finalNodeTree;
    } catch (err) {
        logger.error({
            label: "Generate Node",
            message: err
        });
        throw new customError.ApplicationError(err);
    }
}

/* Helps to Generate Root Site Application Tree */
async function GenerateApplicationNode(applicationList) {
    try {
        logger.info({
            label: "Generate Application Node",
            message: "STARTED"
        });
        let finalNodeTree = [];
        applicationList.forEach(async nodeValue => {
            let node = {};
            node['NodeId'] = null;
            node['NodeName'] = nodeValue.ApplicationName;
            node['ParentId'] = nodeValue.EnterpriseNodeId;
            node['NodeType'] = 'application';
            node['ApplicationVersionId'] = nodeValue.ApplicationVersionId;
            node['Children'] = [];
            await finalNodeTree.push(node);
        });
        logger.info({
            label: "Generate Node",
            message: "SUCCESS"
        });
        return await finalNodeTree;
    } catch (err) {
        logger.error({
            label: "Generate Node",
            message: err
        });
        throw new customError.ApplicationError(err);
    }
}

/*
<summary> Helps to Get All LDAP   </summary>
<param name="req"> Request object </param>
<param name="res"> Response object </param>
<returns> Return All Registered LDAP </returns>
*/
function getAllLdapInfo(req, res) {
    (async () => {
        try {
            logger.info({
                label: "Get LDAP Information",
                message: "STARTED"
            });
            let response = [];
            let ldapDetails = await commonDbAccess.GetAllLdapDetails();
            let ldapDetailsResponse = new ldapModel.LdapDetailsResponse(null, ldapDetails);
            logger.info({
                label: "Get LDAP Information",
                message: "SUCCESS"
            });
            helperUtil.GenerateJSONAndXMLResponse(req, res, ldapDetailsResponse, 200);
        } catch (err) {
            let errorMessage = new customError.ApplicationError(err);
            logger.error({
                label: "GET LDAP Information",
                message: errorMessage.Error.Message
            });
            let ldapDetailsResponse = new ldapModel.LdapDetailsResponse(errorMessage, null);
            helperUtil.GenerateJSONAndXMLResponse(req, res, ldapDetailsResponse, errorMessage.Status);
        }
    })();
}

/*
<summary> Helps to Get All Imprivata   </summary>
<param name="req"> Request object </param>
<param name="res"> Response object </param>
<returns> Return All Registered Imprivata </returns>
*/
function getAllImprivataInfo(req, res) {
    (async () => {
        try {
            logger.info({
                label: "Get Imprivata Information",
                message: "STARTED"
            });
            let response = [];
            let imprivataDetails = await commonDbAccess.GetAllImprivataDetails();
            let imprivataDetailsResponse = new ldapModel.ImprivataDetailsResponse(null, imprivataDetails);
            logger.info({
                label: "Get Imprivata Information",
                message: "SUCCESS"
            });
            helperUtil.GenerateJSONAndXMLResponse(req, res, imprivataDetailsResponse, 200);
        } catch (err) {
            let errorResponse = new customError.ApplicationError(err);
            logger.error({
                label: "GET Imprivata Information",
                message: errorResponse.Error.Message
            });
            let imprivataDetailsResponse = new ldapModel.ImprivataDetailsResponse(errorResponse, null);
            helperUtil.GenerateJSONAndXMLResponse(req, res, imprivataDetailsResponse, errorResponse.Status);
        }
    })();
}

/*
<summary> Helps to Get Security Model Information   </summary>
<param name="req"> Request object </param>
<param name="res"> Response object </param>
<returns> Return Security Model Information </returns>
*/
function getSecurityModelInfo(req, res) {
    (async () => {
        try {
            logger.info({
                label: "Get Security Model",
                message: "STARTED"
            });
            let securityModelDetails = await commonDbAccess.GetSecurityModelDetails();
            let securityModelResponse = new settingsModel.SecurityModelDetailsResponse(null, securityModelDetails);
            logger.info({
                label: "Get Security Model",
                message: "SUCCESS"
            });
            helperUtil.GenerateJSONAndXMLResponse(req, res, securityModelResponse, 200);
        } catch (err) {
            let errorMessage = new customError.ApplicationError(err);
            let securityModelResponse = new settingsModel.SecurityModelDetailsResponse(errorMessage, null);
            logger.error({
                label: "GET Security Model",
                message: errorMessage.Error.Message
            });
            helperUtil.GenerateJSONAndXMLResponse(req, res, securityModelResponse, errorMessage.Status);
        }
    })();
}

/*
<summary> Helps to Update Security Model Information   </summary>
<param name="req"> Request object </param>
<param name="res"> Response object </param>
<returns> Return Updated Security Model Information </returns>
*/
function updateSecurityModelInfo(req, res) {
    (async () => {
        try {
            if (req.body) {
                logger.info({
                    label: "Update Security Model Information",
                    message: "STARTED"
                });
                let bodyContent = JSON.stringify(req.body);
                var result = settingsValidator.SecurityModelUpdateRequest.validate(req.body);
                if (result != "") {
                    let errorMessage = new customError.ApplicationError(result.toString(), 422);
                    logger.error({
                        label: "Update Security Model Information",
                        message: errorMessage.Error.Message
                    });
                    let securityModelResponse = new settingsModel.SecurityModelDetailsResponse(errorMessage, null);
                    helperUtil.GenerateJSONAndXMLResponse(req, res, securityModelResponse, errorMessage.Status);
                } else {
                    let securityModelDetails = JSON.parse(bodyContent);
                    let selectedSecurityModel = securityModelDetails.securitymodelupdaterequest.securitymodel.toString();
                    // let securityModelObject = {
                    //     isStandalone: (selectedSecurityModel === "Standalone") ? true : false,
                    //     isLdap: (selectedSecurityModel === "LDAP") ? true : false
                    // }
                    let securityModelUpdatedDetails = await commonDbAccess.UpdateSecurityModelDetails(selectedSecurityModel,req.username);
                    process.env.Selected_SecurityModel= securityModelUpdatedDetails.SecurityType;
                    let envConfig = dotenv.parse(fs.readFileSync('.env'));
                    let fileContent='';
                    for (let key in envConfig) {
                         envConfig[key] = process.env[key];
                        fileContent=fileContent+key +"="+envConfig[key] +"\n";
                    }
                    const data = fs.writeFileSync('.env', fileContent);
                    
                    let securityModelResponse = new settingsModel.SecurityModelDetailsResponse(null, securityModelUpdatedDetails);
                    logger.info({
                        label: "Update Security Model Information",
                        message: "SUCCESS"
                    });
                    helperUtil.GenerateJSONAndXMLResponse(req, res, securityModelResponse, 200);
                }
            } else {
                let errorMessage = new customError.ApplicationError("Request Body is Empty!!", 400);
                logger.error({
                    label: "Update Security Model Information",
                    message: errorMessage.Error.Message
                });
                let securityModelResponse = new settingsModel.SecurityModelDetailsResponse(errorMessage, null);
                helperUtil.GenerateJSONAndXMLResponse(req, res, securityModelResponse, 422);
            }
        } catch (err) {
            let errorMessage = new customError.ApplicationError(err);
            logger.error({
                label: "Update Security Model Information",
                message: errorMessage.Error.Message
            });
            let securityModelResponse = new settingsModel.SecurityModelDetailsResponse(errorMessage, null);
            helperUtil.GenerateJSONAndXMLResponse(req, res, securityModelResponse, 422);
        }
    })();
}

/*
<summary> Helps to Get All LDAP and related Groups By LDAP Id </summary>
<param name="req"> Request object </param>
<param name="res"> Response object </param>
<returns> Return All Registered LDAP and Groups By LDAP Id</returns>
*/
function getLdapGroupsById(req, res) {
    (async () => {
        try {
            if (req.body) {
                logger.info({
                    label: "GET LDAP Groups",
                    message: "STARTED"
                });
                var result = ldapValidator.LdapGroupDetails.validate(req.body);
                if (result != "") {
                    let errorMessage = new customError.ApplicationError(result.toString(), 422);
                    let ldapGroupDetailsResponse = new ldapModel.LdapGroupDetailsResponse(errorMessage, null);
                    logger.error({
                        label: "GET LDAP Groups",
                        message: errorMessage.Error.Message
                    });
                    helperUtil.GenerateJSONAndXMLResponse(req, res, ldapGroupDetailsResponse, errorMessage.Status);
                } else {
                    if (isNaN(req.body.ldapgrouprequest.ldapconfigid)) {
                        let errorMessage = new customError.ApplicationError("LDAP Config ID must be a Number", 422);
                        let ldapGroupDetailsResponse = new ldapModel.LdapGroupDetailsResponse(errorMessage, null);
                        logger.error({
                            label: "GET LDAP Groups",
                            message: errorMessage.Error.Message
                        });
                        helperUtil.GenerateJSONAndXMLResponse(req, res, ldapGroupDetailsResponse, errorMessage.Status);
                    } else {
                        let response = [];
                        let ldapConfig = await commonDbAccess.GetLdapDetailsById(req.body.ldapgrouprequest.ldapconfigid);
                           // SSL Selected               
                        let isSslSelected= ldapConfig.IsSslSelected;  

                        let protocol = (isSslSelected===true)?"ldaps://":"ldap://";

                        let ldapDetails = {
                            url: protocol + ldapConfig.ServerHostName + ":" + ldapConfig.ServerPort,
                            baseDN: ldapConfig.BindDn,
                            username: ldapConfig.AdminUserName,
                            password: helperUtil.DecryptData(ldapConfig.AdminPassword)
                        };
                        let ldapGroups = await ldapUtil.GetLDAPGroups(ldapDetails, ldapConfig.LdapConfigId);
                        let ldapInfo = {
                            LdapId: ldapConfig.LdapConfigId,
                            DomainName: ldapConfig.Domain,
                            LdapGroups: ldapGroups
                        };
                        response.push(ldapInfo);
                        let ldapGroupDetailsResponse = new ldapModel.LdapGroupDetailsResponse(null, response);
                        logger.info({
                            label: "GET LDAP Groups",
                            message: "SUCCESS"
                        });
                        helperUtil.GenerateJSONAndXMLResponse(req, res, ldapGroupDetailsResponse, 200);
                    }
                }
            } else {
                let errorMessage = new customError.ApplicationError("Request Body is Empty!!", 400);
                logger.error({
                    label: "GET LDAP Groups",
                    message: errorMessage.Error.Message
                });
                let ldapGroupDetailsResponse = new ldapModel.LdapGroupDetailsResponse(errorMessage, null);
                helperUtil.GenerateJSONAndXMLResponse(req, res, ldapGroupDetailsResponse, errorMessage.Status);
            }

        } catch (err) {
            let errorMessage = new customError.ApplicationError(err);
            logger.error({
                label: "GET LDAP Groups",
                message: errorMessage.Error.Message
            });
            let ldapGroupDetailsResponse = new ldapModel.LdapGroupDetailsResponse(errorMessage, null);
            helperUtil.GenerateJSONAndXMLResponse(req, res, ldapGroupDetailsResponse, errorMessage.Status);
        }
    })();
}

/*
<summary> Helps to Get All LDAP Group Users </summary>
<param name="req"> Request object </param>
<param name="res"> Response object </param>
<returns> Return All LDAP Group users</returns>
*/
function getLdapGroupUsers(req, res) {
    (async () => {
        try {
            if (req.body) {
                logger.info({
                    label: "GET LDAP Group Users",
                    message: "STARTED"
                });
                var result = ldapValidator.LdapGroupUserDetails.validate(req.body);
                if (result != "") {
                    let errorMessage = new customError.ApplicationError(result.toString(), 422);
                    let ldapGroupUsersResponse = new ldapModel.LdapGroupUsersDetailsResponse(errorMessage, null);
                    logger.error({
                        label: "GET LDAP Group Users",
                        message: errorMessage.Error.Message
                    });
                    helperUtil.GenerateJSONAndXMLResponse(req, res, ldapGroupUsersResponse, errorMessage.Status);
                } else {
                    if (isNaN(req.body.ldapgroupuserrequest.ldapconfigid)) {
                        let errorMessage = new customError.ApplicationError("LDAP Config ID must be a Number", 422);
                        let ldapGroupUsersResponse = new ldapModel.LdapGroupUsersDetailsResponse(errorMessage, null);
                        logger.error({
                            label: "GET LDAP Group Users",
                            message: errorMessage.Error.Message
                        });
                        helperUtil.GenerateJSONAndXMLResponse(req, res, ldapGroupUsersResponse, errorMessage.Status);
                    } else {
                        let response = [];
                        let ldapConfig = await commonDbAccess.GetLdapDetailsById(req.body.ldapgroupuserrequest.ldapconfigid);
                        if (ldapConfig) {
                            // SSL Selected               
                            let isSslSelected= ldapConfig.IsSslSelected;  

                            let protocol = (isSslSelected===true)?"ldaps://":"ldap://";
                            let ldapDetails = {
                                url: protocol + ldapConfig.ServerHostName + ":" + ldapConfig.ServerPort,
                                baseDN: ldapConfig.BindDn,
                                username: ldapConfig.AdminUserName,
                                password: helperUtil.DecryptData(ldapConfig.AdminPassword)
                            };
                            //console.log("No Error");
                            let ldapUsers = await ldapUtil.GetLDAPGroupUsers(ldapDetails, req.body.ldapgroupuserrequest.groupname, req.body.ldapgroupuserrequest.filter);
                           
                            let ldapInfo = {
                                LdapId: ldapConfig.LdapConfigId,
                                DomainName: ldapConfig.Domain,
                                GroupName: req.body.ldapgroupuserrequest.groupname,
                                Users: ldapUsers
                            };
                            response.push(ldapInfo);
                            let ldapGroupUsersResponse = new ldapModel.LdapGroupUsersDetailsResponse(null, response);
                            logger.info({
                                label: "GET LDAP Group Users",
                                message: "SUCCESS"
                            });
                            helperUtil.GenerateJSONAndXMLResponse(req, res, ldapGroupUsersResponse, 200);
                        } else {
                            let errorMessage = new customError.ApplicationError("Invalid LDAP Config ID", 422);
                            let ldapGroupUsersResponse = new ldapModel.LdapGroupUsersDetailsResponse(errorMessage, null);
                            logger.error({
                                label: "GET LDAP Group Users",
                                message: errorMessage.Error.Message
                            });
                            helperUtil.GenerateJSONAndXMLResponse(req, res, ldapGroupUsersResponse, errorMessage.Status);
                        }
                    }
                }
            } else {
                let errorMessage = new customError.ApplicationError("Request Body is Empty!!", 400);
                let ldapGroupUsersResponse = new ldapModel.LdapGroupUsersDetailsResponse(errorMessage, null);
                logger.error({
                    label: "GET LDAP Group Users",
                    message: errorMessage.Error.Message
                });
                helperUtil.GenerateJSONAndXMLResponse(req, res, ldapGroupUsersResponse, errorMessage.Status);
            }

        } catch (err) {
            //console.log("error",err);
            let errorMessage = new customError.ApplicationError(err);
            let ldapGroupUsersResponse = new ldapModel.LdapGroupUsersDetailsResponse(errorMessage, null);
            logger.error({
                label: "GET LDAP Group Users",
                message: errorMessage.Error.Message
            });
            helperUtil.GenerateJSONAndXMLResponse(req, res, ldapGroupUsersResponse, errorMessage.Status);
        }
    })();
}

/*
<summary> Helps to Get Config Info </summary>
<param name="req"> Request object </param>
<param name="res"> Response object </param>
<returns> Return Configuration Information </returns>
*/
async function getConfigInfo(req, res) {
    try {
        if (req.body) {
            logger.info({
                label: "GET Config Information",
                message: "STARTED"
            });
            let bodyContent = JSON.stringify(req.body);
            var result = settingsValidator.ConfigInfoRequest.validate(req.body);
            if (result != "") {
                let errorMessage = new customError.ApplicationError(result.toString(), 422);
                logger.error({
                    label: "GET Config Information",
                    message: errorMessage
                });
                helperUtil.GenerateJSONAndXMLResponse(req, res, errorMessage, errorMessage.Status);
            } else {
                let configInfoDetails = JSON.parse(bodyContent);

                // Base URL
                let baseUrl = configInfoDetails.configinforequest.baseurl;

                // Port
                let portNumber = configInfoDetails.configinforequest.port;

                let configDetails = "";

                process.env.EC_Base_URL= baseUrl;

                process.env.EC_Port= parseInt(portNumber);

                let envConfig = dotenv.parse(fs.readFileSync('.env'));
                let fileContent='';
                for (let key in envConfig) {
                     envConfig[key] = process.env[key];
                    fileContent=fileContent+key +"="+envConfig[key] +"\n";
                }
                const data = fs.writeFileSync('.env', fileContent);
                //console.log("req.applicationId-",req.applicationId);
                //let updateAdminApplication= await commonDbAccess.UpdateAdminApplication(req.applicationId);
                
                // if (deletedLdapDetails) {

                var result = configFile.ConfigInfoResponse;
                logger.info({
                    label: "GET Config Information",
                    message: "SUCCESS"
                });
                helperUtil.GenerateJSONAndXMLResponse(req, res, result, 200);
                // } else {
                //     ldapDeletionResponse = new customError.ApplicationError("LDAP Not Deleted. Please Try again Later.");
                //     helperUtil.GenerateJSONAndXMLResponse(req, res, ldapDeletionResponse, 500);
                // }                         
            }
        } else {            
            ldapDeletionResponse = new customError.ApplicationError("Request Body is Empty!!");
            logger.error({
                label: "GET Config Information",
                message: ldapDeletionResponse
            });
            helperUtil.GenerateJSONAndXMLResponse(req, res, ldapDeletionResponse, ldapDeletionResponse.Status);
        }
    } catch (error) {
        ldapDeletionResponse = new customError.ApplicationError(error);
        logger.error({
            label: "GET Config Information",
            message: ldapDeletionResponse
        });
        helperUtil.GenerateJSONAndXMLResponse(req, res, ldapDeletionResponse, ldapDeletionResponse.Status);
    }
}

/*
<summary> Helps to Get All Site Information from EC </summary>
<param name="req"> Request object </param>
<param name="res"> Response object </param>
<returns> Return All Site information  </returns>
*/
async function getEnterpriseSites(req, res) {
    try {
        if (req.body) {
            logger.info({
                label: "GET Enterprise Sites",
                message: "STARTED"
            });
            var result = settingsValidator.SiteInfoRequest.validate(req.body);
            if (result != "") {
                let errorMessage = new customError.ApplicationError(result.toString(), 422);
                let siteResponse = new roleModel.SiteResponse(errorMessage, null);
                logger.error({
                    label: "GET Enterprise Sites",
                    message: errorMessage.Error.Message
                });
                helperUtil.GenerateJSONAndXMLResponse(req, res, siteResponse, errorMessage.Status);
            } else {                
                axios.get(process.env.EC_Base_URL+':'+process.env.EC_Port+process.env.EC_Hierarchy_Path, {
                    headers: {
                        'accesstoken': req.body.siteinforequest.accesstoken
                    }
                }).then((async (response) => {
                    if (response.data.data.hierarchyTree) {       
                        finalTreeData=[];     
                        let treeData = await buildTreeObject(response.data.data.hierarchyTree);
                        let disabledECSiteInfo = await commonDbAccess.DisableSiteInfo();
                        for (let i = 0; i < finalTreeData.length; i++) {
                            let ECSiteInfo = await commonDbAccess.InsertSiteInfo(finalTreeData[i]);
                        }
                        let removeDisabledInfo = await commonDbAccess.RemoveDisabledSiteInfo();
                    } else {
                        let finalTree = [];
                        let disabledECSiteInfo = await commonDbAccess.DisableSiteInfo();
                        let removeDisabledInfo = await commonDbAccess.RemoveDisabledSiteInfo();
                        // let siteResponse = new roleModel.SiteResponse(null, finalTree);
                        // logger.info({
                        //     label: "GET Enterprise Sites",
                        //     message: "SUCCESS"
                        // });
                        // helperUtil.GenerateJSONAndXMLResponse(req, res, siteResponse, 200);
                    }
                    
                    if (response.data.data.singleInstancePlugins) {       
                        let siteApplicationList = response.data.data.singleInstancePlugins;                         
                        let disabledECSiteAppInfo = await commonDbAccess.DisableSiteApplicationInfo();
                        for (let i = 0; i < siteApplicationList.length; i++) {
                            //console.log("response.data.data.singleInstancePlugins",siteApplicationList[i]);
                            let ECSiteAppInfo = await commonDbAccess.InsertSiteApplicationInfo(siteApplicationList[i]);
                        }
                        let removeDisabledAppInfo = await commonDbAccess.RemoveDisabledSiteApplicationInfo();
                    } else {
                        let finalTree = [];
                        let disabledECSiteAppInfo = await commonDbAccess.DisableSiteApplicationInfo();
                        let removeDisabledAppInfo = await commonDbAccess.RemoveDisabledSiteApplicationInfo();
                        // let siteResponse = new roleModel.SiteResponse(null, finalTree);
                        // logger.info({
                        //     label: "GET Enterprise Sites",
                        //     message: "SUCCESS"
                        // });
                        // helperUtil.GenerateJSONAndXMLResponse(req, res, siteResponse, 200);
                    }
                    let siteInfo = await commonDbAccess.GetAllSite();        
                    let finalTree = [];
                    if (siteInfo[0].length > 0) {
                        let parentNode = siteInfo[0].filter(site => site.ParentNodeId === null);
                        for (let i = 0; i < parentNode.length; i++) {
                            let siteTree = await GenerateNode([parentNode[i]], siteInfo[0]);
                            finalTree.push(siteTree);
                        }
                        if(siteInfo[1].length >0){                           
                            let siteApplication = await GenerateApplicationNode(siteInfo[1]);
                            finalTree[0][0].Children=finalTree[0][0].Children.concat(siteApplication);
                        }
                    }   
                    let siteResponse = new roleModel.SiteResponse(null, finalTree);
                    logger.info({
                        label: "GET Enterprise Sites",
                        message: "SUCCESS"
                    });
                    helperUtil.GenerateJSONAndXMLResponse(req, res, siteResponse, 200);
                })).catch((error) => {
                    let errorMessage = new customError.ApplicationError("Not able to get Site Information!!");
                    logger.error({
                        label: "GET Sites",
                        message: errorMessage.Error.Message
                    });
                    let siteResponse = new roleModel.SiteResponse(errorMessage, null);
                    helperUtil.GenerateJSONAndXMLResponse(req, res, siteResponse, errorMessage.Status);
                });
            }
        } else {
            let errorMessage = new customError.ApplicationError("Request Body is Empty!!", 400);
            logger.error({
                label: "GET Enterprise Sites",
                message: errorMessage.Error.Message
            });
            let siteResponse = new roleModel.SiteResponse(errorMessage, null);
            helperUtil.GenerateJSONAndXMLResponse(req, res, siteResponse, 422);
        }

    } catch (err) {
        let errorMessage = new customError.ApplicationError(err);
        logger.error({
            label: "GET Sites",
            message: errorMessage.Error.Message
        });
        let siteResponse = new roleModel.SiteResponse(errorMessage, null);
        helperUtil.GenerateJSONAndXMLResponse(req, res, siteResponse, errorMessage.Status);
    }
}


/*
<summary> Helps to Validate Session Id from EC</summary>
<param name="req"> Request object </param>
<param name="res"> Response object </param>
<returns> Return Session Information </returns>
*/
async function validateSessionId(req, res) {
    try {
        logger.info({
            label: "Validate Session Information",
            message: "STARTED"
        });
        let sessionId = req.headers.sessionid;
        
        if (sessionId && sessionId === "") {
            let errorMessage = new customError.ApplicationError("Invalid Session ID", 422);
            logger.error({
                label: "Validate Session Information",
                message: errorMessage
            });
            let sessionResponse = new sessionModel.SessionInfoResponse(errorMessage, null);
            helperUtil.GenerateJSONAndXMLResponse(req, res, sessionResponse, errorMessage.Status);
        } else {
            axios.get(process.env.EC_Base_URL+':'+ process.env.EC_Port+process.env.EC_Session_Path, {
                    headers: {
                        'accesstoken': sessionId
                    }
                }).then((async (response) => {                   
                    if (response.data.data) {
                        let username = response.data.data.userName;
                        let sessionDetails={
                            Username:username
                        };
                        let sessionResponse = new sessionModel.SessionInfoResponse(null, sessionDetails);
                        logger.info({
                            label: "Validate Session Information",
                            message: "SUCCESS"
                        });
                        helperUtil.GenerateJSONAndXMLResponse(req, res, sessionResponse, 200);
                    } 
                })).catch((error) => {
                    let errorMessage = new customError.ApplicationError("Invalid Session",422);
                    logger.error({
                        label: "Validate Session Information",
                        message: errorMessage.Error.Message
                    });
                    let sessionResponse = new sessionModel.SessionInfoResponse(errorMessage, null);
                    helperUtil.GenerateJSONAndXMLResponse(req, res, sessionResponse, errorMessage.Status);
                });

        }
    } catch (error) {
        errorMessage = new customError.ApplicationError(error);
        logger.error({
            label: "GET Config Information",
            message: ldapDeletionResponse
        });
        let sessionResponse = new sessionModel.SessionInfoResponse(errorMessage, null);
        helperUtil.GenerateJSONAndXMLResponse(req, res, sessionResponse, errorMessage.Status);
    }
}

/* Generate Tree data object from EC response */
async function buildTreeObject(serviceData) {
    try {
        let nodeData = Array.isArray(serviceData) ? serviceData[0] : serviceData;
        //let totalObjectCount = Object.keys(nodeData).length; 
        // console.log("Nodedata-",nodeData);
        finalTreeData.push(nodeData);
        for (let i = 0; i < nodeData.children.length; i++) {
            buildTreeObject(nodeData.children[i]);
        }
    } catch (error) {
        return await finalTreeData;
    }

}

/*
<summary> Helps to Get Lockout Information </summary>
<param name="req"> Request object </param>
<param name="res"> Response object </param>
<returns> Return All Lockout information  </returns>
*/
async function getLockoutInfo(req, res) {
    try {
        logger.info({
            label: "GET Lockout Information",
            message: "STARTED"
        });      
        let lockoutDetails = await commonDbAccess.GetLockoutInfo();
        let lockoutResponse = new settingsModel.LockoutDetailsResponse(null, lockoutDetails);
        logger.info({
            label: "Get Lockout Information",
            message: "SUCCESS"
        });
        helperUtil.GenerateJSONAndXMLResponse(req, res, lockoutResponse, 200);
    } catch (err) {
        let errorMessage = new customError.ApplicationError(err);
        logger.error({
            label: "GET Lockout Information",
            message: errorMessage.Error.Message
        });
        let lockoutResponse = new settingsModel.LockoutDetailsResponse(errorMessage, null);
        helperUtil.GenerateJSONAndXMLResponse(req, res, lockoutResponse, errorMessage.Status);
    }
}

/*
<summary> Helps to Get General Config Information </summary>
<param name="req"> Request object </param>
<param name="res"> Response object </param>
<returns> Return General Config information  </returns>
*/
async function getGeneralConfig(req, res) {
    try {
        logger.info({
            label: "GET General Configuration",
            message: "STARTED"
        });      
        let generalConfig = await commonDbAccess.GetGeneralConfig();
        if(generalConfig.length===0){
            generalConfig={
                LockoutPeriod:null,
                MaxRetires:null,
                MaxLoginAttempts:null
            };
        }
        else{
            generalConfig=generalConfig[0];
        }
        let generalConfigResponse = new settingsModel.GeneralConfigResponse(null, generalConfig);
        logger.info({
            label: "Get General Configuration",
            message: "SUCCESS"
        });
        helperUtil.GenerateJSONAndXMLResponse(req, res, generalConfigResponse, 200);
    } catch (err) {
        let errorMessage = new customError.ApplicationError(err);
        logger.error({
            label: "GET General Configuration",
            message: errorMessage.Error.Message
        });
        let generalConfigResponse = new settingsModel.GeneralConfigResponse(errorMessage, null);
        helperUtil.GenerateJSONAndXMLResponse(req, res, generalConfigResponse, errorMessage.Status);
    }
}


/*
<summary> Helps to Update General Config </summary>
<param name="req"> Request object </param>
<param name="res"> Response object </param>
<returns> Return Updated General Config </returns>
*/
async function updateGeneralConfig(req, res) {
    try {
        if (req.body) {
            logger.info({
                label: "Update General Config",
                message: "STARTED"
            });
            let bodyContent = JSON.stringify(req.body);
            var result = settingsValidator.GeneralConfigUpdateRequest.validate(req.body);
            if (result != "") {
                let errorMessage = new customError.ApplicationError(result.toString(), 422);
                logger.error({
                    label: "Update General Config",
                    message: errorMessage.Error.Message
                });
                let generalConfigUpdateResponse = new settingsModel.GeneralConfigUpdateResponse(errorMessage, null);                
                helperUtil.GenerateJSONAndXMLResponse(req, res, generalConfigUpdateResponse, errorMessage.Status);                
            } else {
                let configDetails = JSON.parse(bodyContent);
                let generalConfig = {
                    LockoutPeriod:configDetails.generalconfigupdaterequest.lockoutperiod,
                    MaxRetries:configDetails.generalconfigupdaterequest.maxretires,
                    MaxLoginAttempts:configDetails.generalconfigupdaterequest.maxloginattempts
                };
                let updatedConfig = await commonDbAccess.InsertGeneralConfig(generalConfig,req.username);
                logger.info({
                    label: "Update General Config",
                    message: "SUCCESS"
                });

                process.env.Max_Retires=parseInt(generalConfig.MaxRetries);
                process.env.Max_LoginAttempts= parseInt(generalConfig.MaxLoginAttempts);
                process.env.LockoutPeriod= parseInt(generalConfig.LockoutPeriod);

                let envConfig = dotenv.parse(fs.readFileSync('.env'));
                let fileContent='';
                for (let key in envConfig) {
                     envConfig[key] = process.env[key];
                    fileContent=fileContent+key +"="+envConfig[key] +"\n";
                }
                const data = fs.writeFileSync('.env', fileContent);

                let generalConfigUpdateResponse = new settingsModel.GeneralConfigUpdateResponse(null, updatedConfig[0]);
                helperUtil.GenerateJSONAndXMLResponse(req, res, generalConfigUpdateResponse, 200);    
            }
        } else {
            errorMessage = new customError.ApplicationError("Request Body is Empty!!");
            logger.error({
                label: "Update General Config",
                message: errorMessage.Error.Message
            });
            let generalConfigUpdateResponse = new settingsModel.GeneralConfigUpdateResponse(errorMessage, null);
            helperUtil.GenerateJSONAndXMLResponse(req, res, generalConfigUpdateResponse, errorMessage.Status);
        }
    } catch (error) {
        errorMessage = new customError.ApplicationError(error);
        logger.error({
            label: "Update General Config",
            message: errorMessage.Error.Message
        });
        let generalConfigUpdateResponse = new settingsModel.GeneralConfigUpdateResponse(errorMessage, null);
        helperUtil.GenerateJSONAndXMLResponse(req, res, generalConfigUpdateResponse, errorMessage.Status);
    }
}

/*
<summary> Helps to Validate Application </summary>
<param name="req"> Request object </param>
<param name="res"> Response object </param>
<returns> Return Application valid or not </returns>
*/
async function validateApplication(req, res) {
    try {
        if (req.body) {
            logger.info({
                label: "Validate Application",
                message: "STARTED"
            });
            let bodyContent = JSON.stringify(req.body);
            var result = applicationValidator.ValidateApplicationSchema.validate(req.body);
            if (result != "") {
                let errorMessage = new customError.ApplicationError(result.toString(), 422);
                logger.error({
                    label: "Validate Application",
                    message: errorMessage.Error.Message
                });
                let validateApplicationResponse = new applicationModel.ValidateApplicationResponse(errorMessage, false);                
                helperUtil.GenerateJSONAndXMLResponse(req, res, validateApplicationResponse, errorMessage.Status);                
            } else {
                let applicationTokenDetails = JSON.parse(bodyContent);
                let applicationToken= applicationTokenDetails.validateapplicationrequest.applicationtoken;
                const credentials = Buffer.from(applicationToken, 'base64').toString('ascii');
                const base64Value= Buffer.from(applicationToken, 'base64').toString('base64');
                const token = credentials.split(':');
                let applicationCode = "";
                let requestTime = "";
                let hashValue = "";
                let isValidApplication = false;
               if(applicationToken===base64Value){
                if (token.length >= 3) {
                    applicationCode = token[0];
                    hashValue = token[token.length - 1];
                    requestTime = token.slice(1, token.length - 1).join(':');
                    if (applicationCode != 'undefined' && requestTime != 'undefined' && hashValue != 'undefined') {
                        let timeDifference= moment().utc().diff(moment(requestTime).utc());
                        let duration = moment.duration(timeDifference);
                        let year = duration.years();
                        let month = duration.months();
                        let days =duration.days();
                        let hours = duration.hours();
                        let minutes= duration.minutes() + (hours*60);   
                                          
                        if(year===0 && month===0 && days===0 && minutes<=process.env.Application_Token_Validity )
                        {
                            const crypto = require('crypto');
                            let appDetails = await applicationDbAccess.GetAppDetailsByCode(applicationCode);
                            if (appDetails.length > 0) {
                                const hash = crypto.createHmac('sha256', appDetails[0].ApplicationSecret)
                                    .update(requestTime)
                                    .digest('hex');
                                if (hash === hashValue) {
                                    isValidApplication=true;
                                } else {
                                isValidApplication=false;
                                }
                            } 
                            logger.info({
                                label: "Validate Application",
                                message: "SUCCESS"
                            });
                        
                            let validateApplicationResponse = new applicationModel.ValidateApplicationResponse(null, isValidApplication);                
                            helperUtil.GenerateJSONAndXMLResponse(req, res, validateApplicationResponse, 200); 
                        }
                        else{
                            logger.info({
                                label: "Validate Application",
                                message: "SUCCESS"
                            });
                            let validateApplicationResponse = new applicationModel.ValidateApplicationResponse(null,isValidApplication );                
                            helperUtil.GenerateJSONAndXMLResponse(req, res, validateApplicationResponse, 200);
                        }  
                    } 
                    else{
                        logger.info({
                            label: "Validate Application",
                            message: "SUCCESS"
                        });
                        let validateApplicationResponse = new applicationModel.ValidateApplicationResponse(null,isValidApplication );                
                        helperUtil.GenerateJSONAndXMLResponse(req, res, validateApplicationResponse, 200);
                    }                     
                } else {
                    logger.info({
                        label: "Validate Application",
                        message: "SUCCESS"
                    });
                    let validateApplicationResponse = new applicationModel.ValidateApplicationResponse(null,isValidApplication );                
                    helperUtil.GenerateJSONAndXMLResponse(req, res, validateApplicationResponse, 200);
                } 
               }
               else {
                logger.info({
                    label: "Validate Application",
                    message: "SUCCESS"
                });
                let validateApplicationResponse = new applicationModel.ValidateApplicationResponse(null,isValidApplication );                
                helperUtil.GenerateJSONAndXMLResponse(req, res, validateApplicationResponse, 200);
            } 
                                             
            }
        } else {
            let errorMessage = new customError.ApplicationError("Request Body is Empty!!");
            logger.error({
                label: "Validate Application",
                message: errorMessage.Error.Message
            });
            let validateApplicationResponse = new applicationModel.ValidateApplicationResponse(errorMessage, false);                
            helperUtil.GenerateJSONAndXMLResponse(req, res, validateApplicationResponse, errorMessage.Status);
        }
    } catch (error) {
        let errorMessage = new customError.ApplicationError(error);
        logger.error({
            label: "Validate Application",
            message: errorMessage.Error.Message
        });
        let validateApplicationResponse = new applicationModel.ValidateApplicationResponse(errorMessage, false);                
        helperUtil.GenerateJSONAndXMLResponse(req, res, validateApplicationResponse, errorMessage.Status);
    }
}

// /*
// <summary> Helps to Get Key Information </summary>
// <param name="req"> Request object </param>
// <param name="res"> Response object </param>
// <returns> Return Key information  </returns>
// */
// async function getKeyInfo(req, res) {
//     try {
//         logger.info({
//             label: "GET Key Information",
//             message: "STARTED"
//         }); 
//         // var archiver = require('archiver');
//         // var archive = archiver('zip', {
//         //     zlib: { level: 9 } // Sets the compression level.
//         //   });

//         // var output = fs.createWriteStream('config/example.zip');
//         // //var file1 = 'config/file1.txt';
//         // archive.pipe(output);
//         // archive.append(process.env.encryptionkey, { name: 'file2.txt' });
//         // archive.finalize();

//         let keyInformationResponse = new settingsModel.KeyInformationResponse(null, process.env.encryptionkey);
//         logger.info({
//             label: "GET Key Information",
//             message: "SUCCESS"
//         });
       
//         helperUtil.GenerateJSONAndXMLResponse(req, res, keyInformationResponse, 200);
//     } catch (err) {
//         console.log(err);
//         let errorMessage = new customError.ApplicationError(err);
//         logger.error({
//             label: "GET Key Information",
//             message: errorMessage.Error.Message
//         });
//         let keyInformationResponse = new settingsModel.KeyInformationResponse(errorMessage, null);
//         helperUtil.GenerateJSONAndXMLResponse(req, res, keyInformationResponse, errorMessage.Status);
//     }
// }
/*
<summary> Helps to Get Key Info </summary>
<param name="req"> Request object </param>
<param name="res"> Response object </param>
<returns> Return Key Info </returns>
*/
async function getKeyInfo(req, res) {
    try {
        if (req.body) {
            logger.info({
                label: "GET Key Information",
                message: "STARTED"
            });
            let bodyContent = JSON.stringify(req.body);
            var result = settingsValidator.KeyInfoRequest.validate(req.body);
            if (result != "") {
                let errorMessage = new customError.ApplicationError(result.toString(), 422);
                logger.error({
                    label: "GET Key Information",
                    message: errorMessage.Error.Message
                });
                let keyInformationResponse = new settingsModel.KeyInformationResponse(errorMessage, null);
                helperUtil.GenerateJSONAndXMLResponse(req, res, keyInformationResponse, errorMessage.Status);                
            } else {
                let keyInfo = JSON.parse(bodyContent);
                let password = keyInfo.keyinforequest.password;
                let encryptedKey = helperUtil.EncryptDataWithPassword(process.env.encryptionkey,password);             
                logger.info({
                    label: "GET Key Information",
                    message: "SUCCESS"
                });

                let keyInformationResponse = new settingsModel.KeyInformationResponse(null,encryptedKey);
                helperUtil.GenerateJSONAndXMLResponse(req, res, keyInformationResponse, 200);    
            }
        } else {
            errorMessage = new customError.ApplicationError("Request Body is Empty!!");
            logger.error({
                label: "GET Key Information",
                message: errorMessage.Error.Message
            });
            let keyInformationResponse = new settingsModel.KeyInformationResponse(errorMessage, null);
            helperUtil.GenerateJSONAndXMLResponse(req, res, keyInformationResponse, errorMessage.Status);  
        }
    } catch (error) {
        errorMessage = new customError.ApplicationError(error);
        logger.error({
            label: "GET Key Information",
            message: errorMessage.Error.Message
        });
        let keyInformationResponse = new settingsModel.KeyInformationResponse(errorMessage, null);
        helperUtil.GenerateJSONAndXMLResponse(req, res, keyInformationResponse, errorMessage.Status);  
    }
}


/*
<summary> Helps to Update Key Information </summary>
<param name="req"> Request object </param>
<param name="res"> Response object </param>
<returns> Return Status of Upload valid or not </returns>
*/
// async function updateKeyInfo(req, res) {
//     try {
//         if (req.body) {
//             logger.info({
//                 label: "Update Key Information",
//                 message: "STARTED"
//             });
//             let bodyContent = JSON.stringify(req.body);
//             var result = settingsValidator.KeyUpdateRequest.validate(req.body);
//             if (result != "") {
//                 let errorMessage = new customError.ApplicationError(result.toString(), 422);
//                 logger.error({
//                     label: "Update Key Information",
//                     message: errorMessage.Error.Message
//                 });
//                 let updateKeyInfoResponse = new settingsModel.UpdateKeyInfoResponse(errorMessage, null);                
//                 helperUtil.GenerateJSONAndXMLResponse(req, res, updateKeyInfoResponse, errorMessage.Status);                
//             } else {
//                 let isUpdateSuccess=false;
//                 let keyInfo = JSON.parse(bodyContent);
//                 let key = keyInfo.updatekeyinforequest.key;
//                 let keyPassword = keyInfo.updatekeyinforequest.password;
//                 let decryptKey= await helperUtil.DecryptDataWithPassword(key,keyPassword);
//                 let dbKeyInfo= await commonDbAccess.GetKeyInfo();
//                 if(dbKeyInfo.length>0){
//                     let hashDecryptedKey= await helperUtil.GetPasswordHash(decryptKey,dbKeyInfo[0].KeySalt);
//                     if(hashDecryptedKey===dbKeyInfo[0].KeyHash){
//                         isUpdateSuccess=true;
//                         logger.info({
//                             label: "Update Key Information",
//                             message: "SUCCESS"
//                         });
//                         let updateKeyInfoResponse = new settingsModel.UpdateKeyInfoResponse(null, isUpdateSuccess);                
//                         helperUtil.GenerateJSONAndXMLResponse(req, res, updateKeyInfoResponse, 200); 
//                     }
//                     else{
//                         errorMessage = new customError.ApplicationError("Invalid Key!!");
//                         logger.error({
//                             label: "Update Key Information",
//                             message: errorMessage.Error.Message
//                         });
//                         let updateKeyInfoResponse = new settingsModel.UpdateKeyInfoResponse(errorMessage, null);                
//                         helperUtil.GenerateJSONAndXMLResponse(req, res, updateKeyInfoResponse, errorMessage.Status);
//                     }
//                 }
//                 else{
//                     errorMessage = new customError.ApplicationError("Internal Server Error");
//                     logger.error({
//                         label: "Update Key Information",
//                         message: errorMessage.Error.Message
//                     });
//                     let updateKeyInfoResponse = new settingsModel.UpdateKeyInfoResponse(errorMessage, null);                
//                     helperUtil.GenerateJSONAndXMLResponse(req, res, updateKeyInfoResponse, errorMessage.Status); 
//                 }           
//             }
//         } else {
//             errorMessage = new customError.ApplicationError("Request Body is Empty!!");
//             logger.error({
//                 label: "Update Key Information",
//                 message: errorMessage.Error.Message
//             });
//             let updateKeyInfoResponse = new settingsModel.UpdateKeyInfoResponse(errorMessage, null);                
//             helperUtil.GenerateJSONAndXMLResponse(req, res, updateKeyInfoResponse, errorMessage.Status); 
//         }
//     } catch (error) {
//         errorMessage = new customError.ApplicationError(error);
//         logger.error({
//             label: "Update Key Information",
//             message: errorMessage.Error.Message
//         });
//         let updateKeyInfoResponse = new settingsModel.UpdateKeyInfoResponse(errorMessage, null);                
//         helperUtil.GenerateJSONAndXMLResponse(req, res, updateKeyInfoResponse, errorMessage.Status); 
//     }
// }

/*
<summary> Helps to Get Receive Site Information from EC </summary>
<param name="req"> Request object </param>
<param name="res"> Response object </param>
<returns> Return Status  </returns>
*/
async function receiveEnterpriseSites(req, res) {
    try {
        if (req.body) {
            logger.info({
                label: "POST Enterprise Sites",
                message: "STARTED"
            });
            let bodyContent = JSON.stringify(req.body);
            var result = settingsValidator.EnterpriseSiteInfo.validate(req.body);
            if (result != "") {
                let errorMessage = new customError.ApplicationError(result.toString(), 422);
                let siteResponse = new roleModel.SiteInfoResponse(errorMessage, null);
                logger.error({
                    label: "POST Enterprise Sites",
                    message: errorMessage.Error.Message
                });
                helperUtil.GenerateJSONAndXMLResponse(req, res, siteResponse, errorMessage.Status);
            } else {
                let response=JSON.parse(bodyContent);
                //console.log("response",response);
                    if (response.data.hierarchyTree) {       
                        finalTreeData=[];     
                        let treeData = await buildTreeObject(response.data.hierarchyTree);
                        //console.log("finalTreeData",finalTreeData);
                        let disabledECSiteInfo = await commonDbAccess.DisableSiteInfo();
                        for (let i = 0; i < finalTreeData.length; i++) {
                            let ECSiteInfo = await commonDbAccess.InsertSiteInfo(finalTreeData[i]);
                        }
                        let removeDisabledInfo = await commonDbAccess.RemoveDisabledSiteInfo();
                    } else {
                        let finalTree = [];
                        let disabledECSiteInfo = await commonDbAccess.DisableSiteInfo();
                        let removeDisabledInfo = await commonDbAccess.RemoveDisabledSiteInfo();
                    }
                    
                    if (response.data.singleInstancePlugins) {       
                        let siteApplicationList = response.data.singleInstancePlugins;                         
                        let disabledECSiteAppInfo = await commonDbAccess.DisableSiteApplicationInfo();
                        for (let i = 0; i < siteApplicationList.length; i++) {
                            //console.log("response.data.data.singleInstancePlugins",siteApplicationList[i]);
                            let ECSiteAppInfo = await commonDbAccess.InsertSiteApplicationInfo(siteApplicationList[i]);
                        }
                        let removeDisabledAppInfo = await commonDbAccess.RemoveDisabledSiteApplicationInfo();
                    } else {
                        let finalTree = [];
                        let disabledECSiteAppInfo = await commonDbAccess.DisableSiteApplicationInfo();
                        let removeDisabledAppInfo = await commonDbAccess.RemoveDisabledSiteApplicationInfo();
                    }
                    let siteResponse = new roleModel.SiteInfoResponse(null, "Success");
                    logger.info({
                        label: "POST Enterprise Sites",
                        message: "SUCCESS"
                    });
                    helperUtil.GenerateJSONAndXMLResponse(req, res, siteResponse, 200);
                }
            }
         else {
            let errorMessage = new customError.ApplicationError("Request Body is Empty!!", 400);
            logger.error({
                label: "POST Enterprise Sites",
                message: errorMessage.Error.Message
            });
            let siteResponse = new roleModel.SiteInfoResponse(errorMessage, null);
            helperUtil.GenerateJSONAndXMLResponse(req, res, siteResponse, 422);
        }

    } catch (err) {
        let errorMessage = new customError.ApplicationError(err);
        logger.error({
            label: "POST Enterprise Sites",
            message: errorMessage.Error.Message
        });
        let siteResponse = new roleModel.SiteInfoResponse(errorMessage, null);
        helperUtil.GenerateJSONAndXMLResponse(req, res, siteResponse, errorMessage.Status);
    }
}

/*
<summary> Helps to Get Notification Information from EC </summary>
<param name="req"> Request object </param>
<param name="res"> Response object </param>
<returns> Return Notification information  </returns>
*/
async function getNotificationInfo(req, res) {
    try {
        logger.info({
            label: "GET Notification Information",
            message: "STARTED"
        });      
        //console.log("Notification Call");
        axios.get(process.env.EC_Base_URL+':'+ process.env.EC_Port + process.env.EC_Notification_Path, {
            headers: {
                'accesstoken': req.headers.sessionid
            }
        }).then((async (response) => {                   
            if (response.data) {
                //console.log("response",response);
                let notificationUrl = (response.data.data.notificationViewerUiUrl)?response.data.data.notificationViewerUiUrl:"";                
                //console.log("notificationUrl",notificationUrl);
                let notificationResponse = new sessionModel.NotificationInfoResponse(null, notificationUrl);
                logger.info({
                    label: "GET Notification Information",
                    message: "SUCCESS"
                });
                helperUtil.GenerateJSONAndXMLResponse(req, res, notificationResponse, 200);
            } 
        })).catch((error) => {
            console.log("Error",error);
            let errorMessage = new customError.ApplicationError("Not able to get Notification Information.",422);
            logger.error({
                label: "GET Notification Information",
                message: errorMessage.Error.Message
            });
            let notificationResponse = new sessionModel.NotificationInfoResponse(errorMessage, null);
            helperUtil.GenerateJSONAndXMLResponse(req, res, notificationResponse, errorMessage.Status);
        });       
    } catch (err) {
        let errorMessage = new customError.ApplicationError(err);
        logger.error({
            label: "GET Notification Information",
            message: errorMessage.Error.Message
        });
        let notificationResponse = new sessionModel.NotificationInfoResponse(errorMessage, null);
        helperUtil.GenerateJSONAndXMLResponse(req, res, notificationResponse, errorMessage.Status);
    }
}


module.exports = {
    GetAllApplications: getAllApplications,
    GetAllRoles: getAllRoles,
    GetAllUsers: getAllUsers,
    GetUserInfo: getUserInfo,
    GetAllApplicationsPrivileges: getAllApplicationsPrivileges,
    GetRolesPrivileges: getRolesPrivileges,
    GetRoleInfo: getRoleInfo,
    GetLdapInfo: getAllLdapGroups,
    GetAllSiteRoles: getAllSiteRoles,
    GetAllSiteUsers: getAllSiteUsers,
    GetAllSiteLdapGroups: getAllSiteLdapGroups,
    GetPrivilegesRoles: getPrivilegesRoles,
    GetPrivilegesUsers: getPrivilegesUsers,
    GetPrivilegesLdapGroups: getPrivilegesLdapGroups,
    GetAllSite: getAllSite,
    GetAllLdapInfo: getAllLdapInfo,
    GetAllImprivataInfo: getAllImprivataInfo,
    GetLdapGroupsById: getLdapGroupsById,
    GetLdapGroupUsers: getLdapGroupUsers,
    GetSecurityModelInfo: getSecurityModelInfo,
    UpdateSecurityModelInfo: updateSecurityModelInfo,
    GetConfigInfo: getConfigInfo,
    GetEnterpriseSites: getEnterpriseSites,
    ValidateSessionId: validateSessionId,
    GetLockoutInfo:getLockoutInfo,
    GetGeneralConfig:getGeneralConfig,
    UpdateGeneralConfig:updateGeneralConfig,
    ValidateApplication:validateApplication,
    GetKeyInfo:getKeyInfo,
    //UpdateKeyInfo:updateKeyInfo,
    ReceiveEnterpriseSites:receiveEnterpriseSites,
    GetNotificationInfo:getNotificationInfo
};