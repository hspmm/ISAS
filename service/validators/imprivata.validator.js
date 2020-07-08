/* Declare required npm packages */
var schema = require('validate');

/* Imprivata Registration Schema */
const imprivataRegistration = new schema({
    imprivataregistration: {
        configname: {
            type: String,
            required: true,
            message: {
                required: 'Configuration Name is required.'
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
            required: true,
            // match: /^[0-9]+$/,
            message: {
                // type: 'Server Port must be a Number.',
                required: 'Server Port is required.',
                // match: 'Invalid Server Port.'
            }
        },
        apipath: {
            type: String,
            required: true,
            message: {
                required: 'API Path is required.'
            }
        },
        apiversion: {
            type: String,
            required: true,
            message: {
                required: 'API Version is required.'
            }
        },
        productcode: {
            type: String,
            required: true,
            message: {
                required: 'Product Code is required.'
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

/* Imprivata Update Schema */
const imprivataUpdation = new schema({
    imprivataupdate: {
        imprivataconfigid: {          
            required: true,
            message: {
                // type: 'Imprivata Config Id must be a Number.',
                required: 'Imprivata Config Id is required.',
                // match: 'Invalid Imprivata Config Id.'
            }
        },
        configname: {
            type: String,
            required: true,
            message: {
                required: 'Configuration Name is required.'
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
        apipath: {
            type: String,
            required: true,
            message: {
                required: 'API Path is required.'
            }
        },
        apiversion: {
            type: String,
            required: true,
            message: {
                required: 'API Version is required.'
            }
        },
        productcode: {
            type: String,
            required: true,
            message: {
                required: 'Product Code is required.'
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


/* Imprivata Delete Schema */
const imprivataDelete = new schema({
    imprivatadelete: {
        imprivataconfigid: {
            // type: String,
            required: true,
            // match: /^[0-9]+$/,
            message: {
                // type: 'Imprivata Config Id must be a Number.',
                required: 'Imprivata Config Id is required.',
                // match: 'Invalid Imprivata Config Id.'
            }
        }
    }
});

module.exports = {
    ImprivataRegistration:imprivataRegistration,
    ImprivataUpdation:imprivataUpdation,
    ImprivataDelete: imprivataDelete
};