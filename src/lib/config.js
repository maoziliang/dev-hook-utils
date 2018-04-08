import fse from 'fs-extra';
import { projectRoot, resolveProjectRootPath } from './projectHelper';

const DEFAULT_CONFIG = {
  'prepare-commit-msg': `node ${require.resolve('../hooks/hook-prepareMsg.js')} < /dev/tty`,
  'pre-commit': `node ${require.resolve('../hooks/hook-lintCode.js')}`,
  'commit-msg': `node ${require.resolve('../hooks/hook-lintMsg.js')}`,
};
const CONFIG_FILE = '.dev-hook-utils.config.js';

export function loadConfig() {
  const configFile = resolveProjectRootPath(CONFIG_FILE);
  if (fse.pathExistsSync(configFile)) {
    return require(configFile);
  }
  return DEFAULT_CONFIG;
}