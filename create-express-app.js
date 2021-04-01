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
const execa = require('execa');
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
console.log(boxen('create-express-app v0.0.1', { padding: 1, margin: 1, borderStyle: 'double' }));

(async () => {
    // perform check before proceeding
    let spinner = ora('performing checks').start();
    let result = await performChecks().catch(err => {
        spinner.fail(err.message);
        process.exit(1);
    });
    Object.assign(metadata, result);
    spinner.succeed("checks complete");
    // fetch template list
    spinner.text = "fetching template..."
    spinner.start();
    const templateList = await getTemplateList().catch(err => {
        spinner.fail(err.message);
        process.exit(1);
    });
    if (templateList.length === 0) {
        spinner.fail("Template list couldn't be fetched\n check you internet connection or try again");
        process.exit(1);
    }
    spinner.succeed("fetched templates\n");
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
                name: 'projectName',
                message: `${emojis.get('gear')} Enter Project Name:`,
                validate: function (project) {
                    if (project.length === 0) {
                        return "project name cannot be empty";
                    }
                    return true;
                },
            }]);
    Object.assign(metadata, answers);
    // create directory
    await fs.ensureDir(metadata.projectName).then(() => {
        console.log(`${emojis.get("open_file_folder")} ${metadata.projectName}  created!`);
    }).catch(err => {
        console.log(err.message);
        process.exit(1);
    });
    //TODO: move template from dir to current project files
    const temDir = path.join(os.homedir(), ".create-express-app-data", "templates", metadata.template);
    await fs.copy(temDir, metadata.projectName)
        .then(() => {
            console.log(`${emojis.get('floppy_disk')} files copied!`);
        })
        .catch(err => {
            console.log(`${emojis.get('x')} ${err.message}`);
            process.exit(1);
        })
    // FIXME:
    // todo: get command as per package manager
    //make changes to downloaded package.json
    await modifyPackageJson(metadata).then(() => {
        console.log(`${emojis.get('memo')} modified package.json`);
    }).catch(err => {
        console.log(`${emojis.get('x')} ${err.message}`);
        process.exit(1);
    });
    spinner.text="installing node modules";
    spinner.start();
    await execa('npm', ['install', '--prefix', `${metadata.projectName}/`]).catch(err => {
        sp.fail(err.message);
        process.exit(1);
    });
    spinner.succeed(`${emojis.get('package')} node modules installed!`);
    // git init
    spinner.text="initializing as git repo";
    spinner.start();
    await execa('git', ['init', `${metadata.projectName}/`]).catch(err => {
        spinner.fail(err.message);
        process.exit(1);
    });
    spinner.succeed(`${emojis.get('octopus')} git repo initialized`);
    console.log(`${emojis.get('sunglasses')} All set`);
    //TODO: print instructions to use
})();