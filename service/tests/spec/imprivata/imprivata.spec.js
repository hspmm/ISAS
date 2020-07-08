const axios= require("axios");

describe("Imprivata Route - ",()=>{
    var server;
    let serverPath="http://localhost:3000/api/v1/imprivata/";
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
                "imprivataregistration": {
                    "configname": "Test_Imprivata",
                    "serverhostname": "172.16.20.83",
                    "serverport": "443",
                    "apipath": "/sso/ProveIDWeb/",
                    "apiversion": "v14",
                    "productcode": "a47a5227-a83e-4b45-b2dc-353e52145134"
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
                "imprivataupdate": {
                    "imprivataconfigid": "4",
                    "configname": "Test_Imprivata",
                    "serverhostname": "172.16.20.83",
                    "serverport": "443",
                    "apipath": "/sso/ProveIDWeb/",
                    "apiversion": "v14",
                    "productcode": "a47a5227-a83e-4b45-b2dc-353e52145134"
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
                "imprivatadelete": {
                    "imprivataconfigid": 1
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
