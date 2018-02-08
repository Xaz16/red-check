const ApiSvc = require('../Services/RedmineApiCheck');
const Gather = require('../Services/Gather');
const Responder = require('../Services/Responder');
const crons = require('../Crons/main');

class MainController {
  constructor(connector, builder) {
    this.initBot = (listener) => {
      return new builder.UniversalBot(connector, listener)
    };
    this.api = new ApiSvc();
    this.responder = new Responder();
    this.crons = crons;
    this.gather = new Gather('../../storage/');
    this.enabledCrons = [];
  }

  listen() {
    this.bot = this.initBot(async (session) => {
      let currentUser = await this.api.currentUser;
      session.send(`Current api user is ${currentUser.data.user.firstname}`);
      if(this.enabledCrons.length === 0) {
        this.enabledCrons.push(this.crons.send(this.responder.onWorkPhrase, [this.api, session, this.gather]));
        session.send(`Send cron launched`);
      }

      if (session.message.text.match(/работать/g) !== null) {
        this.responder.onWorkPhrase(this.api, session, this.gather);
      }

      if (session.message.text.match(/bind/g) !== null && session.message.address.user.name === process.env.ownerName) {
        if (!this.gather.dataExists()) {
          await this.gather.createFile();
          console.log(session.message.address);
        }
        session.send(`Binded to chat`);
        this.gather.addAddress(session.message.address);
      }
    });

  }

}

module.exports = MainController;