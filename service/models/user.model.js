/* 
<summary> User Authentication Response Model class </summary>
*/
class AuthenticationResponse {
    constructor(errorDetails, authenticationDetails) {
        this.ErrorCode = 0;
        this.ErrorText = "";
        this.AccessToken = "";
        this.RefreshToken = "";
        this.AccessToken_ExpiryTime = "";
        this.RefreshToken_ExpiryTime = "";
        this.TokenType = "";

        if (errorDetails) {
            this.ErrorCode = errorDetails.Status;
            this.ErrorText = errorDetails.Error.Message;
        } else {
            this.AccessToken = authenticationDetails.AccessToken;
            this.RefreshToken = authenticationDetails.RefreshToken;
            this.AccessToken_ExpiryTime = authenticationDetails.AccessToken_ExpiryTime;
            this.RefreshToken_ExpiryTime = authenticationDetails.RefreshToken_ExpiryTime;
            this.TokenType = "Bearer";
        }

        return {
            AuthenticationResponse: {
                ErrorCode: this.ErrorCode,
                ErrorText: this.ErrorText,
                AccessToken: this.AccessToken,
                RefreshToken: this.RefreshToken,
                AccessToken_ExpiryTime: this.AccessToken_ExpiryTime,
                RefreshToken_ExpiryTime:this.RefreshToken_ExpiryTime,
                TokenType: this.TokenType
            }
        };
    }
}


/* 
<summary> User Details Response Model class </summary>
*/
class UserDetailsResponse {
    constructor(errorDetails,arrayUserDetails) {
        this.ErrorCode = 0;
        this.ErrorText = "";
        this.Users=[];

        if (errorDetails) {
            this.ErrorCode = errorDetails.Status;
            this.ErrorText = errorDetails.Error.Message;
        } else {
            arrayUserDetails.forEach(element => {
                this.Users.push({
                    User: element
                });
            });
        }

      
        return {
            UserDetailsResponse: {
                ErrorCode: this.ErrorCode,
                ErrorText: this.ErrorText,
                Users:this.Users
            }
        };
    }
}

/* 
<summary> User Roles Response Model class </summary>
*/
class UserInfoResponse {
    constructor(errorDetails,userDetails, arrayAvailableRoles, arrayMappedRoles, arrayLogInfo) {
        let mappedRoles = [];
        let availableRoles = [];

        this.ErrorCode = 0;
        this.ErrorText = "";
        this.UserInfo={};
        // this.UserDetails={};
        // this.Roles={};

        if (errorDetails) {
            this.ErrorCode = errorDetails.Status;
            this.ErrorText = errorDetails.Error.Message;
        } else {
           
            arrayMappedRoles.forEach(element => {
                mappedRoles.push({
                    Role: element
                });
            });
            arrayAvailableRoles.forEach(element => {
                availableRoles.push({
                    Role: element
                });
            });
            // this.UserDetails=userDetails;
            // this.Roles={
            //     AvailableRoles:availableRoles,
            //     MappedRoles:mappedRoles
            // };
            this.UserInfo={
                UserDetails:userDetails,
                Roles:{
                    AvailableRoles:availableRoles,
                    MappedRoles:mappedRoles
                },
                Logs: arrayLogInfo
            }
        }
        
        return {
            UserInformationResponse: {
                ErrorCode: this.ErrorCode,
                ErrorText: this.ErrorText,
                UserInfo:this.UserInfo
            }
        };
    }
}

/* 
<summary> User Registration Model class </summary>
*/
class UserRegistrationResponse {
    constructor(errorDetails,userDetails, isNewUser) {
        this.ErrorCode = 0;
        this.ErrorText = "";
        this.UserInformation={};

        if (errorDetails) {
            this.ErrorCode = errorDetails.Status;
            this.ErrorText = errorDetails.Error.Message;
        } else {
            this.UserInformation={
                UserName : userDetails.UserName,
                UserId : userDetails.UserId,
                EmailAddress : userDetails.EmailAddress,
                isNewUser : isNewUser
            };
        }

        return {
            RegistrationResponse: {
                ErrorCode:this.ErrorCode,
                ErrorText:this.ErrorText,
                UserInformation:this.UserInformation
            }
        };
    }
}

/* 
<summary> User Update Model class </summary>
*/
class UserUpdateResponse {
    constructor(errorDetails,userDetails) {
        this.ErrorCode = 0;
        this.ErrorText = "";
        this.UserInformation={};

        if (errorDetails) {
            this.ErrorCode = errorDetails.Status;
            this.ErrorText = errorDetails.Error.Message;
        } else {
            this.UserInformation={
                UserName : userDetails.UserName,
                UserId : userDetails.UserId,
                EmailAddress : userDetails.EmailAddress
            };
        }

        return {
            UserUpdateResponse: {
                ErrorCode:this.ErrorCode,
                ErrorText:this.ErrorText,
                UserInformation:this.UserInformation
            }
        };
    }
}


/* 
<summary> User Deleted Response Model class </summary>
*/
class UserDeleteResponse {
    constructor(errorDetails,userId) {
        this.ErrorCode = 0;
        this.ErrorText = "";
        this.UserId=0;

        if (errorDetails) {
            this.ErrorCode = errorDetails.Status;
            this.ErrorText = errorDetails.Error.Message;
        } else {
            this.UserId=userId.UserId;
        }
        return {
            UserDeleteResponse: {
                ErrorCode:this.ErrorCode,
                ErrorText:this.ErrorText,
                UserId: this.UserId
            }
        };
    }
}

/* 
<summary> User Logout Response Model class </summary>
*/
class LogoutResponse {
    constructor(errorDetails, logoutStatus) {
        this.ErrorCode = 0;
        this.ErrorText = "";
        this.Status ="";

        if (errorDetails) {
            this.ErrorCode = errorDetails.Status;
            this.ErrorText = errorDetails.Error.Message;
            this.Status= "Failure";
        } else if(logoutStatus){
            this.Status= "Success";
        }

        return {
            LogoutResponse: {
                ErrorCode: this.ErrorCode,
                ErrorText: this.ErrorText,
                Status: this.Status
            }
        };
    }
}


/* 
<summary> Default User Registration Model class </summary>
*/
class DefaultUserResponse {
    constructor(errorDetails,username) {
        this.ErrorCode = 0;
        this.ErrorText = "";
        this.UserInformation={};

        if (errorDetails) {
            this.ErrorCode = errorDetails.Status;
            this.ErrorText = errorDetails.Error.Message;
        } else {
            this.UserInformation={
                UserName : username
            };
        }

        return {
            RegistrationResponse: {
                ErrorCode:this.ErrorCode,
                ErrorText:this.ErrorText,
                UserInformation:this.UserInformation
            }
        };
    }
}

/* 
<summary> Reset User Password Model class </summary>
*/
class PasswordResetResponse {
    constructor(errorDetails,status) {
        this.ErrorCode = 0;
        this.ErrorText = "";
        this.Status="Failure";

        if (errorDetails) {
            this.ErrorCode = errorDetails.Status;
            this.ErrorText = errorDetails.Error.Message;
        } else {
            this.Status=status;
        }

        return {
            PasswordResetResponse: {
                ErrorCode:this.ErrorCode,
                ErrorText:this.ErrorText,
                Status:this.Status
            }
        };
    }
}

module.exports = {
    AuthenticationResponse: AuthenticationResponse,
    UserDetailsResponse: UserDetailsResponse,
    UserInfoResponse: UserInfoResponse,
    UserRegistrationResponse:UserRegistrationResponse,
    UserDeleteResponse:UserDeleteResponse,
    UserUpdateResponse:UserUpdateResponse,
    LogoutResponse:LogoutResponse,
    DefaultUserResponse:DefaultUserResponse,
    PasswordResetResponse:PasswordResetResponse
};