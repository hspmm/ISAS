const axios= require("axios");

describe("Application Route - ",()=>{
    var server;
    let serverPath="http://localhost:3000/api/v1/Application/";
    beforeAll(() => {
        server = require("../../../app");
        
    });
    afterAll(() => {
        //server.close();
    });
    describe("POST Application Registration ", ()=>{
        var data = {};
        beforeAll((done) => {           
            axios.post(serverPath+"Registration",{applicationregistration:{applicationname:"TestApplication",applicationversion:"V1",adminname:"Admin",adminemail:"admin@test.com"}}).then((response)=>{
              
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

