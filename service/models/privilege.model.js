/* 
<summary> Privilege Registration Response Model class </summary>
*/
class PrivilegeRegistrationResponse {
    constructor(errorDetails, arrayPrivilegeDetails) {
        this.ErrorCode = 0;
        this.ErrorText = "";
        this.Privileges = [];

        if (errorDetails) {
            this.ErrorCode = errorDetails.Status;
            this.ErrorText = errorDetails.Error.Message;
            // response.push({
            //     Privilege: {
            //         PrivilegeId: "",
            //         PrivilegeName: "",
            //         PrivilegeDescription: "",
            //         PrivilegeKey: ""
            //     }
            // });
        } else {
            arrayPrivilegeDetails.forEach(element => {
                this.Privileges.push({
                    Privilege: {
                        PrivilegeId: element.PrivilegeId,
                        PrivilegeName: element.PrivilegeName,
                        PrivilegeKey: element. PrivilegeKey
                    }
                });
            });
        }

        return {
            PrivilegeRegistrationResponse: {
                ErrorCode: this.ErrorCode,
                ErrorText: this.ErrorText,
                Privileges: this.Privileges
            }
        };

    }
}

/* 
<summary> Privilege Registration Response Model class </summary>
*/
class ApplicationPrivilegeResponse {
    constructor(errorDetails,arrayApplicationPrivilege) {
        this.ErrorCode = 0;
        this.ErrorText = "";
        this.Applications = [];

        if (errorDetails) {
            this.ErrorCode = errorDetails.Status;
            this.ErrorText = errorDetails.Error.Message;            
        } else {
            this.Applications = Array.from(new Set(arrayApplicationPrivilege.map(s => s.ApplicationVersionId))).map(appVersionId => {
                return {
                    ApplicationPrivileges: {
                        Application: {
                            ApplicationId: arrayApplicationPrivilege.find(appPrivilege => appPrivilege.ApplicationVersionId === appVersionId).ApplicationId,
                            ApplicationName: arrayApplicationPrivilege.find(appPrivilege => appPrivilege.ApplicationVersionId === appVersionId).ApplicationName,
                            ApplicationVersionId: appVersionId,
                            ApplicationVersion:arrayApplicationPrivilege.find(appPrivilege => appPrivilege.ApplicationVersionId === appVersionId).VersionNumber,
                            ApplicationCode:arrayApplicationPrivilege.find(appPrivilege => appPrivilege.ApplicationVersionId === appVersionId).ApplicationCode
                        },
                        Privileges: arrayApplicationPrivilege.filter(appPrivilege => appPrivilege.ApplicationVersionId === appVersionId).map(function (filteredObject) {
                            return {
                                Privilege: {
                                    PrivilegeId: filteredObject.ApplicationPrivilegeId,
                                    PrivilegeName: filteredObject.PrivilegeName
                                }
                            }
                        })
                    }
                }
            });
        }

        return {
            ApplicationPrivilegeResponse: {
                ErrorCode: this.ErrorCode,
                ErrorText: this.ErrorText,
                Applications: this.Applications
            }
        };
    }
}

/* 
<summary> Role Privileges Response Model class </summary>
*/
class PrivilegeRolesResponse {
    constructor(errorDetails,arrayPrivilegeRoles) {       
        this.ErrorCode = 0;
        this.ErrorText = "";
        this.SiteRoles = [];

        if (errorDetails) {
            this.ErrorCode = errorDetails.Status;
            this.ErrorText = errorDetails.Error.Message;            
        } else {
            arrayPrivilegeRoles.forEach(element => {
                this.SiteRoles.push({
                    SiteRole: element
                });
            });
        }   
       
        return {
            PrivilegeRolesResponse: {
                ErrorCode: this.ErrorCode,
                ErrorText: this.ErrorText,
                SiteRoles: this.SiteRoles
            }
        };
    }
}

/* 
<summary> User Privileges Response Model class </summary>
*/
class PrivilegeUsersResponse {
    constructor(errorDetails,arrayPrivilegeUsers) {
        this.ErrorCode = 0;
        this.ErrorText = "";
        this.SiteUsers = [];

        if (errorDetails) {
            this.ErrorCode = errorDetails.Status;
            this.ErrorText = errorDetails.Error.Message;            
        } else {
            arrayPrivilegeUsers.forEach(element => {
                this.SiteUsers.push({
                    SiteUser: element
                });
            });
        }   
       
        return {
            PrivilegeUsersResponse: {
                ErrorCode: this.ErrorCode,
                ErrorText: this.ErrorText,
                SiteUsers: this.SiteUsers
            }
        };
    }
}

/* 
<summary> Ldap Groups Privileges Response Model class </summary>
*/
class PrivilegeLdapGroupsResponse {
    constructor(errorDetails,arrayPrivilegeLdapGroups) {
        this.ErrorCode = 0;
        this.ErrorText = "";
        this.SiteLdapGroups = [];

        if (errorDetails) {
            this.ErrorCode = errorDetails.Status;
            this.ErrorText = errorDetails.Error.Message;            
        } else {
            arrayPrivilegeLdapGroups.forEach(element => {
                this.SiteLdapGroups.push({
                    SiteLdapGroup: element
                });
            });
        }        
        return {
            PrivilegeLdapGroupsResponse: {
                ErrorCode: this.ErrorCode,
                ErrorText: this.ErrorText,
                SiteLdapGroups: this.SiteLdapGroups
            }
        };
    }
}

module.exports = {
    RegistrationResponse: PrivilegeRegistrationResponse,
    ApplicationPrivilegeResponse: ApplicationPrivilegeResponse,
    PrivilegeRolesResponse: PrivilegeRolesResponse,
    PrivilegeUsersResponse: PrivilegeUsersResponse,
    PrivilegeLdapGroupsResponse: PrivilegeLdapGroupsResponse
};