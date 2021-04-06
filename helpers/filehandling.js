const fs = require('fs-extra');
const path = require('path');

exports.modifyPackageJson = async function (projectname) {
    const packagefile = path.join(projectname, "package.json");
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

// elevated privileges
exports.removeDir = async function (dirpath) {
    fs.remove(dirpath)
        .catch(err => {
            throw new Error(err);
        })
}