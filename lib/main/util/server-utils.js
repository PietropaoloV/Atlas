const { acceptableHeaderTypes, exercisePathRegex, setPathRegex, workoutPathRegex,
     profilePathRegex, wellnessPathRegex, idRegex, plotPathRegex}= require("../constants/server-constants");
const { ExerciseHandler } = require("../handlers/exercise-handler");
const { SetHandler } = require("../handlers/set-handler");
const { ProfileHandler } = require("../handlers/profile-handler");
const { ValidationException } = require("./exceptions");
const { WellnessHandler } = require("../handlers/WellnessHandler");
const { WorkoutHandler } = require("../handlers/workout-handler");
const { LoginHandler } = require('../handlers/login-handler'); 
const { PlotHandler } = require("../handlers/plot-handler");

const validateAndConvertId = (id) => {
    if(id.match(idRegex))
        return Number(id);
    throw new ValidationException(`Id ${id} is not valid id`);
}

const validateHeaderType = (req) => {
    let headerType = req.headers['content-type'];
    if(!acceptableHeaderTypes.includes(headerType))
        throw new ValidationException(`Unsupported header-type ${headerType}`);
}

const selectHandler = (url) => {
    if (url.startsWith('/login')) {
        return new LoginHandler();
    }
    if (url == null)
        throw new ValidationException("request url is null");
    if (url.match(exercisePathRegex)){
        console.log("Using exercise handler for this request")
        return new ExerciseHandler();
    } else if (url.match(setPathRegex)) {
        console.log("Using set handler for this request")
        return new SetHandler();
    } else if (url.match(workoutPathRegex)) {
        console.log("Using workout handler for this request")
        return new WorkoutHandler();
    } else if (url.match(profilePathRegex)) {
        console.log("Using profile handler for this request")
        return new ProfileHandler();
    } else if (url.match(wellnessPathRegex)) {
        console.log("Using wellness handler for this request")
        return new WellnessHandler();
    } else if (url.match(plotPathRegex)) {
        console.log("Using plot handler for this request")
        return new PlotHandler();
    }
    throw new ValidationException(`Unable to serve request, malformed url ${url}`);
}


module.exports = {
    validateHeaderType,
    selectHandler,
    validateAndConvertId
}
