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
      const names = await this.api.currentUsers();
      const dateInMessage = session.message.text.match(/(\d+) (\d+)/);
      session.send(`Current api user/users is/are ${names}<br/>Date data schema: DD MM of current year`);
      if(this.enabledCrons.length === 0) {
        this.enabledCrons.push(this.crons.send(this.responder.onWorkPhrase, [this.api, session, this.gather]));
        session.send(`Send cron launched`);
      }

      if (session.message.text.match(/работать|work|1/g) !== null) {
        this.responder.onWorkPhrase(this.api, session, this.gather);
      }

      if (dateInMessage !== null) {
        const date = new Date();
        this.responder.onWorkPhrase(this.api, session, this.gather, {
          date: {
            year: date.getFullYear(),
            month: dateInMessage[2],
            day: dateInMessage[1]
          }
        });
      }

      if (session.message.text.match(/bind/g) !== null) {
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