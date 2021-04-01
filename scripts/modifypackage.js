const fs = require('fs-extra');
const path = require('path');

exports.modifyPackageJson = async function (metadata) {
    const packagefile = path.join(metadata.projectname, "package.json");
    // read file and make changes
    let jsondata;
    await fs.readJson(packagefile).then(packageObj => {
        jsondata = packageObj;
        // set project name
        jsondata.name = metadata.projectname;
    }).catch(err => { throw new Error(err) });
    //save modified data back to package json
    fs.writeJson(packagefile, jsondata,{
        spaces:'\t'
    }, err => {
        if (err) throw new Error(err);
    })
}