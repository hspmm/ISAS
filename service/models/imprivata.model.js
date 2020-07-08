/* 
<summary> Imprivata Registration Response Model class </summary>
*/
class ImprivataRegistrationResponse {    
    constructor(errorDetails,imprivataDetails) {
        this.ErrorCode = 0;
        this.ErrorText = "";
        this.ImprivataDetails={};

        if (errorDetails) {
            this.ErrorCode = errorDetails.Status;
            this.ErrorText = errorDetails.Error.Message;
        } else {
           this.ImprivataDetails=imprivataDetails
        }

        return {
            ImprivataRegistrationResponse:{
                ErrorCode: this.ErrorCode,
                ErrorText: this.ErrorText,
                ImprivataDetails: this.ImprivataDetails
            }
        };
    }
}

/* 
<summary> Imprivata Update Response Model class </summary>
*/
class ImprivataUpdateResponse {    
    constructor(errorDetails,imprivataDetails) {
        this.ErrorCode = 0;
        this.ErrorText = "";
        this.ImprivataDetails={};

        if (errorDetails) {
            this.ErrorCode = errorDetails.Status;
            this.ErrorText = errorDetails.Error.Message;
        } else {
           this.ImprivataDetails=imprivataDetails
        }

        return {
            ImprivataUpdateResponse:{
                ErrorCode: this.ErrorCode,
                ErrorText: this.ErrorText,
                ImprivataDetails: this.ImprivataDetails
            }
        };
    }
}

/* 
<summary> Imprivata Deleted Response Model class </summary>
*/
class ImprivataDeleteResponse {
    constructor(errorDetails,imprivataConfigId) {     
        this.ErrorCode = 0;
        this.ErrorText = "";
        this.ImprivataId=0;

        if (errorDetails) {
            this.ErrorCode = errorDetails.Status;
            this.ErrorText = errorDetails.Error.Message;
        } else {
           this.ImprivataId=imprivataConfigId.ImprivataConfigId
        }
        return {
            ImprivataDeleteResponse: {
                ErrorCode: this.ErrorCode,
                ErrorText: this.ErrorText,
                ImprivataId: this.ImprivataId
            }
        };
    }
}


module.exports = {  
    ImprivataRegistrationResponse:ImprivataRegistrationResponse,
    ImprivataUpdateResponse:ImprivataUpdateResponse,
    ImprivataDeleteResponse:ImprivataDeleteResponse
};