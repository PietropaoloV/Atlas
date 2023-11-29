const enums = require("../../../lib/main/constants/enumConstants.js");
const { generateRandomString,} = require("./general-testing-util.js");
const generateRandomProfile = (username, createdAt, age, bmi, height, weight, shouldParse = true) => {
const generateRandomDate = () => {
     const randomTimestamp = Math.random() * Date.now();
     return new Date(randomTimestamp).toISOString().split('T')[0];
    };

     module.exports = {
     generateRandomDate
    };
     username = generateRandomString(20);
     age = Math.floor(Math.random() * (100 - 12 + 1)) + 12; // Random age between 18 and 100
     bmi = Math.random() * (30 - 18) + 18; // Random BMI between 18 and 30
     height = Math.floor(Math.random() * (200 - 60 + 1)) + 60; // Random height between 150 and 200
     weight = Math.floor(Math.random() * (150 - 30 + 1)) + 30; // Random weight between 40 and 100

    const rawProfileString = `{"username": "${username}",`
        + `"createdAt": "${createdAt}",`
        + `"age": ${age},`
        + `"bmi": ${bmi.toFixed(2)},`
        + `"height": ${height},`
        + `"weight": ${weight}\n}`;

    return shouldParse ? JSON.parse(rawProfileString) : rawProfileString;
};

module.exports = {
    generateRandomProfile
}
