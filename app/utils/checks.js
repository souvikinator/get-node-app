const { lookpath } = require('lookpath');
let result = {
    node: false,
    isgitPresent: false,
    pkgManager: ""
}
// OPTIMISE: improve this function
exports.performChecks = async function () {
    // check if node present
    let nodepath = await lookpath('node');
    if (nodepath == undefined) throw new Error("NodeJs is not present");
    result.node = true;
    //check if git is present
    let gitpath = await lookpath('git');
    if (gitpath != undefined) result.isgitPresent = true;
    //check for npm and yarn
    //if anyone is present then return
    let npmpath = await lookpath('npm');
    if (npmpath != undefined) {
        result.pkgManager = "npm";
        return result;
    }

    let yarnpath = await lookpath('yarn');
    if (yarnpath != undefined) {
        result.pkgmanager = "yarn";
        return result;
    }

    // if both undefined
    if (npmpath == undefined && yarnpath == undefined) {
        throw new Error(`Neither npm nor yarn is present. Please install any one to proceed.`);
    }
}