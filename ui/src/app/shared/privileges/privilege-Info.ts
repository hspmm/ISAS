export class ApplicationInfo {
  ApplicationId: number;
  ApplicationName: string;
  ApplicationCode: string;
}

export class PrivilegeInfo {
  PrivilegeId: number;
  PrivilegeName: string;
}

export class ApplicationPrivilege {
  Application: ApplicationInfo;
  Privileges: PrivilegeInfo[];
}

export class SitePrivilegeInfo {
  SiteId:number;
  PrivilegeId: number;
  PrivilegeName: string;
}