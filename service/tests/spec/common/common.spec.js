const axios= require("axios");

describe("Common Route - ",()=>{
    var server;
    let serverPath="http://localhost:3000/api/v1/";
    beforeAll(() => {
        server = require("../../../app");        
    });
    afterAll(() => {
        //server.close();
    });
    describe("GET Applications", ()=>{
        var data = {};
        beforeAll((done) => {           
            axios.get(serverPath+"Applications").then((response)=>{
                data.status=response.status
                done();
            }).catch((error)=>{
                data.body=response.data;
                done();
            });
        });
        it("Status 200(OK)", () => {
            expect(data.status).toBe(200);
        });
        // it("Body", () => {
        //     expect(data.body).toBe("The Polyglot Developer");
        // });
    }); 
    describe("GET Roles", ()=>{
        var data = {};
        beforeAll((done) => {           
            axios.get(serverPath+"Roles").then((response)=>{
                data.status=response.status
                done();
            }).catch((error)=>{
                data.body=response.data;
                done();
            });
        });
        it("Status 200(OK)", () => {
            expect(data.status).toBe(200);
        });
        // it("Body", () => {
        //     expect(data.body).toBe("The Polyglot Developer");
        // });
    }); 
    describe("GET Users", ()=>{
        var data = {};
        beforeAll((done) => {           
            axios.get(serverPath+"Users").then((response)=>{
                data.status=response.status
                done();
            }).catch((error)=>{
                data.body=response.data;
                done();
            });
        });
        it("Status 200(OK)", () => {
            expect(data.status).toBe(200);
        });
        // it("Body", () => {
        //     expect(data.body).toBe("The Polyglot Developer");
        // });
    });
    describe("GET ApplicationPrivileges", ()=>{
        var data = {};
        beforeAll((done) => {           
            axios.get(serverPath+"ApplicationPrivileges").then((response)=>{
                data.status=response.status
                done();
            }).catch((error)=>{
                data.body=response.data;
                done();
            });
        });
        it("Status 200(OK)", () => {
            expect(data.status).toBe(200);
        });
        // it("Body", () => {
        //     expect(data.body).toBe("The Polyglot Developer");
        // });
    });
    describe("GET LdapGroups", ()=>{
        var data = {};       
        beforeAll((done) => {           
            axios.get(serverPath+"LdapGroups").then((response)=>{
                data.status=response.status;               
                done();
            }).catch((error)=>{
                data.body=response.data;
                done();
            });
        });       
        it("Status 200(OK)", () => {
            expect(data.status).toBe(200);
        });
        // it("Body", () => {
        //     expect(data.body).toBe("The Polyglot Developer");
        // });
    });
    describe("GET SiteRoleInfo", ()=>{
        var data = {};       
        beforeAll((done) => {           
            axios.get(serverPath+"SiteRoleInfo").then((response)=>{
                data.status=response.status;               
                done();
            }).catch((error)=>{
                data.body=response.data;
                done();
            });
        });       
        it("Status 200(OK)", () => {
            expect(data.status).toBe(200);
        });
        // it("Body", () => {
        //     expect(data.body).toBe("The Polyglot Developer");
        // });
    });
    describe("GET SiteUserInfo", ()=>{
        var data = {};       
        beforeAll((done) => {           
            axios.get(serverPath+"SiteUserInfo").then((response)=>{
                data.status=response.status;               
                done();
            }).catch((error)=>{
                data.body=response.data;
                done();
            });
        });       
        it("Status 200(OK)", () => {
            expect(data.status).toBe(200);
        });
        // it("Body", () => {
        //     expect(data.body).toBe("The Polyglot Developer");
        // });
    });
    describe("GET SiteLdapGroupInfo", ()=>{
        var data = {};       
        beforeAll((done) => {           
            axios.get(serverPath+"SiteUserInfo").then((response)=>{
                data.status=response.status;               
                done();
            }).catch((error)=>{
                data.body=response.data;
                done();
            });
        });       
        it("Status 200(OK)", () => {
            expect(data.status).toBe(200);
        });
        // it("Body", () => {
        //     expect(data.body).toBe("The Polyglot Developer");
        // });
    });
    describe("GET SiteInfo", ()=>{
        var data = {};       
        beforeAll((done) => {           
            axios.get(serverPath+"SiteInfo").then((response)=>{
                data.status=response.status;               
                done();
            }).catch((error)=>{
                data.body=response.data;
                done();
            });
        });       
        it("Status 200(OK)", () => {
            expect(data.status).toBe(200);
        });
        // it("Body", () => {
        //     expect(data.body).toBe("The Polyglot Developer");
        // });
    });
    describe("GET LdapInfo", ()=>{
        var data = {};       
        beforeAll((done) => {           
            axios.get(serverPath+"LdapInfo").then((response)=>{
                data.status=response.status;               
                done();
            }).catch((error)=>{
                data.body=response.data;
                done();
            });
        });       
        it("Status 200(OK)", () => {
            expect(data.status).toBe(200);
        });
        // it("Body", () => {
        //     expect(data.body).toBe("The Polyglot Developer");
        // });
    });
    describe("GET ImprivataInfo", ()=>{
        var data = {};       
        beforeAll((done) => {           
            axios.get(serverPath+"ImprivataInfo").then((response)=>{
                data.status=response.status;               
                done();
            }).catch((error)=>{
                data.body=response.data;
                done();
            });
        });       
        it("Status 200(OK)", () => {
            expect(data.status).toBe(200);
        });
        // it("Body", () => {
        //     expect(data.body).toBe("The Polyglot Developer");
        // });
    });
    describe("GET SecurityModelInfo", ()=>{
        var data = {};       
        beforeAll((done) => {           
            axios.get(serverPath+"SecurityModelInfo").then((response)=>{
                data.status=response.status;               
                done();
            }).catch((error)=>{
                data.body=response.data;
                done();
            });
        });       
        it("Status 200(OK)", () => {
            expect(data.status).toBe(200);
        });
        // it("Body", () => {
        //     expect(data.body).toBe("The Polyglot Developer");
        // });
    });
    describe("GET SecurityModelInfo", ()=>{
        var data = {};       
        beforeAll((done) => {           
            axios.get(serverPath+"SecurityModelInfo").then((response)=>{
                data.status=response.status;               
                done();
            }).catch((error)=>{
                data.body=response.data;
                done();
            });
        });       
        it("Status 200(OK)", () => {
            expect(data.status).toBe(200);
        });
        // it("Body", () => {
        //     expect(data.body).toBe("The Polyglot Developer");
        // });
    });
    describe("POST UserInfo", ()=>{
        var data = {};       
        beforeAll((done) => {           
            axios.post(serverPath+"UserInfo",{
                "userinforequest":{
                    "userid":"1"
                }
            }).then((response)=>{
                data.status=response.status;               
                done();
            }).catch((error)=>{
                data.body=response.data;
                done();
            });
        });       
        it("Status 200(OK)", () => {
            expect(data.status).toBe(200);
        });
        // it("Body", () => {
        //     expect(data.body).toBe("The Polyglot Developer");
        // });
    });
    describe("POST RolesPrivileges", ()=>{
        var data = {};       
        beforeAll((done) => {           
            axios.post(serverPath+"RolesPrivileges",{
                "roleprivilegerequest": {
                    "role":[
                        {"roleid":"1022"}
                    ]        
                }
            }
            ).then((response)=>{
                data.status=response.status;               
                done();
            }).catch((error)=>{
                data.body=response.data;
                done();
            });
        });       
        it("Status 200(OK)", () => {
            expect(data.status).toBe(200);
        });
        // it("Body", () => {
        //     expect(data.body).toBe("The Polyglot Developer");
        // });
    });
    describe("POST LdapGroupInfo", ()=>{
        var data = {};       
        beforeAll((done) => {           
            axios.post(serverPath+"LdapGroupInfo",{
                "ldapgrouprequest": {
                    "ldapconfigid": 18
                }
            }
            ).then((response)=>{
                data.status=response.status;               
                done();
            }).catch((error)=>{
                data.body=response.data;
                done();
            });
        });       
        it("Status 200(OK)", () => {
            expect(data.status).toBe(200);
        });
        // it("Body", () => {
        //     expect(data.body).toBe("The Polyglot Developer");
        // });
    });
    describe("POST LdapGroupUserInfo", ()=>{
        var data = {};       
        beforeAll((done) => {           
            axios.post(serverPath+"RolesPrivileges",{
                "ldapgroupuserrequest": {
                    "ldapconfigid":18,
                    "groupname":"Users",
                    "filter":""          
                }
            }
            ).then((response)=>{
                data.status=response.status;               
                done();
            }).catch((error)=>{
                data.body=response.data;
                done();
            });
        });       
        it("Status 200(OK)", () => {
            expect(data.status).toBe(200);
        });
        // it("Body", () => {
        //     expect(data.body).toBe("The Polyglot Developer");
        // });
    });
    describe("POST UpdateSecurityModelInfo", ()=>{
        var data = {};       
        beforeAll((done) => {           
            axios.post(serverPath+"UpdateSecurityModelInfo",{
                "securitymodelupdaterequest": {
                    "securitymodel":"LDAP"   
                }
            }            
            ).then((response)=>{
                data.status=response.status;               
                done();
            }).catch((error)=>{
                data.body=response.data;
                done();
            });
        });       
        it("Status 200(OK)", () => {
            expect(data.status).toBe(200);
        });
        // it("Body", () => {
        //     expect(data.body).toBe("The Polyglot Developer");
        // });
    });
    describe("POST roleinfo", ()=>{
        var data = {};       
        beforeAll((done) => {           
            axios.post(serverPath+"roleinfo",{
                "roleinforequest": {
                    "roleid": 1022        
                }
            }                        
            ).then((response)=>{
                data.status=response.status;               
                done();
            }).catch((error)=>{
                data.body=response.data;
                done();
            });
        });       
        it("Status 200(OK)", () => {
            expect(data.status).toBe(200);
        });
        // it("Body", () => {
        //     expect(data.body).toBe("The Polyglot Developer");
        // });
    });
    describe("POST PrivilegesLdapGroups", ()=>{
        var data = {};       
        beforeAll((done) => {           
            axios.post(serverPath+"PrivilegesLdapGroups",{
                "privilegeldaprequest": {
                    "privilege":[
                        {
                            "privilegeid":10
                        }
                    ]
                }
            }                        
            ).then((response)=>{
                data.status=response.status;               
                done();
            }).catch((error)=>{
                data.body=response.data;
                done();
            });
        });       
        it("Status 200(OK)", () => {
            expect(data.status).toBe(200);
        });
        // it("Body", () => {
        //     expect(data.body).toBe("The Polyglot Developer");
        // });
    });
    describe("POST PrivilegesUsers", ()=>{
        var data = {};       
        beforeAll((done) => {           
            axios.post(serverPath+"PrivilegesUsers",{
                "privilegeuserrequest":{
                    "privilege":{
                        "privilegeid":3
                    }
                }
            }                        
            ).then((response)=>{
                data.status=response.status;               
                done();
            }).catch((error)=>{
                data.body=response.data;
                done();
            });
        });       
        it("Status 200(OK)", () => {
            expect(data.status).toBe(200);
        });
        // it("Body", () => {
        //     expect(data.body).toBe("The Polyglot Developer");
        // });
    });
    describe("POST PrivilegesRoles", ()=>{
        var data = {};       
        beforeAll((done) => {           
            axios.post(serverPath+"PrivilegesRoles",{
                "privilegerolerequest":{
                    "privilege":{
                        "privilegeid":1
                    }
                }
            }                        
            ).then((response)=>{
                data.status=response.status;               
                done();
            }).catch((error)=>{
                data.body=response.data;
                done();
            });
        });       
        it("Status 200(OK)", () => {
            expect(data.status).toBe(200);
        });
        // it("Body", () => {
        //     expect(data.body).toBe("The Polyglot Developer");
        // });
    });
        
});

