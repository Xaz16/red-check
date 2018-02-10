const FileSvc = new (require('./FileSvc'))();

class Memberer {
  static async getMembers () {
    return JSON.parse(await FileSvc.getFileData('app/storage/members.json'));
  }
}

module.exports = Memberer;