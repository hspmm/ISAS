export class LockoutInfo {
    LockoutIP:{
        IPAddress:string,
        LockedDateTime:Date
    }
}

export class GeneralConfig {
    LockoutPeriod:number;
    MaxRetires: number;
    MaxLoginAttempts: number;
}