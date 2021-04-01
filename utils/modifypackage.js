const fs = require('fs-extra');
const path = require('path');
const emojis = require('node-emoji');

exports.modifyPackageJson = async function (metadata) {
    const packagefile = path.join(metadata.projectName, "package.json");
    // read file and make changes
    let jsondata;
    await fs.readJson(packagefile).then(packageObj => {
        jsondata = packageObj;
        // set project name
        jsondata.name = metadata.projectName;
    }).catch(err => { throw new Error(err) });
    //save modified data back to package json
    fs.writeJson(packagefile, jsondata, err => {
        if (err) throw new Error(err);
    })
}