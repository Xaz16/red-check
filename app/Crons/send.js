const cron = require('node-cron');

const start = (handler, arg) => cron.schedule('0 * * * *', () => {
  handler.apply(null, arg);
} , true);

module.exports = start;