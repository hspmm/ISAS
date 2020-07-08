/* Declare required npm packages */
var sql = require('mssql');

/* Custom Error */
var customError = require('../errors/custom.error');

/* Declare Database connection */
var dbConn = require('../dataaccess/sqlconnection');


/*
<summary> Helps to insert LDAP Groups details into Database </summary>
<param name="ldapGroupsDetails"> LDAP Group Details object </param>
<returns> Returns inserted LDAP Group details </returns>
*/

async function insertLdapGroupDetails(ldapGroupDetails, ldapConfigId) {
    try {
        return await new sql.ConnectionPool(dbConn.Config).connect().then(async pool => {
            let dbResponse;
            if (ldapGroupDetails.length > 0) {
                dbResponse = await pool.request()
                    .input('LdapConfigId', sql.INT, ldapConfigId)
                    .execute("usp_DisableLdapAllGroups");
                let insertedGroups = [];
                insertedGroups = await InsertGroupDetails(pool, ldapGroupDetails, ldapConfigId);
                return insertedGroups;
            }
            sql.close();
        }).catch(err => {
            sql.close();
            throw new customError.ApplicationError(err);
        });
    } catch (err) {
        throw new customError.ApplicationError(err);
    }
}


/*
<summary> Helps to insert LDAP Groups details into Database </summary>
<param name="ldapGroupsDetails"> LDAP Group Details object </param>
<returns> Returns inserted LDAP Group details </returns>
*/

async function InsertGroupDetails(pool, groupNames, ldapConfigId) {
    let insertedGroups = [];
    for (let group of groupNames) {
        dbResponse = await pool.request()
            .input('LdapConfigId', sql.INT, parseInt(ldapConfigId))
            .input('LdapGroupName', sql.NVarChar(group.Group.length), group.Group)
            .input('LdapGroupPath', sql.NVarChar(group.Path.length), group.Path)
            .execute("usp_InsertLdapGroupDetails");
        insertedGroups.push({Group:dbResponse.recordset[0]});
    }
    return insertedGroups;
}

/*
<summary> Helps to Get LDAP Groups details by Ldap Configuration Id from Database </summary>
<param name="ldapConfigId"> LDAP configuration ID </param>
<returns> Returns LDAP Group details </returns>
*/

async function getLdapGroupDetailsByLdapId(ldapConfigId) {
    try {
        return await new sql.ConnectionPool(dbConn.Config).connect().then(async pool => {
            let dbResponse;
            dbResponse = await pool.request()
                .input('LdapConfigId', sql.INT, ldapConfigId)
                .execute("usp_GetLdapGroupsByLdapId");
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
<summary> Helps to Get LDAP details by Domain Name from Database </summary>
<param name="domainName"> Domain Name </param>
<returns> Returns LDAP details </returns>
*/

async function getLdapDetailsByDomainName(domainName) {
    try {
        return await new sql.ConnectionPool(dbConn.Config).connect().then(async pool => {
            let dbResponse;
            dbResponse = await pool.request()
                .input('DomainName', sql.NVarChar(domainName.length), domainName)
                .execute("usp_GetLdapDetailsByDomainName");
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
<summary> Helps to Check LDAP details by Domain Name from Database </summary>
<param name="domainName"> Domain Name </param>
<returns> Returns LDAP details </returns>
*/

async function checkLdapDetailsByDomainName(domainName,ldapConfigId) {
    try {
        return await new sql.ConnectionPool(dbConn.Config).connect().then(async pool => {
            let dbResponse;
            dbResponse = await pool.request()
                .input('LdapConfigId', sql.Int, parseInt(ldapConfigId))
                .input('DomainName', sql.NVarChar(domainName.length), domainName)
                .execute("usp_CheckLdapDetailsByDomainName");
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
<summary> Helps to Get LDAP Group Id by Group Name from Database </summary>
<param name="ldapConfigId"> LDAP Config Id </param>
<param name="groupName"> Group Name </param>
<returns> Returns LDAP Group ID </returns>
*/

async function getLdapGroupIdByName(ldapConfigId,groupName) {
    try {
        return await new sql.ConnectionPool(dbConn.Config).connect().then(async pool => {
            let dbResponse;
            dbResponse = await pool.request()
                .input('LdapConfigId', sql.INT, parseInt(ldapConfigId))
                .input('GroupName', sql.NVarChar(groupName.length), groupName)
                .execute("usp_GetGroupIdByGroupName");
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
<summary> Helps to Get Mapped Roles and Privileges By Ldap Group Id from Database </summary>
<param name="ldapGroupId"> LDAP Group Id </param>
<returns> Returns Mapped Roles d Privileges </returns>
*/

async function getRolesAndPrivilegesByGroupId(ldapGroupId,siteId,applicationId) {
    try {
        return await new sql.ConnectionPool(dbConn.Config).connect().then(async pool => {
            let dbResponse;
            dbResponse = await pool.request()
                .input('LdapGroupId', sql.NVarChar(ldapGroupId.length), ldapGroupId)
                .input('SiteId', sql.NVarChar(siteId.length), siteId)
                .input('ApplicationVersionId', sql.NVarChar(applicationId.length), applicationId)
                .execute("usp_GetRolesAndPrivilegesByGroupId");
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
<summary> Helps to insert LDAP details into Database </summary>
<param name="ldapDetails"> LDAP Details object </param>
<returns> Returns inserted LDAP details </returns>
*/

async function insertLdapDetails(ldapDetails,createdBy) {
    try {
       
        return await new sql.ConnectionPool(dbConn.Config).connect().then(async pool => {
            let dbResponse = await pool.request()
                .input('ServerHostName', sql.NVarChar(ldapDetails.serverHostName.length), ldapDetails.serverHostName)
                .input('ServerPort', sql.INT, parseInt(ldapDetails.serverPort))
                .input('Domain', sql.NVarChar(ldapDetails.domain.length), ldapDetails.domain)
                .input('AdminUserName', sql.NVarChar(ldapDetails.adminUsername.length), ldapDetails.adminUsername)
                .input('AdminPassword', sql.NVarChar(ldapDetails.adminPassword.length), ldapDetails.adminPassword)
                .input('BindDn', sql.NVarChar(ldapDetails.bindDN.length), ldapDetails.bindDN)
                .input('IsSslSelected', sql.Bit, (ldapDetails.isSslSelected.toLowerCase() === 'true' ? 1 : 0))
                .input('CreatedBy', sql.NVarChar(createdBy.length), createdBy)
                .execute("usp_InsertLdapDetails");
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
<summary> Helps to update LDAP details into Database </summary>
<param name="ldapDetails"> LDAP Details object </param>
<returns> Returns updated LDAP details </returns>
*/

async function updateLdapDetails(ldapDetails,updatedBy) {
    try {
       
        return await new sql.ConnectionPool(dbConn.Config).connect().then(async pool => {
            let dbResponse = await pool.request()
                .input('LdapConfigId', sql.INT, parseInt(ldapDetails.ldapConfigId))
                .input('ServerHostName', sql.NVarChar(ldapDetails.serverHostName.length), ldapDetails.serverHostName)
                .input('ServerPort', sql.INT, parseInt(ldapDetails.serverPort))
                .input('Domain', sql.NVarChar(ldapDetails.domain.length), ldapDetails.domain)
                .input('AdminUserName', sql.NVarChar(ldapDetails.adminUsername.length), ldapDetails.adminUsername)
                .input('AdminPassword', sql.NVarChar(ldapDetails.adminPassword.length), ldapDetails.adminPassword)
                .input('BindDn', sql.NVarChar(ldapDetails.bindDN.length), ldapDetails.bindDN)
                .input('IsSslSelected', sql.Bit, (ldapDetails.isSslSelected.toLowerCase() === 'true' ? 1 : 0))
                .input('UpdatedBy', sql.NVarChar(updatedBy.length), updatedBy)
                .execute("usp_UpdateLdapDetails");
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
<summary> Helps to Delete LDAP details from Database </summary>
<param name="ldapConfigId"> LDAP Id </param>
<returns> Returns Deleted LDAP </returns>
*/

async function deleteLdapDetails(ldapConfigId,disabledBy) {
    try {
        return await new sql.ConnectionPool(dbConn.Config).connect().then(async pool => {
            let dbResponse = await pool.request()
                .input('LdapConfigId', sql.INT, parseInt(ldapConfigId))
                .input('DisabledBy', sql.NVarChar(disabledBy.length), disabledBy)
                .execute("usp_DeleteLdapDetailsById");
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

module.exports = {
    InsertLdapGroupDetails: insertLdapGroupDetails,
    GetLdapGroupDetailsByLdapId: getLdapGroupDetailsByLdapId,
    GetLdapDetailsByDomainName: getLdapDetailsByDomainName,
    GetLdapGroupIdByName:getLdapGroupIdByName,
    GetRolesAndPrivilegesByGroupId:getRolesAndPrivilegesByGroupId,
    InsertLdapDetails:insertLdapDetails,
    CheckLdapDetailsByDomainName:checkLdapDetailsByDomainName,
    UpdateLdapDetails:updateLdapDetails,
    DeleteLdapDetails:deleteLdapDetails
}