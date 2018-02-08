const restify = require('restify');
const builder = require('botbuilder');
const controllerInstance = require('./app/Controllers/MainController');

const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, () => {
  console.log('%s listening to %s', server.name, server.url);
});

const connector = new builder.ChatConnector({
  appId: process.env.MicrosoftAppId,
  appPassword: process.env.MicrosoftAppPassword,
});

server.post('/api/messages', connector.listen());
server.get('/', (req, res) => {
  res.send(200);
});
const controller = new controllerInstance(connector, builder);
controller.listen();
