export class LdapInfo {
    LdapConfigId: number;
    ServerHostName:string;
    ServerPort:number;
    Domain:string;
    AdminUserName:string;
    AdminPassword:string;
    IsSslSelected:boolean;
   // DomainName:string;
}

export class LdapGroupList {
    LdapId: number;
    DomainName:string;
    LdapGroups:string[];
}


