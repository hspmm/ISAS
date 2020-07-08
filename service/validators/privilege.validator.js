/* Declare required npm packages */
var schema = require('validate');

/* Privilege Details Schema */
const privilegeArrayDetails = new schema({
    privilegeregistration: {
        privilege: [{
            name: {
                type: String,
                required: true,
                match:/^may [A-Za-z0-9]{2,} [A-Za-z0-9]{2,} */i,
                message: {
                    type: 'Privilege Name must be a string.',
                    required: 'Privilege Name is required.',
                    match: 'Invalid Privilege Format'
                }
            },
            // description: {
            //     type: String,
            //     required: true,
            //     message: {
            //         type: 'Privilege Description must be a string.',
            //         required: 'Privilege Description is required.'
            //     }
            // },
            key: {
                type: String,
                required: true,
                message: {
                    type: 'Privilege Key must be a string.',
                    required: 'Privilege Key is required.'
                }
            }
        }]
    }
});

/* Privilege Details Schema */
const privilegeDetails = new schema({
    privilegeregistration: {
        privilege: {
            name: {
                type: String,
                required: true,
                match:/^may [A-Za-z0-9]{2,} [A-Za-z0-9]{2,} */i,
                message: {
                    type: 'Privilege Name must be a string.',
                    required: 'Privilege Name is required.',
                    match: 'Invalid Privilege Format'
                }
            },
            // description: {
            //     type: String,
            //     required: true,
            //     message: {
            //         type: 'Privilege Description must be a string.',
            //         required: 'Privilege Description is required.'
            //     }
            // },
            key: {
                type: String,
                required: true,
                message: {
                    type: 'Privilege Key must be a string.',
                    required: 'Privilege Key is required.'
                }
            }
        }
    }
});


const privilegeRoleArrayRequest = new schema({
    privilegerolerequest: {
        privilege: [{
            privilegeid: {
                // type: String,
                required: true,
                match: /^[0-9]+$/,
                message: {
                    // type: 'Privilege ID must be a Number.',
                    required: 'Privilege ID is required.',
                    match: "Privilege ID must be a Number."
                }
            }
        }]
    }
});

const privilegeroleRequest = new schema({
    privilegerolerequest: {
        privilege: {
            privilegeid: {
                // type: String,
                required: true,
                match: /^[0-9]+$/,
                message: {
                    // type: 'Privilege ID must be a Number.',
                    required: 'Privilege ID is required.',
                    match: "Privilege ID must be a Number."
                }
            }
        }
    }
});

const privilegeUserArrayRequest = new schema({
    privilegeuserrequest: {
        privilege: [{
            privilegeid: {
                // type: String,
                required: true,
                match: /^[0-9]+$/,
                message: {
                    // type: 'Privilege ID must be a Number.',
                    required: 'Privilege ID is required.',
                    match: "Privilege ID must be a Number."
                }
            }
        }]
    }
});

const privilegeUserRequest = new schema({
    privilegeuserrequest: {
        privilege: {
            privilegeid: {
                // type: String,
                required: true,
                match: /^[0-9]+$/,
                message: {
                    // type: 'Privilege ID must be a Number.',
                    required: 'Privilege ID is required.',
                    match: "Privilege ID must be a Number."
                }
            }
        }
    }
});

const privilegeLdapArrayRequest = new schema({
    privilegeldaprequest: {
        privilege: [{
            privilegeid: {
                // type: String,
                required: true,
                match: /^[0-9]+$/,
                message: {
                    // type: 'Privilege ID must be a Number.',
                    required: 'Privilege ID is required.',
                    match: "Privilege ID must be a Number."
                }
            }
        }]
    }
});

const privilegeLdapRequest = new schema({
    privilegeldaprequest: {
        privilege: {
            privilegeid: {
                // type: String,
                required: true,
                match: /^[0-9]+$/,
                message: {
                    // type: 'Privilege ID must be a Number.',
                    required: 'Privilege ID is required.',
                    match: "Privilege ID must be a Number."
                }
            }
        }
    }
});

module.exports = {
    PrivilegeRegistration: privilegeDetails,
    PrivilegeArrayRegistration: privilegeArrayDetails,
    PrivilegeRoleArrayRequest: privilegeRoleArrayRequest,
    PrivilegeRoleRequest: privilegeroleRequest,
    PrivilegeUserArrayRequest: privilegeUserArrayRequest,
    PrivilegeUserRequest: privilegeUserRequest,
    PrivilegeLdapArrayRequest: privilegeLdapArrayRequest,
    PrivilegeLdapRequest: privilegeLdapRequest,
};