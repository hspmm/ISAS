const axios= require("axios");

describe("Role Route - ",()=>{
    var server;
    let serverPath="http://localhost:3000/api/v1/role/";
    beforeAll(() => {
        server = require("../../../app");        
    });
    afterAll(() => {
        //server.close();
    });
    describe("POST Registration ", ()=>{
        var data = {};
        beforeAll((done) => {           
            axios.post(serverPath+"InfoRegistration",{
                "roleregistration": {
                    "role": {
                        "name": "Role 7",
                        "roledescription": "Role 7 desc"
                    },
                    "securitymodel": "LDAP"
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
    describe("POST Update ", ()=>{
        var data = {};
        beforeAll((done) => {           
            axios.post(serverPath+"Update",{
                "roleupdate": {
                    "role": {
                       "id":1022,
                        "name": "Role 1",
                        "roledescription": "Role 1 desc"
                    },
                    "securitymodel": "LDAP"
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
            axios.post(serverPath+"Delete",{
                "roledeleterequest":{
                    "roleid":1030
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
