const { execSync } = require('child_process');
const path = require('path');

module.exports.updb = function () {
  execSync(path.resolve('../UpTestDB.sh'));
}

module.exports.downdb = function () {
  execSync(path.resolve('../DownTestDB.sh'));
}