#!/usr/bin/env node
const inquirer = require("inquirer");
const emojis = require('node-emoji');
const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const boxen = require('boxen');
const ora = require('ora');
const execa = require('execa');
const logto = require('logto');
const chalk = require('chalk');
const { modifyPackageJson, removeDir } = require('./scripts/filehandling');
const { performChecks } = require('./scripts/checks');
const { getTemplateList } = require('./scripts/templates');
const { getRandomPhrase, getDateTime } = require('./scripts/misc');
let metadata = {
    pkgmanager: "",
    template: "",
    projectname: "",
    pkgmoption: "",  //package manager option(--cwd/--prefix)
    debug: ""
}
// display banner
console.log(boxen('create-express-app v0.0.1', { padding: 0, margin: 0, borderColor: "magentaBright", borderStyle: "round" }));

// check if debug mode is enabled
const arg = process.argv.splice(2)[0];
if (arg === "--debug" || arg === '-d') {
    metadata.debug = true;
    console.log(emojis.get('bug'), chalk.cyan('debug mode enabled'));
};
// starting new logfile instance
const logdir = path.join(os.homedir(), ".create-express-app-data", "logs");
const logfile = `${getDateTime()}.log`;
const logger = new logto({ dir: logdir, file: logfile });

(async () => {
    // perform checks before proceeding
    let spinner = ora('performing checks').start();
    let result = await performChecks().catch(err => {
        // log error to log file
        logger.log(err.stack);
        spinner.fail(`${chalk.redBright(err.message)}`);
        console.log(`log file can be found at ${chalk.cyan(logger.logfile)}`);
        process.exit(1);
    });
    Object.assign(metadata, result);
    spinner.succeed("checks complete");
    // fetch template list
    spinner.text = "fetching template..."
    spinner.start();
    const templateList = await getTemplateList().catch(err => {
        // log error to log file
        logger.log(err.stack);
        spinner.fail(`${chalk.redBright("some error occured while fetching templates. Make sure you have active internet connection\n")}`);
        console.log(`log file can be found at ${chalk.cyan(logger.logfile)}`);
        process.exit(1);
    });
    spinner.succeed("fetched templates\n");
    console.log(emojis.get('information_source'), 'To know mode about each templates: https://github.com/DarthCucumber/create-express-app-templates');
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
        // log error to log file
        logger.log(err.stack);
        console.log(`${emojis.get('x')}${chalk.redBright(err.message)}`);
        console.log(`log file can be found at ${chalk.cyan(logger.logfile)}`);
        process.exit(1);
    });
    // copy selected template from app data to project dir
    // {homedir}/.create-express-app/templates/{template-name}
    const templateDir = path.join(os.homedir(), ".create-express-app-data", "templates", metadata.template);
    await fs.copy(templateDir, metadata.projectname)
        .then(() => {
            console.log(`${emojis.get('floppy_disk')} files copied!`);
        })
        .catch(err => {
            // log error to log file
            logger.log(err.stack);
            // remove project directory
            removeDir(metadata.projectname);
            //then log error
            console.log(`${emojis.get('x')}${chalk.redBright(err.message)}`);
            console.log(`log file can be found at ${chalk.cyan(logger.logfile)}`);
            process.exit(1);
        })
    //make changes to package.json in project directory
    await modifyPackageJson(metadata).then(() => {
        console.log(`${emojis.get('memo')} modified package.json\n`);
    }).catch(err => {
        // log error to log file
        logger.log(err.stack);
        // remove project directory
        removeDir(metadata.projectname);
        //then log error
        console.log(`${emojis.get('x')}${chalk.redBright(err.message)}`);
        console.log(`log file can be found at ${chalk.cyan(logger.logfile)}`);
        process.exit(1);
    });
    // perform installs as per the package manager selected in checks
    spinner.text = "installing node modules";
    spinner.start();
    await execa(metadata.pkgmanager, ['install', metadata.pkgmoption, `${metadata.projectname}/`]).catch(err => {
        // log error to log file
        logger.log(err.stack);
        // remove project directory
        removeDir(metadata.projectname);
        //then log error
        sp.fail(chalk.redBright(err.message));
        console.log(`log file can be found in ${chalk.cyan(logger.logfile)}`);
        process.exit(1);
    });
    spinner.succeed(`${emojis.get('package')} node modules installed!`);
    // git init
    spinner.text = "initializing as git repo";
    spinner.start();
    await execa('git', ['init', `${metadata.projectname}/`]).catch(err => {
        // log error to log file
        logger.log(err.stack);
        // remove project directory
        removeDir(metadata.projectname);
        //then log error
        sp.fail(chalk.redBright(err.message));
        console.log(`log file can be found in ${chalk.cyan(logger.logfile)}`);
        process.exit(1);
    });
    spinner.succeed(`${emojis.get('octopus')} git repo initialized`);
    console.log(`${emojis.get('sunglasses')} All set\n`);
    //print random phrase
    // why? just for fun ;)
    let rp = getRandomPhrase();
    console.log(boxen(rp, { padding: 0, margin: 0, borderColor: "yellow", borderStyle: "round" }));
    // reached here => no errors => no need of log files. remove em
    // if debug mode then don't delete log
    if (!metadata.debug) {
        removeDir(logdir);
        return;
    };
    console.log(`log file can be found at`, chalk.cyan(logger.logfile));
})();