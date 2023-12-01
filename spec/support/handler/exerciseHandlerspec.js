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

        it("missing user/exercise ID", async() => {
            var res = await eh.CreateExercise(null);
            expect(res.getCode()).toBe(400);
        });

        it("checks that name, forces, target_muscle_group, progression, rest_interval exists", async() => {
            //null name
            eh.postValue = generateRandomExercise(userID, exerciseID, null, "pull", "biceps", "reps", "00:01:30", false);
            var res = await eh.CreateExercise(userID, exerciseID);
            expect(res.getCode()).toBe(400);

            //null force
            eh.postValue = generateRandomExercise(userID, exerciseID, "bicep curl", null, "biceps", "reps", "00:01:30", false);
            var res = await eh.CreateExercise(userID, exerciseID);
            expect(res.getCode()).toBe(400);

            //null target_muscle_group
            eh.postValue = generateRandomExercise(userID, exerciseID, "bicep curl", "pull", null, "reps", "00:01:30", false);
            var res = await eh.CreateExercise(userID, exerciseID);
            expect(res.getCode()).toBe(400);
            
            //null progression
            eh.postValue = generateRandomExercise(userID, exerciseID, "bicep curl", "pull", "biceps", null, "00:01:30", false);
            var res = await eh.CreateExercise(userID, exerciseID);
            expect(res.getCode()).toBe(400);

            //null rest_interval
            eh.postValue = generateRandomExercise(userID, exerciseID, "bicep curl", "pull", "biceps", "reps", null, false);
            var res = await eh.CreateExercise(userID, exerciseID);
            expect(res.getCode()).toBe(400);
        });

        it("checks forces, target_muscle_group, progression, rest_interval enums", async() => {
            //WRONG force
            eh.postValue = generateRandomExercise(userID, exerciseID, "bicep curl", "WRONG", "biceps", "reps", "00:01:30", false);
            var res = await eh.CreateExercise(userID, exerciseID);
            expect(res.getCode()).toBe(400);

            //WRONG target_muscle_group
            eh.postValue = generateRandomExercise(userID, exerciseID, "bicep curl", "pull", "WRONG", "reps", "00:01:30", false);
            var res = await eh.CreateExercise(userID, exerciseID);
            expect(res.getCode()).toBe(400);
            
            //WRONG progression
            eh.postValue = generateRandomExercise(userID, exerciseID, "bicep curl", "pull", "biceps", "WRONG", "00:01:30", false);
            var res = await eh.CreateExercise(userID, exerciseID);
            expect(res.getCode()).toBe(400);

            //WRONG rest_interval
            eh.postValue = generateRandomExercise(userID, exerciseID, "bicep curl", "pull", "biceps", "reps", "WRONG", false);
            var res = await eh.CreateExercise(userID, exerciseID);
            expect(res.getCode()).toBe(400);
        });
    });

    describe("ListExercise", () => {
        let eh = new ExerciseHandler();

        beforeEach(() => {
            userID = generateShortUUID();
            exerciseID = generateShortUUID();
        });

        it("missing user/exercise ID", async() => {
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

        it("missing user/exercise ID", async() => {
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

        it("missing user/exercise ID", async() => {
            var res = await eh.UpdateExercise(null, exerciseID);
            expect(res.getCode()).toBe(400);
            var res = await eh.UpdateExercise(userID, null);
            expect(res.getCode()).toBe(400);
        });

        it("checks that name, forces, target_muscle_group, progression, rest_interval exists", async() => {
            //null name
            eh.postValue = generateRandomExercise(userID, exerciseID, null, "pull", "biceps", "reps", "00:01:30", false);
            var res = await eh.UpdateExercise(userID, exerciseID);
            expect(res.getCode()).toBe(400);

            //null force
            eh.postValue = generateRandomExercise(userID, exerciseID, "bicep curl", null, "biceps", "reps", "00:01:30", false);
            var res = await eh.UpdateExercise(userID, exerciseID);
            expect(res.getCode()).toBe(400);

            //null target_muscle_group
            eh.postValue = generateRandomExercise(userID, exerciseID, "bicep curl", "pull", null, "reps", "00:01:30", false);
            var res = await eh.UpdateExercise(userID, exerciseID);
            expect(res.getCode()).toBe(400);
            
            //null progression
            eh.postValue = generateRandomExercise(userID, exerciseID, "bicep curl", "pull", "biceps", null, "00:01:30", false);
            var res = await eh.UpdateExercise(userID, exerciseID);
            expect(res.getCode()).toBe(400);

            //null rest_interval
            eh.postValue = generateRandomExercise(userID, exerciseID, "bicep curl", "pull", "biceps", "reps", null, false);
            var res = await eh.UpdateExercise(userID, exerciseID);
            expect(res.getCode()).toBe(400);
        });

        it("checks forces, target_muscle_group, progression, rest_interval enums", async() => {

            //WRONG force
            eh.postValue = generateRandomExercise(userID, exerciseID, "bicep curl", "WRONG", "biceps", "reps", "00:01:30", false);
            var res = await eh.UpdateExercise(userID, exerciseID);
            expect(res.getCode()).toBe(400);

            //WRONG target_muscle_group
            eh.postValue = generateRandomExercise(userID, exerciseID, "bicep curl", "pull", "WRONG", "reps", "00:01:30", false);
            var res = await eh.UpdateExercise(userID, exerciseID);
            expect(res.getCode()).toBe(400);
            
            //WRONG progression
            eh.postValue = generateRandomExercise(userID, exerciseID, "bicep curl", "pull", "biceps", "WRONG", "00:01:30", false);
            var res = await eh.UpdateExercise(userID, exerciseID);
            expect(res.getCode()).toBe(400);

            //WRONG rest_interval
            eh.postValue = generateRandomExercise(userID, exerciseID, "bicep curl", "pull", "biceps", "reps", "00:1", false);
            var res = await eh.UpdateExercise(userID, exerciseID);
            expect(res.getCode()).toBe(400);

            eh.postValue = "{}";
            var res = await eh.UpdateExercise(userID, exerciseID);
            expect(res.getCode()).toBe(400);
        });
    });

    describe("DeleteExercise", () => {
        let eh = new ExerciseHandler();

        beforeEach(() => {
            userID = generateShortUUID();
            exerciseID = generateShortUUID();
        });

        it("missing user/exercise ID", async () => {
            var res = await eh.DeleteExercise(null, exerciseID);
            expect(res.getCode()).toBe(400);
            var res = await eh.DeleteExercise(userID, null);
            expect(res.getCode()).toBe(400);
        });
    });
});

