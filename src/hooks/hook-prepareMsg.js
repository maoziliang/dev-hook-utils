const args = process.env.GIT_PARAMS.split(' ');
const editMsgFile = args[0];
const rawMsg = args[1];

export function run() {
  // if raw command is `git commit`, the rawMsg argument is 'template'.
  // if raw command is `git commit --amend`, the rawMsg argument is 'commit'.
  // Here, we hook the `git commit` command to provide commitizen ui to write commit message.
  if (rawMsg === 'template') {
    const prompt = require('../commitizen').default;
    prompt(editMsgFile);
  }
}

run();
