/* Declare required npm packages */
var sql = require('mssql');

/* Declare Database connection */
var dbConn = require('../dataaccess/sqlconnection');

/* Custom Error */
var customError = require('../errors/custom.error');

/* Declare Common functions */
var helperUtil = require('../utils/helper.utils');
/*
<summary> Helps to check user details into Database </summary>
<param name="userDetails"> User Details object </param>
<returns> Returns User details if available </returns>
*/

async function checkUserDetails(userDetails) {
    try {
        return await new sql.ConnectionPool(dbConn.Config).connect().then(async pool => {
            let dbResponse = await pool.request()
                .input('UserName', sql.NVarChar(userDetails.loginid.length), userDetails.loginid)
               // .input('EmailAddress', sql.NVarChar(userDetails.emailid.length), userDetails.emailid)
                .execute("usp_GetUsersDetails");
            sql.close();
            return {
                User: dbResponse.recordset
            };
        }).catch(err => {
            sql.close();
            throw new customError.ApplicationError(err);
        });
    } catch (err) {
        throw new customError.ApplicationError(err);
    }
}

/*
<summary> Helps to check user Username and Email into Database </summary>
<param name="userDetails"> User Details object </param>
<returns> Returns User details if available </returns>
*/

async function checkUsernameAndEmailDetails(userDetails) {
    try {
        return await new sql.ConnectionPool(dbConn.Config).connect().then(async pool => {
            let dbResponse = await pool.request()
                .input('UserName', sql.NVarChar(userDetails.loginid.length), userDetails.loginid)
               // .input('EmailAddress', sql.NVarChar(userDetails.emailid.length), userDetails.emailid)
                .input('UserId', sql.Int, parseInt(userDetails.userid))
                .execute("usp_CheckUsernameAndEmailDetails");
            sql.close();
            return {
                User: dbResponse.recordset
            };
        }).catch(err => {
            sql.close();
            throw new customError.ApplicationError(err);
        });
    } catch (err) {
        throw new customError.ApplicationError(err);
    }
}

/*
<summary> Helps to insert user details into Database </summary>
<param name="userDetails"> User Details object </param>
<returns> Returns inserted User details </returns>
*/

async function insertUserDetails(userDetails, createdBy, passwordData) {
    try {
        let middleName= (userDetails.middlename && userDetails.middlename.trim().length>0 && userDetails.middlename!=null)?helperUtil.EncryptData(userDetails.middlename):"";
        let middleNameLength= (middleName!="")?middleName.length:1;

        let firstName= helperUtil.EncryptData(userDetails.firstname);
        let lastName= helperUtil.EncryptData(userDetails.lastname);
        let mobileNumber= helperUtil.EncryptData(userDetails.mobilenumber);
        let emailId= helperUtil.EncryptData(userDetails.emailid);
        let passwordHash= helperUtil.EncryptData(passwordData.passwordHash);
        let passwordSalt= helperUtil.EncryptData(passwordData.salt);
        let username=userDetails.isemailselected === 'true'?userDetails.emailid:userDetails.loginid;
        return await new sql.ConnectionPool(dbConn.Config).connect().then(async pool => {
            let dbResponse = await pool.request()
                //.input('UserName', sql.NVarChar(userDetails.loginid.length), userDetails.loginid)
                .input('UserName', sql.NVarChar(username.length), username)
                .input('FirstName', sql.NVarChar(firstName.length), firstName)
                .input('MiddleName', sql.NVarChar(middleNameLength), middleName)
                .input('LastName', sql.NVarChar(lastName.length), lastName)
                .input('PhoneNumber',  sql.NVarChar(mobileNumber.length), mobileNumber)
                .input('EmailAddress', sql.NVarChar(emailId.length), emailId)
                .input('IsEmailSelected', sql.Bit, (userDetails.isemailselected === 'true' ? 1 : 0))
                .input('Password', sql.NVarChar(passwordHash.length), passwordHash)
                .input('PasswordSalt', sql.NVarChar(passwordSalt.length), passwordSalt)
                .input('IsAccountLocked', sql.Bit, (userDetails.isaccountlocked === 'true' ? 1 : 0))
                .input('IsDisabled', sql.Bit, (userDetails.isaccountdisabled === 'true') ? 1 : 0)
                .input('CreatedBy', sql.NVarChar(createdBy.length), createdBy)
                .execute("usp_InsertUserDetails");                
            sql.close();
            return {
                User: dbResponse.recordset
            };
        }).catch(err => {
            sql.close();
            throw new customError.ApplicationError(err);
        });
    } catch (err) {
        throw new customError.ApplicationError(err);
    }
}

/*
<summary> Helps to insert user Role details into Database </summary>
<param name="userRoleDetails"> User Role Details object </param>
<returns> Returns inserted User Roles details </returns>
*/

async function insertUserRolesDetails(userRolesDetails, userId, createdBy) {
    try {
        return await new sql.ConnectionPool(dbConn.Config).connect().then(async pool => {
            let dbResponse;
            dbResponse = await pool.request()
                .input('UserId', sql.INT, userId)
                .input('DisabledBy', sql.NVarChar(createdBy.length), createdBy)
                .execute("usp_DisableUserAllRoles");

            if (userRolesDetails.length > 0) {
                let mappedRoles = [];
                // userRolesDetails.forEach(async roleDetails => {
                for (let roleDetails of userRolesDetails) {
                    dbResponse = await pool.request()
                        .input('UserId', sql.INT, parseInt(userId))
                        .input('RoleId', sql.INT, parseInt(roleDetails.roleid))
                        .input('CreatedBy', sql.NVarChar(createdBy.length), createdBy)
                        .execute("usp_InsertUserRoleDetails");
                        mappedRoles.push(dbResponse.recordset[0]);
                }
                // });
                sql.close();
                return {
                    // User: dbResponse.recordset
                    User: mappedRoles
                };
            } else {
                sql.close();
                return {
                    User: []
                };
            }
        }).catch(err => {
            sql.close();
            throw new customError.ApplicationError(err);
        });
    } catch (err) {
        throw new customError.ApplicationError(err);
    }
}


/*
<summary> Helps to Update user details into Database </summary>
<param name="userDetails"> User Details object </param>
<returns> Returns Updated User details </returns>
*/

async function updateUserDetails(userDetails,updatedBy) {
    try {
        let middleName= (userDetails.middlename && userDetails.middlename.trim().length>0 && userDetails.middlename!=null)?helperUtil.EncryptData(userDetails.middlename):"";
        let middleNameLength= (middleName!="")?middleName.length:1;

        let firstName= helperUtil.EncryptData(userDetails.firstname);
        let lastName= helperUtil.EncryptData(userDetails.lastname);
        let mobileNumber= helperUtil.EncryptData(userDetails.mobilenumber);
        let emailId= helperUtil.EncryptData(userDetails.emailid);
        let username=userDetails.isemailselected === 'true'?userDetails.emailid:userDetails.loginid;
        return await new sql.ConnectionPool(dbConn.Config).connect().then(async pool => {
            let dbResponse = await pool.request()
                .input('UserId', sql.Int, parseInt(userDetails.userid))
                .input('UserName', sql.NVarChar(username.length), username)
                .input('FirstName', sql.NVarChar(firstName.length), firstName)
                .input('MiddleName', sql.NVarChar(middleNameLength), middleName)
                .input('LastName', sql.NVarChar(lastName.length), lastName)
                .input('PhoneNumber',  sql.NVarChar(mobileNumber.length), mobileNumber)
                .input('EmailAddress', sql.NVarChar(emailId.length), emailId)
                .input('IsEmailSelected', sql.Bit, (userDetails.isemailselected === 'true' ? 1 : 0))
               //.input('Password', sql.NVarChar(userDetails.password.length), userDetails.password)
                .input('IsAccountLocked', sql.Bit, (userDetails.isaccountlocked === 'true' ? 1 : 0))
                .input('IsDisabled', sql.Bit, (userDetails.isaccountdisabled === 'true') ? 1 : 0)
                .input('UpdatedBy', sql.NVarChar(updatedBy.length), updatedBy)
                .execute("usp_UpdateUserDetails");
            sql.close();
            return {
                User: dbResponse.recordset
            };
        }).catch(err => {
            sql.close();
            throw new customError.ApplicationError(err);
        });
    } catch (err) {
        throw new customError.ApplicationError(err);
    }
}


/*
<summary> Helps to Delete User details from Database </summary>
<param name="roleId"> Role Id </param>
<returns> Returns Deleted Role </returns>
*/

async function deleteUserDetails(userId, disabledBy) {
    try {
        return await new sql.ConnectionPool(dbConn.Config).connect().then(async pool => {
            let dbResponse = await pool.request()
                .input('UserId', sql.INT, parseInt(userId))
                .input('DisabledBy', sql.NVarChar(disabledBy.length), disabledBy)
                .execute("usp_DeleteUserDetailsById");
            sql.close();
            return dbResponse.recordset[0];
        }).catch(err => {
            sql.close();
            throw new customError.ApplicationError(err);
        });
    } catch (err) {
        throw new customError.ApplicationError(err);
    }
}


/*
<summary> Helps to Get User  Mapped details using LDAP Group from Database </summary>
<param name="ldapGroup"> LDAP Group </param>
<returns> Returns User Mapped Roles </returns>
*/

async function mappedRolesByLdapGroups(ldapGroups,ldapConfigId) {
    try {
        return await new sql.ConnectionPool(dbConn.Config).connect().then(async pool => {
            let dbResponse = await pool.request()
                .input('GroupName', sql.NVarChar(ldapGroups.length), ldapGroups)
                .input('LdapConfigId', sql.Int, ldapConfigId)
                .execute("usp_GetRolesByLdapGroups");
            sql.close();
            return dbResponse.recordset;
        }).catch(err => {
            sql.close();
            throw new customError.ApplicationError(err);
        });
    } catch (err) {
        throw new customError.ApplicationError(err);
    }
}

/*
<summary> Helps to check user Username and Password into Database </summary>
<param name="userDetails"> User Details object </param>
<returns> Returns User details if available </returns>
*/

async function checkUsernameAndPasswordDetails(userDetails) {
    try {
        return await new sql.ConnectionPool(dbConn.Config).connect().then(async pool => {
            let dbResponse = await pool.request()
                .input('UserName', sql.NVarChar(userDetails.Username.length), userDetails.Username)
                .input('Password', sql.NVarChar(userDetails.Password.length), userDetails.Password)
                .execute("usp_CheckUsernameAndPasswordDetails");
            sql.close();
            return {
                User: dbResponse.recordset
            };
        }).catch(err => {
            sql.close();
            throw new customError.ApplicationError(err);
        });
    } catch (err) {
        throw new customError.ApplicationError(err);
    }
}

/*
<summary> Helps to Get Mapped Roles and Privileges By ISAS User Id from Database </summary>
<param name="isasUserId"> ISAS User Id </param>
<returns> Returns Mapped Roles and Privileges</returns>
*/

async function getRolesAndPrivilegesByUserId(isasUserId,siteId,applicationId) {
    try {
        return await new sql.ConnectionPool(dbConn.Config).connect().then(async pool => {
            let dbResponse;
            dbResponse = await pool.request()
                .input('UserId', sql.NVarChar(isasUserId.length), isasUserId)
                .input('SiteId', sql.NVarChar(siteId.length), siteId)
                .input('ApplicationVersionId', sql.NVarChar(applicationId.length), applicationId)
                .execute("usp_GetRolesAndPrivilegesByUserId");
            sql.close();
            return dbResponse.recordset;
        }).catch(err => {
            sql.close();
            throw new customError.ApplicationError(err);
        });
    } catch (err) {
        throw new customError.ApplicationError(err);
    }
}


/*
<summary> Helps to Store User Transaction details to Database </summary>
<param name="userId"> ISAS User Id </param>
<param name="requestInfo"> Request Information </param>
<param name="responseInfo"> Response Information </param>
<returns> </returns>
*/

async function saveUserTransaction(userId,requestInfo,responseInfo) {
    try {
        return await new sql.ConnectionPool(dbConn.Config).connect().then(async pool => {
            let dbResponse;
            dbResponse = await pool.request()
                .input('UserId', sql.INT,parseInt(userId))
                .input('ApplicationVersionId', sql.INT, parseInt(requestInfo.ApplicationVersionId))
                .input('Endpoint', sql.NVarChar(requestInfo.EndPoint), requestInfo.EndPoint)
                .input('EndpointType', sql.NVarChar(requestInfo.EndpointType), requestInfo.EndpointType)
                .input('ResponseCode', sql.NVarChar(responseInfo.ResponseCode), responseInfo.ResponseCode)
                .input('ResponseMessage', sql.NVarChar(responseInfo.ResponseMessage), responseInfo.ResponseMessage)
                .execute("usp_SaveUserTransaction");
            sql.close();
            return dbResponse.recordset;
        }).catch(err => {
            sql.close();
            throw new customError.ApplicationError(err);
        });
    } catch (err) {
        throw new customError.ApplicationError(err);
    }
}


/*
<summary> Helps to insert Default user details into Database </summary>
<param name="userDetails"> User Details object </param>
<returns> Returns inserted default User details </returns>
*/

async function insertDefaultUser(userDetails) {
    try {
        return await new sql.ConnectionPool(dbConn.Config).connect().then(async pool => {
            let dbResponse = await pool.request()
                .input('UserName', sql.NVarChar(userDetails.UserBasicDetails.Username.length), userDetails.UserBasicDetails.Username)
                .input('FirstName', sql.NVarChar(userDetails.UserBasicDetails.FirstName.length), userDetails.UserBasicDetails.FirstName)
                .input('LastName', sql.NVarChar(userDetails.UserBasicDetails.LastName.length), userDetails.UserBasicDetails.LastName)
                .input('PhoneNumber', sql.NVarChar(userDetails.UserBasicDetails.PhoneNumber.length), userDetails.UserBasicDetails.PhoneNumber)
                .input('EmailAddress', sql.NVarChar(userDetails.UserBasicDetails.EmailAddress.length), userDetails.UserBasicDetails.EmailAddress)
                .input('IsEmailSelected', sql.Bit, (userDetails.UserBasicDetails.IsEmailSelected === true ? 1 : 0))
                .input('Password', sql.NVarChar(userDetails.UserBasicDetails.Password.length), userDetails.UserBasicDetails.Password)
                .input('PasswordSalt', sql.NVarChar(userDetails.UserBasicDetails.PasswordSalt.length), userDetails.UserBasicDetails.PasswordSalt)
                .input('IsAccountLocked', sql.Bit, (userDetails.UserBasicDetails.IsAccountLocked === true ? 1 : 0))
                .input('IsDisabled', sql.Bit, (userDetails.UserBasicDetails.IsDisabled === true) ? 1 : 0)
                .input('CreatedBy', sql.NVarChar(userDetails.UserBasicDetails.CreatedBy.length), userDetails.UserBasicDetails.CreatedBy)
                .input('RoleName', sql.NVarChar(userDetails.RoleDetails.RoleName.length), userDetails.RoleDetails.RoleName)
                .input('Description', sql.NVarChar(userDetails.RoleDetails.Description.length), userDetails.RoleDetails.Description)
                .input('ApplicationVersionId', sql.INT, parseInt(userDetails.ApplicationVersionId))
                .input('SiteUid', sql.NVarChar(userDetails.SiteInfo.Uid.length), userDetails.SiteInfo.Uid)
                .input('SiteName', sql.NVarChar(userDetails.SiteInfo.NodeName.length), userDetails.SiteInfo.NodeName)
                .input('SiteNodeId', sql.INT, parseInt(userDetails.SiteInfo.NodeId))
                .input('SiteNodeType', sql.NVarChar(userDetails.SiteInfo.NodeType.length), userDetails.SiteInfo.NodeType)
                .execute("usp_InsertDefaultUser");                
            sql.close();
            return {
                User: dbResponse.recordset[0]
            };
        }).catch(err => {
            sql.close();
            throw new customError.ApplicationError(err);
        });
    } catch (err) {
        throw new customError.ApplicationError(err);
    }
}


/*
<summary> Helps to Get User Password Salt from Database </summary>
<param name="username"> ISAS Username </param>
<returns> Returns Password Salt</returns>
*/

async function getUserPasswordSalt(username) {
    try {
        return await new sql.ConnectionPool(dbConn.Config).connect().then(async pool => {
            let dbResponse;
            dbResponse = await pool.request()
                .input('Username', sql.NVarChar(username), username)
                .execute("usp_GetUserPasswordAndSalt");
            sql.close();
            return dbResponse.recordset;
        }).catch(err => {
            sql.close();
            throw new customError.ApplicationError(err);
        });
    } catch (err) {
        throw new customError.ApplicationError(err);
    }
}

/*
<summary> Helps to Set new User Password </summary>
<param name="passwordDetails">Password Details</param>
<returns> Returns Updated User Id </returns>
*/

async function updateUserPasswordSalt(passwordDetails) {
    try {
        return await new sql.ConnectionPool(dbConn.Config).connect().then(async pool => {
            let dbResponse;
            dbResponse = await pool.request()
                .input('UserId', sql.INT,parseInt(passwordDetails.UserId))
                .input('Password', sql.NVarChar(passwordDetails.PasswordHash.length), passwordDetails.PasswordHash)
                .input('PasswordSalt', sql.NVarChar(passwordDetails.PasswordSalt.length), passwordDetails.PasswordSalt)
                .input('UpdatedBy', sql.NVarChar(passwordDetails.UpdatedBy.length), passwordDetails.UpdatedBy)
                .execute("usp_UpdateUserPassword");
            sql.close();
            return dbResponse.recordset;
        }).catch(err => {
            sql.close();
            throw new customError.ApplicationError(err);
        });
    } catch (err) {
        throw new customError.ApplicationError(err);
    }
}


/*
<summary> Helps to Get User Password Salt By ID from Database </summary>
<param name="username"> ISAS Username </param>
<returns> Returns Password Salt</returns>
*/

async function getUserPasswordSaltById(userId) {
    try {
        return await new sql.ConnectionPool(dbConn.Config).connect().then(async pool => {
            let dbResponse;
            dbResponse = await pool.request()
                .input('UserId', sql.INT,parseInt(userId))
                .execute("usp_GetUserPasswordAndSaltById");
            sql.close();
            return dbResponse.recordset;
        }).catch(err => {
            sql.close();
            throw new customError.ApplicationError(err);
        });
    } catch (err) {
        throw new customError.ApplicationError(err);
    }
}


module.exports = {
    CheckUserDetails: checkUserDetails,
    InsertUserDetails: insertUserDetails,
    InsertUserRolesDetails: insertUserRolesDetails,
    UpdateUserDetails: updateUserDetails,
    DeleteUserDetails: deleteUserDetails,
    CheckUsernameAndEmailDetails: checkUsernameAndEmailDetails,
    CheckUsernameAndPasswordDetails: checkUsernameAndPasswordDetails,
    GetRolesByLdapGroups:mappedRolesByLdapGroups,
    GetRolesAndPrivilegesByUserId:getRolesAndPrivilegesByUserId,
    SaveUserTransaction:saveUserTransaction,
    InsertDefaultUser:insertDefaultUser,
    GetUserPasswordSalt:getUserPasswordSalt,
    UpdateUserPasswordSalt:updateUserPasswordSalt,
    GetUserPasswordSaltById:getUserPasswordSaltById
}