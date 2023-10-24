const { WorkoutHandler } = require('../lib/workoutHandler.js');

describe("WorkoutHandler", () => {

    describe("GetWorkout method", () => {
        let mockReq, mockRes;

        beforeEach(() => {
            mockReq = {
                params: {
                    userID: "123",
                    workoutID: "1"
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

        it("should return 400 if userID or workoutID is missing", () => {
            mockReq.params.userID = null;

            WorkoutHandler.GetWorkout(mockReq, mockRes);

            expect(mockRes.statusCode).toBe(400);
            expect(mockRes.data).toEqual({ error: "Invalid userID or workoutID" });
        });

        //The workoutHandler database request needs to be directly modified for this test case to work
        /*it("should return 404 if workout is not found", () => {
            WorkoutHandler.GetWorkout(mockReq, mockRes);

            expect(mockRes.statusCode).toBe(404);
            expect(mockRes.data).toEqual({ error: "Workout not found" });
        });*/

        it("should return 401 if unauthorized userID is provided", () => {
            mockReq.params.userID = "999";

            WorkoutHandler.GetWorkout(mockReq, mockRes);

            expect(mockRes.statusCode).toBe(401);
            expect(mockRes.data).toEqual({ error: "Unauthorized UserID" });
        });

        it("should return the workout if the userID and workoutID are valid", () => {
            WorkoutHandler.GetWorkout(mockReq, mockRes);

            expect(mockRes.statusCode).toBeNull();  // Successful, so no specific status code set
            expect(mockRes.data).toEqual({
                userID: 123,
                workoutID: 1,
                exercise: "Squats",
                sets: 3,
                reps: 10,
                weight: 70,
                date: "2023-10-23"
            });
        });

        // The database needs to be directly modified to throw an error
        /*it("should return 500 on an internal server error", () => {
            WorkoutHandler.GetWorkout(mockReq, mockRes);

            expect(mockRes.statusCode).toBe(500);
            expect(mockRes.data).toEqual({ error: "Internal Server Error" });
        });*/
    });

    describe("CreateWorkout method", () => {
        let mockReq, mockRes;

        beforeEach(() => {
            mockReq = {
                params: {
                    userID: "123"
                },
                body: {
                    exercises: ["Squats", "Bench Press"],
                    sets: [3, 4],
                    reps: [10, 8],
                    weights: [70, 80],
                    date: "2023-10-23"
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

        it("should return 400 if userID is missing", () => {
            mockReq.params.userID = null;

            WorkoutHandler.CreateWorkout(mockReq, mockRes);

            expect(mockRes.statusCode).toBe(400);
            expect(mockRes.data).toEqual({ error: "Invalid userID" });
        });

        it("should return 422 if workout data is incomplete", () => {
            mockReq.body.exercises = null;

            WorkoutHandler.CreateWorkout(mockReq, mockRes);

            expect(mockRes.statusCode).toBe(422);
            expect(mockRes.data).toEqual({ error: "Incomplete workout data" });
        });

        it("should return 400 if any of exercises, sets, reps, or weights is not an array", () => {
            mockReq.body.exercises = "Squats";

            WorkoutHandler.CreateWorkout(mockReq, mockRes);

            expect(mockRes.statusCode).toBe(400);
            expect(mockRes.data).toEqual({ error: "Exercises, sets, reps, and weights should be arrays" });
        });

        it("should return 400 if exercises, sets, reps, and weights arrays are not of the same length", () => {
            mockReq.body.weights.push(85);

            WorkoutHandler.CreateWorkout(mockReq, mockRes);

            expect(mockRes.statusCode).toBe(400);
            expect(mockRes.data).toEqual({ error: "Exercises, sets, reps, and weights arrays must be of the same length" });
        });

        it("should return 200 with a workoutID when data is valid", () => {
            WorkoutHandler.CreateWorkout(mockReq, mockRes);

            expect(mockRes.statusCode).toBe(200);
            expect(mockRes.data.workoutID).toBeDefined();
        });
    });

});

