#!/usr/bin/env node
const inquirer = require("inquirer");
const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const boxen = require('boxen');
const ora = require('ora');
const logto = require('logto');
const chalk = require('chalk');
const { modifyPackageJson, removeDir } = require('./helpers/filehandling');
const { performChecks } = require('./helpers/checks');
const { getTemplateList, downloadTemplate } = require('./helpers/templates');
const { getRandomPhrase, getDateTime } = require('./helpers/misc');
const { installModules, gitInit } = require('./helpers/installs');
let metadata = {
    pkgmanager: "",
    template: "",
    projectname: "",
    pkgmoption: "",  //package manager option(--cwd/--prefix)
    appdatadir: ""
}
// display banner
console.log(boxen('get-node-app v0.1.0', { borderColor: "magentaBright", borderStyle: "round" }));
// starting new logfile instance
metadata.appdatadir = path.join(os.homedir(), ".get-node-app-data");
const logdir = path.join(metadata.appdatadir, "logs");
const logfile = `${getDateTime()}.log`;
const logger = new logto({ dir: logdir, file: logfile });

let spinner = ora('Performing checks').start();

(async () => {
    // perform checks before proceeding
    let result = await performChecks().catch(err => {
        handleError(err);
    });
    Object.assign(metadata, result);
    spinner.succeed("Checks complete");
    // fetch template list
    spinner.text = "Fetching template..."
    spinner.start();
    const templateList = await getTemplateList().catch(err => {
        handleError(err);
    });
    spinner.succeed("Fetched templates\n");
    console.log('To know mode about each templates: https://github.com/DarthCucumber/create-express-app-templates');
    // ask questions realted to project
    let answers = await inquirer
        .prompt([
            {
                type: 'list',
                name: 'template',
                message: `Select Template:`,
                choices: templateList
            }
            , {
                type: 'input',
                name: 'projectname',
                message: `Enter Project Name:`,
                validate: function (project) {
                    if (project.length === 0) {
                        return "project name cannot be empty";
                    }
                    return true;
                },
            }]);
    // store in metadata
    Object.assign(metadata, answers);
    // {homedir}/.create-express-app/templates/{template-name}
    const templateDir = path.join(metadata.appdatadir, "templates");
    // Download template
    spinner.text = `Downloading templates...`;
    spinner.start();
    await downloadTemplate(templateDir, metadata.template).catch(err => {
        handleError(err);
    });
    spinner.succeed(`Template downloaded\n`);
    // create project directory
    await fs.ensureDir(metadata.projectname).then(() => {
        spinner.succeed(`Projects Created: ${metadata.projectname}`);
    }).catch(err => {
        handleError(err);
    });
    // copy selected template from app data to project dir
    const tmplContent = path.join(templateDir, metadata.template);
    await fs.copy(tmplContent, metadata.projectname).catch(err => {
        handleError(err);
    })
    //make changes to package.json in project directory
    await modifyPackageJson(metadata.projectname).catch(err => {
        handleError(err);
    });
    // install node modules
    spinner.text = "Installing node modules";
    spinner.start();
    await installModules(metadata.pkgmanager, metadata.pkgmoption, metadata.projectname).catch(err => {
        handleError(err);
    });
    spinner.succeed(`Node modules installed!`);
    // git init
    spinner.text = "Initializing as git repo";
    spinner.start();
    await gitInit(metadata.projectname).catch(err => {
        handleError(err);
    });
    spinner.succeed(`git repo Initialized\n`);
    console.log(`ヽ(^O^)ノ All set\n`);
    //print random phrase
    // why? just for fun ;)
    let rp = getRandomPhrase();
    console.log(boxen(rp, { padding: 0, margin: 0, borderColor: "yellow", borderStyle: "round" }));
    // reached here => no errors => no need of log files. remove em
    // if debug mode then don't delete log
})();

// not the elegant way, but works lol
function handleError(err) {
    logger.log(err.stack);
    removeDir(metadata.projectname);
    spinner.fail(chalk.redBright(err.message));
    console.log(`log file can be found in ${chalk.cyan(logger.logfile)}`);
    process.exit(1);
}