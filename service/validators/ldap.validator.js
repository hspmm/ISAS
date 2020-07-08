/* Declare required npm packages */
var schema = require('validate');

/* LDAP Group Details Request Schema */
const ldapGroupDetails = new schema({
    ldapgrouprequest: {
        ldapconfigid: {
            // type: String,
            required: true,
            // match: /^[0-9]+$/,
            message: {
                // type: 'LDAP Config Id must be a Number.',
                required: 'LDAP Config Id is required.',
                // match: 'Invalid LDAP Config Id.'
            }
        }
    }
});

/* LDAP Group users Details Request Schema */
const ldapGroupUserDetails = new schema({
    ldapgroupuserrequest: {
        ldapconfigid: {
            // type: String,
            required: true,
            // match: /^[0-9]+$/,
            message: {
                // type: 'LDAP Config Id must be a Number.',
                required: 'LDAP Config Id is required.',
                // match: 'Invalid LDAP Config Id.'
            }
        },
        groupname: {
            type: String,
            required: true,
            message: {
                type: 'Group Name must be a String.',
                required: 'Group Name is required.'
            }
        },
        filter:{
            type: String
        }
    }
});



/* LDAP Registration Schema */
const ldapRegistration = new schema({
    ldapregistration: {
        serverhostname: {
            type: String,
            required: true,
            message: {
                required: 'Server Host Name is required.'
            }
        },
        serverport: {
            // type: String,
            required: true,
            // match: /^[0-9]+$/,
            message: {
                // type: 'Server Port must be a Number.',
                required: 'Server Port is required.',
                // match: 'Invalid Server Port.'
            }
        },
        domain: {
            type: String,
            required: true,
            message: {
                required: 'Domain is required.'
            }
        },
        adminusername: {
            type: String,
            required: true,
            message: {
                required: 'Admin Username is required.'
            }
        },
        adminpassword: {
            type: String,
            required: true,
            message: {
                required: 'Admin Password is required.'
            }
        },
        issslselected: {
            type: String,
            required: true,
            enum: ['true', 'false'],
            message: {
                type: 'SSL Selected value must be a boolean.',
                required: 'SSL Selected value is required.'
            }
        }
    }
});

/* LDAP Update Schema */
const ldapUpdation = new schema({
    ldapupdate: {
        ldapconfigid: {
            // type: String,
            required: true,
            // match: /^[0-9]+$/,
            message: {
                // type: 'LDAP Config Id must be a Number.',
                required: 'LDAP Config Id is required.',
                // match: 'Invalid LDAP Config Id.'
            }
        },
        serverhostname: {
            type: String,
            required: true,
            message: {
                required: 'Server Host Name is required.'
            }
        },
        serverport: {
            // type: String,
            required: true,
            // match: /^[0-9]+$/,
            message: {
                // type: 'Server Port must be a Number.',
                required: 'Server Port is required.',
                // match: 'Invalid Server Port.'
            }
        },
        domain: {
            type: String,
            required: true,
            message: {
                required: 'Domain is required.'
            }
        },
        adminusername: {
            type: String,
            required: true,
            message: {
                required: 'Admin Username is required.'
            }
        },
        adminpassword: {
            type: String,
            required: true,
            message: {
                required: 'Admin Password is required.'
            }
        },
        issslselected: {
            type: String,
            required: true,
            enum: ['true', 'false'],
            message: {
                type: 'SSL Selected value must be a boolean.',
                required: 'SSL Selected value is required.'
            }
        }
    }
});


/* LDAP Delete Schema */
const ldapDelete = new schema({
    ldapdelete: {
        ldapconfigid: {
            // type: String,
            required: true,
            // match: /^[0-9]+$/,
            message: {
                // type: 'LDAP Config Id must be a Number.',
                required: 'LDAP Config Id is required.',
                // match: 'Invalid LDAP Config Id.'
            }
        }
    }
});

module.exports = {
    LdapGroupDetails: ldapGroupDetails,
    LdapGroupUserDetails:ldapGroupUserDetails,
    LdapRegistration:ldapRegistration,
    LdapUpdation:ldapUpdation,
    LdapDelete: ldapDelete
};