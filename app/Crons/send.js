const cron = require('node-cron');

const start = (handler, arg) => cron.schedule('0 15-17 * * *', () => {
  handler.apply(null, arg);
} , true);

module.exports = start;