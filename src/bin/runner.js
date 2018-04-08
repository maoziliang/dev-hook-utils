import { execSync } from 'child_process';
import { resolve } from 'path';
import { projectRoot } from '../lib/projectHelper';
import log from '../lib/log';
import { loadConfig } from '../lib/config';

const hookName = process.argv[2];

export function run(config) {
  if (config[hookName]) {
    log(hookName);
    try {
      execSync(config[hookName], {
        env: process.env,
        cwd: projectRoot,
        stdio: 'inherit',
      });
    } catch (e) {
      process.exit(e.status);
    }
  }
}

// process.argv[1] maybe exclude extension. eg. node runner
// so we compair with the result of require.resolve
if (require.resolve(process.argv[1]) === require.resolve(__filename)) {
  run(loadConfig());
}
