const { ProfileHandler } = require('../../../lib/main/handlers/profile-handler.js');
const { generateShortUUID } = require('../../../lib/main/util/util.js');
const { db, mysql } = require('../../../lib/main/util/sqlconnector.js');

describe("ProfileHandler", () => {

    describe("General Validation", () => {
        
        let ph = new ProfileHandler();

        beforeEach(() => {
            userID = generateShortUUID();
            profileID = generateShortUUID();
        });

        it("should return 400 if userID or workoutID is missing", async () => {
            
            var res = await ph.GetProfile(null,profileID);
            expect(res.getCode()).toBe(400);
            var res = await ph.GetProfile(userID, null);
            expect(res.getCode()).toBe(400);
            var res = await ph.createProfile(null);
            expect(res.getCode()).toBe(400);
            var res = await ph.ListProfile(null);
            expect(res.getCode()).toBe(400);
            var res = await ph.DeleteProfile(null, profileID);
            expect(res.getCode()).toBe(400);
            var res = await ph.DeleteProfile(userID, null);
            expect(res.getCode()).toBe(400);
            var res = await ph.UpdateProfile(null, profileID);
            expect(res.getCode()).toBe(400);
            var res = await ph.UpdateProfile(userID, null);
            expect(res.getCode()).toBe(400);
           
        });
    });

    describe("createProfile method", () => {
        let ph = new ProfileHandler();
      
        beforeEach(() => {
          userID = generateShortUUID();
        });
      
        it("Req body, username, createdAt, age, bmi, height, weight existence check", async () => {
          ph.postValue = '{"height": 175, "weight": 70, "bmi": 22.86}';
          var res = await ph.createProfile(userID);
          expect(res.getCode()).toBe(400);
      
          ph.postValue = '{"username": "john_doe", "createdAt": "2023-01-01", "height": 175, "weight": 70}';
          var res = await ph.createProfile(userID);
          expect(res.getCode()).toBe(400);
      
          ph.postValue = '{"username": "john_doe", "createdAt": "2023-01-01", "age": 30, "bmi": 22.86}';
          var res = await ph.createProfile(userID);
          expect(res.getCode()).toBe(400);
        });
      
        it("Req body, username, createdAt, age, bmi, height, weight enum", async () => {
          ph.postValue = '{"username": null, "createdAt": "2023-01-01", "age": 30, "bmi": 22.86, "height": 175, "weight": 70}';
          var res = await ph.createProfile(userID);
          expect(res.getCode()).toBe(400);
      
          ph.postValue = '{"username": "john_doe", "createdAt": "invalid_date", "age": 30, "bmi": 22.86, "height": 175, "weight": 70}';
          var res = await ph.createProfile(userID);
          expect(res.getCode()).toBe(400);
      
          ph.postValue = '{"username": "john_doe", "createdAt": "2023-01-01", "age": "invalid_age", "bmi": 22.86, "height": 175, "weight": 70}';
          var res = await ph.createProfile(userID);
          expect(res.getCode()).toBe(400);
      
          ph.postValue = '{"username": "john_doe", "createdAt": "2023-01-01", "age": 30, "bmi": "invalid_bmi", "height": 175, "weight": 70}';
          var res = await ph.createProfile(userID);
          expect(res.getCode()).toBe(400);
      
          ph.postValue = '{"username": "john_doe","createdAt": "2023-01-01","age": 30,"bmi": 22.86, "height": "invalid_height","weight": 70}';
          var res = await ph.createProfile(userID); 
          expect(res.getCode()).toBe(400);
      
          ph.postValue = '{"username": "john_doe", "createdAt": "2023-01-01", "age": 30, "bmi": 22.86, "height": 175, "weight": "invalid_weight"}';
          var res = await ph.createProfile(userID); // Invalid weight format
          expect(res.getCode()).toBe(400);
        });
      
        //it("Create profile successfully", async () => {
          //ph.postValue = '{"username": "john_doe", "createdAt": "2023-01-01", "age": 30, "bmi": 22.86, "height": 175, "weight": 70}';
          //const result = await ph.createProfile(userID);
          //expect(result.getCode()).toBe(201);
        //});
      });

    describe("UpdateProfile method", () => {
        let ph = new ProfileHandler();
      
        beforeEach(() => {
          userID = generateShortUUID();
          profileID = generateShortUUID();
        });
      
        it("Req body, username, createdAt, age, bmi, height, weight existence check", async () => {
          ph.postValue = '{"height": 175, "weight": 70, "bmi": 22.86}'; // Incomplete request body
          var res = await ph.UpdateProfile(userID);
          expect(res.getCode()).toBe(400);
      
          ph.postValue = '{"username": "john_doe", "createdAt": "2023-01-01", "height": 175, "weight": 70}'; // Missing age and bmi
          var res = await ph.UpdateProfile(userID);
          expect(res.getCode()).toBe(400);
      
          ph.postValue = '{"username": "john_doe", "createdAt": "2023-01-01", "age": 30, "bmi": 22.86}'; // Missing height and weight
          var res = await ph.UpdateProfile(userID);
          expect(res.getCode()).toBe(400);
        });
      
        it("Req body, username, createdAt, age, bmi, height, weight validity check", async () => {
          ph.postValue = '{"username": null, "createdAt": "2023-01-01", "age": 30, "bmi": 22.86, "height": 175, "weight": 70}';
          var res = await ph.UpdateProfile(userID); // Null username
          expect(res.getCode()).toBe(400);
      
          ph.postValue = '{"username": "john_doe", "createdAt": "invalid_date", "age": 30, "bmi": 22.86, "height": 175, "weight": 70}';
          var res = await ph.UpdateProfile(userID); // Invalid date format
          expect(res.getCode()).toBe(400);
      
          ph.postValue = '{"username": "john_doe", "createdAt": "2023-01-01", "age": "invalid_age", "bmi": 22.86, "height": 175, "weight": 70}';
          var res = await ph.UpdateProfile(userID); // Invalid age format
          expect(res.getCode()).toBe(400);
      
          ph.postValue = '{"username": "john_doe", "createdAt": "2023-01-01", "age": 30, "bmi": "invalid_bmi", "height": 175, "weight": 70}';
          var res = await ph.UpdateProfile(userID); // Invalid BMI format
          expect(res.getCode()).toBe(400);
      
          ph.postValue = '{"username": "john_doe", "createdAt": "2023-01-01", "age": 30, "bmi": 22.86, "height": "invalid_height", "weight": 70}';
          var res = await ph.UpdateProfile(userID); // Invalid height format
          expect(res.getCode()).toBe(400);
      
          ph.postValue = '{"username": "john_doe", "createdAt": "2023-01-01", "age": 30, "bmi": 22.86, "height": 175, "weight": "invalid_weight"}';
          var res = await ph.UpdateProfile(userID); // Invalid weight format
          expect(res.getCode()).toBe(400);
        });
      
        it("Update profile successfully", async () => {
          ph.postValue = '{"username": "john_doe", "createdAt": "2023-01-01", "age": 30, "bmi": 22.86, "height": 175, "weight": 70}';
          const result = await ph.UpdateProfile(userID, profileID);
          expect(result.getCode()).toBe(200);
        });
      });
    });   

    