const { Handler } = require("./handler");

class DefaultExerciseHandler extends Handler {
    static async CreateDefaultExercise(req,res) {
        const [userID, exerciseID] = [req.params.userID, req.params.exerciseID];

        if (!userID) {
            return res.status(401).json({ error: "Unauthorized: Invalid userID" });
        }

        const {
            name, target_muscle_group, force, rest_interval,
            progression, link
        } = req.body;

        if (!exerciseID || !name || !target_muscle_group || !force) {
            return res.status(400).json({ error: "Bad request: Incomplete exercise data" });
        }

        const validTargetMuscleGroups = ['abdominals', 'biceps', 'calves', 'chest', 'forearm',
        'glutes', 'grip', 'hamstrings', 'hips', 'lats', 'lower_back', 'middle_back', 'neck',
         'quadriceps', 'shoulders', 'traps', 'triceps'];
        const validForces = ['push', 'pull'];
        const validProgressions = ['weight', 'reps', 'time', 'distance'];
        
        if (!validTargetMuscleGroups.includes(target_muscle_group) || 
            (!validForces.includes(force)) ||
            (validProgressions.includes(progression))) {
            return res.status(400).json({ error: "Bad request: Invalid muscle group, force, or progression value" });
        }
    }

    static async ListDefaultExercises(req, res) {
        const userID = req.params.userID;

        if (!userID) {
            return res.status(400).json({ error: "Invalid userID" });
        }
        
        try {

            // test exercises
            const exercises = [
                {
                    exerciseID: 1,
                    userID: 1,
                    name: "Bicep Curl",
                    target_muscle_group: "biceps",
                    force: "pull",
                    rest_interval: "2:00",
                    progression: "weight",
                    link: "https://xxxxxx.xxxxx",
                },
                {
                    exerciseID: 2,
                    userID: 2,
                    name: "Bench Press",
                    target_muscle_group: "chest",
                    force: "push",
                    rest_interval: "3:00",
                    progression: "weight",
                    link: "https://xxxxxx.xxxxx",
                },
                {
                    exerciseID: 3,
                    userID: 3,
                    name: "Leg Extension",
                    target_muscle_group: "quads",
                    force: "push",
                    rest_interval: "3:00",
                    progression: "weight",
                    link: "https://xxxxxx.xxxxx",
                }
            ]

            if (!exercises || exercises.length === 0) {
                return res.status(404).json({ error: "Exercise not found" });
            }

            return res.json(exercises[0]);

        } catch (error) {
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
    static async UpdateDefaultExercise() {
        const [userID, exerciseID] = [req.params.userID, req.params.exerciseID];
        const requestBody = req.body;

        if (!userID || !exerciseID) {
            return res.status(400).json({ error: "Invalid userID or exerciseID" });
        }

        try {
            const exercise = exercises.find(
                (w) => w.userID === parseInt(userID) && w.exerciseID === parseInt(workoutID)
            );

            if (!exercise) {
                return res.status(400).json({ error: "Exercise not found" });
            }

            if (exercise.userID !== parseInt(userID)) {
                return res.status(401).json({ error: "Unauthorized userID" });
            }

            // Change target muscle
            if (requestBody.target_muscle_group !== undefined) {
                exercise.target_muscle_group = requestBody.target_muscle_group;
            }
            // Change exercise name
            if (requestBody.name !== undefined) {
                exercise.name = requestBody.name;
            }
            // Change exercise force
            if (requestBody.force !== undefined) {
                exercise.force = requestBody.force;
            }
            // Change rest time
            if (requestBody.rest_interval !== undefined) {
                exercise.rest_interval = requestBody.rest_interval;
            }
            // Change progression
            if (requestBody.progression !== undefined) {
                exercise.progression = requestBody.progression;
            }

            return res.json(exercise);
        }   catch(error) {
            return res.status (500).json({ error: "Internal service error"});
        }   
    }
    
    static async GetDefaultExercise(req, res) {
        const [userID, exerciseID] = [req.params.userID, req.params.exerciseID];

        if (!userID || !exerciseID) {
            return res.status(400).json({ error: "Invalid userID or exerciseID" });
        }

        try {
            /*
            const result = await queryDatabase(`SELECT * FROM workout 
            WHERE user_id = ${userId} AND workout_id = ${workoutId}`);

            ...taken from the set and workout handlers, I assume it should apply
            here as well I'm not not sure.

            MOCK RESULT HERE, ??? put own data here
            */
            const result = [
                {
                    exerciseID: 1,
                    userID: 1,
                    name: "Bicep Curl",
                    target_muscle_group: "biceps",
                    force: "pull",
                    rest_interval: "2:00",
                    progression: "weight",
                    link: "https://xxxxxx.xxxxx",
                }
            ]

            if (!result || result.length === 0) {
                return res.status(404).json({ error: "Exercise not found" });
            }

            if (result.userID !== parseInt(userID)) {
                return res.status(401).json({ error: "Unauthorized userID" });
            }

            return res.json(result.userID);
        }   catch (error) {
                return res.status(500).json({ error: "Internal server error" });
        }
    }

    static async DeleteDefaultExercise() {

    }
}

module.exports = { DefaultExerciseHandler };