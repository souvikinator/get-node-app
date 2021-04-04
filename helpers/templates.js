const fs = require('fs-extra');
const axios = require('axios');
const execa = require('execa');
const path = require('path');

const tmplUrl = "https://api.github.com/repos/DarthCucumber/create-node-app-templates/contents";
const gitUrl = "git@github.com:DarthCucumber/create-node-app-templates.git";

// gets only template list
exports.getTemplateList = async function () {
    let tmplist = [];
    const exclude = [".git", "README.md", ".gitignore", ".vscode", "LICENSE"];
    await axios.get(tmplUrl)
        .then(resp => {
            let data = resp.data;
            data.forEach(e => {
                let tmplName = e.name;
                if (!exclude.includes(tmplName)) tmplist.push(tmplName);
            })
        })
        .catch(err => {
            throw new Error(err);
        })
    return tmplist;
}

// download selected template
// TODO: ADD WINDOWS SUPPORT?
exports.downloadTemplate = async function (outDir, templateName) {
    // __dirname is /helpers but we want the sh script from /scripts
    // therefore __dirname/../scripts/downloadTemplate.sh
    let workerScript = path.join(__dirname, "..", "scripts", "downloadTemplate.sh");
    await execa(workerScript, [outDir, gitUrl, templateName])
        .catch(err => {
            throw new Error(err);
        })
}