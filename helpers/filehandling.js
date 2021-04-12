const fs = require('fs-extra');
const path = require('path');
const os = require('os');
/**
 * modifies package.json in project directory
 * use it after process.chdir(projectdir)
 * @param {String} projectname - takes in project name
 */
exports.modifyPkgFile = async function (projectname) {
    const packagefile = "package.json";
    // read file and make changes
    let jsondata;
    await fs.readJson(packagefile).then(packageObj => {
        jsondata = packageObj;
        // set project name
        jsondata.name = projectname;
    }).catch(err => { throw new Error(err) });
    //save modified data back to package json
    fs.writeJson(packagefile, jsondata, {
        spaces: 2
    }, err => {
        if (err) throw new Error(err);
    })
}

/**
 * creates app data directory if doesn't exist
 * @returns log directory and template directory
 */
exports.createAppDataDir = async function () {
    const homedir = os.homedir();
    const logsdir = path.join(homedir, ".get-node-app-data", 'logs');
    const templatesdir = path.join(homedir, ".get-node-app-data", 'templates');
    await fs.ensureDir(logsdir).catch(err => { throw new Error(err) });
    await fs.ensureDir(templatesdir).catch(err => { throw new Error(err) });
    return { logsdir, templatesdir }
}