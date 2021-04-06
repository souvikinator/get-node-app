const execa = require('execa');

exports.installModules = async function (pkgmanager, pkgmoption, cwd) {
    // perform installs as per the package manager selected in checks
    // for npm
    let args = ["install", pkgmoption, cwd, cwd];
    // for yarn
    if (pkgmanager === "yarn") args = ["install", pkgmoption, cwd];
    await execa(pkgmanager, args).catch(err => {
        throw new Error(err);
    });

}

exports.gitInit = async function (cwd) {
    await execa('git', ['init', cwd]).catch(err => {
        throw new Error(err);
    });
}