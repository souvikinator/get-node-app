const shell = require("shelljs");
const fs = require('fs-extra');
const path = require('path');
const os=require('os');
shell.config.silent = true;

// if template doesn't exists then clone 
// if exists then pull to make sure its up to date!
// TODO: add logging feature
exports.getTemplateList = async function () {
    let templateList = [];
    const homeDir = os.homedir();
    // place to store logs and templates
    const cloneDir = path.join(homeDir,".create-express-app-data","templates");
    const cloneUrl = "git@github.com:DarthCucumber/create-express-app-templates.git";
    const clonecmd = `git clone ${cloneUrl} ${cloneDir}`;
    // note: it's caps C 
    const pullcmd = `git -C ${cloneDir} pull origin master`;
    // if exists then update repo by git pull
    if (await dirExists(cloneDir)) {
        if (shell.exec(pullcmd).code !== 0) {
            // TODO: log in some file using shell.error();
            console.log("some error occurred while updating templates");
            shell.exit(1);
        }
    } else {
        // clone git repo if doesn't exists
        if (shell.exec(clonecmd).code !== 0) {
            console.log("some error occurred while downloading templates");
            shell.exit(1);
        }
    }
    // get the template list
    await getDirectories(cloneDir).then(contents => {
        templateList = contents.filter(c => {
            return c !== ".git" && c !== "README.md" && c!=".gitignore";
        })
    }).catch(err => {
        throw new Error(err);
    });
    return templateList;
}

async function getDirectories(path) {
    let contents = await (fs.readdir(path)).catch(err => { throw new Error(err) });
    return contents;
}

async function dirExists(dir) {
    if (fs.existsSync(dir)) {
        return true;
    } else {
        return false;
    }
}