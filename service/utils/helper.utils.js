/* Declare required npm packages */
var jsonxml = require('jsontoxml');
var crypto = require('crypto');
var moment = require('moment');
const axios = require("axios");
var fs=require('fs');

const dotenv = require('dotenv');
//const algorithm = 'aes-256-cbc';
//const key = crypto.randomBytes(32);
//const key = process.env.encryptionkey;
const iv = crypto.randomBytes(16);

/* Custom Error */
var customError = require('../errors/custom.error');

/* Database Access */
var applicationDbAccess = require('../dataaccess/application.dbaccess');

/*
<summary> Helps to create Application Secret </summary>
<param name="applicationDetails"> Application Details object </param>
<param name="secretKey"> Secret Key to create hash </param>
<returns> Returns Application Secret </returns>
*/
function CreateApplicationSecret(applicationName,applicationVersion, secretKey) {
    try {
        //const applicationDetailsValidator = require('../validators/application.validator');
        //var validationResult = applicationDetailsValidator.ApplicationRegistrationSchema.validate(applicationDetails);
        //if (validationResult == "") {
            const crypto = require('crypto');

            const hash = crypto.createHmac('sha256', secretKey)
                .update(applicationName + ":" + applicationVersion)
                .digest('hex');

            return hash;
        // } else {
        //     throw new customError.ApplicationError(validationResult);
        // }
    } catch (error) {
        throw new customError.ApplicationError(error);
    }
}

/*
<summary> Helps to generate JSON and XML response </summary>
<param name="req"> Request object </param>
<param name="res"> Response object </param>
<param name="message"> Content to be return as response </param>
<param name="statusCode"> Response status code </param>
<returns> Return Message to the JSON or XML format based on request accept type </returns>
*/
function GenerateJSONAndXMLResponse(req, res, message, statusCode) {
    try {
        // var options = {
        //     compact: true,
        //     ignoreComment: true,
        //     spaces: 4,
        //     alwaysArray: true
        // };

        if (req.headers.accept && req.headers.accept.toLowerCase() == "application/xml") {            
            //res.status(statusCode).send(convert.json2xml(message, options));
            res.status(statusCode).send(jsonxml(message));
        } else {
            res.status(statusCode).json(message);
        }
    } catch (error) {
        throw new Error(error);
    }
}

/*
<summary> Helps to validate Application Secret </summary>
<param name="applicationDetails"> Application Details object </param>
<param name="secretKey"> Secret Key to create hash </param>
<returns> Returns Application Secret </returns>
*/
async function ValidateApplicationSecret(applicationCode, requestTime, hashValue, isAdminApplication) {
    try {
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
                let applicationId = 0;
                let tokenValidity = 0;
                //let isAdminApplication = false;
                let appDetails = await applicationDbAccess.GetAppDetailsByCode(applicationCode);
                if (appDetails.length > 0) {
                    const hash = crypto.createHmac('sha256', appDetails[0].ApplicationSecret)
                        .update(requestTime)
                        .digest('hex');
    
                    if (hash === hashValue && isAdminApplication === true && appDetails[0].IsAdminApplication === true) {
                        applicationId = appDetails[0].ApplicationVersionId;
                        tokenValidity = appDetails[0].TokenValidity;
                        return await {
                            ApplicationVersionId:applicationId,
                            TokenValidity: tokenValidity,
                            IsAdminApplication:appDetails[0].IsAdminApplication  
                        };
                    } else if (hash === hashValue && isAdminApplication === false) {
                        applicationId = appDetails[0].ApplicationVersionId;
                        tokenValidity = appDetails[0].TokenValidity;
                        return await {
                            ApplicationVersionId:applicationId,
                            TokenValidity: tokenValidity,
                            IsAdminApplication:appDetails[0].IsAdminApplication  
                        };
                    } else {
                        return await {
                            ApplicationVersionId:applicationId,
                            TokenValidity: tokenValidity,
                            IsAdminApplication:isAdminApplication
                        };
                    }
                } else {
                    throw new customError.ApplicationError("Unauthorized Access", 401);
                }
            } else {
                throw new customError.ApplicationError("Unauthorized Access", 401);
            }
            }
            else{
                throw new customError.ApplicationError("Unauthorized Access", 401);
            }
           
    } catch (error) {
        throw new customError.ApplicationError(error);
    }
}

/*
<summary> Helps to Encrypt Data </summary>
<param name="data"> Data </param>
<returns> Returns Encrypted Data </returns>
*/
function EncryptData(data) {
    try{
        let key= process.env.encryptionkey;
        let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key,'base64'), iv);
        let encrypted = cipher.update(data);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        let encryptedData= iv.toString('hex')+encrypted.toString('hex');
        let base64Data=Buffer.from(encryptedData).toString('base64');
        return base64Data;
    }
    catch(error){
        throw new customError.ApplicationError(error);
    }   
}

/*
<summary> Helps to Decrypt Data </summary>
<param name="encrptedData"> encrptedData </param>
<returns> Returns Decrpted Data </returns>
*/
function DecryptData(data) {
    try{
        // Convert Base64 to ASCII
        data= Buffer.from(data, 'base64').toString('ascii');
        let key= process.env.encryptionkey;
        if(data.length>32){
            let iv = data.slice(0,32);
            let encryptedText = data.slice(32,data.length);
            iv = Buffer.from(iv, 'hex');
            encryptedText = Buffer.from(encryptedText, 'hex');
            let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key,'base64'), iv);
            let decrypted = decipher.update(encryptedText);
            decrypted = Buffer.concat([decrypted, decipher.final()]);
            return decrypted.toString();
        }
        else{
            throw new customError.ApplicationError("Invalid Data",422);
        } 
    }
    catch(error){
        throw new customError.ApplicationError(error);
    }    
}

/**
 * generates random string of characters i.e salt
 * @function
 * @param {number} length - Length of the random string.
 */
function getRandomString(length){
    return crypto.randomBytes(Math.ceil(length/2))
            .toString('hex') /** convert to hexadecimal format */
            .slice(0,length);   /** return required number of characters */
};

/**
 * hash password with sha512.
 * @function
 * @param {string} password - List of required fields.
 * @param {string} salt - Data to be validated.
 */
function getPasswordHash(password, salt){
    var hash = crypto.createHmac('sha256', salt); /** Hashing algorithm sha256 */
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt:salt,
        passwordHash:value
    };
};

/**
 * Salt Hash password 
 * @function
 * @param {string} userPassword - List of required fields.
 */

function saltHashPassword(userPassword) {
    var salt = getRandomString(16); /** Gives us salt of length 16 */
    var passwordData = getPasswordHash(userPassword, salt);
    // console.log('UserPassword = '+userpassword);
    // console.log('Passwordhash = '+passwordData.passwordHash);
    // console.log('nSalt = '+passwordData.salt);
    return passwordData;
}

function getPasswordEncryptData(storedPassword,passwordHash) {
    try{       
        let data= Buffer.from(storedPassword, 'base64').toString('ascii');
        if(data.length>32){
            let iv = data.slice(0,32);
            iv = Buffer.from(iv, 'hex');
            let key= process.env.encryptionkey;
            let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key,'base64'), iv);
            let encrypted = cipher.update(passwordHash);
            encrypted = Buffer.concat([encrypted, cipher.final()]);
            let encryptedData= iv.toString('hex')+encrypted.toString('hex');
            let base64Data=Buffer.from(encryptedData).toString('base64');
            return base64Data;
        }
        else{
            throw new customError.ApplicationError("Invalid Data",422);
        }       
    }
    catch(error){
        throw new customError.ApplicationError(error);
    }  
}

/*
<summary> Helps to Encrypt Data with Password </summary>
<param name="data"> Data </param>
<returns> Returns Encrypted Data </returns>
*/
function EncryptDataWithPassword(data,password) {
    try{
        let key= crypto.createHash('sha256').update(String(password)).digest('base64').substr(0, 32);
        let cipher = crypto.createCipheriv('aes-256-cbc',  key, iv);
        let encrypted = cipher.update(data);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        let encryptedData= iv.toString('hex')+encrypted.toString('hex');
        let base64Data=Buffer.from(encryptedData).toString('base64');
        return base64Data;
    }
    catch(error){
        throw new customError.ApplicationError(error);
    }   
}

/*
<summary> Helps to Decrypt Data with Password</summary>
<param name="encrptedData"> encrptedData </param>
<returns> Returns Decrpted Data </returns>
*/
function DecryptDataWithPassword(data,password) {
    try{
        // Convert Base64 to ASCII
        data= Buffer.from(data, 'base64').toString('ascii');
        let key= crypto.createHash('sha256').update(String(password)).digest('base64').substr(0, 32);;
        if(data.length>32){
            let iv = data.slice(0,32);
            let encryptedText = data.slice(32,data.length);
            iv = Buffer.from(iv, 'hex');
            encryptedText = Buffer.from(encryptedText, 'hex');
            let decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
            let decrypted = decipher.update(encryptedText);
            decrypted = Buffer.concat([decrypted, decipher.final()]);
            return decrypted.toString();
        }
        else{
            throw new customError.ApplicationError("Invalid Data",422);
        } 
    }
    catch(error){
        throw new customError.ApplicationError("Invalid Data",422);
    }    
}

/*
<summary> Helps to ISAS Notification to Notification Manager </summary>
<param name="req"> Request object </param>
<param name="res"> Response object </param>
<returns> Return Message Status  </returns>
*/
async function sendNotification(message, messageType){
    try{
        if(process.env.NM_Application_Secret!="" && process.env.NM_Application_Code!=""){
            //console.log("Send Notification");
            let UtcDateTime = moment.utc().format();
            let hmac = await crypto.createHmac('sha256', process.env.NM_Application_Secret).update(UtcDateTime.toString()).digest('hex');
            let jsonObj = process.env.NM_Application_Code + ":" + UtcDateTime.toString() + ":" + hmac;
            let hashedBase64 = Buffer.from(jsonObj).toString('base64');
            //console.log("HMAC-",hashedBase64);
            //console.log("UtcDateTime-",UtcDateTime);
            axios.post(process.env.EC_Base_URL+':'+ process.env.EC_Port + process.env.EC_Plugin_Path + process.env.NM_Message_Path, {
                 item: [{
                        msg_app_key: "ISAS",
                        msg_profile_key: "Access Alerts",                    
                        msg_profile_priority: "High",
                        msg_type: messageType,
                        msg_text: message,
                        created_on: UtcDateTime
                    }]            
            },{
                headers:{
                    accesstoken:hashedBase64
                }
            }).then((async (response) => {
                console.log("Notification Send Response Success");
            })).catch((error) => {
                console.log("Notification Send Error-",error);
            });
        }      
    }
    catch(error){
        console.log("NM Send Catch",error);
    } 
}

/*
<summary> Helps to Register ISAS with Notification Manager </summary>
<param name="req"> Request object </param>
<param name="res"> Response object </param>
<returns> Return Registration Status  </returns>
*/
async function registerNotification(){
    try{
        if(process.env.NM_Application_Secret!="" && process.env.NM_Application_Code!=""){
            //console.log("Register Notification");
            let UtcDateTime = moment.utc().format();
            let hmac = await crypto.createHmac('sha256', process.env.NM_Application_Secret).update(UtcDateTime.toString()).digest('hex');
            let jsonObj = process.env.NM_Application_Code + ":" + UtcDateTime.toString() + ":" + hmac;
            let hashedBase64 = Buffer.from(jsonObj).toString('base64');
        
           return await axios.post(process.env.EC_Base_URL+':'+ process.env.EC_Port + process.env.EC_Plugin_Path + process.env.NM_Register_Path, {
                item: {
                        app_key: "ISAS",
                        app_name: "ISAS",
                        msg_profile_key: "Access Alerts",
                        msg_profile_display_text: "Access Alerts",
                        msg_profile_priority: "High"
                    }            
            },{
                headers:{
                    accesstoken:hashedBase64
                }
            }).then((async (response) => {
                process.env.IsNotificationRegistered=true;
                let envConfig = dotenv.parse(fs.readFileSync('.env'));
                let fileContent='';
                for (let key in envConfig) {
                    envConfig[key] = process.env[key];
                    fileContent=fileContent+key +"="+envConfig[key] +"\n";
                }
                const data = fs.writeFileSync('.env', fileContent);  
                
                console.log("Notification Registration Success");  
                return true;               
            })).catch((error) => {
                if(error.response.data.errorMessage && (error.response.data.errorMessage.status).toLowerCase() === 'failure' && error.response.data.errorMessage.db_error_code && error.response.data.errorMessage.db_error_code == 2627 ){
                    process.env.IsNotificationRegistered=true;
                    let envConfig = dotenv.parse(fs.readFileSync('.env'));
                    let fileContent='';
                    for (let key in envConfig) {
                        envConfig[key] = process.env[key];
                        fileContent=fileContent+key +"="+envConfig[key] +"\n";
                    }
                    const data = fs.writeFileSync('.env', fileContent);  
                    
                    console.log("Notification Registration Success");  
                    return true;
                }else{
                    console.log("Notification Registration Error-",error);  
                    return false;
                }                              
            });
        }
    }
    catch(error){
        console.log("Notification Registration Error",error);       
        return false;
    } 
    
}

module.exports = {
    CreateApplicationSecret: CreateApplicationSecret,
    GenerateJSONAndXMLResponse: GenerateJSONAndXMLResponse,
    ValidateApplicationSecret: ValidateApplicationSecret,
    EncryptData: EncryptData,
    DecryptData:DecryptData,
    SaltHashPassword:saltHashPassword,
    GetPasswordHash: getPasswordHash,
    GetPasswordEncryptData:getPasswordEncryptData,
    EncryptDataWithPassword:EncryptDataWithPassword,
    DecryptDataWithPassword:DecryptDataWithPassword,
    SendNotification:sendNotification,
    RegisterNotification: registerNotification
};