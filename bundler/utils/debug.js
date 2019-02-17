const debug = require('debug');

module.exports = (processName) => {
  const log = debug(processName || '');

  return (value) => {
    log(value);
    console.log(`${processName}:`, value);
  };
};
