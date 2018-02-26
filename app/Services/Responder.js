const FileSvc = require('./FileSvc');
const Memberer = require('./Memberer');

class Responder {
  constructor() {
    this.memberer = new Memberer();
  }

  async onWorkPhrase(ApiSvc, session, gather, config) {
    const options = config || {};
    session.message.address = JSON.parse(await gather.fileSvc.getFileData(gather.defaultStoragePath));
    const data = await ApiSvc.getTimeEntries(options.date);
    const newMember = this.memberer.checkForNewMember(data);
    if(newMember) {
      this.memberer.saveNewMember(newMember);
    }
    let message = options.date ? `Data for date: ${options.date.day} ${options.date.month} ${new Date().getFullYear()}` : '';
    let notEnoughMessage = '<br/><br/>';
    if(Object.keys(data).length > 1 || Object.keys(data.low).length >= 1) {
      for(let key in data) {
        if(key !== 'low') {
          message += `${key} logged ${data[key].time.toFixed(2)}<br/>`;
        }
      }
      for(let key in data.low) {
        notEnoughMessage += `${key} logged ${data.low[key].time.toFixed(2)}<br/>`;
      }
    } else {
      message += 'No logging data';
      notEnoughMessage += 'No data';
    }
    session.send(message + notEnoughMessage);
  }
}

module.exports = Responder;