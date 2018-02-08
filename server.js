const restify = require('restify');
const builder = require('botbuilder');
const controllerInstance = require('./app/Controllers/MainController');

const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, () => {
  console.log('%s listening to %s', server.name, server.url);
});

const connector = new builder.ChatConnector({
  appId: process.env.MicrosoftAppId || 'd49dab97-26d5-496d-8f1c-44deed41f46b',
  appPassword: process.env.MicrosoftAppPassword || 'ft1KopBYA6ZhP82gSfDQeAb'
});

server.post('/api/messages', connector.listen());

let controller = new controllerInstance(connector, builder);
controller.listen();