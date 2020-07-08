var env = process.env.NODE_ENV || 'development';
let applicationDetails = require('../dataaccess/sqlconnection').ApplicationConfig[env];

let ConfigInfo = {
  name: process.env.APP_NAME,
  uniqueName : process.env.UNIQUE_APP_NAME,
  version: 0.1,
  uiPort: process.env.UI_PORT,
  description: process.env.DESCRIPTION,
  baseUrl: applicationDetails.URL,
  type:"Default",
  instances : 1,
  serverPort: process.env.PORT,
  prependUrl: "/api/v1",
  iconUrl :process.env.APP_ICON,
  uiUrls: 
      {
          home: process.env.Home_URL
      },
  serverUrls : {
      applicationRegistration : process.env.API_Application_Registration,
      userAuthentication : process.env.API_User_Authentication,
      privilegeRegistration : process.env.API_Privilege_Registration,
      introspect : process.env.API_Introspect,
      getNewToken: process.env.API_GetNewToken,
      createDefaultUser: process.env.API_User_DefaultUser,
      getSecurityModel: process.env.API_Security_Model,
      validateApplication: process.env.API_Validate_Application,
      uploadEncryptionKey: process.env.API_Upload_Encryption_Key
  }
}

module.exports={  
  ConfigInfoResponse :ConfigInfo 
};