const execa = require('execa');
const { modifyPkgFile } = require('./filehandling');

/**
 * performs npm/yarn install followed by git init
 * @param {string} pkgmanager - npm/yarn, depends on the checks. if both present then npm is preferred
 * @param {string} projectdir - project directory where the user wants the template to be generated
 */
exports.setupProject = async function (pkgmanager, projectdir) {
    const cwd = process.cwd();
    // change directory to project dir
    process.chdir(projectdir);
    // modify package.json
    await modifyPkgFile(projectdir);
    // install node modules
    await execa(pkgmanager, ['install']);
    // perform git init
    await execa('git', ['init']);
    // change to original directory
    process.chdir(cwd);
}