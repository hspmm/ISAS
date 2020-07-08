/* Declare required npm packages */
var sql = require('mssql');

/* Declare Database connection */
var dbConn = require('../dataaccess/sqlconnection');

/* Custom Error */
var customError = require('../errors/custom.error');

/*
<summary> Helps to Insert role details into Database </summary>
<param name="roleDetails"> Role Details object </param>
<returns> Returns Inserted Role details </returns>
*/

async function insertRoleDetails(roleDetails,createdBy) {
    try {
        return await new sql.ConnectionPool(dbConn.Config).connect().then(async pool => {
            let dbResponse = await pool.request()
                .input('RoleName', sql.NVarChar(roleDetails.name.length), roleDetails.name)
                .input('RoleDescription', sql.NVarChar(roleDetails.roledescription.length), roleDetails.roledescription)               
                .input('CreatedBy', sql.NVarChar(createdBy.length), createdBy)
                .execute("usp_InsertRolesDetails");
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
<summary> Helps to Get role details by RoleName from Database </summary>
<param name="roleName"> Role Name </param>
<returns> Returns Role details </returns>
*/

async function getRoleDetailsByName(roleName) {
    try {
        return await new sql.ConnectionPool(dbConn.Config).connect().then(async pool => {
            let dbResponse = await pool.request()
                .input('RoleName', sql.NVarChar(roleName.length), roleName)
                .execute("usp_GetRoleDetailsByName");
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
<summary> Helps to Get all role details from Database </summary>
<returns> Returns All Role details </returns>
*/

// async function getAllRoleDetails(roleId) {
//     try {
//         return await new sql.ConnectionPool(dbConn.Config).connect().then(async pool => {
//             let dbResponse = await pool.request()
//                 .execute("usp_GetAllRolesDetails");
//             sql.close();
//             return dbResponse.recordset;
//         }).catch(err => {
//             sql.close();
//         });
//     } catch (err) {
//     }
// }

/*
<summary> Helps to insert Role Site details into Database </summary>
<param name="roleSitesDetails"> Role Site Details object </param>
<returns> Returns inserted Roles Site details </returns>
*/

async function insertRoleSitesDetails(roleSitesDetails, roleId,createdBy) {
    try {
        return await new sql.ConnectionPool(dbConn.Config).connect().then(async pool => {
            let dbResponse;
            dbResponse = await pool.request()
                    .input('RoleId', sql.INT, roleId)
                    .input('DisabledBy', sql.NVarChar(createdBy.length), createdBy)
                    .execute("usp_DisableRoleAllSites");
            if (roleSitesDetails.length > 0) {
                let mappedSites = []; 
                for (let siteDetails of roleSitesDetails){                    
                    dbResponse = await pool.request()
                        .input('RoleId', sql.INT, parseInt(roleId))
                        .input('SiteId', sql.INT, parseInt(siteDetails.siteid))
                        .input('CreatedBy', sql.NVarChar(createdBy.length), createdBy)
                        .execute("usp_InsertRoleSitesDetails");
                        mappedSites.push(dbResponse.recordset[0]);
                }
                sql.close();
                return {              
                    MappedSitesDetails: mappedSites
                };
            } else {
                sql.close();
                return {
                    MappedSitesDetails: []
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
<summary> Helps to insert Role Privileges details into Database </summary>
<param name="rolePrivilegesDetails"> Role Privileges Details object </param>
<returns> Returns inserted Roles privileges details </returns>
*/

async function insertRolePrivilegesDetails(rolePrivilegesDetails, roleId, createdBy) {
    try {
        return await new sql.ConnectionPool(dbConn.Config).connect().then(async pool => {
            let dbResponse;
            dbResponse = await pool.request()
                    .input('RoleId', sql.INT, roleId)
                    .input('DisabledBy', sql.NVarChar(createdBy.length), createdBy)
                    .execute("usp_DisableRoleAllPrivileges");
            if (rolePrivilegesDetails.length > 0) {
                let mappedPrivileges = [];                

               // rolePrivilegesDetails.forEach(async privilegeDetails => {
                for (let privilegeDetails of rolePrivilegesDetails){                    
                    dbResponse = await pool.request()
                        .input('RoleId', sql.INT, parseInt(roleId))
                        .input('ApplicationPrivilegeId', sql.INT, parseInt(privilegeDetails.privilegeid))
                        .input('CreatedBy', sql.NVarChar(createdBy.length), createdBy)
                        .execute("usp_InsertRolePrivilegesDetails");
                    mappedPrivileges.push(dbResponse.recordset[0]);
                }
               // });
                sql.close();
                return {              
                    MappedPrivilegesDetails: mappedPrivileges
                };
            } else {
                sql.close();
                return {
                    MappedPrivilegesDetails: []
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
<summary> Helps to insert Role Groups details into Database </summary>
<param name="roleGroupsDetails"> Role Groups Details object </param>
<returns> Returns inserted Roles Groups details </returns>
*/

async function insertRoleGroupsDetails(roleGroupsDetails, roleId, createdBy) {
    try {
        return await new sql.ConnectionPool(dbConn.Config).connect().then(async pool => {
            let dbResponse;
            dbResponse = await pool.request()
                    .input('RoleId', sql.INT, roleId)
                    .input('DisabledBy', sql.NVarChar(createdBy.length), createdBy)
                    .execute("usp_DisableRoleAllGroups");
            if (roleGroupsDetails.length > 0) {
                let mappedGroups = [];                

                roleGroupsDetails.forEach(async group => {
                    dbResponse = await pool.request()
                        .input('RoleId', sql.INT, parseInt(roleId))
                        .input('GroupId', sql.INT, parseInt(group.groupid))
                        .input('CreatedBy', sql.NVarChar(createdBy.length), createdBy)
                        .execute("usp_InsertRoleGroupsDetails");
                        mappedGroups.push(dbResponse.recordset[0]);
                });
                sql.close();
                return {
                    MappedGroupsDetails: mappedGroups
                };
            } else {
                sql.close();
                return {
                    MappedGroupsDetails: []
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
<summary> Helps to insert Role Users details into Database </summary>
<param name="roleUsersDetails"> Role Users Details object </param>
<returns> Returns inserted Roles Users details </returns>
*/

async function insertRoleUsersDetails(roleUsersDetails, roleId, createdBy) {
    try {
        return await new sql.ConnectionPool(dbConn.Config).connect().then(async pool => {
            let dbResponse;
            dbResponse = await pool.request()
                    .input('RoleId', sql.INT, roleId)
                    .input('DisabledBy', sql.NVarChar(createdBy.length), createdBy)
                    .execute("usp_DisableRoleAllUsers");
            if (roleUsersDetails.length > 0) {
                let mappedUsers = [];                

                roleUsersDetails.forEach(async user => {
                    dbResponse = await pool.request()
                        .input('RoleId', sql.INT, parseInt(roleId))
                        .input('UserId', sql.INT, parseInt(user.userid))
                        .input('CreatedBy', sql.NVarChar(createdBy.length), createdBy)
                        .execute("usp_InsertRoleUsersDetails");
                        mappedUsers.push(dbResponse.recordset[0]);
                });
                sql.close();
                return {
                    MappedUsersDetails: mappedUsers
                };
            } else {
                sql.close();
                return {
                    MappedUsersDetails: []
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
<summary> Helps to Update role details into Database </summary>
<param name="roleDetails"> Role Details object </param>
<returns> Returns Updated Role details </returns>
*/

async function updateRoleDetails(roleDetails,updatedBy) {
    try {
        return await new sql.ConnectionPool(dbConn.Config).connect().then(async pool => {
            let dbResponse = await pool.request()
                .input('RoleId', sql.INT, parseInt(roleDetails.id))
                .input('RoleName', sql.NVarChar(roleDetails.name.length), roleDetails.name)
                .input('RoleDescription', sql.NVarChar(roleDetails.roledescription.length), roleDetails.roledescription) 
                .input('UpdatedBy', sql.NVarChar(updatedBy.length), updatedBy)              
                .execute("usp_UpdateRolesDetails");
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
<summary> Helps to Delete role details from Database </summary>
<param name="roleId"> Role Id </param>
<returns> Returns Deleted Role </returns>
*/

async function deleteRoleDetails(roleId,disabledBy) {
    try {
        return await new sql.ConnectionPool(dbConn.Config).connect().then(async pool => {
            let dbResponse = await pool.request()
                .input('RoleId', sql.INT, parseInt(roleId))
                .input('DisabledBy', sql.NVarChar(disabledBy.length), disabledBy)           
                .execute("usp_DeleteRoleDetailsById");
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
<summary> Helps to check Role By Role name into Database </summary>
<param name="roleDetails"> Role Details object </param>
<returns> Returns Role details if available </returns>
*/

async function checkRoleDetails(roleDetails) {
    try {
        return await new sql.ConnectionPool(dbConn.Config).connect().then(async pool => {
            let dbResponse = await pool.request()
                .input('RoleName', sql.NVarChar(roleDetails.name.length), roleDetails.name)
                .input('RoleId', sql.Int, parseInt(roleDetails.id))
                .execute("usp_CheckRoleName");
            sql.close();
            return {
                Role: dbResponse.recordset
            };
        }).catch(err => {
            sql.close();
            throw new customError.ApplicationError(err);
        });
    } catch (err) {
        throw new customError.ApplicationError(err);
    }
}


module.exports = {
    InsertRoleDetails: insertRoleDetails,
    GetRoleDetailsByName: getRoleDetailsByName,
    InsertRolePrivilegesDetails: insertRolePrivilegesDetails,
    InsertRoleGroupsDetails:insertRoleGroupsDetails,
    UpdateRoleDetails:updateRoleDetails,
    DeleteRoleDetails:deleteRoleDetails,
    InsertRoleUsersDetails:insertRoleUsersDetails,
    InsertRoleSitesDetails:insertRoleSitesDetails,
    CheckRoleDetails:checkRoleDetails
    // GetAllRoleDetails: getAllRoleDetails
}