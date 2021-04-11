#!/usr/bin/env node
const inquirer = require("inquirer");
const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const ora = require('ora');
const logto = require('logto');
const chalk = require('chalk');
const { removeDir } = require('./helpers/filehandling');
const { performChecks } = require('./helpers/checks');
const { getTemplateList, downloadTemplate } = require('./helpers/templates');
const { getRandomPhrase, getDateTime } = require('./helpers/misc');
const { setupProject } = require('./helpers/installs');
let metadata = {
    pkgmanager: "",
    template: "",
    projectname: "",
    appdatadir: "",
    debug: false
}
// TODO: improve logging
// display banner
console.log(chalk.magentaBright.bold(`
 _  _  _
/_\/\/ //_| v0.1.0
_/
`));
// check if debug mode enabled
const args = process.argv.slice(2);
if (args[0] === "-d" || args[0] === "--debug") {
    metadata.debug = true;
    console.log(chalk.yellow('> debug mode enabled'));
}
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
    metadata.pkgmanager = result;
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
    console.log('know more about each templates or create your own: https://github.com/DarthCucumber/get-node-app-templates');
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
        spinner.succeed(`Project Created: ${metadata.projectname}`);
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
    console.log(chalk.magentaBright.bold(rp),"\n");
    logger.log(`random phrase generated`);
    /**
     * keep log file if debug mode is enabled else delete log file
     */
    if (metadata.debug) {
        console.log(`log file can be found in ${chalk.cyan(logger.logfile)}\n`);
        logger.end();
        return;
    }
    removeDir(path.join(logdir, logfile));
})();

// not the elegant way, but works lol
async function handleError(err) {
    logger.log(err.stack);
    logger.end();
    await removeDir(metadata.projectname);
    spinner.fail(chalk.redBright(err.message));
    console.log(`log file can be found in ${chalk.cyan(logger.logfile)}`);
    process.exit(1);
}
