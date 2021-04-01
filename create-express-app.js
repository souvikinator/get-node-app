#!/usr/bin/env node
const inquirer = require("inquirer");
const emojis = require('node-emoji');
const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const boxen = require('boxen');
const ora = require('ora');
const execa = require('execa');
const { modifyPackageJson } = require('./scripts/modifypackage');
const { performChecks } = require('./scripts/checks');
const { getTemplateList } = require('./scripts/templates');
const { getRandomPhrase } = require('./scripts/randomphrase');
// FIXME: delete created file error occurs
// temporary storage of user input
let metadata = {
    pkgmanager: "",
    template: "",
    projectname: "",
    pkgmoption: ""  //package manager option(--cwd/--prefix)
}
// display banner
console.log(boxen('create-express-app v0.0.1', { padding: 1, margin: 1}));

(async () => {
    // perform checks before proceeding
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
    spinner.succeed("fetched templates\n");
    // ask questions realted to project
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
    // store in metadata
    Object.assign(metadata, answers);
    // create project directory
    await fs.ensureDir(metadata.projectname).then(() => {
        console.log(`${emojis.get("open_file_folder")} ${metadata.projectname}  created!`);
    }).catch(err => {
        console.log(`${emojis.get('x')}${err.message}`);
        process.exit(1);
    });
    // copy selected template from app data to project dir
    const templateDir = path.join(os.homedir(), ".create-express-app-data", "templates", metadata.template);
    await fs.copy(templateDir, metadata.projectname)
        .then(() => {
            console.log(`${emojis.get('floppy_disk')} files copied!`);
        })
        .catch(err => {
            console.log(`${emojis.get('x')} ${err.message}`);
            process.exit(1);
        })
    //make changes to package.json in project directory
    await modifyPackageJson(metadata).then(() => {
        console.log(`${emojis.get('memo')} modified package.json`);
    }).catch(err => {
        console.log(`${emojis.get('x')} ${err.message}`);
        process.exit(1);
    });
    // perform installs as per the package manager selected in checks
    spinner.text = "installing node modules";
    spinner.start();
    await execa(metadata.pkgmanager, ['install', metadata.pkgmoption, `${metadata.projectname}/`]).catch(err => {
        sp.fail(err.message);
        process.exit(1);
    });
    spinner.succeed(`${emojis.get('package')} node modules installed!`);
    // git init
    spinner.text = "initializing as git repo";
    spinner.start();
    await execa('git', ['init', `${metadata.projectname}/`]).catch(err => {
        spinner.fail(err.message);
        process.exit(1);
    });
    spinner.succeed(`${emojis.get('octopus')} git repo initialized`);
    console.log(`${emojis.get('sunglasses')} All set\n`);
    //print random phrase
    // why? just for fun ;)
    let rp = getRandomPhrase();
    console.log(boxen(rp, { padding: 1, margin: 1, borderColor: 'yellow' }));
})();