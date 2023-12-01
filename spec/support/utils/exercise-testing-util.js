const enums = require("../../../lib/main/constants/enumConstants.js");
//const { generateShortUUID } = require("../../../lib/main/util/util.js");
const { generateRandomString, generateWholeRandomNumber, generateRandomEnumValue } = require("./general-testing-util.js");

function generateRandomRestInterval() {
    return generateWholeRandomNumber(0,12) + ":" + generateWholeRandomNumber(0,59) + ":" + generateWholeRandomNumber(0,59) ;
}


const generateRandomExercise = (userId, exerciseId, name, force, muscleGroup, progression, rest_interval, shouldParse = true) => {
    let rest_interval_metric = generateRandomEnumValue(enums.enumList.restIntervalMetricEnum);
    let link = "http://www." + generateRandomString(6) + ".com";


    const rawExerciseString = `{\"name\":\"${name}\",` 
    + `\"forces\":\"${force}\",`
    + `\"userId\":\"${userId}\",`
    + `\"exerciseId\":\"${exerciseId}\",`
    + `\"target_muscle_group\":\"${muscleGroup}\",`
    + `\"progression\":\"${progression}\",`
    + `\"link\":\"${link}\",`
    + `\"rest_interval\":\"${rest_interval}\",`
    + `\"rest_interval_metric\":\"${rest_interval_metric}\"}`


    return shouldParse ? JSON.parse(rawExerciseString): rawExerciseString;
}
// Test File- uncomment line 29 and line 2
// console.log(generateRandomExercise(generateShortUUID(), generateShortUUID()))

module.exports = {
    generateRandomExercise
}