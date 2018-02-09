const FileSvc = require('./FileSvc');

class Responder {
  constructor() {
  }

  async onWorkPhrase(ApiSvc, session, gather) {
    session.message.address = JSON.parse( await gather.fileSvc.getFileData(gather.defaultStoragePath));
    const data = await ApiSvc.getTodayEntries();
    let message = '';
    let notEnoughMessage = '<br/><br/>';
    if(Object.keys(data).length > 1 || Object.keys(data).length >= 1) {
      for(let key in data) {
        if(key !== 'low') {
          message += `${key} logged ${data[key].time.toFixed(2)}<br/>`;
        }
      }
      for(let key in data.low) {
        notEnoughMessage += `${key} logged ${data.low[key].time.toFixed(2)} is not enough<br/>`;
      }
    } else {
      message += 'No logging data';
      notEnoughMessage += 'No data';
    }
    session.send(message + notEnoughMessage);
  }
}

module.exports = Responder;