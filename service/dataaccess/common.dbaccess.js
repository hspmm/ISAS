/* Declare required npm packages */
var sql = require('mssql');

/* Declare Database connection */
var dbConn = require('../dataaccess/sqlconnection');

/* Custom Error */
var customError = require('../errors/custom.error');
/*
<summary> Helps to Get all role details from Database </summary>
<returns> Returns All Role details </returns>
*/

async function getAllRoleDetails() {
    try {
        return await new sql.ConnectionPool(dbConn.Config).connect().then(async pool => {
            let dbResponse = await pool.request()
                .execute("usp_GetAllRolesDetails");
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
<summary> Helps to Get all Application details from Database </summary>
<returns> Returns All Application details </returns>
*/

async function getAllApplicationDetails() {
    try {
        return await new sql.ConnectionPool(dbConn.Config).connect().then(async pool => {
            let dbResponse = await pool.request()
                .execute("usp_GetAllApplicationDetails");
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
<summary> Helps to Get all User details from Database </summary>
<returns> Returns All User details </returns>
*/

async function getAllUserDetails() {
    try {
        return await new sql.ConnectionPool(dbConn.Config).connect().then(async pool => {
            let dbResponse = await pool.request()
                .execute("usp_GetAllUsersDetails");
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
<summary> Helps to Get all role details for Particular user from Database </summary>
<returns> Returns All mapped Role details for user </returns>
*/

async function getUserMappedRoleDetails(userId) {
    try {
        return await new sql.ConnectionPool(dbConn.Config).connect().then(async pool => {
            let dbResponse = await pool.request()
                .input('UserId', sql.Int, userId)
                .execute("usp_GetUserMappedRolesDetails");
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
<summary> Helps to Get details for Particular user from Database </summary>
<returns> Returns All details for user </returns>
*/

async function getUserDetails(userId) {
    try {
        return await new sql.ConnectionPool(dbConn.Config).connect().then(async pool => {
            let dbResponse = await pool.request()
                .input('UserId', sql.Int, userId)
                .execute("usp_GetUserDetailsByUserId");
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
<summary> Helps to Get all Applications Privileges from Database </summary>
<returns> Returns All Applications privileges </returns>
*/

async function getAllApplicationsPrivileges() {
    try {
        return await new sql.ConnectionPool(dbConn.Config).connect().then(async pool => {
            let dbResponse = await pool.request()
                .execute("usp_GetAllApplicationsPrivileges");
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
<summary> Helps to Get Roles Privileges from Database </summary>
<returns> Returns Roles Privileges </returns>
*/

async function getRolesPrivileges(roleId) {
    try {
        return await new sql.ConnectionPool(dbConn.Config).connect().then(async pool => {
            let dbResponse = await pool.request()
                .input('RoleId', sql.VarChar, roleId)
                .execute("usp_GetRolesPrivileges");
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
<summary> Helps to Get role details by RoleId from Database </summary>
<param name="roleId"> Role ID </param>
<returns> Returns Role details </returns>
*/

async function getRoleDetailsById(roleId) {
    try {
        return await new sql.ConnectionPool(dbConn.Config).connect().then(async pool => {
            let roleBasicDetails = await pool.request()
                .input('RoleId', sql.Int, roleId)
                .execute("usp_GetRoleDetailsById");
            let roleMappedPrivilegesDetails = await pool.request()
                .input('RoleId', sql.Int, roleId)
                .execute("usp_GetRoleMappedPrivilgesById");
            let roleMappedSitesDetails = await pool.request()
                .input('RoleId', sql.Int, roleId)
                .execute("usp_GetRoleMappedSitesById");
            let roleMappedLdapGroupsDetails = await pool.request()
                .input('RoleId', sql.Int, roleId)
                .execute("usp_GetRoleMappedLdapGroupsById");
            let roleMappedUsersDetails = await pool.request()
                .input('RoleId', sql.Int, roleId)
                .execute("usp_GetRoleMappedUsersById");
            sql.close();
            return {
                roleBasicDetails: roleBasicDetails.recordset,
                roleMappedPrivilegesDetails: roleMappedPrivilegesDetails.recordset,
                roleMappedSitesDetails: roleMappedSitesDetails.recordset,
                roleMappedLdapGroupsDetails: roleMappedLdapGroupsDetails.recordset,
                roleMappedUsersDetails:roleMappedUsersDetails.recordset
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
<summary> Helps to Get all LDAP Configuration from Database </summary>
<returns> Returns All LDAP Configuration </returns>
*/

async function getAllLdapConfiguration() {
    try {
        return await new sql.ConnectionPool(dbConn.Config).connect().then(async pool => {
            let dbResponse = await pool.request()
                .execute("usp_GetAllLdapDetails");
            sql.close();
            return dbResponse.recordset;
        }).catch(err => {
            sql.close();
            throw new customError.ApplicationError(err);
        });
    } catch (err) {
        sql.close();
        throw new customError.ApplicationError(err);
    }
}

/*
<summary> Helps to Get all Imprivata Configuration from Database </summary>
<returns> Returns All Imprivata Configuration </returns>
*/

async function getAllImprivataConfiguration() {
    try {
        return await new sql.ConnectionPool(dbConn.Config).connect().then(async pool => {
            let dbResponse = await pool.request()
                .execute("usp_GetAllImprivataDetails");
            sql.close();
            return dbResponse.recordset;
        }).catch(err => {
            sql.close();
            throw new customError.ApplicationError(err);
        });
    } catch (err) {
        sql.close();
        throw new customError.ApplicationError(err);
    }
}

/*
<summary> Helps to Get all Site Roles from Database </summary>
<returns> Returns All Site Roles </returns>
*/

async function getAllSiteRoles() {
    try {
        return await new sql.ConnectionPool(dbConn.Config).connect().then(async pool => {
            let dbResponse = await pool.request()
                .execute("usp_GetAllSiteRoles");
            sql.close();
            return dbResponse.recordsets;
        }).catch(err => {
            sql.close();
            throw new customError.ApplicationError(err);
        });
    } catch (err) {
        throw new customError.ApplicationError(err);
    }
}

/*
<summary> Helps to Get all Site Users from Database </summary>
<returns> Returns All Site Users </returns>
*/

async function getAllSiteUsers() {
    try {
        return await new sql.ConnectionPool(dbConn.Config).connect().then(async pool => {
            let dbResponse = await pool.request()
                .execute("usp_GetAllSiteUsers");
            sql.close();
            return dbResponse.recordsets;
        }).catch(err => {
            sql.close();
            throw new customError.ApplicationError(err);
        });
    } catch (err) {
        throw new customError.ApplicationError(err);
    }
}

/*
<summary> Helps to Get all Site LdapGroups from Database </summary>
<returns> Returns All Site Ldap Groups </returns>
*/

async function getAllSiteLdapGroups() {
    try {
        return await new sql.ConnectionPool(dbConn.Config).connect().then(async pool => {
            let dbResponse = await pool.request()
                .execute("usp_GetAllSiteLdapGroups");
            sql.close();
            return dbResponse.recordsets;
        }).catch(err => {
            sql.close();
            throw new customError.ApplicationError(err);
        });
    } catch (err) {
        throw new customError.ApplicationError(err);
    }
}


/*
<summary> Helps to Get Ldap Details by Id from Database </summary>
<returns> Returns Ldap Details </returns>
*/

async function getLdapDetailsById(ldapConfigId) {
    try {       
        return await new sql.ConnectionPool(dbConn.Config).connect().then(async pool => {
            let dbResponse = await pool.request()
                .input('LdapConfigId', sql.Int, ldapConfigId)
                .execute("usp_GetLdapDetailsById");
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
<summary> Helps to Get Privileges Roles from Database </summary>
<returns> Returns Privileges Roles </returns>
*/

async function getPrivilegesRoles(privilegeId) {
    try {
        return await new sql.ConnectionPool(dbConn.Config).connect().then(async pool => {
            let dbResponse = await pool.request()
                .input('PrivilegeId', sql.VarChar, privilegeId)
                .execute("usp_GetPrivilegesRoles");
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
<summary> Helps to Get Privileges Users from Database </summary>
<returns> Returns Privileges Users </returns>
*/

async function getPrivilegesUsers(privilegeId) {
    try {
        return await new sql.ConnectionPool(dbConn.Config).connect().then(async pool => {
            let dbResponse = await pool.request()
                .input('PrivilegeId', sql.VarChar, privilegeId)
                .execute("usp_GetPrivilegesUsers");
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
<summary> Helps to Get Privileges Ldap Groups from Database </summary>
<returns> Returns Privileges Ldap Groups </returns>
*/

async function getPrivilegesLdapGroups(privilegeId) {
    try {
        return await new sql.ConnectionPool(dbConn.Config).connect().then(async pool => {
            let dbResponse = await pool.request()
                .input('PrivilegeId', sql.VarChar, privilegeId)
                .execute("usp_GetPrivilegesLdapGroups");
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
<summary> Helps to Get all Site from Database </summary>
<returns> Returns All Site </returns>
*/

async function getAllSite() {
    try {
        return await new sql.ConnectionPool(dbConn.Config).connect().then(async pool => {
            let dbResponse = await pool.request()
                .execute("usp_GetAllEnterpriseNodes");
            sql.close();
            return dbResponse.recordsets;
        }).catch(err => {
            sql.close();
            throw new customError.ApplicationError(err);
        });
    } catch (err) {
        throw new customError.ApplicationError(err);
    }
}

/*
<summary> Helps to Get Security Model Information from Database </summary>
<returns> Returns All Security Model Informations </returns>
*/

async function getSecurityModelDetails() {
    try {
        return await new sql.ConnectionPool(dbConn.Config).connect().then(async pool => {
            let dbResponse = await pool.request()
                .execute("usp_GetSecurityModelDetails");
            sql.close();
            return dbResponse.recordset[0];
        }).catch(err => {
            sql.close();
            throw new customError.ApplicationError(err);
        });
    } catch (err) {
        sql.close();
        throw new customError.ApplicationError(err);
    }
}


/*
<summary> Helps to Update Security Model Details </summary>
<returns> Returns Updated Securiy Model Details</returns>
*/

async function updateSecurityModelDetails(selectedSecurityModel,modifiedBy) {
    try {       
        return await new sql.ConnectionPool(dbConn.Config).connect().then(async pool => {
            let dbResponse = await pool.request()
                // .input('IsStandalone', sql.Bit, securityModelDetails.isStandalone)
                // .input('IsLdap', sql.Bit, securityModelDetails.isLdap)
                .input('SecurityType', sql.NVarChar(selectedSecurityModel.length), selectedSecurityModel)
                .input('ModifiedBy', sql.NVarChar(modifiedBy.length), modifiedBy)
                .execute("usp_UpdateSecurityModel");
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
<summary> Helps to Insert all Site from EC </summary>
<returns> Returns All Site </returns>
*/

async function insertSiteInfo(siteInfo) {
    try {
        let pluginId= (siteInfo.PluginID!=null)?siteInfo.PluginID:0;
        let parentId=(siteInfo.ParentID!=null)?siteInfo.ParentID:0;
        return await new sql.ConnectionPool(dbConn.Config).connect().then(async pool => {
            let dbResponse = await pool.request()
                .input('EnterpriseNodeId', sql.NVarChar(siteInfo.Uid.length), siteInfo.Uid)
                .input('NodeId', sql.INT, siteInfo.NodeID)
                .input('NodeName', sql.NVarChar(siteInfo.NodeName.length), siteInfo.NodeName)
                .input('ParentNodeId', sql.INT, siteInfo.ParentID)
                .input('NodeType', sql.NVarChar(siteInfo.NodeType.length), siteInfo.NodeType)
                .input('ApplicationVersionUid', sql.NVarChar(pluginId.length), pluginId)
                .execute("usp_InsertEnterpriseNode");
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
<summary> Helps to Insert all Enterprise Application from EC </summary>
<returns> Returns All Enterprise Application </returns>
*/

async function insertSiteApplicationInfo(siteApplicationInfo) {
    try {
        return await new sql.ConnectionPool(dbConn.Config).connect().then(async pool => {
            let dbResponse = await pool.request()
                .input('ApplicationGuid', sql.NVarChar(siteApplicationInfo.Uid.length), siteApplicationInfo.Uid)
                .input('EnterpriseNodeId', sql.INT,parseInt(siteApplicationInfo.rootNodeId))
                .input('ApplicationName', sql.NVarChar(siteApplicationInfo.name.length),siteApplicationInfo.name)
                .execute("usp_InsertEnterpriseApplication");
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
<summary> Helps to Disable all Site </summary>
<returns> Returns All Site </returns>
*/

async function disableSiteInfo() {
    try {
        return await new sql.ConnectionPool(dbConn.Config).connect().then(async pool => {
            let dbResponse = await pool.request()
                .execute("usp_DisableEnterpriseNode");
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
<summary> Helps to Disable all Enterprise Application  </summary>
<returns> Returns All Enterprise Application </returns>
*/

async function disableSiteApplicationInfo() {
    try {
        return await new sql.ConnectionPool(dbConn.Config).connect().then(async pool => {
            let dbResponse = await pool.request()
                .execute("usp_DisableEnterpriseApplication");
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
<summary> Helps to Remove Disabled Sites </summary>
<returns> Returns Sites </returns>
*/

async function removeDisabledSiteInfo() {
    try {
        return await new sql.ConnectionPool(dbConn.Config).connect().then(async pool => {
            let dbResponse = await pool.request()
                .execute("usp_RemoveDisabledEnterpriseNode");
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
<summary> Helps to Remove Disabled Site Application </summary>
<returns> Returns Disabled Site Application </returns>
*/

async function removeDisabledSiteApplicationInfo() {
    try {
        return await new sql.ConnectionPool(dbConn.Config).connect().then(async pool => {
            let dbResponse = await pool.request()
                .execute("usp_RemoveDisabledEnterpriseApplication");
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
<summary> Helps to get user log details </summary>
<param name="userId"> User Id </param>
<returns> Returns User Log details </returns>
*/

async function getUserLogDetails(userId) {
    try {
        return await new sql.ConnectionPool(dbConn.Config).connect().then(async pool => {
            let dbResponse = await pool.request()
                .input('UserId', sql.INT, userId)
                .execute("usp_GetUserLogDetails");
            sql.close();

            return dbResponse.recordsets;
          
        }).catch(err => {
            sql.close();
            throw new customError.ApplicationError(err);
        });
    } catch (err) {
        throw new customError.ApplicationError(err);
    }
}

/*
<summary> Helps to get General Config </summary>
<returns> Returns General Config </returns>
*/

async function getGeneralConfig() {
    try {
        return await new sql.ConnectionPool(dbConn.Config).connect().then(async pool => {
            let dbResponse = await pool.request()
                .execute("usp_GetGeneralConfig");
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
<summary> Helps to Insert General Config Info </summary>
<returns> Returns Inserted Configuration Info </returns>
*/

async function insertGeneralConfig(configInfo,updatedBy) {
    try {
        let lockoutPeriod = parseInt(configInfo.LockoutPeriod);
        let maxRetries = parseInt(configInfo.MaxRetries);
        let maxLoginAttempts = parseInt(configInfo.MaxLoginAttempts);
        return await new sql.ConnectionPool(dbConn.Config).connect().then(async pool => {
            let dbResponse = await pool.request()
                .input('LockoutPeriod', sql.INT, (lockoutPeriod!=0)?lockoutPeriod:null)
                .input('MaxRetries', sql.INT, (maxRetries!=0)?maxRetries:null)
                .input('MaxLoginAttempts', sql.INT, (maxLoginAttempts!=0)?maxLoginAttempts:null)
                .input('UpdatedBy', sql.NVarChar(updatedBy.length), updatedBy)
                .execute("usp_UpdateGeneralInfo");
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
<summary> Helps to get Lockout Information </summary>
<returns> Returns Lockout Info </returns>
*/

async function getLockoutInfo() {
    try {
        return await new sql.ConnectionPool(dbConn.Config).connect().then(async pool => {
            let dbResponse = await pool.request()
                .execute("usp_GetLockoutInfo");
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
<summary> Helps to Insert Lockout Info </summary>
<returns> Returns Inserted Lockout Info </returns>
*/

async function insertLockoutInfo(ipAddress) {
    try {
        return await new sql.ConnectionPool(dbConn.Config).connect().then(async pool => {
            let dbResponse = await pool.request()
                .input('LockoutIPAddress', sql.NVarChar(ipAddress.length), ipAddress)
                .execute("usp_InsertLockoutInfo");
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
<summary> Helps to Set Admin Application </summary>
<returns> Returns Admin Application Id </returns>
*/

async function updateAdminApplication(applicationId) {
    try {
        return await new sql.ConnectionPool(dbConn.Config).connect().then(async pool => {
            let dbResponse = await pool.request()
                .input('ApplicationVersionId', sql.INT, parseInt(applicationId))
                .execute("usp_UpdateAdminApplication");
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
<summary> Helps to get Key Details </summary>
<returns> Returns Key Info </returns>
*/

async function getKeyInfo() {
    try {
        return await new sql.ConnectionPool(dbConn.Config).connect().then(async pool => {
            let dbResponse = await pool.request()
                .execute("usp_GetKeyDetails");
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
<summary> Helps to Insert Key Info </summary>
<returns> Returns Inserted Key Info </returns>
*/

async function insertKeyInfo(keyHash,keySalt) {
    try {
        return await new sql.ConnectionPool(dbConn.Config).connect().then(async pool => {
            let dbResponse = await pool.request()
                .input('KeyHash', sql.NVarChar(keyHash.length), keyHash)
                .input('keySalt', sql.NVarChar(keySalt.length), keySalt)
                .execute("usp_InsertKeyDetails");
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
<summary> Helps to Check DB Details </summary>
<returns> Returns Success or Failure </returns>
*/

async function checkDBInfo() {
    try {
        return await new sql.ConnectionPool(dbConn.Config).connect().then(async pool => {
            let dbResponse = await pool.request()
                .execute("usp_GetKeyDetails");
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
    GetAllRoleDetails: getAllRoleDetails,
    GetAllApplicationDetails: getAllApplicationDetails,
    GetAllUserDetails: getAllUserDetails,
    GetUserMappedRoleDetails: getUserMappedRoleDetails,
    GetUserDetails: getUserDetails,
    GetAllApplicationsPrivileges: getAllApplicationsPrivileges,
    GetRolesPrivileges: getRolesPrivileges,
    GetRoleDetailsById: getRoleDetailsById,
    GetAllLdapDetails: getAllLdapConfiguration,
    GetAllImprivataDetails: getAllImprivataConfiguration,
    GetAllSiteRoles: getAllSiteRoles,
    GetAllSiteUsers: getAllSiteUsers,
    GetAllSiteLdapGroups: getAllSiteLdapGroups,
    GetPrivilegesRoles: getPrivilegesRoles,
    GetPrivilegesUsers: getPrivilegesUsers,
    GetPrivilegesLdapGroups: getPrivilegesLdapGroups,
    GetAllSite: getAllSite,
    GetLdapDetailsById: getLdapDetailsById,
    GetSecurityModelDetails:getSecurityModelDetails,
    UpdateSecurityModelDetails:updateSecurityModelDetails,
    InsertSiteInfo:insertSiteInfo,
    DisableSiteInfo:disableSiteInfo,
    RemoveDisabledSiteInfo:removeDisabledSiteInfo,
    GetUserLogDetails:getUserLogDetails,
    GetGeneralConfig:getGeneralConfig,
    InsertGeneralConfig:insertGeneralConfig,
    GetLockoutInfo:getLockoutInfo,
    InsertLockoutInfo:insertLockoutInfo,
    UpdateAdminApplication:updateAdminApplication,
    GetKeyInfo:getKeyInfo,
    InsertKeyInfo:insertKeyInfo,
    InsertSiteApplicationInfo:insertSiteApplicationInfo,
    DisableSiteApplicationInfo:disableSiteApplicationInfo,
    RemoveDisabledSiteApplicationInfo:removeDisabledSiteApplicationInfo,
    CheckDBInfo:checkDBInfo
}