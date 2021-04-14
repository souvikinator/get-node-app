const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');
const { getDateTime } = require('./misc');
const Errfmt=require('errfmt');
const errfmt=new Errfmt();

function Logto(logsdir) {
    const logfile = `${getDateTime()}.log`;
    const logfilepath = path.join(logsdir, logfile);
    let stream = fs.createWriteStream(logfilepath, { flag: 'a', encoding: 'utf-8' });
    this.logfile = logfilepath;
    this.info = function (msg) {
        stream.write(`[INFO] ${msg}\n`);
    }
    this.warn = function (msg) {
        stream.write(`[WARN] ${msg}\n`);
    }
    this.error = function (err) {
        let inc=['exitCode','code','errorCode','stack'];
        stream.write(errfmt.withoutColor().include(...inc).render(err));
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