/* 
<summary> Role Details Model class </summary>
*/
class RoleDetails {
    constructor(roleName, roleDescription) {
        this.Role_Name = roleName;
        this.Role_Description = roleDescription;

        return {
            Role: {
                Name: this.Role_Name,
                Description: this.Role_Description
            }
        };
    }
}

/* 
<summary> Role Registration Response Model class </summary>
*/
class RoleRegistrationResponse {
    constructor(arrayRoleDetails) {
        //this.Role_Details = arrayRoleDetails;
        let response = [];
        arrayRoleDetails.forEach(element => {
            response.push(element);
        });
        return {
            RoleRegistrationResponse: response
        };
    }
}

/* 
<summary> Role Registration Response Model class </summary>
*/
class RoleInfoRegistrationResponse {
    constructor(errorDetails,roleDetails) {   
        this.ErrorCode = 0;
        this.ErrorText = "";
        this.RoleDetails={};

        if (errorDetails) {
            this.ErrorCode = errorDetails.Status;
            this.ErrorText = errorDetails.Error.Message;
        } else {           
           this.RoleDetails=roleDetails;
        }
        return {
            RoleRegistrationResponse: {
                ErrorCode: this.ErrorCode,
                ErrorText: this.ErrorText,
                RoleDetails: this.RoleDetails                
            }
        };
    }
}

/* 
<summary> Role Update Response Model class </summary>
*/
class RoleInfoUpdateResponse {
    constructor(errorDetails,roleDetails) {   
        this.ErrorCode = 0;
        this.ErrorText = "";
        this.RoleDetails={};

        if (errorDetails) {
            this.ErrorCode = errorDetails.Status;
            this.ErrorText = errorDetails.Error.Message;
        } else {           
           this.RoleDetails=roleDetails;
        }
        return {
            RoleUpdateResponse: {
                ErrorCode: this.ErrorCode,
                ErrorText: this.ErrorText,
                RoleDetails: this.RoleDetails                
            }
        };
    }
}


/* 
<summary> Role Details Response Model class </summary>
*/
class RoleDetailsResponse {
    constructor(errorDetails,arrayRoleDetails) {
        this.ErrorCode = 0;
        this.ErrorText = "";
        this.Roles=[];

        if (errorDetails) {
            this.ErrorCode = errorDetails.Status;
            this.ErrorText = errorDetails.Error.Message;
        } else {           
            arrayRoleDetails.forEach(element => {
                this.Roles.push({
                    Role: element
                });
            });
        }
        
        return {
            RoleDetailsResponse: {
                ErrorCode: this.ErrorCode,
                ErrorText: this.ErrorText,
                Roles: this.Roles
            }
        };
    }
}

/* 
<summary> Role Privileges Response Model class </summary>
*/
class RolePrivilegesResponse {
    constructor(errorDetails,arrayRolePrivileges) {
        this.ErrorCode = 0;
        this.ErrorText = "";
        this.RolePrivileges=[];

        if (errorDetails) {
            this.ErrorCode = errorDetails.Status;
            this.ErrorText = errorDetails.Error.Message;
        } else {           
            arrayRolePrivileges.forEach(element => {
                this.RolePrivileges.push({
                    SitePrivileges: element
                });
            });
        }
       
        return {
            RolePrivilegesResponse: {
                ErrorCode: this.ErrorCode,
                ErrorText: this.ErrorText,
                RolePrivileges:this.RolePrivileges
            }
        };
    }
}


/* 
<summary> Role Info Response Model class </summary>
*/
class RoleInfoResponse {
    constructor(errorDetails,roleDetails, arrayMappedSites, arrayMappedPrivileges, arrayMappedGroups, arrayMappedUsers) {
        this.ErrorCode = 0;
        this.ErrorText = "";
        this.Role={};

        if (errorDetails) {
            this.ErrorCode = errorDetails.Status;
            this.ErrorText = errorDetails.Error.Message;
        } else {           
            let sitePrivilegeInfo = [];
            arrayMappedPrivileges.forEach(element =>{
                sitePrivilegeInfo.push({
                    PrivilegeId: element.ApplicationPrivilegeId
                });
            });
            let siteInfo = [];
            arrayMappedSites.forEach(element =>{
                siteInfo.push({
                    SiteId: element.SiteId
                });
            });

            let siteGroupInfo = [];
            arrayMappedGroups.forEach(element => {
                siteGroupInfo.push({
                    LdapId: element.LdapConfigId,
                    GroupId: element.LdapGroupId
                });
            });

            let userInfo = [];
            arrayMappedUsers.forEach(element => {
                userInfo.push({
                    User: {
                        UserId: element.UserId,
                        UserName: element.UserName
                    }
                });
            });
            this.Role={
                RoleDetails: roleDetails[0],
                MappedPrivileges: sitePrivilegeInfo,
                MappedGroups: siteGroupInfo,
                MappedSites: siteInfo,
                MappedUsers: userInfo
            }
        }

       
        return {
            RoleInformationResponse: {
                ErrorCode: this.ErrorCode,
                ErrorText: this.ErrorText,
                Role:this.Role
            }
        };
    }
}

/* 
<summary> Site Roles Response Model class </summary>
*/
class SiteRolesResponse {
    constructor(errorDetails,arraySiteRoles) {
        this.ErrorCode=0;
        this.ErrorText="";
        this.SiteRoles=[];
        this.SiteRolePrivileges=[];

        if (errorDetails) {
            this.ErrorCode = errorDetails.Status;
            this.ErrorText = errorDetails.Error.Message;
        } else {
            arraySiteRoles[0].forEach(element => {
                this.SiteRoles.push({
                    SiteRole: element
                });
            });
            arraySiteRoles[1].forEach(element => {
                this.SiteRolePrivileges.push({
                    SiteRolePrivilege: element
                });
            });
        }
        
        return {
            SiteRolesResponse: {
                ErrorCode: this.ErrorCode,
                ErrorText: this.ErrorText,
                SiteRoles:this.SiteRoles,
                SiteRolePrivileges: this.SiteRolePrivileges
            }
        };
    }
}

/* 
<summary> Site Users Response Model class </summary>
*/
class SiteUsersResponse {
    constructor(errorDetails,arraySiteUsers) {
        this.ErrorCode=0;
        this.ErrorText="";
        this.SiteUsers=[];
        this.SiteUserPrivileges=[];

        if (errorDetails) {
            this.ErrorCode = errorDetails.Status;
            this.ErrorText = errorDetails.Error.Message;
        } else {
            arraySiteUsers[0].forEach(element => {
                this.SiteUsers.push({
                    SiteUser: element
                });
            });
            arraySiteUsers[1].forEach(element => {
                this.SiteUserPrivileges.push({
                    SiteUserPrivilege: element
                });
            });
        }        
        return {
            SiteUsersResponse: {
                ErrorCode: this.ErrorCode,
                ErrorText: this.ErrorText,
                SiteUsers:this.SiteUsers,
                SiteUserPrivileges:this.SiteUserPrivileges
            }
        };
    }
}

/* 
<summary> Site Ldap Groups Response Model class </summary>
*/
class SiteLdapGroupsResponse {
    constructor(errorDetails,arraySiteLdapGroups) {
        this.ErrorCode=0;
        this.ErrorText="";
        this.SiteLdapGroups=[];
        this.SiteLdapPrivileges=[];

        if (errorDetails) {
            this.ErrorCode = errorDetails.Status;
            this.ErrorText = errorDetails.Error.Message;
        } else {
            arraySiteLdapGroups[0].forEach(element => {
                this.SiteLdapGroups.push({
                    SiteLdapGroup: element
                });
            });
            arraySiteLdapGroups[1].forEach(element => {
                this.SiteLdapPrivileges.push({
                    SiteLdapPrivilege: element
                });
            });
        }    
        return {
            SiteLdapGroupsResponse: {
                ErrorCode: this.ErrorCode,
                ErrorText: this.ErrorText,
                SiteLdapGroups:this.SiteLdapGroups,
                SiteLdapPrivileges:this.SiteLdapPrivileges
            }
        };
    }
}

/* 
<summary> Site Response Model class </summary>
*/
class SiteResponse {
    constructor(errorDetails,arraySite) {
        this.ErrorCode=0;
        this.ErrorText="";
        this.Sites=[];

        if (errorDetails) {
            this.ErrorCode = errorDetails.Status;
            this.ErrorText = errorDetails.Error.Message;
        } else {
            arraySite.forEach(element => {
                this.Sites.push(element);
            });
        } 
        
        return {
            SiteResponse: {
                ErrorCode: this.ErrorCode,
                ErrorText: this.ErrorText,
                Sites:this.Sites
            }
        };
    }
}

/* 
<summary> Role Deleted Response Model class </summary>
*/
class RoleDeleteResponse {
    constructor(errorDetails,roleId) {
        this.ErrorCode=0;
        this.ErrorText="";
        this.RoleId=0;

        if (errorDetails) {
            this.ErrorCode = errorDetails.Status;
            this.ErrorText = errorDetails.Error.Message;
        } else {
            this.RoleId=roleId.RoleId
        } 

        return {
            RoleDeleteResponse: {
                ErrorCode: this.ErrorCode,
                ErrorText: this.ErrorText,
                RoleId: this.RoleId
            }
        };
    }
}

/* 
<summary> Site Info Response Model class </summary>
*/
class SiteInfoResponse {
    constructor(errorDetails,status) {
        this.ErrorCode=0;
        this.ErrorText="";
        this.Status="Failure";

        if (errorDetails) {
            this.ErrorCode = errorDetails.Status;
            this.ErrorText = errorDetails.Error.Message;
        } else {
           this.Status="Success";
        } 
        
        return {
            SiteResponse: {
                ErrorCode: this.ErrorCode,
                ErrorText: this.ErrorText,
                Status:this.Status
            }
        };
    }
}



module.exports = {
    RoleDetails: RoleDetails,
    RegistrationResponse: RoleRegistrationResponse,
    RoleDetailsResponse: RoleDetailsResponse,
    RolePrivilegesResponse: RolePrivilegesResponse,
    RoleInfoResponse: RoleInfoResponse,
    RoleInfoRegistrationResponse: RoleInfoRegistrationResponse,
    RoleInfoUpdateResponse:RoleInfoUpdateResponse,
    SiteRolesResponse: SiteRolesResponse,
    SiteUsersResponse: SiteUsersResponse,
    SiteLdapGroupsResponse:SiteLdapGroupsResponse,
    SiteResponse: SiteResponse,
    RoleDeleteResponse: RoleDeleteResponse,
    SiteInfoResponse:SiteInfoResponse
};