/* Declare required npm packages */
var sql = require('mssql');

/* Custom Error */
var customError = require('../errors/custom.error');

/* Declare Database connection */
var dbConn = require('../dataaccess/sqlconnection');


/*
<summary> Helps to Get Imprivata details from Database </summary>
<param name="imprivataDetails"> Imprivata details </param>
<returns> Returns Imprivata details </returns>
*/

async function getImprivataDetails(imprivataDetails) {
    try {
        return await new sql.ConnectionPool(dbConn.Config).connect().then(async pool => {
            let dbResponse;
            dbResponse = await pool.request()
                .input('ConfigName', sql.NVarChar(imprivataDetails.configName.length), imprivataDetails.configName)
                .input('ServerHostName', sql.NVarChar(imprivataDetails.serverHostname.length), imprivataDetails.serverHostname)
                .input('ServerPort', sql.INT, parseInt(imprivataDetails.serverPort))
                .input('ApiPath', sql.NVarChar(imprivataDetails.apiPath.length), imprivataDetails.apiPath)
                .input('ApiVersion', sql.NVarChar(imprivataDetails.apiVersion.length), imprivataDetails.apiVersion)
                .input('ProductCode', sql.NVarChar(imprivataDetails.productCode.length), imprivataDetails.productCode)
                .execute("usp_GetImprivataDetails");
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
<summary> Helps to Check Imprivata details from Database </summary>
<param name="imprivataDetails"> Imprivata details </param>
<returns> Returns Imprivata details </returns>
*/

async function checkImprivataDetails(imprivataDetails) {
    try {
        return await new sql.ConnectionPool(dbConn.Config).connect().then(async pool => {
            let dbResponse;
            dbResponse = await pool.request()
                .input('ImprivataConfigId',  sql.INT, parseInt(imprivataDetails.serverPort))
                .input('ConfigName', sql.NVarChar(imprivataDetails.configName.length), imprivataDetails.configName)
                .input('ServerHostName', sql.NVarChar(imprivataDetails.serverHostname.length), imprivataDetails.serverHostname)
                .input('ServerPort', sql.INT, parseInt(imprivataDetails.serverPort))
                .input('ApiPath', sql.NVarChar(imprivataDetails.apiPath.length), imprivataDetails.apiPath)
                .input('ApiVersion', sql.NVarChar(imprivataDetails.apiVersion.length), imprivataDetails.apiVersion)
                .input('ProductCode', sql.NVarChar(imprivataDetails.productCode.length), imprivataDetails.productCode)
                .execute("usp_CheckImprivataDetails");
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
<summary> Helps to insert Imprivata details into Database </summary>
<param name="imprivataDetails"> Imprivata Details object </param>
<returns> Returns inserted Imprivata details </returns>
*/

async function insertImprivataDetails(imprivataDetails,createdBy) {
    try {
      
        return await new sql.ConnectionPool(dbConn.Config).connect().then(async pool => {
            let dbResponse = await pool.request()
                .input('ConfigName', sql.NVarChar(imprivataDetails.configName.length), imprivataDetails.configName)
                .input('ServerHostName', sql.NVarChar(imprivataDetails.serverHostname.length), imprivataDetails.serverHostname)
                .input('ServerPort', sql.INT, parseInt(imprivataDetails.serverPort))
                .input('ApiPath', sql.NVarChar(imprivataDetails.apiPath.length), imprivataDetails.apiPath)
                .input('ApiVersion', sql.NVarChar(imprivataDetails.apiVersion.length), imprivataDetails.apiVersion)
                .input('ProductCode', sql.NVarChar(imprivataDetails.productCode.length), imprivataDetails.productCode)
                .input('IsSslSelected', sql.Bit, (imprivataDetails.isSslSelected.toLowerCase() === 'true' ? 1 : 0))
                .input('CreatedBy', sql.NVarChar(createdBy.length), createdBy)
                .execute("usp_InsertImprivataDetails");
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
<summary> Helps to update Imprivata details into Database </summary>
<param name="imprivataDetails"> Imprivata Details object </param>
<returns> Returns updated Imprivata details </returns>
*/

async function updateImprivataDetails(imprivataDetails,updatedBy) {
    try {
        return await new sql.ConnectionPool(dbConn.Config).connect().then(async pool => {
            let dbResponse = await pool.request()
                .input('ImprivataConfigId', sql.INT, parseInt(imprivataDetails.imprivataConfigId))
                .input('ConfigName', sql.NVarChar(imprivataDetails.configName.length), imprivataDetails.configName)
                .input('ServerHostName', sql.NVarChar(imprivataDetails.serverHostname.length), imprivataDetails.serverHostname)
                .input('ServerPort', sql.INT, parseInt(imprivataDetails.serverPort))
                .input('ApiPath', sql.NVarChar(imprivataDetails.apiPath.length), imprivataDetails.apiPath)
                .input('ApiVersion', sql.NVarChar(imprivataDetails.apiVersion.length), imprivataDetails.apiVersion)
                .input('ProductCode', sql.NVarChar(imprivataDetails.productCode.length), imprivataDetails.productCode)
                .input('IsSslSelected', sql.Bit, (imprivataDetails.isSslSelected.toLowerCase() === 'true' ? 1 : 0))
                .input('UpdatedBy', sql.NVarChar(updatedBy.length), updatedBy)
                .execute("usp_UpdateImprivataDetails");
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
<summary> Helps to Delete Imprivata details from Database </summary>
<param name="imprivataConfigId"> Imprivata Config Id </param>
<returns> Returns Deleted Imprivata </returns>
*/

async function deleteImprivataDetails(imprivataConfigId,disabledBy) {
    try {
        return await new sql.ConnectionPool(dbConn.Config).connect().then(async pool => {
            let dbResponse = await pool.request()
                .input('ImprivataConfigId', sql.INT, parseInt(imprivataConfigId))
                .input('DisabledBy', sql.NVarChar(disabledBy.length), disabledBy)
                .execute("usp_DeleteImprivataDetailsById");
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
    GetImprivataDetails: getImprivataDetails,
    InsertImprivataDetails:insertImprivataDetails,
    UpdateImprivataDetails:updateImprivataDetails,
    CheckImprivataDetails:checkImprivataDetails,
    DeleteImprivataDetails:deleteImprivataDetails
}