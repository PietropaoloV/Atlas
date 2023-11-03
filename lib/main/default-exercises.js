class DefaultExercise {
    
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
}