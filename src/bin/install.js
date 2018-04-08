const isCI = require('is-ci');
if (!isCI) {
  const installer = require('../installer');

  if (process.argv[2] === '--cleanup') {
    installer.uninstall();
  } else {
    installer.install();
  }
}