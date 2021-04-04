const { lookpath } = require('lookpath');
let result = {
    pkgmanager: "",
    pkgmoption: ""
}
exports.performChecks = async function () {
    // node present?
    const nodepath = await lookpath('node');
    if (nodepath == undefined) {
        throw new Error("NodeJs is not present. Please install to proceed");
    }
    // git present?
    const gitpath = await lookpath('git');
    if (gitpath == undefined) {
        throw new Error("Git is not present. Please install to proceed");
    }
    // npm?
    const npmpath = await lookpath('npm');
    if (npmpath != undefined) {
        result.pkgmanager = "npm";
        result.pkgmoption = "--prefix";
        return result;
    }
    // yarn?
    const yarnpath = await lookpath('yarn');
    if (yarnpath != undefined) {
        result.pkgmanager = "yarn";
        result.pkgmoption = "--cwd";
        return result;
    }
    // if both undefined
    throw new Error(`Neither npm nor yarn is present. Please install any one to proceed.`);
}