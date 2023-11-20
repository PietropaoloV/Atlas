const textHeader = "text/plain";
const jsonHeader = "application/json";
const acceptableHeaderTypes = [textHeader, jsonHeader];
const exercisePathRegex = /^[/][a-zA-Z0-9]*[/]exercise{1}[/]?[a-zA-Z0-9]*$/gm;
const workoutPathRegex = /^[/][a-zA-Z0-9]*[/]workouts{1}[/]?[a-zA-Z0-9]*$/gm;
const profilePathRegex = /^[/][a-zA-Z0-9]*[/]profile{1}[/]?[a-zA-Z0-9]*$/gm;
const setPathRegex = /^[/][a-zA-Z0-9]*[/]sets{1}[/]?[a-zA-Z0-9]*$/gm;
const wellnessPathRegex = /^[/][a-zA-Z0-9]*[/]wellness{1}[/]?[a-zA-Z0-9]*$/gm;
const idRegex = /^[0-9]{17}$/gm;


let clienttoken = "00000000000000000000";
let servertoken = "11111111111111111111";


const setClientToken = (newToken) => {
    clienttoken = newToken;
};

const getClientToken = () => {
    return clienttoken;
};

const setServerToken = (newToken) => {
    servertoken = newToken;
};

const getServerToken = () => {
    return servertoken;
};


module.exports = {
    textHeader,
    jsonHeader,
    acceptableHeaderTypes,
    exercisePathRegex,
    wellnessPathRegex,
    workoutPathRegex,
    setPathRegex,
    profilePathRegex,
    idRegex,
    clienttoken,
    servertoken,
    setClientToken,
    getClientToken,
    setServerToken,
    getServerToken
}
