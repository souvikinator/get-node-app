#!/usr/bin/env node
const inquirer = require("inquirer");
const emojis = require('node-emoji');
const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const boxen = require('boxen');
const { modifyPackageJson } = require('./utils/modifypackage');
const { performChecks } = require('./utils/checks');
const { getTemplateList } = require('./utils/templates');
const ora = require('ora');
// TODO: rename vaiables properly
// FIXME: delete created file error occurs
// temporary storage of user input
let metadata = {
    pkgManager: "",
    template: "",
    projectName: "",
    isgitPresent: false
}
// display banner
console.log(boxen('create-express-app v1.0.0', { padding: 1, margin: 1, borderStyle: 'double' }));

(async () => {
    // perform check before proceeding
    const checkspinner = ora('performing checks').start();
    let result = await performChecks().catch(err => {
        checkspinner.fail(err.message);
        process.exit(1);
    });
    Object.assign(metadata, result);
    checkspinner.succeed("checks complete");
    // fetch template list
    const fetchspinner = ora("fetching template list").start();
    const templateList = await getTemplateList().catch(err => {
        fetchspinner.fail(err.message);
        process.exit(1);
    });
    if (templateList.length === 0) {
        fetchspinner.fail("Template list couldn't be fetched\n check you internet connection or try again");
        process.exit(1);
    }
    fetchspinner.succeed("fetched template list\n");
    // ask general questions
    let answers = await inquirer
        .prompt([
            {
                type: 'list',
                name: 'template',
                message: `${emojis.get('card_file_box')} Select Template:`,
                choices: templateList
            }
            , {
                type: 'input',
                name: 'projectname',
                message: `${emojis.get('gear')} Enter Project Name:`,
                validate: function (project) {
                    if (project.length === 0) {
                        return "project name cannot be empty";
                    }
                    return true;
                },
            }]);
    metadata.template = answers.template;
    metadata.projectName = answers.projectname;
    // create directory
    await fs.ensureDir(metadata.projectName).then(() => {
        console.log(`${emojis.get("open_file_folder")} ${metadata.projectName}  created!`);
    }).catch(err => {
        console.log(err.message);
        process.exit(1);
    });
    //TODO: move template from dir to current project files
    const temDir = path.join(process.env.HOME, ".create-express-app-data", "templates", metadata.template);
    await fs.copy(temDir, metadata.projectName)
        .then(() => {
            console.log(`${emojis.get('floppy_disk')} files copied!`);
        })
        .catch(err => {
            console.log(`${emojis.get('x')} ${err.message}`);
            process.exit(1);
        })
    //TODO: make changes to downloaded package.json
    await modifyPackageJson(metadata).then(() => {
        console.log(`${emojis.get('memo')} modified package.json`);
    }).catch(err => {
        console.log(`${emojis.get('x')} ${err.message}`);
        process.exit(1);
    });
    //TODO: perform: installs and boom! all ready
    //// git flow init -f
    // remove remote origin origin
    //TODO: print instructions to use
})();