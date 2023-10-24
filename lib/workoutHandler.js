class WorkoutHandler {

    static async ListWorkouts(req, res) {
        
    }

    static async GetWorkout(req, res) {
        const userID = req.params.userID;
        const workoutID = req.params.workoutID;

        if (!userID || !workoutID) {
            return res.status(400).json({ error: "Invalid userID or workoutID" });
        }

        try {
            //const result = await queryDatabase(`SELECT * FROM workout WHERE user_id = ${userId} AND workout_id = ${workoutId}`);
            
            //MOCK RESULT HERE, ??? put your own data here
            const result = [
                {
                  userID: 123,
                  workoutID: 1,
                  exercise: "Squats",
                  sets: 3,
                  reps: 10,
                  weight: 70,
                  date: "2023-10-23"
                }
            ]

            if (!result || result.length === 0) {
                return res.status(404).json({ error: "Workout not found" });
            }

            if (result[0].userID !== parseInt(userID)) {
                return res.status(401).json({ error: "Unauthorized UserID" });
            }

            return res.json(result[0]);

        } catch (error) {
            return res.status(500).json({ error: "Internal Server Error" });  //Some general catchall error
        }
    }

    static async CreateWorkout(req, res) {
        const userID = req.params.userID;
    
        // Validation
        if (!userID) {
            return res.status(400).json({ error: "Invalid userID" });
        }
    
        const { exercises, sets, reps, weights, date } = req.body;
    
        if (!exercises || !sets || !reps || !weights || !date) {
            return res.status(422).json({ error: "Incomplete workout data" });
        }
    
        if (!Array.isArray(exercises) || !Array.isArray(sets) || !Array.isArray(reps) || !Array.isArray(weights)) {
            return res.status(400).json({ error: "Exercises, sets, reps, and weights should be arrays" });
        }
    
        if (exercises.some(e => typeof e !== "string") || sets.some(s => typeof s !== "number") || reps.some(r => typeof r !== "number") || weights.some(w => typeof w !== "number")) {
            return res.status(400).json({ error: "Invalid data types in exercises, sets, reps, or weights" });
        }
    
        if (!(exercises.length === sets.length && exercises.length === reps.length && exercises.length === weights.length)) {
            return res.status(400).json({ error: "Exercises, sets, reps, and weights arrays must be of the same length" });
        }
    
        try {
            // Insert a database function here to add the data and return the newly created workoutID.
            const newWorkoutID = Math.floor(Math.random() * 1000) + 1;  // Mock ID
            
            return res.status(200).json({ workoutID: newWorkoutID });
        } catch (error) {
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
    
    

    static async UpdateWorkout(req, res) {
        
    }

    static async DeleteWorkout(req, res) {
        
    }
}

module.exports = { WorkoutHandler };



