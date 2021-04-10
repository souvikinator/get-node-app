const axios = require('axios');
const { sparseDownload } = require('gh-retrieve');

const tmplUrl = "https://api.github.com/repos/DarthCucumber/get-node-app-templates/contents";
const gitUrl = "https://github.com/DarthCucumber/get-node-app-templates.git";

/**
 * @returns list of templates from github repository
 */
exports.getTemplateList = async function () {
    let tmplist = [];
    const exclude = ["LICENSE"];
    // request to github api
    await axios.get(tmplUrl)
        .then(resp => {
            let data = resp.data;
            data = data.filter(e => e.type === "dir");
            data.forEach(e => {
                let tmplName = e.name;
                //excluding hidden files, md files and those included in exlude list
                if (tmplName[0] !== '.' && tmplName.substring(-2) !== ".md" && !exclude.includes(tmplName)) {
                    tmplist.push(tmplName);
                }
            })
        })
        .catch(err => {
            throw new Error(err);
        })
    return tmplist;
}

/**
 * @param {string} outDir - output directory where template needs to be downloaded
 * i.e {homedir}/.get-node-app/templates
 * @param {string} templateName - name of the template one wants to download
 */
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