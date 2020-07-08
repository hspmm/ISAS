/* Declare required npm packages */
var sql = require('mssql');

/* Declare Database connection */
var dbConn = require('../dataaccess/sqlconnection');

/* Custom Error */
var customError = require('../errors/custom.error');

/*
<summary> Helps to Insert Token details into Database </summary>
<param name="tokenDetails"> Token Details object </param>
<returns> Returns Inserted Token details </returns>
*/

async function insertTokenDetails(tokenDetails) {
    try {
        if (tokenDetails.IsRefreshToken === true) {
            if (tokenDetails.OldRefreshToken != undefined && tokenDetails.OldRefreshToken.length > 0) {
                return await new sql.ConnectionPool(dbConn.Config).connect().then(async pool => {
                    let dbResponse = await pool.request()
                        .input('AccessToken', sql.NVarChar(tokenDetails.AccessToken.length), tokenDetails.AccessToken)
                        .input('RefreshToken', sql.NVarChar(tokenDetails.RefreshToken.length), tokenDetails.RefreshToken)
                        // .input('OldAccessToken', sql.NVarChar(tokenDetails.OldAccessToken.length), tokenDetails.OldAccessToken)
                        .input('OldRefreshToken', sql.NVarChar(tokenDetails.OldRefreshToken.length), tokenDetails.OldRefreshToken)
                        .input('AccessExpiry', sql.DateTime, new Date(tokenDetails.AccessExpiry))
                        .input('RefreshExpiry', sql.DateTime, new Date(tokenDetails.RefreshExpiry))
                        .input('LoginApplicationId', sql.INT, tokenDetails.ApplicationId)
                        .input('Username', sql.NVarChar(tokenDetails.Username.length), tokenDetails.Username)
                        .input('UserId', sql.INT, (tokenDetails.UserId) ? tokenDetails.UserId : 0)
                        .execute("usp_InsertTokenDetails");
                    sql.close();
                    return dbResponse.recordset[0];
                }).catch(err => {
                    sql.close();
                    throw new customError.ApplicationError(err);
                });
            }
        } else if (tokenDetails.IsRefreshToken === false) {
            return await new sql.ConnectionPool(dbConn.Config).connect().then(async pool => {
                let dbResponse = await pool.request()
                    .input('AccessToken', sql.NVarChar(tokenDetails.AccessToken.length), tokenDetails.AccessToken)
                    .input('RefreshToken', sql.NVarChar(tokenDetails.RefreshToken.length), tokenDetails.RefreshToken)
                    .input('AccessExpiry', sql.DateTime, new Date(tokenDetails.AccessExpiry))
                    .input('RefreshExpiry', sql.DateTime, new Date(tokenDetails.RefreshExpiry))
                    .input('LoginApplicationId', sql.INT, tokenDetails.ApplicationId)
                    .input('Username', sql.NVarChar(tokenDetails.Username.length), tokenDetails.Username)
                    .input('UserId', sql.INT, (tokenDetails.UserId) ? tokenDetails.UserId : 0)
                    .execute("usp_InsertTokenDetails");
                sql.close();
                return dbResponse.recordset[0];
            }).catch(err => {
                sql.close();
                throw new customError.ApplicationError(err);
            });
        }
    } catch (err) {
        throw new customError.ApplicationError(err);
    }
}

/*
<summary> Helps to Check Token expiry into Database </summary>
<param name="tokenDetails"> Token Details object </param>
<returns> Returns valid Token details </returns>
*/

async function checkTokenExpiry(tokenDetails) {
    try {
        if (tokenDetails.IsRefreshToken === true) {
            if (tokenDetails.RefreshToken != undefined && tokenDetails.RefreshToken.length > 0) {
                return await new sql.ConnectionPool(dbConn.Config).connect().then(async pool => {
                    let dbResponse = await pool.request()
                        .input('RefreshToken', sql.NVarChar(tokenDetails.RefreshToken.length), tokenDetails.RefreshToken)
                        .input('IsAccessToken', sql.Bit, false)
                        .input('IsRefreshToken', sql.Bit, true)
                        .execute("usp_CheckTokenExpiry");
                    sql.close();
                    return dbResponse.recordset;
                }).catch(err => {
                    sql.close();
                    throw new customError.ApplicationError(err);
                });
            }
        } else if (tokenDetails.IsAccessToken === true) {
            if (tokenDetails.AccessToken != undefined && tokenDetails.AccessToken.length > 0) {
                return await new sql.ConnectionPool(dbConn.Config).connect().then(async pool => {
                    let dbResponse = await pool.request()
                        .input('AccessToken', sql.NVarChar(tokenDetails.AccessToken.length), tokenDetails.AccessToken)
                        .input('IsAccessToken', sql.Bit, true)
                        .input('IsRefreshToken', sql.Bit, false)
                        .execute("usp_CheckTokenExpiry");
                    sql.close();
                    return dbResponse.recordset;
                }).catch(err => {
                    sql.close();
                    throw new customError.ApplicationError(err);
                });
            }
        }
    } catch (err) {
        throw new customError.ApplicationError(err);
    }
}


/*
<summary> Helps to Update Logout details into Database </summary>
<param name="tokenDetails"> Token Details object </param>
<returns> Returns Logout Status</returns>
*/

async function updateLogoutDetails(accessToken, applicationId) {
    try {
        return await new sql.ConnectionPool(dbConn.Config).connect().then(async pool => {
            let dbResponse = await pool.request()
                .input('AccessToken', sql.NVarChar(accessToken.length), accessToken)
                .input('ApplicationId', sql.INT, applicationId)
                .execute("usp_UpdateLogoutDetails");
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
    InsertTokenDetails: insertTokenDetails,
    CheckTokenExpiry: checkTokenExpiry,
    UpdateLogoutDetails: updateLogoutDetails
}