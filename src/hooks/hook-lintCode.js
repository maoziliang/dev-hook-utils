// The hook is executed at project root directory.
import { spawnSync } from 'child_process';
import eslint from 'eslint';
import chalk from 'chalk';
import { relative } from 'path';
import fse from 'fs-extra';
import glob from 'glob';
import { projectRoot, resolveProjectRootPath } from '../lib/projectHelper';

function getStagedFileContent(fileName) {
  const result = spawnSync('git', ['show', `:${fileName}`], {
    cwd: projectRoot,
  });
  return result.stdout.toString();
}

/**
 * Get the the list of files which to be commited.
 */
function getCommitingFiles() {
  const result = spawnSync('git', ['diff', '--cached', '--name-only'], {
    cwd: projectRoot,
  });
  const files = result.stdout.toString().split('\n');
  return files
    .filter(file => file.length > 0 && (file.endsWith('.js') || file.endsWith('.vue')))
    .map(file => ({
      filename: file,
      content: getStagedFileContent(file),
    }));
}

function hasCustomizedConfigFile() {
  const customizedEslintFiles = glob.sync(resolveProjectRootPath('.eslintrc.*'));
  return customizedEslintFiles.length || fse.pathExistsSync(resolveProjectRootPath('.eslintrc'));
}

/**
 * Print result item.
 * @param {*} fileResult
 */
function printRuleResult(fileResult) {
  if (!isFileValid(fileResult)) {
    const { filePath, messages: msgs, errorCount, warningCount } = fileResult;
    const relativePath = relative(projectRoot, filePath);
    console.log(chalk.red.bold(relativePath), '\t', chalk.bgRed(` ERRORS: ${errorCount} `), chalk.bgYellow(` WARNINGS: ${warningCount} `));
    msgs.forEach((msg, i) => {
      const lvl = msg.severity === 1 ? chalk.yellow('WARNING') : chalk.red('ERROR');
      console.log(
        chalk.gray(`    ${msg.line}:${msg.column}`), `\t${lvl}\t`, msg.message,
        '\t', chalk.gray.bold(msg.ruleId),
      );
    });
    console.log('');
  }
}

function isFileValid(fileResult) {
  return fileResult.errorCount === 0  && fileResult.warningCount === 0;
}

function isValid(results) {
  return results.every(isFileValid);
}

function run() {
  const files = getCommitingFiles();
  if (!files.length) {
    return;
  }
  console.log(chalk.bold('start to lint staged files'));
  const cli = new eslint.CLIEngine({
    configFile: hasCustomizedConfigFile() ? null : require.resolve('./eslintrc.js'),
  });
  const results = files.reduce(
    (rs, file) => [...rs, ...cli.executeOnText(file.content, file.filename).results],
    [],
  );
  if (!isValid(results)) {
    console.log(`\nLint result of the ${chalk.bold('staged')} files. Please fix the problems below before your next commit.\n`);
    results.forEach(printRuleResult);
    process.exit(1);
  }
  console.log(chalk.green('lint passed.'));
  process.exit(0);
}

run();
