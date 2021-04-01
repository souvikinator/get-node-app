const shell = require("shelljs");
const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const execa = require('execa');
shell.config.silent = true;

// if template doesn't exists then clone 
// if exists then pull to make sure its up to date!
// TODO: add logging feature
exports.getTemplateList = async function () {
    let templateList = [];
    const homeDir = os.homedir();
    // place to store logs and templates
    const cloneDir = path.join(homeDir, ".create-express-app-data", "templates");
    const cloneUrl = "git@github.com:DarthCucumber/create-express-app-templates.git";
    // if exists then update repo by git pull
    if (await dirExists(cloneDir)) {
        // TODO: log in some file using shell.error();
        const { pullstdout } = await execa('git', ['-C', cloneDir, 'pull', 'origin', 'master'])
            .catch(err => { throw new Error(err) });
        // console.log(pullstdout);
    } else {
        // clone git repo if doesn't exists
        const { clonestdout } = await execa('git', ['clone', cloneUrl, cloneDir])
            .catch(err => { throw new Error(err) });
        // console.log(clonestdout);
    }
    // get the template list
    const exclude = [".git", "README.md", ".gitignore", ".vscode"];
    await getDirectories(cloneDir).then(contents => {
        templateList = contents.filter(c => {
            // exclude those present in exclude list
            return !exclude.includes(c);
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