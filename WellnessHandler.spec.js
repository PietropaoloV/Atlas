const { WellnessHandler } = require('../../..//lib/main/handlers/WellnessHandler.js');

describe("WellnessHandler", () => {

    describe("GetWellness method", () => {
        let mockReq, mockRes;

        beforeEach(() => {
            mockReq = {
                params: {
                    userID: "123",
                    wellnessID: "1"
                }
            };

            mockRes = {
                status(code) {
                    this.statusCode = code;
                    return this;
                },
                json(data) {
                    this.data = data;
                    return this;
                },
                statusCode: null,
                data: null
            };
        });

        it("should return 400 if the WellnessID is not valud", () => {
            mockReq.params.userID = null;

            WellnessHandler.GetWellness(mockReq, mockRes);

            expect(mockRes.statusCode).toBe(400);
            expect(mockRes.data).toEqual({ error: "UserID or WellnessID Invalid"});
        });
         // The WellnessHandler database request needs to be directly modified for this test case to work
        /*it("should return 404 if set is not found", () => {
            WellnessHandler.GetSet(mockReq, mockRes);

            expect(mockRes.statusCode).toBe(404);
            expect(mockRes.data).toEqual({ error: "Wellness Entry Not Found" });
        });*/

        it("should return the wellness entry if the userID and wellnessID are valid", () => {
            WellnessHandler.GetWellness(mockReq, mockRes);

            expect(mockRes.statusCode).toBeNull();
            expect(mockRes.data).toEqual({
                wellnessID: 1,
                userID: 123,
                date: "2023-23-10",
                mood: "normal",
                stress: 'moderate',
                sleep: 'fair',
                motivation: 'normal',
                hydration: 'yellow',
                soreness: 'moderate',
            });
        });

        // The database needs to be directly modified to throw an error
         /*it("should return 500 on an internal server error", () => {
            // Simulate an error in the WellnessHandler (like a database failure)
            WellnessHandler.GetWellness(mockReq, mockRes);

            expect(mockRes.statusCode).toBe(500);
            expect(mockRes.data).toEqual({ error: "Internal Server Error" });
        });*/
    });    



    describe("ListWellness method", () => {
        let mockReq, mockRes;
        
        beforeEach(() => {
            mockReq = {
                params: {
                    userID: "123",
                }
            };
        
            mockRes = {
                status(code) {
                    this.statusCode = code;
                    return this;
                },
                json(data) {
                    this.data = data;
                    return this;
                },
                statusCode: null,
                data: null
            };
        });
        
        it("should return 400 if userID is missing or not valid ", () => {
            mockReq.params.userID = null;
        
            WellnessHandler.ListWellness(mockReq, mockRes);
        
            expect(mockRes.statusCode).toBe(400);
            expect(mockRes.data).toEqual({ error: "UserID Invalid" });
        });

        /*it("should return 404 if no wellness entries are associated with the given userID", () => {
            SetHandler.ListSets(mockReq, mockRes);

            expect(mockRes.statusCode).toBe(404);
            expect(mockRes.data).toEqual({ error: "Not found: No wellness entries associated with the given userID" });
        });*/

        it("should return the list of wellness entries if the userID is valid", () => {
            WellnessHandler.ListWellness(mockReq, mockRes);
        
            expect(mockRes.statusCode).toBeNull(); 
            expect(mockRes.data.length).toBeGreaterThan(0);
                    
        });

        // The database needs to be directly modified to throw an error
         /*it("should return 500 on an internal server error", () => {
            // Simulate an error in the WellnessHandler (like a database failure)
            WellnessHandler.GetWellness(mockReq, mockRes);

            expect(mockRes.statusCode).toBe(500);
            expect(mockRes.data).toEqual({ error: "Internal Server Error" });
        });*/
    });


    describe("CreateWellness method", () => {
        let mockReq, mockRes;
        
        beforeEach(() => {
            mockReq = {
                params: {
                    userID: "123",
                }
            };
        
            mockRes = {
                status: jasmine.createSpy("status").and.callFake(function (code){
                    this.statusCode = code;
                    return this;
                }),
                json: jasmine.createSpy("json").and.callFake(function (data){
                    this.data = data;
                    return this;
                }),
                statusCode: null,
                data: null,
            };
        });

        it("should return 403 if userID is missing or not valid ", async () => {
            mockReq.params.userID = "";
        
            await WellnessHandler.CreateWellness(mockReq, mockRes);
        
            expect(mockRes.statusCode).toHaveBeenCalledWith(403);
            expect(mockRes.json).toHaveBeenCalledWith({ error: "UserID Invalid" });
        });
        
        it("should return a success messsage if the userID and wellnessID are valid", async () => {
            mockReq.params = {
                userID: "123", 
                wellnessID: "1",
              };
            
            mockReq.body ={
                wellnessID: 1,
                userID: 123,
                date: "2023-10-23",
                mood: "normal",
                stress: 'moderate',
                sleep: 'fair',
                motivation: 'normal',
                hydration: 'yellow',
                soreness: 'moderate',  
            }

            WellnessHandler.CreateWellness(mockReq, mockRes);

            expect(mockRes.statusCode).toHaveBeenCalledWith(200); 
            expect(mockRes.json).toHaveBeenCalledWith(jasmine.objectContaining({wellness_id: jasmine.any(Number)}));

        });

        it("should return 400 if inputs have missing fields ", async () => { 
            mockReq.params = {
                userID: "123", 
                wellnessID: "1",
              };
            
            mockReq.body ={
                wellnessID: 1,
                userID: 123,
                date: "2023-10-23",
                mood: "",
                stress: 'moderate',
                sleep: 'fair',
                motivation: 'normal',
                hydration: 'yellow',
                soreness: 'moderate',  
            }   
             await WellnessHandler.CreateWellness(mockReq, mockRes);
        
            expect(mockRes.statusCode).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({ error: "Missing Fields" });
        });

        it("should return 400 if input fields are not included in the valid fields listed", async() =>{
            mockReq.params = {
                userID: "123", 
                wellnessID: "1",
              };
            
            mockReq.body ={
                wellnessID: 1,
                userID: 123,
                date: "2023-10-23",
                mood: "",
                stress: 'moderate',
                sleep: 'fair',
                motivation: 'normal',
                hydration: 'blue',
                soreness: 'moderate',  
            }   
            await WellnessHandler.CreateWellness(mockReq, mockRes);
        
            expect(mockRes.statusCode).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({ error:"Bad Request: Invalid Mood, Stress, Sleep, Motivation, Hydration, or Soreness" });
        });
    });


    describe("UpdateWellness method", () => {
        let mockReq, mockRes;
        
        beforeEach(() => {
            mockReq = {
                params: {
                    userID: "123",
                    wellnessID:"1",
                }
            };
        
            mockRes = {
                status(code) {
                    this.statusCode = code;
                    return this;
                },
                json(data) {
                    this.data = data;
                    return this;
                },
                statusCode: null,
                data: null
            };
        });
        
        it("should return 400 if userID or wellnessID are missing or not valid ", async () => {
            mockReq.params.userID = null;
        
            WellnessHandler.UpdateWellness(mockReq, mockRes);
        
            expect(mockRes.statusCode).toBe(400);
            expect(mockRes.data).toEqual({ error: "UserID or WellnessID Invalid" });
        });

        it("should return 404 if wellness entry is not found", async () => {
            mockReq.params.userID = '999';
        
            WellnessHandler.UpdateWellness(mockReq, mockRes);
        
            expect(mockRes.statusCode).toBe(400);
            expect(mockRes.data).toEqual({ error: "Wellness Entry Not Found" });
        });
        it("should return a success messsage if the userID and wellnessID are valid", async () => {
            WellnessHandler.UpdateWellness(mockReq, mockRes);

            expect(mockRes.statusCode).toBe(200); 
            expect(mockRes.data).toEqual({ error: "Update Successful" });

        });

        // The database needs to be directly modified to throw an error
         /*it("should return 500 on an internal server error", () => {
            WellnessHandler.UpdateWellness(mockReq, mockRes);

            expect(mockRes.statusCode).toBe(500);
            expect(mockRes.data).toEqual({ error: "Internal Server Error" });
        });*/


    });


    describe("DeleteWellness method", () => {
        let mockReq, mockRes;
        
        beforeEach(() => {
            mockReq = {
                params: {
                    userID: "123",
                    wellnessID: "1"
                }
            };
        
            mockRes = {
                status(code) {
                    this.statusCode = code;
                    return this;
                },
                json(data) {
                    this.data = data;
                    return this;
                },
                statusCode: null,
                data: null
            };
        });

        it("should return 400 if userID or wellnessID are missing or not valid ", () => {
            mockReq.params.userID = null;
        
            WellnessHandler.DeleteWellness(mockReq, mockRes);
        
            expect(mockRes.statusCode).toBe(400);
            expect(mockRes.data).toEqual({ error: "UserID or WellnessID not Valid" });
        });

        it("should return 404 if no set exists for the given setID and userID", () => {
            mockReq.params.setID = "999";

            SetHandler.DeleteSet(mockReq, mockRes);

            expect(mockRes.statusCode).toBe(404);
            expect(mockRes.data).toEqual({ error: "No wellness entry with for the specified userID" });
        });

        it("should return a success messsage if the userID and wellnessID are valid", () => {
            WellnessHandler.DeleteWellness(mockReq, mockRes);

            expect(mockRes.statusCode).toBe(200); 
            expect(mockRes.data).toEqual({ error: "Delete Successful" });
        });

          // The database needs to be directly modified to throw an error
         /*it("should return 500 on an internal server error", () => {
            WellnessHandler.DeleteWellness(mockReq, mockRes);

            expect(mockRes.statusCode).toBe(500);
            expect(mockRes.data).toEqual({ error: "Internal Server Error" });
        });*/
    });
});