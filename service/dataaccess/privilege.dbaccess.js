/* Declare required npm packages */
var sql = require('mssql');

/* Declare Database connection */
var dbConn = require('../dataaccess/sqlconnection');

/* Custom Error */
var customError = require('../errors/custom.error');

/*
<summary> Helps to Insert Privilege details into Database </summary>
<param name="privilegeDetails"> Privilege Details object </param>
<returns> Returns Inserted Privilege details </returns>
*/

async function insertPrivilegeDetails(privilegeDetails, applicationId) {
    try {
        let privilegeName= privilegeDetails.name.trim().toLowerCase().split(" ").map(word => word.charAt(0).toUpperCase()+ word.slice(1)).join(" ");
        let privilegeKey= privilegeDetails.key.trim().toLowerCase().split(" ").map(word => word.charAt(0).toUpperCase()+ word.slice(1)).join(" ");
        return await new sql.ConnectionPool(dbConn.Config).connect().then(async pool => {
            let dbResponse = await pool.request()
                .input('PrivilegeName', sql.NVarChar(privilegeName.length), privilegeName)
               // .input('PrivilegeDescription', sql.NVarChar(privilegeDetails.description.length), privilegeDetails.description)
                .input('PrivilegeKey', sql.NVarChar(privilegeKey.length), privilegeKey)
                .input('ApplicationVersionId', sql.Int, applicationId)
                // .input('CreationTime', sql.DateTime, new Date())
                .execute("usp_InsertPrivilegesDetails");
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
    InsertPrivilegeDetails: insertPrivilegeDetails
}