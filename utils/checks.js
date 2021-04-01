const { lookpath } = require('lookpath');
let result = {
    node: false,
    isgitPresent: false,
    pkgManager: ""
}
exports.performChecks = async function () {
    // node present?
    const nodepath = await lookpath('node');
    if (nodepath == undefined) {
        throw new Error("NodeJs is not present. Please install to proceed");
    }
    result.node = true;
    // git present?
    const gitpath = await lookpath('git');
    if (gitpath == undefined) {
        throw new Error("Git is not present. Please install to proceed");
    }
    result.isgitPresent = true;
    // npm?
    const npmpath = await lookpath('npm');
    if (npmpath != undefined) {
        result.pkgManager = "npm";
        return result;
    }
    // yarn?
    const yarnpath = await lookpath('yarn');
    if (yarnpath != undefined) {
        result.pkgManager = "yarn";
        return result;
    }
    // if both undefined
    throw new Error(`Neither npm nor yarn is present. Please install any one to proceed.`);
}