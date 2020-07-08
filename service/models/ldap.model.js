/* 
<summary> Application Details Response Model class </summary>
*/
class LdapGroupDetailsResponse {
    constructor(errorDetails,arrayLdapGroupsDetails) {
        let response = [];
        this.ErrorCode = 0;
        this.ErrorText = "";
        this.LdapGroups=[];

        if (errorDetails) {
            this.ErrorCode = errorDetails.Status;
            this.ErrorText = errorDetails.Error.Message;
        } else {
            arrayLdapGroupsDetails.forEach(element => {
                this.LdapGroups.push({
                    Ldap: element
                });
            });
        }

        
        return {
            LdapGroupDetailsResponse: {
                ErrorCode: this.ErrorCode,
                ErrorText: this.ErrorText,
                LdapDetails: this.LdapGroups
            }
        };
    }
}

/* 
<summary> LDAP User Details Response Model class </summary>
*/
class LdapUsersDetailsResponse {
    constructor(arrayLdapUsersDetails) {
        let response = [];
        arrayLdapUsersDetails.forEach(element => {
            response.push({
                element
            });
        });
        return {
            LdapUsersDetailsResponse: response
        };
    }
}

/* 
<summary> Ldap Details Response Model class </summary>
*/
class LdapDetailsResponse {
    constructor(errorDetails,arrayLdapDetails) {
        this.ErrorCode = 0;
        this.ErrorText = "";
        this.LdapDetails=[];

        if (errorDetails) {
            this.ErrorCode = errorDetails.Status;
            this.ErrorText = errorDetails.Error.Message;
        } else {
            arrayLdapDetails.forEach(element => {
                this.LdapDetails.push({
                 Ldap:{
                        LdapConfigId: element.LdapConfigId,
                        Domain: element.Domain,
                        ServerHostName: element.ServerHostName,
                        ServerPort:element.ServerPort,
                        AdminUserName:element.AdminUserName,
                        IsSslSelected: element.IsSslSelected
                }});
            });          
        }
        return {
            LdapDetailsResponse: {
                ErrorCode: this.ErrorCode,
                ErrorText: this.ErrorText,
                LdapDetails:this.LdapDetails
            }
        };
    }
}

/* 
<summary> Imprivata Details Response Model class </summary>
*/
class ImprivataDetailsResponse {
    constructor(errorDetails,arrayImprivataDetails) {       
        this.ErrorCode = 0;
        this.ErrorText = "";
        this.ImprivataDetails=[];

        if (errorDetails) {
            this.ErrorCode = errorDetails.Status;
            this.ErrorText = errorDetails.Error.Message;
        } else {
            arrayImprivataDetails.forEach(element => {
                this.ImprivataDetails.push({
                    Imprivata:{
                    ImprivataConfigId: element.ImprivataConfigId,
                    ImprivataConfigName: element.ImprivataConfigName,
                    ServerHostName: element.ServerHostName,
                    ServerPort:element.ServerPort,
                    ApiPath:element.ApiPath,
                    ApiVersion:element.ApiVersion,
                    ProductCode:element.ProductCode,
                    IsSslSelected : element.IsSslSelected
                }});
            });
        }
        return {
            ImprivataDetailsResponse: {
                ErrorCode: this.ErrorCode,
                ErrorText: this.ErrorText,
                ImprivataDetails: this.ImprivataDetails
            }
        };
    }
}


/* 
<summary> LDAP Group User Details Response Model class </summary>
*/
class LdapGroupUsersDetailsResponse {
    constructor(errorDetails,arrayLdapGroupUsersDetails) {      
        this.ErrorCode = 0;
        this.ErrorText = "";
        this.LdapDetails=[];

        if (errorDetails) {
            this.ErrorCode = errorDetails.Status;
            this.ErrorText = errorDetails.Error.Message;
        } else {
            arrayLdapGroupUsersDetails.forEach(element => {
                this.LdapDetails.push({
                    Ldap: element
                });
            });
        }
       
        return {
            LdapGroupUsersDetailsResponse: {
                ErrorCode: this.ErrorCode,
                ErrorText: this.ErrorText,
                LdapDetails: this.LdapDetails
            }
        };
    }
}

/* 
<summary> LDAP Registration Response Model class </summary>
*/
class LdapRegistrationResponse {    
    constructor(errorDetails,ldapDetails) {
        this.ErrorCode = 0;
        this.ErrorText = "";
        this.LdapDetails={};
        
        if (errorDetails) {
            this.ErrorCode = errorDetails.Status;
            this.ErrorText = errorDetails.Error.Message;
        } else {
           this.LdapDetails=ldapDetails
        }

        return {
            LdapRegistrationResponse: {
                ErrorCode: this.ErrorCode,
                ErrorText: this.ErrorText,
                LdapDetails:this.LdapDetails
            }
        };
    }
}

/* 
<summary> LDAP Update Response Model class </summary>
*/
class LdapUpdateResponse {    
    constructor(errorDetails,ldapDetails) {
        this.ErrorCode = 0;
        this.ErrorText = "";
        this.LdapDetails={};
        
        if (errorDetails) {
            this.ErrorCode = errorDetails.Status;
            this.ErrorText = errorDetails.Error.Message;
        } else {
           this.LdapDetails=ldapDetails
        }

        return {
            LdapUpdateResponse: {
                ErrorCode: this.ErrorCode,
                ErrorText: this.ErrorText,
                LdapDetails:this.LdapDetails
            }
        };
    }
}

/* 
<summary> LDAP Deleted Response Model class </summary>
*/
class LdapDeleteResponse {
    constructor(errorDetails,ldapConfigId) {
       
        this.ErrorCode = 0;
        this.ErrorText = "";
        this.LdapId=0;
        
        if (errorDetails) {
            this.ErrorCode = errorDetails.Status;
            this.ErrorText = errorDetails.Error.Message;
        } else {
           this.LdapId=ldapConfigId.LdapConfigId
        }

        return {
            LdapDeleteResponse: {
                ErrorCode: this.ErrorCode,
                ErrorText: this.ErrorText,
                LdapId: this.LdapId
            }
        };
    }
}


module.exports = {
    LdapGroupDetailsResponse: LdapGroupDetailsResponse,
    LdapUsersDetailsResponse: LdapUsersDetailsResponse,
    LdapDetailsResponse:LdapDetailsResponse,
    ImprivataDetailsResponse:ImprivataDetailsResponse,
    LdapGroupUsersDetailsResponse:LdapGroupUsersDetailsResponse,
    LdapRegistrationResponse:LdapRegistrationResponse,
    LdapUpdateResponse:LdapUpdateResponse,
    LdapDeleteResponse:LdapDeleteResponse
};