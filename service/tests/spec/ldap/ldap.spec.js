const axios= require("axios");

describe("LDAP Route - ",()=>{
    var server;
    let serverPath="http://localhost:3000/api/v1/ldap/";
    beforeAll(() => {
        server = require("../../../app");        
    });
    afterAll(() => {
        //server.close();
    });
    describe("POST Registration ", ()=>{
        var data = {};
        beforeAll((done) => {           
            axios.post(serverPath+"Registration",{
                "ldapregistration": {
                    "serverhostname":"3.133.185.198",
                    "serverport":"389",
                    "domain":"icumed1.test",
                    "adminusername":"syedjavid@icumed1.test",
                    "adminpassword":"user@123"
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
                "ldapupdate": {
                      "ldapconfigid":18,
                      "serverhostname":"3.133.185.198",
                      "serverport":389,
                      "domain":"icumed1.test",
                      "adminusername":"syedjavid@icumed1.test",
                      "adminpassword":"user@123"
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
                "ldapdelete": {
                    "ldapconfigid":18
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
