import { resolveProjectRootPath } from './lib/projectHelper';
import fse from 'fs-extra';
const pkg = require('../package.json');

const ORIGIN_POSTFIX = '-dev-hook-utils-orig';
const template = `#!/bin/sh
# dev-hook-utils
# ${pkg.version}

# run the original hook
originFile="\`dirname $0\`"/"\`basename $0\`"${ORIGIN_POSTFIX}
if [ -e $originFile ]
then
  $originFile "$@" || {
    echo "execute origin \`basename $0\` failed"
    exit 1
  }
fi

# run dev-hook-utils hook
export GIT_PARAMS="$*"
node ./node_modules/dev-hook-utils/dist/bin/runner \`basename "$0"\`
`;

const hooks = [
  'applypatch-msg',
  'pre-applypatch',
  'post-applypatch',
  'pre-commit',
  'prepare-commit-msg',
  'commit-msg',
  'post-commit',
  'pre-rebase',
  'post-checkout',
  'post-merge',
  'pre-push',
  'pre-receive',
  'update',
  'post-receive',
  'post-update',
  'push-to-checkout',
  'pre-auto-gc',
  'post-rewrite',
  'sendemail-validate',
];

function resolveHookFilePath(hookName) {
  return resolveProjectRootPath(`.git/hooks/${hookName}`);
}

function isHookExists(hookName) {
  return fse.pathExistsSync(resolveHookFilePath(hookName));
}

function getOriginHookName(hookName) {
  return `${hookName}${ORIGIN_POSTFIX}`;
}

function processOriginHook(hookName) {
  if (isHookExists(hookName)) {
    fse.moveSync(
      resolveHookFilePath(hookName),
      resolveHookFilePath(getOriginHookName(hookName)),
    );
  }
}

function writeHook(hookName) {
  const hookFilePath = resolveHookFilePath(hookName);
  fse.writeFileSync(
    hookFilePath,
    template,
    {
      encoding: 'utf-8',
    },
  );
  fse.chmodSync(hookFilePath, '755');
}

function isHookInstalledByUs(hookName) {
  const hookPath = resolveHookFilePath(hookName);
  if (fse.pathExistsSync(hookPath)) {
    const hookContent = fse.readFileSync(hookPath, { encoding: 'utf-8' });
    return hookContent.trim().startsWith(`#!/bin/sh
# dev-hook-utils`);
  }
  return false;
}

function restoreOriginHook(hookName) {
  const originHookPath = resolveHookFilePath(getOriginHookName(hookName));
  const hookPath = resolveHookFilePath(hookName);
  // Remove hook which was installed by us
  fse.removeSync(hookPath);
  if (fse.pathExistsSync(originHookPath)) {
    fse.moveSync(originHookPath, hookPath);
  }
}

export function install() {
  uninstall();
  hooks.forEach(hookName => {
    processOriginHook(hookName);
    writeHook(hookName);
  });
}

export function uninstall() {
  hooks.forEach(hookName => {
    if (isHookInstalledByUs(hookName)) {
      restoreOriginHook(hookName);
    }
  });
}
