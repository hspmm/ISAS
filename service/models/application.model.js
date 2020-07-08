/* 
<summary> Application Registration Response Model class </summary>
*/
class RegistrationResponse {
    constructor(errorDetails, applicationDetails, isNewapplication) {
        this.ErrorCode = 0;
        this.ErrorText = "";
        this.Application_Id = "";
        this.Application_Secret = "";
        this.Application_GUID = "";
        this.IsNewApplication = null;

        if (errorDetails) {
            this.ErrorCode = errorDetails.Status;
            this.ErrorText = errorDetails.Error.Message;
        } else {
            this.Application_Id = applicationDetails.ApplicationCode;
            this.Application_Secret = applicationDetails.ApplicationSecret;
            this.Application_GUID = applicationDetails.ApplicationUid;
            this.IsNewApplication = isNewapplication || false;
        }

        return {
            RegistrationResponse: {
                ErrorCode: this.ErrorCode,
                ErrorText: this.ErrorText,
                Application_Id: this.Application_Id,
                Application_Secret: this.Application_Secret,
                Application_GUID: this.Application_GUID,
                IsNewApplication: this.IsNewApplication
            }
        };
    }
}

/* 
<summary> Application Details Response Model class </summary>
*/
class ApplicationDetailsResponse {
    constructor(errorDetails,arrayApplicationDetails) {
        this.ErrorCode = 0;
        this.ErrorText = "";
        this.Applications=[];

        if (errorDetails) {
            this.ErrorCode = errorDetails.Status;
            this.ErrorText = errorDetails.Error.Message;
        } else {           
            arrayApplicationDetails.forEach(element => {
                this.Applications.push({
                    Application: element
                });
            });
        }

        
        return {
            ApplicationDetailsResponse: {
                ErrorCode: this.ErrorCode,
                ErrorText: this.ErrorText,
                Applications: this.Applications
            }
        };
    }
}

/* 
<summary> Token Update Response Model </summary>
*/
class TokenUpdateResponse {
    constructor(errorDetails, updateStatus) {
        this.ErrorCode = 0;
        this.ErrorText = "";
        this.Status = "";

        if (errorDetails) {
            this.ErrorCode = errorDetails.Status;
            this.ErrorText = errorDetails.Error.Message;
            this.Status="Failure";
        } else if(updateStatus) {
            this.Status="Success";
        }

        return {
            TokenValidityResponse: {
                ErrorCode: this.ErrorCode,
                ErrorText: this.ErrorText,
                Status:this.Status
            }
        };
    }
}

/* 
<summary> Validate Application Response Model </summary>
*/
class ValidateApplicationResponse {
    constructor(errorDetails, isValid) {
        this.ErrorCode = 0;
        this.ErrorText = "";
        this.IsValidApplication = false;

        if (errorDetails) {
            this.ErrorCode = errorDetails.Status;
            this.ErrorText = errorDetails.Error.Message;           
        } else {
            this.IsValidApplication=isValid;
        }

        return {
            TokenValidityResponse: {
                ErrorCode: this.ErrorCode,
                ErrorText: this.ErrorText,
                IsValidApplication:this.IsValidApplication
            }
        };
    }
}

module.exports = {
    RegistrationResponse: RegistrationResponse,
    ApplicationDetailsResponse: ApplicationDetailsResponse,
    TokenUpdateResponse:TokenUpdateResponse,
    ValidateApplicationResponse:ValidateApplicationResponse
};