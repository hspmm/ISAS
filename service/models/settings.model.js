/* 
<summary> Security Model Details Response Model class </summary>
*/
class SecurityModelDetailsResponse {
    constructor(errorDetails,securityModelDetails) {        
        this.ErrorCode = 0;
        this.ErrorText = "";
        this.SecurityModel="";

        if (errorDetails) {
            this.ErrorCode = errorDetails.Status;
            this.ErrorText = errorDetails.Error.Message;
        } else {
            //this.SecurityModel=securityModelDetails.IsStandalone?"Standalone":"LDAP";
            this.SecurityModel=securityModelDetails.SecurityType;
        }
        
        return {
            SecurityModelDetailsResponse: {
                ErrorCode: this.ErrorCode,
                ErrorText: this.ErrorText,
                SecurityModel:this.SecurityModel
            }
        };
    }
}


/* 
<summary> Config Info Response Model class </summary>
*/
class ConfigInfoResponse {
    constructor(configInfoDetails) {
        let response = "";
        return {
            SecurityModelDetailsResponse: {
                SecurityModel:response
            }
        };
    }
}

/* 
<summary> Lockout Details Response Model class </summary>
*/
class LockoutDetailsResponse {
    constructor(errorDetails,lockoutDetails) {        
        this.ErrorCode = 0;
        this.ErrorText = "";
        this.LockoutDetails=[];

        if (errorDetails) {
            this.ErrorCode = errorDetails.Status;
            this.ErrorText = errorDetails.Error.Message;
        } else {
            lockoutDetails.forEach(element => {
                this.LockoutDetails.push({
                 LockoutIP:{
                        IPAddress: element.LockoutIPAddress,
                        LockedDateTime: element.LockedDateTime
                }});
            });  
        }
        
        return {
            LockoutDetailsResponse: {
                ErrorCode: this.ErrorCode,
                ErrorText: this.ErrorText,
                LockoutDetails:this.LockoutDetails
            }
        };
    }
}

/* 
<summary> General Config Response Model class </summary>
*/
class GeneralConfigResponse {
    constructor(errorDetails,generalConfig) {       
        this.ErrorCode = 0;
        this.ErrorText = "";
        this.GeneralConfig={};

        if (errorDetails) {
            this.ErrorCode = errorDetails.Status;
            this.ErrorText = errorDetails.Error.Message;
        } else {
            this.GeneralConfig={
                LockoutPeriod: generalConfig.LockoutPeriod,
                MaxRetires: generalConfig.MaxRetires,
                MaxLoginAttempts: generalConfig.MaxLoginAttempts
            };
        }
        
        return {
            GeneralConfigResponse: {
                ErrorCode: this.ErrorCode,
                ErrorText: this.ErrorText,
                GeneralConfig:this.GeneralConfig
            }
        };
    }
}

/* 
<summary> General Config Response Model class </summary>
*/
class GeneralConfigUpdateResponse {
    constructor(errorDetails,generalConfig) {       
        this.ErrorCode = 0;
        this.ErrorText = "";
        this.GeneralConfig={};

        if (errorDetails) {
            this.ErrorCode = errorDetails.Status;
            this.ErrorText = errorDetails.Error.Message;
        } else {
            this.GeneralConfig={
                LockoutPeriod: generalConfig.LockoutPeriod,
                MaxRetires: generalConfig.MaxRetires,
                MaxLoginAttempts: generalConfig.MaxLoginAttempts
            };
        }
        
        return {
            GeneralConfigUpdateResponse: {
                ErrorCode: this.ErrorCode,
                ErrorText: this.ErrorText,
                GeneralConfig:this.GeneralConfig
            }
        };
    }
}

/* 
<summary> Key Info Response Model class </summary>
*/
class KeyInformationResponse {
    constructor(errorDetails,key) {       
        this.ErrorCode = 0;
        this.ErrorText = "";
        this.Key="";

        if (errorDetails) {
            this.ErrorCode = errorDetails.Status;
            this.ErrorText = errorDetails.Error.Message;
        } else {
           this.Key=key;
        }
        
        return {
            KeyInformationResponse: {
                ErrorCode: this.ErrorCode,
                ErrorText: this.ErrorText,
                Key:this.Key
            }
        };
    }
}

/* 
<summary> Update Key Info Response Model class </summary>
*/
// class UpdateKeyInfoResponse {
//     constructor(errorDetails,status) {       
//         this.ErrorCode = 0;
//         this.ErrorText = "";
//         this.Status=false;

//         if (errorDetails) {
//             this.ErrorCode = errorDetails.Status;
//             this.ErrorText = errorDetails.Error.Message;
//         } else {
//            this.Status=status;
//         }
        
//         return {
//             UpdateKeyInfoResponse: {
//                 ErrorCode: this.ErrorCode,
//                 ErrorText: this.ErrorText,
//                 Status:this.Status
//             }
//         };
//     }
// }

module.exports = {
    SecurityModelDetailsResponse: SecurityModelDetailsResponse,
    ConfigInfoResponse :ConfigInfoResponse,
    LockoutDetailsResponse:LockoutDetailsResponse,
    GeneralConfigResponse:GeneralConfigResponse,
    GeneralConfigUpdateResponse:GeneralConfigUpdateResponse,
    KeyInformationResponse:KeyInformationResponse,
   // UpdateKeyInfoResponse:UpdateKeyInfoResponse
};