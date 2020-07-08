/* Declare required npm packages */
var schema = require('validate');

/* LDAP Based Authentication Required Parameters */
const ldapRequiredDetails = new schema({
    username: {
        type: String,
        required: true,
        match:/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w+)+$/,
        message: {
            type: 'Username must be a String or Number.',
            required: 'Username is required.',
            match: "Incorrect Email format"
        }
    },
    password: {
        required: true,
        message: {
            required: 'Password is required.'
        }
    },
    // domainname: {
    //     type: String,
    //     required: true
    // }
});

/* Imprivata Password Based Authentication Required Parameters */
const imprivataPasswordRequiredDetails = new schema({
    username: {
        type: String,
        required: true,
        message: {
            type: 'Username must be a String or Number.',
            required: 'Username is required.'
        }
    },
    password: {
        required: true,
        message: {
            required: 'Password is required.'
        }
    },
    // domainname: {
    //     type: String,
    //     required: true
    // }
});

/* Imprivata Proximity Card Based Authentication Required Parameters */
const imprivataCardRequiredDetails = new schema({
    uniqueid: {
        type: String,
        required: true,
        message: {
            type: 'Unique Id must be a String or Number.',
            required: 'Unique Id is required.'
        }
    }
});

/* User Authentication Schema */
const userAuthentication = new schema({
    authenticationrequest: {
        authenticationtype: {
            type: String,
            required: true,
            enum: ['LDAP', 'Imprivata', 'ISAS'],
            message: {
                type: 'Authentication Type must be a string.',
                required: 'Authentication Type is required.'
            }
        },
        authenticationmethod: {
            type: String,
            required: true,
            enum: ['Password', 'Proximity Card'],
            message: {
                type: 'Authentication Method must be a string.',
                required: 'Authentication Method is required.'
            }
        },
        authenticationparameters: {
            required: true
        }
        // authenticationparameters: {
        //     type: imprivataCardRequiredDetails,
        //     required: true,
        //     message: {
        //         required: 'Authentication Parameters required.'
        //     }
        // }
    }
});

/* User Information Schema */
const userInformation = new schema({
    userinforequest: {
        userid: {
            // type: String,
            required: true,
            message: {
                required: 'User ID is required.'
            }
        }
    }
});


/* User Information Schema */
const userAndRoleDetails = new schema({
    userregistration: {
        userdetails: {
            firstname: {
                type: String,
                required: true,
                message: {
                    required: 'First Name is required.'
                }
            },
            middlename: {
                type: String,
                //required: true,
                message: {
                    required: 'Middle Name is required.'
                }
            },
            lastname: {
                type: String,
                required: true,
                message: {
                    required: 'Last Name is required.'
                }
            },
            mobilenumber: {
                type: String,
                required: true,
               // match: /^[0-9][0-9]+\-\d{10}/,
                message: {
                    type: 'Mobile Number must be a string.',
                    required: 'Mobile Number is required.',
                   // match: 'Invalid Mobile Number.'
                }
            },
            emailid: {
                type: String,
                required: true,
               // match: /^\S+@\S+\.\S+/,
                message: {
                    type: 'Email ID must be a string.',
                    required: 'Email ID is required.',
                  //  match: 'Invalid Email ID'
                }
            },
            isemailselected: {
                type: String,
                required: true,
                enum: ['true', 'false'],
                message: {
                    type: 'Email ID is Login Id value must be a boolean.',
                    required: 'Email ID is Login Id value is required.'
                }
            },
            loginid: {
                type: String,
                required: true,
                message: {
                    type: 'Login ID must be a string.',
                    required: 'Login ID is required.'
                }
            },
            password: {
                type: String,
                required: true,
               // match: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
                message: {
                    type: 'Password must be a string.',
                    required: 'Password is required.',
                    //match: 'Password must contain atleast 1 integer,1 special character(!@#\$%\^&\*),1 Uppercase letter,1 Lowercase letter and must be eight characters or long'
                }
            },
            isaccountlocked: {
                type: String,
                required: true,
                enum: ['true', 'false'],
                message: {
                    type: 'Account Locked value must be a boolean.',
                    required: 'Account Locked value is required.'
                }
            },
            isaccountdisabled: {
                type: String,
                required: true,
                enum: ['true', 'false'],
                message: {
                    type: 'Account Disabled value must be a boolean.',
                    required: 'Account Disabled value is required.'
                }
            }
        },
        roledetails: {
            role: {
                roleid: {
                    // type: String,
                    match: /^[0-9]+$/,
                    message: {
                        // type: 'Role ID must be a Number.',
                        required: 'Role ID is required.',
                        match: "Role ID must be a Number."
                    }
                }
            }
        }
    }
});

/* User Information Schema */
const userAndRoleArrayDetails = new schema({
    userregistration: {
        userdetails: {
            firstname: {
                type: String,
                required: true,
                message: {
                    required: 'First Name is required.'
                }
            },
            middlename: {
                type: String,
               // required: true,
                message: {
                    required: 'Middle Name is required.'
                }
            },
            lastname: {
                type: String,
                required: true,
                message: {
                    required: 'Last Name is required.'
                }
            },
            mobilenumber: {
                type: String,
                required: true,
                //match: /^[0-9][0-9]+\-\d{10}/,
                message: {
                    type: 'Mobile Number must be a string.',
                    required: 'Mobile Number is required.',
                    //match: 'Invalid Mobile Number.'
                }
            },
            emailid: {
                type: String,
                required: true,
                //match: /^\S+@\S+\.\S+/,
                message: {
                    type: 'Email ID must be a string.',
                    required: 'Email ID is required.',
                    // match: 'Invalid Email ID'
                }
            },
            isemailselected: {
                type: String,
                required: true,
                enum: ['true', 'false'],
                message: {
                    type: 'Email ID is Login Id value must be a boolean.',
                    required: 'Email ID is Login Id value is required.'
                }
            },
            loginid: {
                type: String,
                required: true,
                message: {
                    type: 'Login ID must be a string.',
                    required: 'Login ID is required.'
                }
            },
            password: {
                type: String,
                required: true,
               // match: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
                message: {
                    type: 'Password must be a string.',
                    required: 'Password is required.',
                   // match: 'Password must contain atleast 1 integer,1 special character(!@#\$%\^&\*),1 Uppercase letter,1 Lowercase letter and must be eight characters or long'
                }
            },
            isaccountlocked: {
                type: String,
                required: true,
                enum: ['true', 'false'],
                message: {
                    type: 'Account Locked value must be a boolean.',
                    required: 'Account Locked value is required.'
                }
            },
            isaccountdisabled: {
                type: String,
                required: true,
                enum: ['true', 'false'],
                message: {
                    type: 'Account Disabled value must be a boolean.',
                    required: 'Account Disabled value is required.'
                }
            }
        },
        roledetails: {
            role: [{
                roleid: {
                    // type: String,
                    required: true,
                    match: /^[0-9]+$/,
                    message: {
                        // type: 'Role ID must be a Number.',
                        required: 'Role ID is required.',
                        match: "Role ID must be a Number."
                    }
                }
            }]
        }
    }
});

/* User Information Schema */
const userAndRoleUpdateDetails = new schema({
    userupdate: {
        userdetails: {
            userid: {
                // type: String,
                required: true,
                message: {
                    required: 'User Id is required.'
                }
            },
            firstname: {
                type: String,
                required: true,
                message: {
                    required: 'First Name is required.'
                }
            },
            middlename: {
                type: String,
                //required: true,
                message: {
                    required: 'Middle Name is required.'
                }
            },
            lastname: {
                type: String,
                required: true,
                message: {
                    required: 'Last Name is required.'
                }
            },
            mobilenumber: {
                type: String,
                required: true,
               // match: /^[0-9][0-9]+\-\d{10}/,
                message: {
                    type: 'Mobile Number must be a string.',
                    required: 'Mobile Number is required.',
                   // match: 'Invalid Mobile Number.'
                }
            },
            emailid: {
                type: String,
                required: true,
               // match: /^\S+@\S+\.\S+/,
                message: {
                    type: 'Email ID must be a string.',
                    required: 'Email ID is required.',
                  //  match: 'Invalid Email ID'
                }
            },
            isemailselected: {
                type: String,
                required: true,
                enum: ['true', 'false'],
                message: {
                    type: 'Email ID is Login Id value must be a boolean.',
                    required: 'Email ID is Login Id value is required.'
                }
            },
            loginid: {
                type: String,
                required: true,
                message: {
                    type: 'Login ID must be a string.',
                    required: 'Login ID is required.'
                }
            },
            password: {
                type: String,
                required: true,
               // match: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
                message: {
                    type: 'Password must be a string.',
                    required: 'Password is required.',
                    //match: 'Password must contain atleast 1 integer,1 special character(!@#\$%\^&\*),1 Uppercase letter,1 Lowercase letter and must be eight characters or long'
                }
            },
            isaccountlocked: {
                type: String,
                required: true,
                enum: ['true', 'false'],
                message: {
                    type: 'Account Locked value must be a boolean.',
                    required: 'Account Locked value is required.'
                }
            },
            isaccountdisabled: {
                type: String,
                required: true,
                enum: ['true', 'false'],
                message: {
                    type: 'Account Disabled value must be a boolean.',
                    required: 'Account Disabled value is required.'
                }
            }
        },
        roledetails: {
            role: {
                roleid: {
                    // type: String,
                    match: /^[0-9]+$/,
                    message: {
                        // type: 'Role ID must be a Number.',
                        required: 'Role ID is required.',
                        match: "Role ID must be a Number."
                    }
                }
            }
        }
    }
});

/* User Information Schema */
const userAndRoleUpdateArrayDetails = new schema({
    userupdate: {
        userdetails: {
            userid: {
                // type: String,
                required: true,
                message: {
                    required: 'User Id is required.'
                }
            },
            firstname: {
                type: String,
                required: true,
                message: {
                    required: 'First Name is required.'
                }
            },
            middlename: {
                type: String,
                //required: true,
                message: {
                    required: 'Middle Name is required.'
                }
            },
            lastname: {
                type: String,
                required: true,
                message: {
                    required: 'Last Name is required.'
                }
            },
            mobilenumber: {
                // type: String,
                required: true,
                //match: /^[0-9][0-9]+\-\d{10}/,
                message: {
                    type: 'Mobile Number must be a string.',
                    required: 'Mobile Number is required.',
                    //match: 'Invalid Mobile Number.'
                }
            },
            emailid: {
                type: String,
                required: true,
                //match: /^\S+@\S+\.\S+/,
                message: {
                    type: 'Email ID must be a string.',
                    required: 'Email ID is required.',
                    // match: 'Invalid Email ID'
                }
            },
            isemailselected: {
                type: String,
                required: true,
                enum: ['true', 'false'],
                message: {
                    type: 'Email ID is Login Id value must be a boolean.',
                    required: 'Email ID is Login Id value is required.'
                }
            },
            loginid: {
                type: String,
                required: true,
                message: {
                    type: 'Login ID must be a string.',
                    required: 'Login ID is required.'
                }
            },
            password: {
                type: String,
                required: true,
               // match: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
                message: {
                    type: 'Password must be a string.',
                    required: 'Password is required.',
                   // match: 'Password must contain atleast 1 integer,1 special character(!@#\$%\^&\*),1 Uppercase letter,1 Lowercase letter and must be eight characters or long'
                }
            },
            isaccountlocked: {
                type: String,
                required: true,
                enum: ['true', 'false'],
                message: {
                    type: 'Account Locked value must be a boolean.',
                    required: 'Account Locked value is required.'
                }
            },
            isaccountdisabled: {
                type: String,
                required: true,
                enum: ['true', 'false'],
                message: {
                    type: 'Account Disabled value must be a boolean.',
                    required: 'Account Disabled value is required.'
                }
            }
        },
        roledetails: {
            role: [{
                roleid: {
                    // type: String,
                    required: true,
                    match: /^[0-9]+$/,
                    message: {
                        // type: 'Role ID must be a Number.',
                        required: 'Role ID is required.',
                        match: "Role ID must be a Number."
                    }
                }
            }]
        }
    }
});


/* User Deletion Schema */
const userInfoDelete = new schema({
    userdeleterequest: {
        userid: {
            // type: String,
            required: true,
            message: {
                required: 'User ID is required.'
            }
        }
    }
});


/* LDAP User Information Request Schema */
const ldapUserInfoRequest = new schema({
    ldapuserinforequest: {
        username: {
            type: String,
            required: true,
            message: {
                required: 'User Name is required.'
            }
        }
    }
});


/* ISAS Based Authentication Required Parameters */
const isasRequiredDetails = new schema({
    username: {
        type: String,
        required: true,
        message: {
            type: 'Username must be a String or Number.',
            required: 'Username is required.'
        }
    },
    password: {
        required: true,
        message: {
            required: 'Password is required.'
        }
    }
});

/* User Logout Schema */
const userLogoutSchema = new schema({
    logoutrequest: {
        accesstoken: {
            type: String,
            required: true,
            length: { min: 1 },
            message: {
                required: 'Access Token required.'
            }
        }
    }
});

/* User Information Schema */
const defaultUserRequestSchema = new schema({
    defaultuserrequest: {
        nodeinfo: {
            uid: {
                type: String,
                required: true,
                message: {
                    required: 'UID is required.'
                }
            },
            nodeid: {
                required: true,
                match: /^[0-9]+$/,
                message: {
                    required: 'Middle Name is required.',
                    match:'Node Id must be a Number'                }
            },
            nodename: {
                type: String,
                required: true,
                message: {
                    required: 'Node Name is required.'
                }
            },
            nodetype: {
                type: String,
                required: true,
                message: {
                    required: 'Node Type is required.'
                }
            }  
        }
    }
});


/* User Password Reset Schema */
const resetUserPasswordSchema = new schema({
    passwordresetrequest: {
        userid: {
            required: true,
            match: /^[0-9]+$/,         
            message: {
                required: 'User Id required.'
            }
        },
        currentpassword: {
            type: String,
            required: true,          
            message: {
                required: 'Current Password required.'
            }
        },
        newpassword: {
            type: String,
            required: true,          
            message: {
                required: 'New Password required.'
            }
        }
    }
});
module.exports = {
    UserAuthentication: userAuthentication,
    LdapRequiredDetails: ldapRequiredDetails,
    ImprivataPasswordRequiredDetails: imprivataPasswordRequiredDetails,
    ImprivataCardRequiredDetails: imprivataCardRequiredDetails,
    UserInformation: userInformation,
    UserAndRoleRegistration: userAndRoleDetails,
    UserAndRoleArrayRegistration: userAndRoleArrayDetails,
    UserAndRoleUpdation: userAndRoleUpdateDetails,
    UserAndRoleArrayUpdation: userAndRoleUpdateArrayDetails,
    UserInfoDeletion:userInfoDelete,
    LdapUserInfoRequest:ldapUserInfoRequest,
    IsasRequiredDetails: isasRequiredDetails,
    UserLogoutSchema:userLogoutSchema,
    DefaultUserRequestSchema:defaultUserRequestSchema,
    ResetUserPasswordSchema:resetUserPasswordSchema
};