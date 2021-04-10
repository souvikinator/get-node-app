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
const { setupProject } = require('./helpers/installs');
let metadata = {
    pkgmanager: "",
    template: "",
    projectname: "",
    appdatadir: ""
}
// display banner
console.log(boxen('get-node-app v0.1.0', { borderColor: "magentaBright", borderStyle: "round" }));
// starting new logfile instance
metadata.appdatadir = path.join(os.homedir(), ".get-node-app-data");
const logdir = path.join(metadata.appdatadir, "logs");
const logfile = `${getDateTime()}.log`;
const logger = new logto({ dir: logdir, file: logfile });
// log the platform
logger.log(`platform: ${process.platform}`);

let spinner = ora('Performing checks').start();

(async () => {
    /**
     * node, git, npm or yarn present?
     * return package manager installed in the system
     * if both yarn and npm installed then npm is preferred
     **/
    let result = await performChecks().catch(err => {
        handleError(err);
    });
    metadata.pkgmanager=result;
    spinner.succeed("Checks complete");
    logger.log("Checks complete");
    // fetch template list
    spinner.text = "Fetching template..."
    spinner.start();
    const templateList = await getTemplateList().catch(err => {
        handleError(err);
    });
    spinner.succeed("Fetched templates\n");
    logger.log("Fetched templates");
    console.log('know more about each templates or create your own: https://github.com/DarthCucumber/create-express-app-templates');
    /**
     * allow users to select template and project name
     * */ 
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
    // {homedir}/.get-node-app-data/templates/{template-name}
    const templateDir = path.join(metadata.appdatadir, "templates");
    // Download template
    spinner.text = `Downloading templates...`;
    spinner.start();
    await downloadTemplate(templateDir, metadata.template).catch(err => {
        handleError(err);
    });
    spinner.succeed(`Template downloaded\n`);
    logger.log("templates downloaded");
    // create project directory
    await fs.ensureDir(metadata.projectname).then(() => {
        spinner.succeed(`Projects Created: ${metadata.projectname}`);
        logger.log(`project created: ${metadata.projectname}`);
    }).catch(err => {
        handleError(err);
    });
    // copy selected template from app data to project dir
    const tmplContent = path.join(templateDir, metadata.template);
    await fs.copy(tmplContent, metadata.projectname).catch(err => {
        handleError(err);
    })
    logger.log(`copied file from ${templateDir} to ${metadata.template}`);
    // modeify package file, install node modules and git init
    spinner.text = "Setting up project";
    spinner.start();
    await setupProject(metadata.pkgmanager, metadata.projectname).catch(err => {
        handleError(err);
    });
    spinner.succeed(`Project setup complete\n`);
    logger.log(`Project setup complete`);
    console.log(`＼(＾O＾)／ All set\n`);
    /**
     * print random phrase
     * why? just for fun ;)
     */
    let rp = getRandomPhrase();
    console.log(boxen(rp, { padding: 0, margin: 0, borderColor: "yellow", borderStyle: "round" }));
    logger.log(`random phrase generated`);
    // TODO: show only when error occurs otherwise delete
    console.log(`\nlog file can be found in ${chalk.cyan(logger.logfile)}`);
    logger.end();
})();

// not the elegant way, but works lol
function handleError(err) {
    logger.log(err.stack);
    logger.end();
    removeDir(metadata.projectname);
    spinner.fail(chalk.redBright(err.message));
    console.log(`log file can be found in ${chalk.cyan(logger.logfile)}`);
    process.exit(1);
}
