export class UserBasicDetails {
  UserId: number;
  UserName: string;
  FirstName: string;
  MiddleName: string;
  LastName: string;
  EmailAddress: string;
  PhoneNumber: string;
  IsAccountLocked: boolean;
  IsAccountDisabled: boolean;
  Password:string;
  ConfirmPassword:string;
  IsEmailSelected:boolean;

}

export class RoleDetails {
  Role: {
    RoleId: number;
    RoleName: string;
    RoleDescription: string
  }
}

export class RolePrivilegeDetails {
  SitePrivileges: {
    SiteId: number;
    ApplicationPrivilegeId: number;
  }
}

export class UserList {
  User: UserBasicDetails;
}

export class UserFullDetails {
  UserDetails: UserBasicDetails;
  Roles: {
    AvailableRoles: RoleDetails[];
    MappedRoles: RoleDetails[]
  };
  Logs:LogInfo[]
}

export class UserInfo {
  User: {
    UserId:number,
    UserName:string
  }  
}

export class SiteUserInfo {
  SiteUser:{
    SiteId:number;
    UserId: number;
    UserName: string;
  }
}

export class SiteUserPrivilegeInfo {
  SiteUserPrivilege:{
    SiteId:number;
    UserId: number;
    UserName: string;
    ApplicationName:string;
    PrivilegeName:string;
    ApplicationId:number;
  }
}

export class SiteLdapGroupInfo {
  SiteLdapGroup:{
    SiteId:number;
    LdapGroupId: number;
    LdapGroupName: string;
    Domain: string;
  }
}


export class SiteLdapPrivilegeInfo {
  SiteLdapPrivilege:{
    SiteId:number;
    LdapGroupId: number;
    LdapGroupName: string;
    Domain: string;
    ApplicationName:string;
    PrivilegeName:string;
    ApplicationId:number;
  }
}


export class LogInfo {  
    Activity: string;
    Application: string;
    DateTime: string;
    Version: string;
}
