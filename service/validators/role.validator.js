/* Declare required npm packages */
var schema = require('validate');

/* Role Details Schema */
const roleDetailsArray = new schema({
    roleregistration: {
        role: [{
            name: {
                type: String,
                required: true,
                message: {
                    type: 'Role Name must be a string.',
                    required: 'Role Name is required.'
                }
            },
            roledescription: {
                type: String,
                required: true,
                message: {
                    type: 'Role Description must be a string.',
                    required: 'Role Description is required.'
                }
            }
        }]
    }
});


/* Role Details Schema */
const roleDetails = new schema({
    roleregistration: {
        role: {
            name: {
                type: String,
                required: true,
                message: {
                    type: 'Role Name must be a string.',
                    required: 'Role Name is required.'
                }
            },
            roledescription: {
                type: String,
                required: true,
                message: {
                    type: 'Role Description must be a string.',
                    required: 'Role Description is required.'
                }
            }
        }
    }
});

const rolePrivilegeArrayRequest = new schema({
    roleprivilegerequest: {
        role: [{
            roleid: {
                // type: String,
                required: true,
                match: /^[0-9]+$/,
                message: {
                    // type: 'Role ID must be a Number.',
                    match: "Role ID must be a Number.",
                    required: 'Role ID is required.'
                    
                }
            }
        }]
    }
});

const rolePrivilegeRequest = new schema({
    roleprivilegerequest: {
        role: {
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
        }
    }
});

/* Role Information Schema */
const roleInformation = new schema({
    roleinforequest: {
        roleid: {
            // type: String,
            required: true,
            message: {
                required: 'Role ID is required.'
            }
        }
    }
});

/* Role Full Information Schema */
const roleInfoArray = new schema({
    roleregistration: {
        role: {
            name: {
                type: String,
                required: true,
                message: {
                    type: 'Role Name must be a string.',
                    required: 'Role Name is required.'
                }
            },
            roledescription: {
                type: String,
                required: true,
                message: {
                    type: 'Role Description must be a string.',
                    required: 'Role Description is required.'
                }
            }
        },
        securitymodel:{
            type: String,
            required: true,
            enum: ['LDAP', 'ISAS'],
            message: {
                type: 'Security Model must be a string.',
                required: 'Security Model is required.'
            }
        },
        // privilegedetails: {
        //     privilege: [{
        //         siteid: {
        //             type: String,
        //             required: true,
        //             match: /^[0-9]+$/,
        //             message: {
        //                 type: 'Site Id must be a Number.',
        //                 required: 'Site Id is required.',
        //                 match: 'Invalid Site Id.'
        //             }
        //         },
        //         privilegeid: {
        //             type: String,
        //             required: true,
        //             match: /^[0-9]+$/,
        //             message: {
        //                 type: 'Privilege Id must be a Number.',
        //                 required: 'Privilege Id is required.',
        //                 match: 'Invalid Privilege Id.'
        //             }
        //         },
        //         privilegename: {
        //             type: String,
        //             required: true,
        //             message: {
        //                 type: 'Privilege Name must be a Number.',
        //                 required: 'Privilege Name is required.'
        //             }
        //         }
        //     }]
        // }
        // ,
        // groupdetails: {
        //     group: [{
        //         groupId: {
        //             type: String,
        //             required: true,
        //             match: /^[0-9]+$/,
        //             message: {
        //                 type: 'Group Id must be a Number.',
        //                 required: 'Group Id is required.',
        //                 match: 'Invalid Group Id.'
        //             }
        //         }
        //     }]
        // }

    }
});


/* Role full Information Schema */
const roleInfo = new schema({
    roleregistration: {
        role: {
            name: {
                type: String,
                required: true,
                message: {
                    type: 'Role Name must be a string.',
                    required: 'Role Name is required.'
                }
            },
            roledescription: {
                type: String,
                required: true,
                message: {
                    type: 'Role Description must be a string.',
                    required: 'Role Description is required.'
                }
            }
        },
        securitymodel:{
            type: String,
            required: true,
            enum: ['LDAP', 'ISAS',"Imprivata"],
            message: {
                type: 'Security Model must be a string.',
                required: 'Security Model is required.'
            }
        },
        // privilegedetails: {
        //     privilege: {
        //         siteid: {
        //             type: String,
        //             required: true,
        //             match: /^[0-9]+$/,
        //             message: {
        //                 type: 'Site Id must be a Number.',
        //                 required: 'Site Id is required.',
        //                 match: 'Invalid Site Id.'
        //             }
        //         },
        //         privilegeid: {
        //             type: String,
        //             required: true,
        //             match: /^[0-9]+$/,
        //             message: {
        //                 type: 'Privilege Id must be a Number.',
        //                 required: 'Privilege Id is required.',
        //                 match: 'Invalid Privilege Id.'
        //             }
        //         },
        //         privilegename: {
        //             type: String,
        //             required: true,
        //             message: {
        //                 type: 'Privilege Name must be a Number.',
        //                 required: 'Privilege Name is required.'
        //             }
        //         }
        //     }
        // }
        // ,
        // groupdetails: {
        //     group: {
        //         groupid: {
        //             type: String,
        //             required: true,
        //             match: /^[0-9]+$/,
        //             message: {
        //                 type: 'Group Id must be a Number.',
        //                 required: 'Group Id is required.',
        //                 match: 'Invalid Group Id.'
        //             }
        //         }
        //     }
        // }


    }
});

/* Role Full Information Schema */
const roleInfoUpdateArray = new schema({
    roleupdate: {
        role: {
            id: {
                type: String,
                required: true,
                match: /^[0-9]+$/,
                message: {
                    type: 'Role Id must be a Number.',
                    required: 'Role Id is required.',
                    match: 'Invalid Role Id.'
                }
            },
            name: {
                type: String,
                required: true,
                message: {
                    type: 'Role Name must be a string.',
                    required: 'Role Name is required.'
                }
            },
            roledescription: {
                type: String,
                required: true,
                message: {
                    type: 'Role Description must be a string.',
                    required: 'Role Description is required.'
                }
            }
        },
        // privilegedetails: {
        //     privilege: [{
        //         siteid: {
        //             type: String,
        //             required: true,
        //             match: /^[0-9]+$/,
        //             message: {
        //                 type: 'Site Id must be a Number.',
        //                 required: 'Site Id is required.',
        //                 match: 'Invalid Site Id.'
        //             }
        //         },
        //         privilegeid: {
        //             type: String,
        //             required: true,
        //             match: /^[0-9]+$/,
        //             message: {
        //                 type: 'Privilege Id must be a Number.',
        //                 required: 'Privilege Id is required.',
        //                 match: 'Invalid Privilege Id.'
        //             }
        //         },
        //         privilegename: {
        //             type: String,
        //             required: true,
        //             message: {
        //                 type: 'Privilege Name must be a Number.',
        //                 required: 'Privilege Name is required.'
        //             }
        //         }
        //     }]
        // }

    },
    securitymodel:{
        type: String,
        required: true,
        enum: ['LDAP', 'ISAS',"Imprivata"],
        message: {
            type: 'Security Model must be a string.',
            required: 'Security Model is required.'
        }
    }
});

/* Role full Information Schema */
const roleInfoUpdate = new schema({
    roleupdate: {
        role: {
            id: {
                // type: String,
                required: true,
                match: /^[0-9]+$/,
                message: {
                    // type: 'Role Id must be a Number.',
                    required: 'Role Id is required.',
                    match: 'Invalid Role Id.'
                }
            },
            name: {
                type: String,
                required: true,
                message: {
                    type: 'Role Name must be a string.',
                    required: 'Role Name is required.'
                }
            },
            roledescription: {
                type: String,
                required: true,
                message: {
                    type: 'Role Description must be a string.',
                    required: 'Role Description is required.'
                }
            }
        },
        securitymodel:{
            type: String,
            required: true,
            enum: ['LDAP', 'ISAS',"Imprivata"],
            message: {
                type: 'Security Model must be a string.',
                required: 'Security Model is required.'
            }
        },
        // privilegedetails: {
        //     privilege: {
        //         siteid: {
        //             type: String,
        //             required: true,
        //             match: /^[0-9]+$/,
        //             message: {
        //                 type: 'Site Id must be a Number.',
        //                 required: 'Site Id is required.',
        //                 match: 'Invalid Site Id.'
        //             }
        //         },
        //         privilegeid: {
        //             type: String,
        //             required: true,
        //             match: /^[0-9]+$/,
        //             message: {
        //                 type: 'Privilege Id must be a Number.',
        //                 required: 'Privilege Id is required.',
        //                 match: 'Invalid Privilege Id.'
        //             }
        //         },
        //         privilegename: {
        //             type: String,
        //             required: true,
        //             message: {
        //                 type: 'Privilege Name must be a Number.',
        //                 required: 'Privilege Name is required.'
        //             }
        //         }
        //     }
        // }

    }
});


/* Privilege full Information Schema */
const privilegeInfo = new schema({
    privilege: {            
        privilegeid: {
            type: String,
            required: true,
            match: /^[0-9]+$/,
            message: {
                type: 'Privilege Id must be a Number.',
                required: 'Privilege Id is required.',
                match: 'Invalid Privilege Id.'
            }
        },
        privilegename: {
            type: String,
            required: true,
            message: {
                type: 'Privilege Name must be a Number.',
                required: 'Privilege Name is required.'
            }
        }
    }
});

/* Privilege full Information Schema */
const privilegeArrayInfo = new schema({   
privilege: [{
        privilegeid: {
            type: String,
            required: true,
            match: /^[0-9]+$/,
            message: {
                type: 'Privilege Id must be a Number.',
                required: 'Privilege Id is required.',
                match: 'Invalid Privilege Id.'
            }
        },
        privilegename: {
            type: String,
            required: true,
            message: {
                type: 'Privilege Name must be a Number.',
                required: 'Privilege Name is required.'
            }
        }
    }]    
});

/* Site full Information Schema */
const siteInfo = new schema({
    site: {            
        siteid: {
                type: String,
                required: true,
                match: /^[0-9]+$/,
                message: {
                    type: 'Site Id must be a Number.',
                    required: 'Site Id is required.',
                    match: 'Invalid Site Id.'
                }
        }
    }
});

/* Privilege full Information Schema */
const siteArrayInfo = new schema({   
site: [{
    siteid: {
        type: String,
        required: true,
        match: /^[0-9]+$/,
        message: {
            type: 'Site Id must be a Number.',
            required: 'Site Id is required.',
            match: 'Invalid Site Id.'
        }}
    }]    
});

/* Group full Information Schema */
const groupInfo = new schema({
        group: {
            groupid: {
                type: String,
                required: true,
                match: /^[0-9]+$/,
                message: {
                    type: 'Group Id must be a Number.',
                    required: 'Group Id is required.',
                    match: 'Invalid Group Id.'
                }
            }
        }
});

/* Group full Information Schema */
const groupArrayInfo = new schema({   
        group: [{
            groupid: {
                type: String,
                required: true,
                match: /^[0-9]+$/,
                message: {
                    type: 'Group Id must be a Number.',
                    required: 'Group Id is required.',
                    match: 'Invalid Group Id.'
                }
            }
        }]    
});

/* User full Information Schema */
const userInfo = new schema({
    user: {
        userid: {
            type: String,
            required: true,
            match: /^[0-9]+$/,
            message: {
                type: 'User Id must be a Number.',
                required: 'User Id is required.',
                match: 'Invalid User Id.'
            }
        }
    }
});

/* User full Information Schema */
const userArrayInfo = new schema({   
    user: [{
        userid: {
            type: String,
            required: true,
            match: /^[0-9]+$/,
            message: {
                type: 'User Id must be a Number.',
                required: 'User Id is required.',
                match: 'Invalid User Id.'
            }
        }
    }]    
});

/* Role Deletion Schema */
const roleInfoDelete = new schema({
    roledeleterequest: {
        roleid: {
            // type: String,
            required: true,
            message: {
                required: 'Role ID is required.'
            }
        }
    }
});

module.exports = {
    RoleArrayRegistration: roleDetailsArray,
    RoleRegistration: roleDetails,
    RolePrivilegeArrayRequest: rolePrivilegeArrayRequest,
    RolePrivilegeRequest: rolePrivilegeRequest,
    RoleInformation: roleInformation,
    //RoleInfoArrayRegistration: roleInfoArray,
    RoleInfoRegistration: roleInfo,
   // RoleInfoArrayUpdation: roleInfoUpdateArray,
    RoleInfoUpdation: roleInfoUpdate,
    GroupInfo: groupInfo,
    GroupArrayInfo: groupArrayInfo,
    RoleInfoDeletion:roleInfoDelete,
    UserInfo: userInfo,
    UserArrayInfo: userArrayInfo,
    PrivilegeInfo: privilegeInfo,
    PrivilegeArrayInfo: privilegeArrayInfo,
    SiteInfo: siteInfo,
    SiteArrayInfo: siteArrayInfo
};