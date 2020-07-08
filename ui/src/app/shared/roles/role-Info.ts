import { SitePrivilegeInfo, PrivilegeInfo } from '../privileges/privilege-Info';
import { UserInfo } from '../users/user-Info';

export class RoleBasicDetails {
    RoleId: number;
    RoleName: string;
    RoleDescription: string
}

export class RoleList {
  Role: RoleBasicDetails;
}

export class RoleFullDetails {
  RoleDetails: RoleBasicDetails;
  MappedPrivileges:PrivilegeInfo[];
  MappedGroups:LdapGroupInfo[];
  MappedSites:SiteInfo[];
  MappedUsers:UserInfo[];
}

export class LdapGroupList
{
  Ldap:{
  LdapId: number;
  DomainName: string;
  LdapGroups: LdapGroupInfo[]
  }
}

export class LdapGroupUserList
{
  Ldap:{
  LdapId: number;
  DomainName: string;
  GroupName:string;
  Users: LdapGroupUserInfo[]
  }
}

export class SiteRoleInfo {
  SiteRole:{
    SiteId:number;
    RoleId: number;
    RoleName: string;
  }
}

export class SiteRolePrivilegeInfo {
  SiteRolePrivilege:{
    SiteId:number;
    RoleId: number;
    RoleName: string;
    ApplicationName:string;
    PrivilegeName:string;
    ApplicationId:number;
  }
}

export class SiteInfo {
  SiteId:number;
  SiteName:string;
}

export class DomainGroupInfo {
  GroupName:string;
  DomainName:string;
}

export class LdapGroupInfo{
  GroupId:number;
  GroupName:string;
  LdapId:number;
  LdapName:string;
}

export class LdapGroupUserInfo{  
  UserName:string;  
  PrincipalName:string;
}

// export class ApplicationDetails {
//   ApplicationId: number;
//   NameName: string;  
// }