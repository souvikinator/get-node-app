const fs = require('fs-extra');
const path = require('path');
const emojis = require('node-emoji');

exports.modifyPackageJson = async function (metadata) {
    const packagefile = path.join(metadata.projectName, "package.json");
    // read file and make changes
    let jsondata;
    fs.readJson(packagefile, (err, packageObj) => {
        if (err) throw new Error(err);
        jsondata = packageObj;
    })
    // set project name
    jsondata.name = metadata.projectname;
    // description as per the template chosen
    switch (metadata.template) {
        case "simple-express-app":
            jsondata.description = "simple express node js app";
            break;
        case "simple-express-rest-api":
            jsondata.description = "simple express node js rest api";
            break;
        case "simple-express-gql-api":
            jsondata.description = "simple express node js graphql api";
            break;
        default:
            jsondata.description = "simple express node js app";
    }
    //save modified data back to package json
    fs.writeJson(packagefile, jsondata, err => {
        if (err) throw new Error(err);
        console.log(`${emojis.get('page_with_curl')} modified ${packagefile}`);
    })
}