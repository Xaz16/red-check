const FileSvc = require('./FileSvc');

let self = null;
class Memberer {
  constructor() {
    if(!self) {
      self = this;
    }
    this.fileSvc = new FileSvc();

    return self;
  }

  async getMembers () {
    const data = await this.fileSvc.getFileData('app/storage/members.json');
    this.members = JSON.parse(data);
    return JSON.parse(data);
  }

  checkForNewMember(data) {
    const newMembers = [];
    for(const key in data) {
      if(key !== 'low') {
        if(!this.members[key]) {
          newMembers.push(key);
        }
      } else {
        for(const lowKey in data[key]) {
          if(!this.members[lowKey]) {
            newMembers.push(lowKey);
          }
        }
      }

    }
    return newMembers.length ? newMembers : null;
  }

  saveNewMember(name) {
    this.members[name] = {
      time: 0
    };

    this.fileSvc.writeFile('app/storage/members.json', JSON.stringify(this.members));
  }
}

module.exports = Memberer;