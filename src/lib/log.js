const pkg = require('../../package.json');
export default function log(...args) {
  console.log(pkg.name, '>', ...args);
}