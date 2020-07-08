/* 
<summary> Refresh Token Response Model class </summary>
*/
class RefreshTokenResponse {
    constructor(errorDetails, tokenDetails) {
        this.ErrorCode = 0;
        this.ErrorText = "";
        this.AccessToken = "";
        this.RefreshToken = "";
        this.AccessToken_ExpiryTime = "";
        this.RefreshToken_ExpiryTime = "";
        this.TokenType = "";
       // this.ExpiryTimeUnit = "";

        if (errorDetails) {
            this.ErrorCode = errorDetails.Status;
            this.ErrorText = errorDetails.Error.Message;
        } else {
            this.AccessToken = tokenDetails.AccessToken;
            this.RefreshToken = tokenDetails.RefreshToken;
            this.AccessToken_ExpiryTime = tokenDetails.AccessToken_ExpiryTime;
            this.RefreshToken_ExpiryTime = tokenDetails.RefreshToken_ExpiryTime;
            this.TokenType = "Bearer";
            //this.ExpiryTimeUnit = "Seconds";
        }

        return {
            TokenResponse: {
                ErrorCode: this.ErrorCode,
                ErrorText: this.ErrorText,
                AccessToken: this.AccessToken,
                RefreshToken: this.RefreshToken,
                AccessToken_ExpiryTime: this.AccessToken_ExpiryTime,
                RefreshToken_ExpiryTime: this.RefreshToken_ExpiryTime,
                TokenType: this.TokenType,
                //ExpiryTimeUnit: this.ExpiryTimeUnit
            }
        };
    }
}

/* 
<summary> Introspect Response Model class </summary>
*/
class IntrospectResponse {
    constructor(errorDetails,userMappingInfo, userDetails) {
        this.ErrorCode = 0;
        this.ErrorText = "";
        //this.MappedRoles = [];
        this.UserDetails = "";
        this.MappedPrivileges = [];
        if (errorDetails) {
            this.ErrorCode = errorDetails.Status;
            this.ErrorText = errorDetails.Error.Message;
        } else {
            //this.MappedRoles = userDetails.MappedRoles;
            this.MappedPrivileges = userMappingInfo.MappedPrivileges;
            this.UserDetails = userDetails;
        }

        return {
            IntrospectResponse: {
                ErrorCode: this.ErrorCode,
                ErrorText: this.ErrorText,
                //MappedRoles: this.MappedRoles,
                UserDetails: this.UserDetails,
                MappedPrivileges: this.MappedPrivileges
            }
        };
    }
}



module.exports = {
    RefreshTokenResponse: RefreshTokenResponse,
    IntrospectResponse: IntrospectResponse
};