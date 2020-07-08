/* Declare required npm packages */

/* Declare Common functions */
var helperUtil = require('../utils/helper.utils');

/* Declare Validators */
var roleDetails = require('../validators/role.validator');

/* Declare Model class */
var roleModel = require('../models/role.model');

/* Custom Error */
var customError = require('../errors/custom.error');

/* Database Access */
var roleDbAccess = require('../dataaccess/role.dbaccess');

/* Logging */
var logger=require('../utils/logger.utils');


// /*
// <summary> Helps to Register Role </summary>
// <param name="req"> Request object </param>
// <param name="res"> Response object </param>
// <param name="next"> next middleware function </param>
// <returns> Return Role Registration Response  </returns>
// */
// async function registerRole(req, res) {
//     try {
//         if (req.body) {
//             logger.info({label:"Register Role",message:"STARTED"});
//             let bodyContent = JSON.stringify(req.body);
//             var result = roleDetails.RoleArrayRegistration.validate(req.body);
//             result = (result != "") ? roleDetails.RoleRegistration.validate(JSON.parse(bodyContent)) : result;
//             if (result != "") {
//                 //result = roleDetails.RoleRegistration.validate(JSON.parse(tempBody));
//                 let errorMessage = new customError.ApplicationError(result.toString(), 422);
//                 logger.error({label:"Register Role",message:errorMessage});
//                 helperUtil.GenerateJSONAndXMLResponse(req, res, errorMessage, errorMessage.Status);
//             } else {
//                 //let roleDetails = req.body;
//                 let roleDetails = JSON.parse(bodyContent);
//                 let roleResponse = [];
//                 if (roleDetails.roleregistration.role.length > 0) {
//                     for (let index = 0; index < roleDetails.roleregistration.role.length; index++) {
//                         let role = roleDetails.roleregistration.role[index];
//                         let insertedRoleDetails = await roleDbAccess.InsertRoleDetails(role);
//                         roleResponse.push(insertedRoleDetails);
//                     }
//                 } else {
//                     let role = roleDetails.roleregistration.role;
//                     let insertedRoleDetails = await roleDbAccess.InsertRoleDetails(role);
//                     roleResponse.push(insertedRoleDetails);
//                 }

//                 var result = new roleModel.RegistrationResponse(roleResponse);
//                 logger.info({label:"Register Role",message:"SUCCESS"});
//                 helperUtil.GenerateJSONAndXMLResponse(req, res, result, 200);
//             }
//         } else {
//             roleRegistrationResponse = new customError.ApplicationError("Request Body is Empty!!");
//             logger.error({label:"Register Role",message:roleRegistrationResponse});
//             helperUtil.GenerateJSONAndXMLResponse(req, res, roleRegistrationResponse, roleRegistrationResponse.Status);
//         }
//     } catch (error) {
//         roleRegistrationResponse = new customError.ApplicationError(error);
//         logger.error({label:"Register Role",message:roleRegistrationResponse});
//         helperUtil.GenerateJSONAndXMLResponse(req, res, roleRegistrationResponse, roleRegistrationResponse.Status);
//     }
// }

/*
<summary> Helps to Register Role Information </summary>
<param name="req"> Request object </param>
<param name="res"> Response object </param>
<returns> Return Role Registration Response  </returns>
*/
async function registerRoleInfo(req, res) {
    try {
        if (req.body) {
            logger.info({label:"Register Role Information",message:"STARTED"});
            let bodyContent = JSON.stringify(req.body);
            var result = roleDetails.RoleInfoRegistration.validate(req.body);
            if (result != "") {
                let errorMessage = new customError.ApplicationError(result.toString(), 422);
                let roleRegistrationResponse = new roleModel.RoleInfoRegistrationResponse(errorMessage,null);
                logger.error({label:"Register Role Information",message:errorMessage.Error.Message});
                helperUtil.GenerateJSONAndXMLResponse(req, res, roleRegistrationResponse, errorMessage.Status);
            } else {
                let roleBodyDetails = JSON.parse(bodyContent);

                // Security Model - LDAP or ISAS                
                let securityModel= roleBodyDetails.roleregistration.securitymodel;     
                
                // Site Information
                let siteDetails = roleBodyDetails.roleregistration.sitedetails;
                let roleMappedSites = [];
                if (siteDetails != undefined) {
                    let siteBody = JSON.stringify(siteDetails);
                    var siteResult = roleDetails.SiteArrayInfo.validate(JSON.parse(siteBody));
                    siteResult = (siteResult != "") ? roleDetails.SiteInfo.validate(JSON.parse(siteBody)) : siteResult;
                    if (siteResult != "") {
                        let errorMessage = new customError.ApplicationError(siteResult.toString(), 422);
                        let roleRegistrationResponse = new roleModel.RoleInfoRegistrationResponse(errorMessage,null);
                        logger.error({label:"Register Role Information",message:errorMessage.Error.Message});
                        helperUtil.GenerateJSONAndXMLResponse(req, res, roleRegistrationResponse, errorMessage.Status);
                    } else {
                        if (Array.isArray(roleBodyDetails.roleregistration.sitedetails.site)) {
                            roleMappedSites = roleBodyDetails.roleregistration.sitedetails.site;
                        } else {
                            roleMappedSites.push(roleBodyDetails.roleregistration.sitedetails.site);
                        }
                    }                   
                }
                
                // Privilege Information
                let privilegeDetails= roleBodyDetails.roleregistration.privilegedetails;
                let roleMappedPrivileges = [];
                if (privilegeDetails != undefined) {
                    let privilegeBody = JSON.stringify(privilegeDetails);
                    var privilegeResult = roleDetails.PrivilegeArrayInfo.validate(JSON.parse(privilegeBody));
                    privilegeResult = (privilegeResult != "") ? roleDetails.PrivilegeInfo.validate(JSON.parse(privilegeBody)) : privilegeResult;
                    if (privilegeResult != "") {
                        let errorMessage = new customError.ApplicationError(privilegeResult.toString(), 422);
                        let roleRegistrationResponse = new roleModel.RoleInfoRegistrationResponse(errorMessage,null);
                        logger.error({label:"Register Role Information",message:errorMessage.Error.Message});
                        helperUtil.GenerateJSONAndXMLResponse(req, res, roleRegistrationResponse, errorMessage.Status);
                    } else {
                        if (Array.isArray(roleBodyDetails.roleregistration.privilegedetails.privilege)) {
                            roleMappedPrivileges = roleBodyDetails.roleregistration.privilegedetails.privilege;
                        } else {
                            roleMappedPrivileges.push(roleBodyDetails.roleregistration.privilegedetails.privilege);
                        }
                    }                    
                }

                // Group Information
                let groupDetails= roleBodyDetails.roleregistration.groupdetails;
                let roleMappedGroups = [];
                if (groupDetails != undefined) {
                    let groupBody = JSON.stringify(groupDetails);
                    var groupResult = roleDetails.GroupArrayInfo.validate(JSON.parse(groupBody));
                    groupResult = (groupResult != "") ? roleDetails.GroupInfo.validate(JSON.parse(groupBody)) : groupResult;
                    if (groupResult != "") {
                        let errorMessage = new customError.ApplicationError(groupResult.toString(), 422);
                        let roleRegistrationResponse = new roleModel.RoleInfoRegistrationResponse(errorMessage,null);
                        logger.error({label:"Register Role Information",message:errorMessage.Error.Message});
                        helperUtil.GenerateJSONAndXMLResponse(req, res, roleRegistrationResponse, errorMessage.Status);
                    } else {
                        if (Array.isArray(roleBodyDetails.roleregistration.groupdetails.group)) {
                            roleMappedGroups = roleBodyDetails.roleregistration.groupdetails.group;
                        } else {
                            roleMappedGroups.push(roleBodyDetails.roleregistration.groupdetails.group);
                        }
                    }                    
                }

                // User Information
                let userDetails= roleBodyDetails.roleregistration.userdetails;
                let roleMappedUsers = [];
                if (userDetails != undefined) {
                    let userBody = JSON.stringify(userDetails);
                    var userResult = roleDetails.UserArrayInfo.validate(JSON.parse(userBody));
                    userResult = (userResult != "") ? roleDetails.UserInfo.validate(JSON.parse(userBody)) : userResult;
                    if (userResult != "") {
                        let errorMessage = new customError.ApplicationError(userResult.toString(), 422);
                        let roleRegistrationResponse = new roleModel.RoleInfoRegistrationResponse(errorMessage,null);
                        logger.error({label:"Register Role Information",message:errorMessage.Error.Message});
                        helperUtil.GenerateJSONAndXMLResponse(req, res, roleRegistrationResponse, errorMessage.Status);
                    } else {
                        if (Array.isArray(roleBodyDetails.roleregistration.userdetails.user)) {
                            roleMappedUsers = roleBodyDetails.roleregistration.userdetails.user;
                        } else {
                            roleMappedUsers.push(roleBodyDetails.roleregistration.userdetails.user);
                        }
                    }                    
                }

                let role = roleBodyDetails.roleregistration.role;

                let existingRoleDetails = await roleDbAccess.GetRoleDetailsByName(role.name);
                if (existingRoleDetails.length > 0) {
                    let errorMessage = new customError.ApplicationError("Role already available!!", 422);
                    let roleRegistrationResponse = new roleModel.RoleInfoRegistrationResponse(errorMessage,null);
                    logger.error({label:"Register Role Information",message:errorMessage.Error.Message});
                    helperUtil.GenerateJSONAndXMLResponse(req, res, roleRegistrationResponse, errorMessage.Status);
                } else {
                    let insertedRoleDetails = await roleDbAccess.InsertRoleDetails(role,req.username);                   
                    
                    let insertedSiteDetails = await roleDbAccess.InsertRoleSitesDetails(roleMappedSites, insertedRoleDetails.RoleId, req.username);
                    
                    let insertedPrivilegeDetails = await roleDbAccess.InsertRolePrivilegesDetails(roleMappedPrivileges, insertedRoleDetails.RoleId, req.username);
                    
                    if(securityModel==="LDAP" || securityModel==="Imprivata"){
                        let insertedGroupsDetails = await roleDbAccess.InsertRoleGroupsDetails(roleMappedGroups, insertedRoleDetails.RoleId, req.username);
                    }
                    else if(securityModel==="ISAS"){
                        let insertedUsersDetails = await roleDbAccess.InsertRoleUsersDetails(roleMappedUsers, insertedRoleDetails.RoleId, req.username);
                    }
                    if (insertedRoleDetails) {
                        //var result = new roleModel.RoleInfoRegistrationResponse(insertedRoleDetails, insertedPrivilegeDetails.MappedPrivilegesDetails, insertedGroupsDetails.MappedGroupsDetails, insertedUsersDetails.MappedUsersDetails);
                        let result = new roleModel.RoleInfoRegistrationResponse(null,insertedRoleDetails);
                        logger.info({label:"Register Role Information",message:"SUCCESS"});
                        helperUtil.GenerateJSONAndXMLResponse(req, res, result, 200);
                    } else {
                        let errorMessage = new customError.ApplicationError("Role Not Saved Successfully. Please Try again Later.");
                        let roleRegistrationResponse = new roleModel.RoleInfoRegistrationResponse(errorMessage,null);
                        logger.error({label:"Register Role Information",message:errorMessage.Error.Message});
                        helperUtil.GenerateJSONAndXMLResponse(req, res, roleRegistrationResponse, errorMessage.Status);
                    }
                }
            }
        } else {
            let errorMessage = new customError.ApplicationError("Request Body is Empty!!",400);
            let roleRegistrationResponse = new roleModel.RoleInfoRegistrationResponse(errorMessage,null);
            logger.error({label:"Register Role Information",message:errorMessage.Error.Message});
            helperUtil.GenerateJSONAndXMLResponse(req, res, roleRegistrationResponse, errorMessage.Status);
        }
    } catch (error) {
        let errorMessage = new customError.ApplicationError(error);
        let roleRegistrationResponse = new roleModel.RoleInfoRegistrationResponse(errorMessage,null);
        logger.error({label:"Register Role Information",message:errorMessage.Error.Message});
        helperUtil.GenerateJSONAndXMLResponse(req, res, roleRegistrationResponse, errorMessage.Status);
    }
}

/*
<summary> Helps to Update Role Information </summary>
<param name="req"> Request object </param>
<param name="res"> Response object </param>
<returns> Return Role Updated Response  </returns>
*/
async function updateRoleInfo(req, res) {
    try {
        if (req.body) {
            logger.info({label:"Update Role Information",message:"STARTED"});
            let bodyContent = JSON.stringify(req.body);
            // var result = roleDetails.RoleInfoArrayUpdation.validate(req.body);
            // result = (result != "") ? roleDetails.RoleInfoUpdation.validate(JSON.parse(bodyContent)) : result;
            var result = roleDetails.RoleInfoUpdation.validate(req.body);
            if (result != "") {
                let errorMessage = new customError.ApplicationError(result.toString(), 422);
                let roleUpdateResponse = new roleModel.RoleInfoUpdateResponse(errorMessage,null);
                logger.error({label:"Update Role Information",message:errorMessage.Error.Message});
                helperUtil.GenerateJSONAndXMLResponse(req, res, roleUpdateResponse, errorMessage.Status);
            } else {
                let roleBodyDetails = JSON.parse(bodyContent);

                // Security Model - LDAP or ISAS                
                let securityModel= roleBodyDetails.roleupdate.securitymodel;  

                 // Site Information
                 let siteDetails = roleBodyDetails.roleupdate.sitedetails;
                 let roleMappedSites = [];
                 if (siteDetails != undefined) {
                     let siteBody = JSON.stringify(siteDetails);
                     var siteResult = roleDetails.SiteArrayInfo.validate(JSON.parse(siteBody));
                     siteResult = (siteResult != "") ? roleDetails.SiteInfo.validate(JSON.parse(siteBody)) : siteResult;
                     if (siteResult != "") {
                        let errorMessage = new customError.ApplicationError(siteResult.toString(), 422);
                        let roleUpdateResponse = new roleModel.RoleInfoUpdateResponse(errorMessage,null);
                        logger.error({label:"Update Role Information",message:errorMessage.Error.Message});
                        helperUtil.GenerateJSONAndXMLResponse(req, res, roleUpdateResponse, errorMessage.Status);
                     } else {
                         if (Array.isArray(roleBodyDetails.roleupdate.sitedetails.site)) {
                             roleMappedSites = roleBodyDetails.roleupdate.sitedetails.site;
                         } else {
                             roleMappedSites.push(roleBodyDetails.roleupdate.sitedetails.site);
                         }
                     }                   
                 }                 
                 // Privilege Information
                 let privilegeDetails= roleBodyDetails.roleupdate.privilegedetails;
                 let roleMappedPrivileges = [];
                 if (privilegeDetails != undefined) {
                     let privilegeBody = JSON.stringify(privilegeDetails);
                     var privilegeResult = roleDetails.PrivilegeArrayInfo.validate(JSON.parse(privilegeBody));
                     privilegeResult = (privilegeResult != "") ? roleDetails.PrivilegeInfo.validate(JSON.parse(privilegeBody)) : privilegeResult;
                     if (privilegeResult != "") {
                        let errorMessage = new customError.ApplicationError(privilegeResult.toString(), 422);
                        let roleUpdateResponse = new roleModel.RoleInfoUpdateResponse(errorMessage,null);
                        logger.error({label:"Update Role Information",message:errorMessage.Error.Message});
                        helperUtil.GenerateJSONAndXMLResponse(req, res, roleUpdateResponse, errorMessage.Status);
                     } else {
                         if (Array.isArray(roleBodyDetails.roleupdate.privilegedetails.privilege)) {
                             roleMappedPrivileges = roleBodyDetails.roleupdate.privilegedetails.privilege;
                         } else {
                             roleMappedPrivileges.push(roleBodyDetails.roleupdate.privilegedetails.privilege);
                         }
                     }                    
                 }

                 // Group Information
                let groupDetails = roleBodyDetails.roleupdate.groupdetails;
                let roleMappedGroups = [];
                if (groupDetails != undefined) {
                    let groupBody = JSON.stringify(groupDetails);
                    var groupResult = roleDetails.GroupArrayInfo.validate(JSON.parse(groupBody));
                    groupResult = (groupResult != "") ? roleDetails.GroupInfo.validate(JSON.parse(groupBody)) : groupResult;
                    if (groupResult != "") {
                        let errorMessage = new customError.ApplicationError(groupResult.toString(), 422);
                        let roleUpdateResponse = new roleModel.RoleInfoUpdateResponse(errorMessage,null);
                        logger.error({label:"Update Role Information",message:errorMessage.Error.Message});
                        helperUtil.GenerateJSONAndXMLResponse(req, res, roleUpdateResponse, errorMessage.Status);
                    } else {
                        // let groupDetails = JSON.parse(groupBody);
                        // let isGroupArray = Array.isArray(groupDetails.group);

                        // if (isGroupArray) {
                        //     roleMappedGroups = groupDetails.group;
                        // } else {
                        //     roleMappedGroups.push(groupDetails.group);
                        // }
                        if (Array.isArray(roleBodyDetails.roleupdate.groupdetails.group)) {
                            roleMappedGroups = roleBodyDetails.roleupdate.groupdetails.group;
                        } else {
                            roleMappedGroups.push(roleBodyDetails.roleupdate.groupdetails.group);
                        }
                    }
                }

                // User Information
                let userDetails = roleBodyDetails.roleupdate.userdetails;
                let roleMappedUsers = [];
                if (userDetails != undefined) {
                    let userBody = JSON.stringify(userDetails);
                    var userResult = roleDetails.UserArrayInfo.validate(JSON.parse(userBody));
                    userResult = (userResult != "") ? roleDetails.UserInfo.validate(JSON.parse(userBody)) : userResult;
                    if (userResult != "") {
                        let errorMessage = new customError.ApplicationError(userResult.toString(), 422);
                        let roleUpdateResponse = new roleModel.RoleInfoUpdateResponse(errorMessage,null);
                        logger.error({label:"Update Role Information",message:errorMessage.Error.Message.Error.Message});
                        helperUtil.GenerateJSONAndXMLResponse(req, res, roleUpdateResponse, errorMessage.Status);

                    } else {
                        // let userDetails = JSON.parse(userBody);
                        // let isUserArray = Array.isArray(userDetails.user);

                        // if (isUserArray) {
                        //     roleMappedUsers = userDetails.user;
                        // } else {
                        //     roleMappedUsers.push(userDetails.user);
                        // }
                        if (Array.isArray(roleBodyDetails.roleupdate.userdetails.user)) {
                            roleMappedUsers = roleBodyDetails.roleupdate.userdetails.user;
                        } else {
                            roleMappedUsers.push(roleBodyDetails.roleupdate.userdetails.user);
                        }
                    }
                }

                let role = roleBodyDetails.roleupdate.role;
                
                let existingRoleDetails = await roleDbAccess.CheckRoleDetails(role);
                //let existingRoleDetails = await roleDbAccess.GetRoleDetailsByName(role.name);
                if (existingRoleDetails.Role.length > 0) {
                    let errorMessage = new customError.ApplicationError("Role already available!!", 422);
                    logger.error({label:"Update Role Information",message:errorMessage.Error.Message});
                    let roleUpdateResponse = new roleModel.RoleInfoUpdateResponse(errorMessage,null);
                    helperUtil.GenerateJSONAndXMLResponse(req, res, roleUpdateResponse, errorMessage.Status);
                } else {
                    let updatedRoleDetails = await roleDbAccess.UpdateRoleDetails(role, req.username);  

                    // let roleMappedPrivileges = [];
                    // if (roleBodyDetails.roleupdate.privilegedetails) {
                    //     if (Array.isArray(roleBodyDetails.roleupdate.privilegedetails.privilege)) {
                    //         roleMappedPrivileges = roleBodyDetails.roleupdate.privilegedetails.privilege;
                    //     } else {
                    //         roleMappedPrivileges.push(roleBodyDetails.roleupdate.privilegedetails.privilege);
                    //     }
                    // }

                    // let updatedPrivilegeDetails = await roleDbAccess.InsertRolePrivilegesDetails(roleMappedPrivileges, updatedRoleDetails.RoleId);

                    // let updatedGroupsDetails = await roleDbAccess.InsertRoleGroupsDetails(roleMappedGroups, updatedRoleDetails.RoleId);

                    // let updatedUsersDetails = await roleDbAccess.InsertRoleUsersDetails(roleMappedUsers, updatedRoleDetails.RoleId);

                    let updatedSiteDetails = await roleDbAccess.InsertRoleSitesDetails(roleMappedSites, updatedRoleDetails.RoleId,req.username);
                    
                    let updatedPrivilegeDetails = await roleDbAccess.InsertRolePrivilegesDetails(roleMappedPrivileges, updatedRoleDetails.RoleId, req.username);
                   
                    if(securityModel==="LDAP" || securityModel==="Imprivata"){
                        let updatedGroupsDetails = await roleDbAccess.InsertRoleGroupsDetails(roleMappedGroups, updatedRoleDetails.RoleId, req.username);
                    }
                    else if(securityModel==="ISAS"){
                        let updatedUsersDetails = await roleDbAccess.InsertRoleUsersDetails(roleMappedUsers, updatedRoleDetails.RoleId, req.username);
                    }

                    if (updatedRoleDetails) {
                    //  var result = new roleModel.RoleInfoRegistrationResponse(updatedRoleDetails, updatedPrivilegeDetails.MappedPrivilegesDetails, updatedGroupsDetails.MappedGroupsDetails,updatedUsersDetails.MappedUsersDetails);
                        var result = new roleModel.RoleInfoUpdateResponse(null,updatedRoleDetails);
                        logger.info({label:"Update Role Information",message:"SUCCESS"});
                        helperUtil.GenerateJSONAndXMLResponse(req, res, result, 200);
                    } else {
                        let errorMessage = new customError.ApplicationError("Role Not Updated Successfully. Please Try again Later.");
                        logger.error({label:"Update Role Information",message:errorMessage.Error.Message});
                        let roleUpdateResponse = new roleModel.RoleInfoUpdateResponse(errorMessage,null);
                        helperUtil.GenerateJSONAndXMLResponse(req, res, roleUpdateResponse, errorMessage.Status);
                    }
                }
            }
        } else {
            let errorMessage = new customError.ApplicationError("Request Body is Empty!!",400);
            logger.error({label:"Update Role Information",message:errorMessage.Error.Message});
            let roleUpdateResponse = new roleModel.RoleInfoUpdateResponse(errorMessage,null);
            helperUtil.GenerateJSONAndXMLResponse(req, res, roleUpdateResponse, errorMessage.Status);
        }
    } catch (error) {
        let errorMessage = new customError.ApplicationError(error);
        logger.error({label:"Update Role Information",message:errorMessage.Error.Message});
        let roleUpdateResponse = new roleModel.RoleInfoUpdateResponse(errorMessage,null);
        helperUtil.GenerateJSONAndXMLResponse(req, res, roleUpdateResponse, errorMessage.Status);
    }
}


/*
<summary> Helps to Delete Role Information </summary>
<param name="req"> Request object </param>
<param name="res"> Response object </param>
<returns> Return Role Deleted Response  </returns>
*/
async function deleteRoleInfo(req, res) {
    try {
        if (req.body) {
            logger.info({label:"Delete Role Information",message:"STARTED"});
            let bodyContent = JSON.stringify(req.body);
            var result = roleDetails.RoleInfoDeletion.validate(req.body);
            if (result != "") {
                let errorMessage = new customError.ApplicationError(result.toString(), 422);
                var roleDeleteResponse = new roleModel.RoleDeleteResponse(errorMessage,null);
                logger.error({label:"Delete Role Information",message:errorMessage.Error.Message});
                helperUtil.GenerateJSONAndXMLResponse(req, res, roleDeleteResponse, errorMessage.Status);
            } else {
                let roleBodyDetails = JSON.parse(bodyContent);

                let roleId = roleBodyDetails.roledeleterequest.roleid;
                if (isNaN(roleId)) {
                    let errorMessage = new customError.ApplicationError("Role Id must be a Number", 422);
                    let roleDeleteResponse = new roleModel.RoleDeleteResponse(errorMessage,null);
                    logger.error({label:"Delete Role Information",message:errorMessage.Error.Message});
                    helperUtil.GenerateJSONAndXMLResponse(req, res, roleDeleteResponse, errorMessage.Status);
                } else { 
                let deletedRoleDetails = await roleDbAccess.DeleteRoleDetails(roleId,req.username);
                if (deletedRoleDetails) {
                    var result = new roleModel.RoleDeleteResponse(null,deletedRoleDetails);
                    logger.info({label:"Delete Role Information",message:"SUCCESS"});
                    helperUtil.GenerateJSONAndXMLResponse(req, res, result, 200);
                } else {
                    let errorMessage = new customError.ApplicationError("Role Not Deleted. Please Try again Later.");
                    let roleDeleteResponse = new roleModel.RoleDeleteResponse(errorMessage,null);
                    logger.error({label:"Delete Role Information",message:errorMessage.Error.Message});
                    helperUtil.GenerateJSONAndXMLResponse(req, res, roleDeleteResponse, errorMessage.Status);
                }
            }
        }
        } else {
            let errorMessage = new customError.ApplicationError("Request Body is Empty!!",400);
            var roleDeleteResponse = new roleModel.RoleDeleteResponse(errorMessage,null);
            logger.error({label:"Delete Role Information",message:errorMessage.Error.Message});
            helperUtil.GenerateJSONAndXMLResponse(req, res, roleDeleteResponse, errorMessage.Status);
        }
    } catch (error) {
        let errorMessage = new customError.ApplicationError(error);
        var roleDeleteResponse = new roleModel.RoleDeleteResponse(errorMessage,null);
        logger.error({label:"Delete Role Information",message:errorMessage.Error.Message});
        helperUtil.GenerateJSONAndXMLResponse(req, res, roleDeleteResponse, errorMessage.Status);
    }
}


module.exports = {
    //RegisterRole: registerRole,
    RegisterRoleInfo: registerRoleInfo,
    UpdateRoleInfo: updateRoleInfo,
    DeleteRoleInfo: deleteRoleInfo
};