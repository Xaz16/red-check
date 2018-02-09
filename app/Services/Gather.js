const path = require('path');
const fs = require('fs');
const FileSvc = require('./FileSvc');

class Gather {
  constructor(pathToStorage) {
    this.storagePath = path.resolve(__dirname + pathToStorage) + '/';
    this.defaultStoragePath = path.resolve(__dirname + pathToStorage) + '/data.json';
    this.fileSvc = new FileSvc();
  }

  async addAddress(address, dataStore = this.dataStorePath) {
    const data = JSON.parse(await this.fileSvc.getFileData(dataStore));
    const writeData = JSON.stringify(Object.assign(data, address));
    this.fileSvc.writeFile(dataStore, writeData);
  }

  dataExists() {
    if(!this.dataStorePath) {
      return false;
    }
    return fs.existsSync(this.storagePath);
  }

  async createFile(name = 'data') {
    this.dataStorePath = `${this.storagePath + name}.json`;
    await this.fileSvc.writeFile(this.dataStorePath, '{}');
  }
}

module.exports = Gather;