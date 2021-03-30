#!/usr/bin/env node
const inquirer = require("inquirer");
const emojis = require('node-emoji');
const fs = require('fs-extra');
const boxen = require('boxen');
const { generatePackageJson } = require('./utils/createpackage');
const { performChecks } = require('./utils/checks');
const ora = require('ora');
// temporary storage of user input
let metadata = {
    pkgManager: "",
    template: "",
    projectName: ""
}
// display banner
console.log(boxen('create-express-app v1.0.0', { padding: 1, margin: 1, borderStyle: 'double' }));
// check if node and (npm or yarn) is present
const spinner = ora('performing checks').start();

(async () => {
    let result = await performChecks().catch(err => {
        spinner.fail(err.message);
        process.exit(1);
    });
    metadata.pkgManager = result
    spinner.succeed("checks complete\n");

    // ask general questions
    let answers = await inquirer
        .prompt([
            {
                type: 'list',
                name: 'template',
                message: `${emojis.get('card_file_box')} Select Template:`,
                choices: ["simple-express-app", "simple-express-rest-api", "simple-express-gql-api"]
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
    metadata.projectname = answers.projectname;
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
    //TODO: print instructions to use
})()