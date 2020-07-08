const axios= require("axios");

describe("Role Route - ",()=>{
    var server;
    let serverPath="http://localhost:3000/api/v1/user/";
    beforeAll(() => {
        server = require("../../../app");        
    });
    afterAll(() => {
        //server.close();
    });
    describe("POST Authentication ", ()=>{
        var data = {};
        beforeAll((done) => {           
            axios.post(serverPath+"Authentication",{
                authenticationrequest: {
                authenticationtype:"LDAP",
                authenticationmethod:"Password",
                authenticationparameters:{
                    username:"nexususer1",
                    password:"user@123",
                    domainname:"icuinnov.corp"
                }
            }
        }).then((response)=>{              
                data.status=response.status
                done();
            }).catch((error)=>{               
                data.body=response.data;
                done();
            });
        });
        it("Status 200", () => {
            expect(data.status).toBe(200);
        });
        // it("Body", () => {
        //     expect(data.body).toBe("The Response Body");
        // });
    }); 
    describe("POST registration ", ()=>{
        var data = {};
        beforeAll((done) => {           
            axios.post(serverPath+"registration",{
                "userregistration": {
                    "userdetails": {
                        "firstname": "first",
                        "middlename": "middle",
                        "lastname": "last",
                        "mobilenumber": "9876543210",
                        "emailid": "test1@test.com",
                        "isemailselected": "true",
                        "loginid": "test1@test.com",
                        "password": "12345678",
                        "isaccountlocked": "false",
                        "isaccountdisabled": "false"
                    },
                    "roledetails": 
                        {
                            "role": {
                                "roleid": 1022
                            }
                        }
                    
                }
            }).then((response)=>{              
                data.status=response.status
                done();
            }).catch((error)=>{               
                data.body=response.data;
                done();
            });
        });
        it("Status 200", () => {
            expect(data.status).toBe(200);
        });
        // it("Body", () => {
        //     expect(data.body).toBe("The Response Body");
        // });
    });  
    describe("POST update ", ()=>{
        var data = {};
        beforeAll((done) => {           
            axios.post(serverPath+"update",{
                "userupdate": {
                    "userdetails": {
                        "userid":13,
                        "firstname": "first",
                        "middlename": "middle",
                        "lastname": "last",
                        "mobilenumber": "9876543210",
                        "emailid": "test2@test.com",
                        "isemailselected": "true",
                        "loginid": "test2@test.com",
                        "password": "12345678",
                        "isaccountlocked": "false",
                        "isaccountdisabled": "false"
                    },
                    "roledetails": 
                        {
                            "role": {
                                "roleid": 1022
                            }
                        }
                    
                }
            }).then((response)=>{              
                data.status=response.status
                done();
            }).catch((error)=>{               
                data.body=response.data;
                done();
            });
        });
        it("Status 200", () => {
            expect(data.status).toBe(200);
        });
        // it("Body", () => {
        //     expect(data.body).toBe("The Response Body");
        // });
    }); 
    describe("POST Delete ", ()=>{
        var data = {};
        beforeAll((done) => {           
            axios.post(serverPath+"Delete", {
                "userdeleterequest": {
                "userid":"16"
            }
        }).then((response)=>{          
                data.status=response.status
                done();
            }).catch((error)=>{                 
                data.body=response.data;
                done();
            });
        });
        it("Status 200", () => {
            expect(data.status).toBe(200);
        });
        // it("Body", () => {
        //     expect(data.body).toBe("The Response Body");
        // });
    });    
});
