const { ExerciseHandler } = require('../../../lib/main/handlers/exercise-handler.js');
const { generateShortUUID } = require('../../../lib/main/util/util.js');
const { generateRandomExercise } = require('../utils/exercise-testing-util.js');
const {db, mysql} = require('../../../lib/main/util/sqlconnector.js');


describe("ExerciseHandler", () => {
    describe("CreateExercise", () => {
        let eh = new ExerciseHandler();


        beforeEach(() => {
            userID = generateShortUUID();
            exerciseID = generateShortUUID();
        });


        it("returns 400 for missing user/exercise ID", async() => {
            var res = await eh.CreateExercise(null);
            expect(res.getCode()).toBe(400);
        });


       
       
    });


    describe("ListExercise", () => {
        let eh = new ExerciseHandler();


        beforeEach(() => {
            userID = generateShortUUID();
            exerciseID = generateShortUUID();
        });


        it("returns 400 for missing user/exercise ID", async() => {
            var res = await eh.ListExercise(null);
            expect(res.getCode()).toBe(400);
        });
    });


    describe("GetExercise", () => {
        let eh = new ExerciseHandler();


        beforeEach(() => {
            userID = generateShortUUID();
            exerciseID = generateShortUUID();
        });


        it("returns 400 for missing user/exercise ID", async() => {
            var res = await eh.GetExercise(null, exerciseID);
            expect(res.getCode()).toBe(400);
            var res = await eh.GetExercise(userID, null);
            expect(res.getCode()).toBe(400);
        });
    });


    describe("UpdateExercise", () => {
        let eh = new ExerciseHandler();


        beforeEach(() => {
            userID = generateShortUUID();
            exerciseID = generateShortUUID();
        });


        it("returns 400 for missing user/exercise ID", async() => {
            var res = await eh.UpdateExercise(null, exerciseID);
            expect(res.getCode()).toBe(400);
            var res = await eh.UpdateExercise(userID, null);
            expect(res.getCode()).toBe(400);
        });
    });


    describe("DeleteExercise", () => {
        let eh = new ExerciseHandler();


        beforeEach(() => {
            userID = generateShortUUID();
            exerciseID = generateShortUUID();
        });


        it("returns 400 for missing user/exercise ID", async () => {
            var res = await eh.DeleteExercise(null, exerciseID);
            expect(res.getCode()).toBe(400);
            var res = await eh.DeleteExercise(userID, null);
            expect(res.getCode()).toBe(400);
        });
    });




});

