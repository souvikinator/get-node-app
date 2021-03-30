const { lookpath } = require('lookpath');
exports.performChecks = async function () {
    // check if node present
    let nodepath = await lookpath('node');
    if (nodepath == undefined) throw new Error("NodeJs is not present");
    //check for npm and yarn
    //if anyone is present then return
    let npmpath = await lookpath('npm');
    if (npmpath != undefined) return "npm";
    let yarnpath = await lookpath('yarn');
    if (yarnpath != undefined) return "yarn";

    // if both undefined
    if (npmpath == undefined && yarnpath == undefined) {
        throw new Error(`Neither npm nor yarn is present. Please install any one to proceed.`);
    }
}