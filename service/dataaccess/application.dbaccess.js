/* Declare required npm packages */
var sql = require('mssql');

/* Declare Database connection */
var dbConn = require('../dataaccess/sqlconnection');

/* Declare Validators */
var applicationValidator = require('../validators/application.validator');

/* Custom Error */
var customError = require('../errors/custom.error');

/*
<summary> Helps to Insert application details into Database </summary>
<param name="applicationDetails"> Application Details object </param>
<returns> Returns Inserted Application details </returns>
*/

async function insertApplicationDetails(applicationName,applicationVersion, applicationCode, applicationSecret, applicationUid, adminEmail, adminName) {
    try {
        let appAdminName= (adminName && adminName.trim().length>0 && adminName!=null)?adminName.trim():"";
        let adminNameLength= (appAdminName!="")?appAdminName.length:1;

        let appAdminEmail= (adminEmail && adminEmail.trim().length>0 && adminEmail!=null)?adminEmail.trim():"";
        let emailLength= (appAdminEmail!="")?appAdminEmail.length:1;

        return await new sql.ConnectionPool(dbConn.Config).connect().then(async pool => {
            let dbResponse = await pool.request()
                .input('ApplicationCode', sql.NVarChar(applicationCode.length), applicationCode)
                .input('ApplicationName', sql.NVarChar(applicationName.length), applicationName)
                .input('ApplicationSecret', sql.NVarChar(applicationSecret.length), applicationSecret)
                .input('ApplicationVersion', sql.NVarChar(applicationVersion.length), applicationVersion)
                .input('ApplicationUid', sql.NVarChar(applicationUid.length), applicationUid)
                .input('AdminName', sql.NVarChar(adminNameLength), appAdminName)
                .input('AdminEmailId', sql.NVarChar(emailLength), appAdminEmail)
                .execute("usp_InsertApplicationDetails");
            sql.close();
            return dbResponse;
        }).catch(err => {
            sql.close();
            throw new customError.ApplicationError(err);
        });
    } catch (err) {
        throw new customError.ApplicationError(err);
    }
}

/*
<summary> Helps to Get application details by Application Name and Application Version from Database </summary>
<param name="applicationDetails"> Application Name and Version </param>
<returns> Returns Application details </returns>
*/

async function getAppDetailsByNameAndVersion(applicationName, applicationVersion) {
    try {
        return await new sql.ConnectionPool(dbConn.Config).connect().then(async pool => {
            let dbResponse = await pool.request()
                .input('ApplicationName', sql.NVarChar(applicationName.length), applicationName)
                .input('ApplicationVersion', sql.NVarChar(applicationVersion.length), applicationVersion)
                .execute("usp_GetApplicationDetailsByNameAndVersion");
            sql.close();
            return dbResponse;
        }).catch(err => {
            sql.close();
            throw new customError.ApplicationError(err);
        });
    } catch (err) {
        throw new customError.ApplicationError(err);
    }
}

/*
<summary> Helps to Get application details by Application Code from Database </summary>
<param name="applicationCode"> Application Code </param>
<returns> Returns Application details </returns>
*/

async function getAppDetailsByCode(applicationCode) {
    try {
        return await new sql.ConnectionPool(dbConn.Config).connect().then(async pool => {
            let dbResponse = await pool.request()
                .input('ApplicationCode', sql.NVarChar(applicationCode.length), applicationCode)
                .execute("usp_GetApplicationDetailsByCode");
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
<summary> Helps to Update Token Validity </summary>
<param name="tokenValidity"> Token Validity </param>
<param name="applicationVersionId"> Application Version Id </param>
<returns> Returns Application Token Validity </returns>
*/

async function updateTokenValidity(tokenValidity,applicationVersionId) {
    try {
        return await new sql.ConnectionPool(dbConn.Config).connect().then(async pool => {
            let dbResponse = await pool.request()
                .input('TokenValidity', sql.INT, tokenValidity)
                .input('ApplicationVersionId', sql.INT, applicationVersionId)
                .execute("usp_UpdateTokenValidity");
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
    InsertApplicationDetails: insertApplicationDetails,
    GetAppDetailsByNameAndVersion: getAppDetailsByNameAndVersion,
    GetAppDetailsByCode: getAppDetailsByCode,
    UpdateTokenValidity:updateTokenValidity
}