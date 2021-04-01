const shell = require('shelljs');

let result = {
    node: false,
    isgitPresent: false,
    pkgManager: ""
}
exports.performChecks = async function () {
    // check if node present
    if (!(shell.which('node'))) {
        throw new Error("NodeJs is not present. Please install to proceed");
    }
    result.node = true;
    //check if git is present
    if (!(shell.which('git'))) {
        throw new Error("Git is not present. Please install to proceed");
    }
    result.isgitPresent = true;
    //check for npm and yarn
    //if anyone is present then return
    if (shell.which('npm')) {
        result.pkgManager = "npm";
        return result;
    }
    if (shell.which('yarn')) {
        result.pkgManager = "yarn";
        return result;
    }
    // if both undefined
    throw new Error(`Neither npm nor yarn is present. Please install any one to proceed.`);
}