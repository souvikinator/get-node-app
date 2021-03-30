const axios = require('axios');

let url = `https://api.github.com/repos/DarthCucumber/create-express-app/contents/templates?ref=master`;

exports.getTemplateList = async function () {
    const resp = await axios.get(url).catch(err => { throw new Error(err) });
    let templates = [];
    let respData=resp.data;
    for (let i in respData) {
        templates.push(respData[i].name);
    }
    return templates;
}