/* Declare required npm packages */
var schema = require('validate');

/* Application Details Schema */
// const applicationDetails = new schema({
//     applicationregistration: {
//         applicationname: {
//             type: String,
//             required: true,
//             message: {
//                 type: 'Application Name must be a string.',
//                 required: 'Application Name is required.'
//             }
//         },
//         applicationversion: {
//             type: String,
//             required: true,
//             message: {
//                 type: 'Application Version must be a string.',
//                 required: 'Application Version is required.'
//             }
//         },
//         adminname: {
//             type: String
//         },
//         adminemail: {
//             type: String
//         }
//     }
// });

// const applicationDetails = new schema({
//     applicationregistration: {
//         applicationname: {
//             type: String,
//             required: true,
//             match: /^[A-Za-z0-9]+$/,
//             message: {
//                 type: 'Application Name must be a string.',
//                 required: 'Application Name is required.',
//                 match:"Invalid Application Name"
//             }
//         },
//         applicationversion: {
//             type: String,
//             required: true,
//             match: /^[A-Za-z0-9]+$/,
//             message: {
//                 type: 'Application Version must be a string.',
//                 required: 'Application Version is required.',
//                 match:"Invalid Application Version"
//             }
//         },
//         adminname: {
//             type: String
//         },
//         adminemail: {
//             type: String
//         },
//         privilegedetails:{
//             required: true
//         }
//     }
// });

/* Privilege Details Schema */
const privilegeArrayDetails = new schema({  
        privilege: [{
            name: {
                type: String,
                required: true, 
                match: /^may [A-Za-z0-9]{2,} [A-Za-z0-9]{2,} */i,              
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
);

/* Privilege Details Schema */
const privilegeDetails = new schema({
        // privilege: {
            name: {
                type: String,
                required: true,
                match: /^may [A-Za-z0-9]{2,} [A-Za-z0-9]{2,} */i,
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
    // }
);


const applicationRegistrationSchema = new schema({
    applicationregistration: {
        applicationname: {
            type: String,
            required: true,
            match: /^[A-Za-z0-9 ]+$/,
            message: {
                type: 'Application Name must be a string.',
                required: 'Application Name is required.',
                match:"Invalid Application Name"
            }
        },
        applicationversion: {
            type: String,
            required: true,
            match: /^[A-Za-z0-9.]+$/,
            message: {
                type: 'Application Version must be a string.',
                required: 'Application Version is required.',
                match:"Invalid Application Version"
            }
        },
        adminname: {
            type: String
        },
        adminemail: {
            type: String,
            match: /^\S+@\S+\.\S+/,
            message: {
                type: 'Email ID must be a string.',
                match:"Invalid Email Format"
            }
        },
        privilegedetails:{
            required: true,
            type: Object,
            privilege:{
                required:true
            }         
        }
    }
});

// const applicationRegistrationArraySchema = new schema({
//     applicationregistration: {
//         applicationname: {
//             type: String,
//             required: true,
//             message: {
//                 type: 'Application Name must be a string.',
//                 required: 'Application Name is required.'
//             }
//         },
//         applicationversion: {
//             type: String,
//             required: true,
//             message: {
//                 type: 'Application Version must be a string.',
//                 required: 'Application Version is required.'
//             }
//         },
//         adminname: {
//             type: String
//         },
//         adminemail: {
//             type: String
//         },
//         privilegedetails:{
//             required:true,
//             type:Object,
//             privilege: [{
//                 required :true,
//                 name: {
//                     type: String,
//                     required: true,
//                     message: {
//                         type: 'Privilege Name must be a string.',
//                         required: 'Privilege Name is required.'
//                     }
//                 },
//                 // description: {
//                 //     type: String,
//                 //     required: true,
//                 //     message: {
//                 //         type: 'Privilege Description must be a string.',
//                 //         required: 'Privilege Description is required.'
//                 //     }
//                 // },
//                 key: {
//                     type: String,
//                     required: true,
//                     message: {
//                         type: 'Privilege Key must be a string.',
//                         required: 'Privilege Key is required.'
//                     }
//                 }
//             }]
//         }
//     }
// });

/* Application Token Validity Update Schema */
const updateTokenValidity = new schema({
    tokenvalidityrequest: {
        validity: {            
            required: true,
            match: /^[0-9]+$/,
            message: {
                required: 'Token Validity required.',
                match:'Invalid Validity'
            }
        }
    }
});

/* Validate Application Schema */
const validateApplicationSchema = new schema({
    validateapplicationrequest: {
        applicationtoken: {  
            type: String,          
            required: true,
            message: {
                required: 'Application Token required.'
            }
        }
    }
});

module.exports = {
    // ApplicationRegistration: applicationDetails,
    PrivilegeArrayDetails:privilegeArrayDetails,
    PrivilegeDetails:privilegeDetails,
    ApplicationRegistrationSchema: applicationRegistrationSchema,
   // ApplicationRegistrationArraySchema: applicationRegistrationArraySchema
    UpdateTokenValidity:updateTokenValidity,
    ValidateApplicationSchema:validateApplicationSchema
};