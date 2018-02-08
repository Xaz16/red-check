const ApiSvc = require('../Services/RedmineApiCheck');
const Gather = require('../Services/Gather');

class MainController {
  constructor(connector, builder) {
    this.initBot = (listener) => {return new builder.UniversalBot(connector, listener)};
    this.api = new ApiSvc();
    this.gather = new Gather('../../storage/');
  }

  listen() {
    this.bot = this.initBot(async (session) => {
      let currentUser = await this.api.currentUser;
      if(!this.gather.dataExists()) {
        await this.gather.createFile();
        this.gather.addAddress(session.message.address);
        console.log(session.message.address);
      }
      session.send(`Current api user is ${currentUser.data.user.firstname}`);

      if(session.message.text.match(/работать/g) !== null) {
        const data = await this.api.getTodayEntries();
        let message = '';
        let notEnoughMessage = '<br/><br/>';
        for(let key in data) {
          if(key !== 'low') {
            message += `${key} logged ${data[key].time.toFixed(2)}<br/>`;
          }
        }
        for(let key in data.low) {
          console.log(key);
          notEnoughMessage += `${key} logged ${data.low[key].time.toFixed(2)} is not enough<br/>`;
        }
        session.send(message + notEnoughMessage);
      }
    });

  }

}

module.exports = MainController;