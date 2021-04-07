const execa = require('execa');

exports.installModules = async function (pkgmanager, cwd) {
    const originalcwd = process.cwd();
    // change directory to project dir
    process.chdir(cwd);
    await execa(pkgmanager, ['install']).catch(err => {
        throw new Error(err);
    });
    // change to original directory
    process.chdir(originalcwd);
}

exports.gitInit = async function (cwd) {
    await execa('git', ['init', cwd]).catch(err => {
        throw new Error(err);
    });
}