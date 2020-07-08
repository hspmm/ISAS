/* Declare required npm packages */
var schema = require('validate');

/* Security Model Update Details Schema */
const securityModelUpdateRequest = new schema({
    securitymodelupdaterequest: {
        securitymodel: {
            type: String,
            required: true,
            enum: ['LDAP', 'ISAS','Imprivata'],
            message: {
                type: 'Security Model must be a string.',
                required: 'Security Mode is required.'
            }
        }
    }
});

/* Config Info Schema */
const configInfoRequest = new schema({
    configinforequest: {
        baseurl: {
            type: String,
            required: true,
            message: {
                type: 'Base URL must be a string.',
                required: 'Base URL is required.'
            }
        },
        port: {
            type: String,
            required: true,
            message: {
                type: 'Port must be a string.',
                required: 'Port is required.'
            }
        }
    }
});

/* Site Info Schema */
const siteInfoRequest = new schema({
    siteinforequest: {
        accesstoken: {
            type: String,
            required: true,
            message: {
                type: 'Session Id must be a string.',
                required: 'Session Id is required.'
            }
        }
    }
});

/* General Config Schema */
const generalConfigUpdateRequest = new schema({
    generalconfigupdaterequest: {
        lockoutperiod: {           
            required: true,
            match: /^[0-9]+$/,
            message: {                
                required: 'Lockout Period is required.',
                match: 'Invalid Lockout Period'
            }
        },
        maxretires: {           
            required: true,
            match: /^[0-9]+$/,
            message: {                
                required: 'Max Retires is required.',
                match: 'Invalid Max Retires'
            }
        },
        maxloginattempts: {           
            required: true,
            match: /^[0-9]+$/,
            message: {                
                required: 'Max Login Attempts is required.',
                match: 'Invalid Max Login Attempts'
            }
        }
    }
});

/* Key Update Update Details Schema */
// const keyUpdateRequest = new schema({
//     updatekeyinforequest: {
//         key: {
//             type: String,
//             required: true,
//             message: {
//                 type: 'Key must be a string.',
//                 required: 'Key is required.'
//             }
//         },
//         password: {
//             type: String,
//             required: true,
//             message: {
//                 type: 'Password must be a string.',
//                 required: 'Password is required.'
//             }
//         }
//     }
// });


/* Key Info Request Schema */
const keyInfoRequest = new schema({
    keyinforequest: {
        password: {
            type: String,
            required: true,
            message: {
                type: 'Password must be a string.',
                required: 'Password is required.'
            }
        }
    }
});

/* EC Site Info Schema */
const enterpriseSiteInfo = new schema({
    data: {
        hierarchyTree: {
            type:Array,
            required:true,
            message: {
                required: 'hierarchyTree is required.'
            }
        },
        singleInstancePlugins:{
             type:Array,
            required:true,
            message: {
                required: 'singleInstancePlugins is required.'
            }
        }
    }
});


module.exports = {
    SecurityModelUpdateRequest: securityModelUpdateRequest,
    ConfigInfoRequest:configInfoRequest,
    SiteInfoRequest:siteInfoRequest,
    GeneralConfigUpdateRequest:generalConfigUpdateRequest,
    //KeyUpdateRequest:keyUpdateRequest,
    KeyInfoRequest:keyInfoRequest,
    EnterpriseSiteInfo:enterpriseSiteInfo
};