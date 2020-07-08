/* Declare required npm Modules */
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
const fs = require('fs');
var crypto = require('crypto');

//const axios = require("axios");

const rateLimit = require("express-rate-limit");

//const dotenv = require('dotenv').config();

/* Declare Common functions */
var helperUtil = require('../service/utils/helper.utils');

/* XML body Parser module */
var xmlParser = require('express-xml-bodyparser');

/* Declare all routers */
var version1Router = require('./routes/v1/index.router');

const requestIp = require('request-ip');

const ipfilter = require('express-ipfilter').IpFilter;

/* Database Call */
let commonDbAccess= require('../service/dataaccess/common.dbaccess');

//var pem = require('pem');

var app = express();

let checkDBDetails= commonDbAccess.GetKeyInfo().then(result=>{
 console.log("Successfully connected with Database!!");
}).catch((error)=>{
  console.log("Database connection Failed!!. Check the connection details.");
  // throw new Error(error);
  process.exit(1);
});

let blacklistIP = [];

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max:1000,
  skipSuccessfulRequests:true
  // handler:function(req,res){
  //   blacklistIP.push('127.0.0.0');
  // }
});

app.use(limiter);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// var ValidateIPRequest= function(req, res, next){
//   console.log("maxCount-",maxCount);
//   console.log("process.env.Max_Retires-",process.env.Max_Retires);
//   if(maxCount!=process.env.Max_Retires){
//     maxCount=process.env.Max_Retires;
//     console.log("Limit change")
//     let limiter = rateLimit({
//       windowMs: 60 * 1000,
//       max:process.env.Max_Retires, 
//       //skipSuccessfulRequests:true,
//       handler: function(req,res){
//         console.log("Limit Handler");
//         const clientIp = requestIp.getClientIp(req); 
//         let fullIPAddress=clientIp.split(':');
//         let ipAddress= (fullIPAddress[fullIPAddress.length-1]==='1')?'127.0.0.0':fullIPAddress[fullIPAddress.length-1]==='1';
//         let isExists= blacklistIP.filter(ip => ip===ipAddress);
//         if(isExists.length===0){
//          // blacklistIP.push(ipAddress);
//         } 
//         console.log("blacklistIP-",blacklistIP);
//       }
//     });    
//     app.use(limiter);
//     console.log("limiter-",limiter);
//   }
//   next();
// }

var ValidateIPRequest=async function(req, res,next){
  let lockoutDetails= await commonDbAccess.GetLockoutInfo();
  blacklistIP = lockoutDetails.map(lockout => lockout.LockoutIPAddress);

  // if(process.env.Max_Retires!=null && process.env.Max_Retires.trim()!=""){
  //   if(process.env.Max_Retires>=req.rateLimit.current){      
  //     next();
  //   }
  //   else{
  //     const clientIp = requestIp.getClientIp(req);
  //     console.log("clientIP",clientIp); 
  //     let fullIPAddress=clientIp.split(':');
  //     let ipAddress= (fullIPAddress[fullIPAddress.length-1]==='1')?'127.0.0.0':fullIPAddress[fullIPAddress.length-1];
  //     let isExists= blacklistIP.filter(ip => ip===ipAddress);
  //     if(isExists.length===0){
  //        //blacklistIP.push(ipAddress); 
  //        console.log("Not Exists");        
  //        let insertedIPDetails= await settingsDbAccess.InsertLockoutInfo(ipAddress);         
  //     } 
  //     console.log("blacklist details-",blacklistIP);
  //     let lockoutDetails= await settingsDbAccess.GetLockoutInfo();
  //     blacklistIP = lockoutDetails.map(lockout => lockout.LockoutIPAddress);
  //     //res.status(429).send('Too many failed Request!!');
  //     //console.log("blacklistIP-",blacklistIP);
  //     next();
  //   }
  // }
  // else{
  //   next();
  // }

  next();
}

app.use(ValidateIPRequest);

const customDetection = req => {
  const clientIp = requestIp.getClientIp(req); 
    let fullIPAddress=clientIp.split(':');
    let ipAddress= (fullIPAddress[fullIPAddress.length-1]==='1')?'127.0.0.0':fullIPAddress[fullIPAddress.length-1];
 
    return ipAddress;
}

let ipValidation= function(){
return blacklistIP;
}
app.use(ipfilter(ipValidation, { detectIp: customDetection,allow:false }));



app.use(logger('dev'));
app.use(express.json());

app.use(cors());

app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/* Add XML Parser in express */
app.use(xmlParser({
  trim: false,
  explicitArray: false
}));

app.use(function(req, res, next) {
  // res.header("Access-Control-Allow-Origin", "*"); 
  // res.header("Access-Control-Allow-Headers", "*");
  // res.header("Access-Control-Request-Headers", "*");
  const clientIp = requestIp.getClientIp(req); 
  let ipAddress=clientIp.split(':');
  next();
});

let keyInfo= commonDbAccess.GetKeyInfo().then(result=>{
  if(result.length>0){
    try {
      var data = fs.readFileSync('config/EncryptionKey.txt', 'utf8');
      if(data.length===0){      
        process.env.encryptionkey="";
      }
      else{
        process.env.encryptionkey=data;
      }
    } catch(e) {
      process.env.encryptionkey="";
    }
  }
  else{
    if(!fs.existsSync('config/EncryptionKey.txt')) {
      fs.openSync('config/EncryptionKey.txt', 'w');
    }
    
    try {
      var data = fs.readFileSync('config/EncryptionKey.txt', 'utf8');
      if(data.length===0){
        const key = crypto.randomBytes(32).toString('base64');
        fs.writeFileSync('config/EncryptionKey.txt', key);
        let keyHash=helperUtil.SaltHashPassword(key);
        let insertedKeyInfo = commonDbAccess.InsertKeyInfo(keyHash.passwordHash,keyHash.salt);
        process.env.encryptionkey=key;
      }
      else{
        let keyHash=helperUtil.SaltHashPassword(data);
        let insertedKeyInfo = commonDbAccess.InsertKeyInfo(keyHash.passwordHash,keyHash.salt);
        process.env.encryptionkey=data;
      }
    } catch(error) {
      console.log('Error:', error.stack);
      throw new Error(error.message);
    }
  }
}).catch((error)=>{
  console.log("Key Error",error);
  // throw new Error(error.message);
  process.exit(1);
});


if(!fs.existsSync('config/ApplicationSecret.txt')) {
  fs.openSync('config/ApplicationSecret.txt', 'w');
}

try {
  var data = fs.readFileSync('config/ApplicationSecret.txt', 'utf8');
  if(data.length===0){
    const key = crypto.randomBytes(32).toString('base64');
    fs.writeFileSync('config/ApplicationSecret.txt', key);
    //let keyHash=helperUtil.SaltHashPassword(key);
    //let insertedKeyInfo = commonDbAccess.InsertKeyInfo(keyHash.passwordHash,keyHash.salt);
    process.env.applicationsecret=key;
  }
  else{
    process.env.applicationsecret=data;
  }
} catch(error) {
  console.log('Error:', error.stack);
  throw new Error(error.message);
}

let securityModel= commonDbAccess.GetSecurityModelDetails().then((selectedModel)=>{  
    if(selectedModel != undefined){
      process.env.Selected_SecurityModel= selectedModel.SecurityType;
    }  
}).catch((err)=>{
  console.log("Error",err);
});

// if(!fs.existsSync('certificates/private/access_private1.pem')) {
//   fs.openSync('certificates/private/access_private1.pem', 'w');
// }

// try {
//   var data = fs.readFileSync('certificates/private/access_private1.pem', 'utf8');
//   if(data.length===0){
//     const privateKey = pem.createPrivateKey(2048,{cipher:'aes128',password:'12345678'},(error,key)=>{
//       if(error){
//         console.log("error",error);
//       }
//       else{
//         fs.writeFileSync('certificates/private/access_private1.pem', key.key);
//         if(!fs.existsSync('certificates/public/access_public1.pem')) {
//           fs.openSync('certificates/public/access_public1.pem', 'w');
//         }
//         var publicKeyFile = fs.readFileSync('certificates/public/access_public1.pem', 'utf8');
//         if(publicKeyFile.length===0){
//           const publicKey=pem.getPublicKey(key.key,(error,publicKey)=>{
//             if(error){
//               console.log("error",error);
//             }
//             else{
//               console.log("Public-",publicKey);
//               fs.writeFileSync('certificates/public/access_public1.pem', publicKey.key);
//             }
//           });
//         }
//         else{

//         }
//       }
//     });    
//   }
//   else{
//     //process.env.applicationsecret=data;
//   }
// } catch(e) {
//   console.log('Error:', e.stack);
// }

if(!fs.existsSync('config/AccessTokenSecret.txt')) {
  fs.openSync('config/AccessTokenSecret.txt', 'w');
}

try {
  var data = fs.readFileSync('config/AccessTokenSecret.txt', 'utf8');
  if(data.length===0){
    const key = crypto.randomBytes(32).toString('base64');
    fs.writeFileSync('config/AccessTokenSecret.txt', key);
    process.env.accesstokensecret=key;
  }
  else{
    process.env.accesstokensecret=data;
  }
}catch(error) {
  console.log('Error:', error.stack);
  throw new Error(error.message);
}

if(!fs.existsSync('config/RefreshTokenSecret.txt')) {
  fs.openSync('config/RefreshTokenSecret.txt', 'w');
}

try {
  var data = fs.readFileSync('config/RefreshTokenSecret.txt', 'utf8');
  if(data.length===0){
    const key = crypto.randomBytes(32).toString('base64');
    fs.writeFileSync('config/RefreshTokenSecret.txt', key);
    process.env.refreshtokensecret=key;
  }
  else{
    process.env.refreshtokensecret=data;
  }
} catch(error) {
  console.log('Error:', error.stack);
  throw new Error(error.message);
}

// For Single Port Changes
//app.use(express.static('UI/ISAS'));
app.use('/api/v1', version1Router);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

if(!fs.existsSync('logs/isas-service.log')) {
  fs.openSync('logs/isas-service.log', 'w');
}

process.on('uncaughtException', (err) => {
  console.error('There was an uncaught error', err)
  process.exit(1); //mandatory (as per the Node docs)
});
if(process.env.NODE_ENV==="development"){
  process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
}

// axios.post(process.env.EC_Base_URL+':'+ process.env.EC_Port + process.env.EC_Plugin_Path + process.env.NM_Register_Path, {
//   headers: {
//       'accesstoken': ""
//   },
//   data:{
//       item: {
//         app_key: "ISAS",
//         app_name: "ISAS",
//         msg_profile_key: "Access Alerts",
//         msg_profile_display_text: "Access Alerts",
//         msg_profile_priority: "High"
//     }
//   }
// }).then((async (response) => {
//  console.log("Notification Registration Response-",response);
// })).catch((error) => {
//   console.log("Notification Registration Error-",error);
// });

// axios.get(process.env.EC_Base_URL+':'+ process.env.EC_Port + process.env.EC_Plugin_Path + process.env.NM_Register_Path, {
//   headers: {
//       'accesstoken': ""      
//   }
// }).then((async (response) => {
//  console.log("Notification Registration Response-",response);
// })).catch((error) => {
//   console.log("Notification Registration Error-",error);
// });

module.exports = app;