/* Declare required npm packages */
//var ldapjs = require('ldapjs');
var promise = require('promise');
var ActiveDirectoryLib = require('activedirectory');

/* Custom Error */
var customError = require('../errors/custom.error');

/* Database Access */
var ldapDbAccess = require('../dataaccess/ldap.dbaccess');

/* LDAP Configuration */
// var ldapConfig = {
//     url: 'ldap://172.16.20.194:389',
//     baseDN: 'dc=icuinnov,dc=corp',
//     username: 'Administrator@icuinnov.corp',
//     password: 'Icumed@1'
// }

/*
<summary> Helps to validate user credentials with LDAP  </summary>
<param name="userDetails"> User Details </param>
<returns> Returns If Valid user, returns User's LDAP Group. Else return error </returns>
*/

async function ValidateLDAPUserCredentials(userDetails, ldapDetails) {
    try {
        // var sAMAccountName = 'Anand';

        //ldapDetails.username=userDetails.Username;
        //ldapDetails.password=userDetails.Password;

        // var activeDirectory = new ActiveDirectoryLib(ldapDetails);

        // return new promise(
        //     function (res, rej) {
        //         activeDirectory.getGroupMembershipForUser(sAMAccountName, (err, groups) => {
        //             try {
        //                 if (err) {
        //                     rej(new customError.ApplicationError("Connection Failed!!"));
        //                 } else if (!groups) {
        //                     rej(new customError.ApplicationError('User: ' + sAMAccountName + ' not found.', 200));
        //                 } else {
        //                     res(JSON.stringify(groups));
        //                 }
        //             } catch (error) {
        //                 rej(new customError.ApplicationError(error));
        //             }
        //         });
        //     });


        var activeDirectory = new ActiveDirectoryLib(ldapDetails);
        let username = userDetails.Username;
       // var username = userDetails.Username + '@'+userDetails.DomainName;

        /* Code to Replace if it not working */

        // return new promise(
        //     function (res, rej) {
        //         activeDirectory.getGroupMembershipForUser(username, function (err, groups) {
        //             try {
        //                 if (err) {
        //                    // rej(new customError.ApplicationError("Security Provider Connection Failed!!"));
        //                     rej(new customError.ApplicationError(err));
        //                 } else if (!groups) {
        //                     rej(new customError.ApplicationError('User: ' + username + ' not found.', 200));
        //                 } else {
        //                     res(JSON.stringify(groups));
        //                 }
        //             } catch (error) {
        //                 rej(new customError.ApplicationError(error));
        //             }
        //         });
        //     });

        return new promise(
            function (res, rej) {
              
                activeDirectory.authenticate(username,userDetails.Password, function (err, auth) {
                    try {
                        if (err) {
                           // rej(new customError.ApplicationError("Security Provider Connection Failed!!"));
                          
                            rej(new customError.ApplicationError('Invalid Credentials!', 200));
                        } 
                        
                        if (!auth) {
                          
                            rej(new customError.ApplicationError('Invalid Credentials!', 200));
                        } else {
                            activeDirectory.getGroupMembershipForUser(username, function (err, groups) {
                                try {
                                    if (err) {
                                        // rej(new customError.ApplicationError("Security Provider Connection Failed!!"));
                                        rej(new customError.ApplicationError(err));
                                    }
                                    
                                    if (!groups) {
                                        rej(new customError.ApplicationError('User: ' + username + ' not found.', 200));
                                    } else {
                                      
                                        res(JSON.stringify(groups));
                                    }
                                } catch (error) {
                                    rej(new customError.ApplicationError(error));
                                }
                            });                          
                        }
                    } catch (error) {
                        rej(new customError.ApplicationError(error));
                    }
                });
            });

    } catch (error) {
        throw new customError.ApplicationError(error);
    }
}


/*
<summary> Helps to get LDAP Groups  </summary>
<param name="ldapDetails"> LDAP Details </param>
<returns> Returns all the LDAP groups </returns>
*/

async function GetLDAPGroups(ldapDetails, ldapConfigId) {
    try {
        var query = 'cn=*';
        var opts = {
            includeMembership: ['group', 'user'],
            includeDeleted: false
        };

        var activeDirectory = new ActiveDirectoryLib(ldapDetails);
      
        return new promise(
            function (res, rej) {
                let availableGroups = [];
                activeDirectory.find(query, async function (err, results) {
                    if ((err) || (!results)) {
                        // return;
                     
                        rej(new customError.ApplicationError(err));
                    } else {
                        if (results.groups.length > 0) {
                            
                            results.groups.forEach(element => {
                                // console.log("Group-",element);
                                availableGroups.push({Group:element.cn, Path:element.dn});
                            });
                            /* Changes Before LDAP DB */
                            // res(availableGroups);
                
                            if (availableGroups.length > 0) {
                                let groupDetails = await ldapDbAccess.InsertLdapGroupDetails(availableGroups, ldapConfigId);
                                res(groupDetails);
                            } else {
                                let groupDetails = await ldapDbAccess.GetLdapGroupDetailsByLdapId(ldapConfigId);
                                //console.log("groupDetails-", groupDetails);
                                let ldapGroups=[];
                                groupDetails.forEach(group =>{
                                    ldapGroups.push({Group:group});
                                })
                                res(ldapGroups);
                            }
                        }
                    }
                });
            });
    } catch (error) {
        throw new customError.ApplicationError(error);
    }
}

/*
<summary> Helps to get LDAP Users  </summary>
<param name="ldapDetails"> LDAP Details </param>
<param name="ldapConfigId"> LDAP Configuration Id </param>
<returns> Returns all the LDAP groups </returns>
*/

async function GetLDAPUsers(ldapDetails,ldapConfigId,username) {
    try {
        //var query = 'cn=*'+username+'*';       
        var query = 'sAMAccountName=*'+username+'*';       
        var activeDirectory = new ActiveDirectoryLib(ldapDetails);
        return new promise(
           async  function (res, rej) {
                let availableUsers = [];   
                   
                 await activeDirectory.findUsers(query, true, function(err, users) {
                    if (err) {
                         rej(new customError.ApplicationError(err));
                      }          
                      availableUsers=users;
                      res(availableUsers);                        
                });               
            });
    } catch (error) {
       
        throw new customError.ApplicationError(error);
    }
}

/*
<summary> Helps to get LDAP Group Users  </summary>
<param name="ldapDetails"> LDAP Details </param>
<returns> Returns all the LDAP groups </returns>
*/

// async function GetLDAPGroupUsers(ldapDetails,groupName,filter) {
//     try {
//         var activeDirectory = new ActiveDirectoryLib(ldapDetails);
//         return new promise(
//             function (res, rej) {
//                 let availableUsers = [];
//                 let finalFilter=(filter.trim().length===0)?"*":filter;
//               
//                 var opts = {
//                     filter: '(&(objectCategory=person)(objectClass=user)(sAMAccountName=Syed*))'                   
//                   };                     
//                   query='(&(objectCategory=person)(objectClass=user)(sAMAccountName=Syed*))'
//                   activeDirectory.getUsersForGroup(opts,groupName, async function (err, results) {                   
//                     if ((err) || (!results)) {
//                         // return;
//                       
//                         rej(new customError.ApplicationError(err));
//                     } else {
//                         if(results.length>0)
//                         {
//                             availableUsers=results.map(user => {return {UserName:user.sAMAccountName,PrincipalName:user.userPrincipalName}});
//                         }
//                      
//                        res(availableUsers);
//                     }
//                 });
//             });
//     } catch (error) {
//         throw new customError.ApplicationError(error);
//     }
// }


async function GetLDAPGroupUsers(ldapDetails,groupName,filter) {
    try {
        var activeDirectory = new ActiveDirectoryLib(ldapDetails);
        return new promise(
            function (res, rej) {
                let availableUsers = [];
                let finalFilter=(filter.trim().length===0)?"*":filter;                
                var opts = {
                    includeMembership: ['group', 'user'],
                    includeDeleted: false,                    
                    //filter: '(&(|(memberOf=CN='+groupName+',CN=Users,'+ldapDetails.baseDN+')(memberOf=CN='+groupName+',CN=Builtin,'+ldapDetails.baseDN+'))(sAMAccountName='+finalFilter+'))'
                    filter: '(&(memberOf='+groupName+')(sAMAccountName='+finalFilter+'))'
                };                                 
                // console.log("Enter");
                  activeDirectory.find(opts, async function (err, users) {                   
                    if (err) {
                        // return;
                    //    console.log("error",err);
                        rej(new customError.ApplicationError(err));
                    }
                    else if(!users){
                        // console.log("No Users",users);
                        //rej(new customError.ApplicationError("User Not found",200));
                        res(availableUsers);
                    } 
                    else {
                        if(users.users.length>0)
                        {
                            // console.log("Users",users.users);
                            availableUsers=users.users.map(user => {return {UserName:user.sAMAccountName,PrincipalName:user.userPrincipalName}});
                        }
                      
                       res(availableUsers);
                    }
                });
            });
    } catch (error) {
        // console.log("error",error);
        throw new customError.ApplicationError(error);
    }
}


/*
<summary> Helps to Validate LDAP information  </summary>
<param name="ldapDetails"> LDAP Details </param>
<returns> Returns validation Success or fail </returns>
*/

async function ValidateLdapInformation(ldapDetails) {
    try {
        var query = 'cn=*';
      
        var activeDirectory = new ActiveDirectoryLib(ldapDetails);
        return new promise(
            function (res, rej) {
                activeDirectory.find(query, async function (err, results) {
                    if ((err) || (!results)) {
                        rej(new customError.ApplicationError(err));
                    } else {
                        res("Success");
                    }
                });
            });
    } catch (error) {
        throw new customError.ApplicationError(error);
    }
}


module.exports = {
    ValidateLDAPUserCredentials: ValidateLDAPUserCredentials,
    GetLDAPGroups: GetLDAPGroups,
    GetLDAPUsers:GetLDAPUsers,
    GetLDAPGroupUsers:GetLDAPGroupUsers,
    ValidateLdapInformation:ValidateLdapInformation
};