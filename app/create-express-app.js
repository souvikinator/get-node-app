#!/usr/bin/env node
const inquirer = require("inquirer");
const emojis = require('node-emoji');
const fs = require('fs-extra');
const boxen = require('boxen');
const { generatePackageJson } = require('./utils/createpackage');
const { performChecks } = require('./utils/checks');
const { getTemplateList } = require('./utils/getTemplateList');
const ora = require('ora');
// TODO: rename vaiables properly
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
    });
    if (templateList.length === 0) {
        fetchspinner.fail("Template list couldn't be fetched\n check you internet connection or try again");
    }
    fetchspinner.succeed("fetched template list\n");
    // ask general questions
    let answers = await inquirer
        .prompt([
            {
                type: 'list',
                name: 'template',
                message: `${emojis.get('card_file_box')} Select Template:`,
                // TODO: get the list of templates from the github api
                // choices: ["simple-express-app", "simple-express-rest-api", "simple-express-gql-api"]
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
    fs.ensureDir(metadata.projectName, err => {
        if (err) throw new Error(err.message);
        console.log(`${emojis.get("open_file_folder")} ${metadata.projectName}  created!`);
    });
    // create package.json file
    //TODO: download template files
    //TODO: after download make changes to downloaded package.json
    // modifyPackageJson(metadata);
    //TODO: perform: installs and boom! all ready
    // TODO: perform git init.
    //TODO: print instructions to use
})()