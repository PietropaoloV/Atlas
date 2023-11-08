const { acceptableHeaderTypes, exercisePathRegex, setPathRegex, workoutPathRegex,
     profilePathRegex, wellnessPathRegex, idRegex} = require("../constants/server-constants");
const { ExerciseHandler } = require("../handlers/exercise-handler");
const { SetHandler } = require("../handlers/set-handler");
const { ProfileHandler } = require("../handlers/profile-handler");
const { ValidationException } = require("./exceptions");
const { WellnessHandler } = require("../handlers/WellnessHandler");
const { WorkoutHandler } = require("../handlers/workout-handler");


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
    if (url == null)
        throw new ValidationException("request url is null");
    logger.log(`Url:${url}`);
    if (url.match(exercisePathRegex)){
        logger.log("Using exercise handler for this  request")
        return new ExerciseHandler();
    } else if (url.match(setPathRegex)) {
        logger.log("Using set handler for this  request")
        return new SetHandler();
    } else if (url.match(workoutPathRegex)) {
        logger.log("Using workout handler for this  request")
        return new WorkoutHandler();
    } else if (url.match(profilePathRegex)) {
        logger.log("Using profile handler for this  request")
        return new ProfileHandler();
    } else if (url.match(wellnessPathRegex)) {
        logger.log("Using wellness handler for this  request")
        return new WellnessHandler();
    }
    throw new ValidationException(`Unable to serve request, malformed url ${url}`);
}


module.exports = {
    validateHeaderType,
    selectHandler,
    validateAndConvertId
}
