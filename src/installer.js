import { join } from 'path';
import chalk from 'chalk';
import { spawnSync, execSync } from 'child_process';
import fse from 'fs-extra';
import log from './lib/log';
import { projectRoot, resolveProjectRootPath } from './lib/projectHelper';
import * as hookInstaller from './hookInstaller';
const pkg = require('../package.json');

function assertGitRepo() {
  if (!fse.existsSync(resolveProjectRootPath('.git'))) {
    throw new Error('The current directory is not a git repository. Maybe you need execute `git init` first.');
  }
}

export function install() {
  try {
    assertGitRepo();
    hookInstaller.install();
    log(chalk.green('Install dev-hook-utils successfully'));
  } catch (e) {
    log(chalk.bgYellow('WARN'), e.message);
    console.error(e);
  }
}

export function uninstall() {
  try {
    hookInstaller.uninstall();
    log(chalk.green('Cleanup dev-hook-utils successfully'));
  } catch (e) {
    log(chalk.yellow('WARN'), e.message);
    console.error(e);
  }
}
