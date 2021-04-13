const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');
const { getDateTime } = require('./misc');
const PrettyError = require('pretty-error');
const pe = new PrettyError();
pe.withoutColors();

function Logto(logsdir) {
    const logfile = `${getDateTime()}.log`;
    const logfilepath = path.join(logsdir, logfile);
    let stream = fs.createWriteStream(logfilepath, { flag: 'a', encoding: 'utf-8' });
    this.logfile = logfilepath;
    this.info = function (msg) {
        stream.write(`[info] ${msg}\n`);
    }
    this.warn = function (msg) {
        stream.write(`[warn] ${msg}\n`);
    }
    this.error = function (err) {
        stream.write(pe.render(err));
    }
    this.handleError = function (err) {
        this.error(err);
        stream.end();
        console.log(`log file can be found at ${chalk.cyan(this.logfile)}\n`);
        process.exit(1);
    }
    this.deleteLog = async function () {
        stream.end();
        fs.remove(logfilepath);
    }
}

module.exports = Logto;