const fs = require('fs-extra');

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

exports.removeDir = async function (dir) {
    fs.remove(dir).catch(err => { throw new Error(err) });
}