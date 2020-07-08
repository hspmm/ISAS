/* Declare required npm packages */
var schema = require('validate');

/* Role-Privilege Details Schema */
const rolePrivilegeDetails = new schema({
    roleprivilegeregistration: {
        roleprivilegemapping: [{
            role: [{
                name: {
                    type: String,
                    required: true,
                    message: {
                        type: 'Role must be a string.',
                        required: 'Role is required.'
                    }
                },
                description: {
                    type: String,
                    required: true,
                    message: {
                        type: 'Role Description must be a string.',
                        required: 'Role Description is required.'
                    }
                }
            }],
            privilege: [{
                name: {
                    type: String,
                    required: true,
                    message: {
                        type: 'Privilege Name must be a string.',
                        required: 'Privilege Name is required.'
                    }
                },
                description: {
                    type: String,
                    required: true,
                    message: {
                        type: 'Privilege Description must be a string.',
                        required: 'Privilege Description is required.'
                    }
                },
                key: {
                    type: String,
                    required: true,
                    message: {
                        type: 'Privilege Key must be a string.',
                        required: 'Privilege Key is required.'
                    }
                }
            }]
        }]
    }
});

module.exports = {
    RolePrivilegeRegistration: rolePrivilegeDetails
};