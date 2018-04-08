// The hook is executed at project root directory.
const load = require('@commitlint/load');
const lint = require('@commitlint/lint');
import fse from 'fs-extra';
import chalk from 'chalk';

const args = process.env.GIT_PARAMS.split(' ');
const editMsgFile = args[0];

const defaultConfig =  {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // 不校验subject的大小写，可以使用中文
    "subject-case": [0],
    // subject限制在100字内
    "subject-max-length": [2, "always", 100],
    "type-enum": [2, "always", ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'build', 'chore', 'revert', 'wip']],
  }
};

function getCommitMsg() {
  const msg = fse.readFileSync(editMsgFile, { encoding: 'utf-8' });
  return msg.replace(/#(.*[\n\r])?/g, '');
}

function printLintResult(result) {
  const { errors, warnings } = result;
  [...errors, ...warnings].forEach((msg, i) => {
    const lvl = msg.level === 1 ? chalk.yellow('WARNING') : chalk.red('ERROR');
    console.log(
      `    ${lvl}\t`, msg.message,
      '\t', chalk.gray.bold(msg.name),
    );
  });
}

export async function run() {
  const config = await load(defaultConfig, {
    cwd: __dirname,
  });
  const msg = getCommitMsg();
  if (msg.trim()) {
    console.log(chalk.bold('start lint the commit msg'));
    const result = await lint(msg, config.rules);
    if (!result.valid) {
      console.log('\nLint result of commit message. Please modify the commit message.\n');
      printLintResult(result);
      process.exit(1);
    }

    console.log(chalk.green('lint passed.'));
  }
  process.exit(0);
}

(async () => {
  try {
    await run();
  } catch (e) {
    console.log(e, e.stack);
    process.exit(2);
  }
})();
