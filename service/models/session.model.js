/* 
<summary> Session Info Response Model class </summary>
*/
class sessionInfoResponse {
    constructor(errorDetails, sessionDetails) {
        this.ErrorCode = 0;
        this.ErrorText = "";
        this.Username ="";

        if (errorDetails) {
            this.ErrorCode = errorDetails.Status;
            this.ErrorText = errorDetails.Error.Message;
        } else {
            this.Username=sessionDetails.Username;
        }

        return {
            SessionResponse: {
                ErrorCode: this.ErrorCode,
                ErrorText: this.ErrorText,
                Username: this.Username
            }
        };
    }
}

/* 
<summary> Notification Info Response Model class </summary>
*/
class notificationInfoResponse {
    constructor(errorDetails, notificationUrl) {
        this.ErrorCode = 0;
        this.ErrorText = "";
        this.NotificationUrl ="";

        if (errorDetails) {
            this.ErrorCode = errorDetails.Status;
            this.ErrorText = errorDetails.Error.Message;
        } else{
            this.NotificationUrl=notificationUrl;
        }

        return {
            NotificationInfoResponse: {
                ErrorCode: this.ErrorCode,
                ErrorText: this.ErrorText,
                NotificationUrl: this.NotificationUrl
            }
        };
    }
}


module.exports = {
    SessionInfoResponse: sessionInfoResponse,
    NotificationInfoResponse:notificationInfoResponse
};