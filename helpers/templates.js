const axios = require('axios');
const { sparseDownload } = require('gh-retrieve');

const tmplUrl = "https://api.github.com/repos/DarthCucumber/get-node-app-templates/contents";
const gitUrl = "https://github.com/DarthCucumber/get-node-app-templates.git";

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
exports.downloadTemplate = async function (outDir, templateName) {
    await sparseDownload({
        cloneurl: gitUrl,
        targetdir: templateName,
        outdir: outDir,
        branch: "master"
    }).catch(err => {
        throw new Error(err);
    });
}