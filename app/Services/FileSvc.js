const fs = require('fs');
const path = require('path');
class FileSvc {

  /**
   * Get file
   * @param pathTo
   * @returns {Promise}
   */
  getFileData(pathTo) {
    return new Promise((resolve, reject) => {
      fs.readFile(path.resolve(pathTo), 'utf-8', (err, data) => {
        if(err) reject(err);
        resolve(data);
      })
    })
  }

  /**
   * Write to file
   * @param path
   * @param data
   * @returns {Promise}
   */
  writeFile(path, data) {
    return new Promise((resolve, reject) => {
      fs.writeFile(path, data, (err) => {
        if (err) reject(err);
        resolve();
      });
    })
  }
}

module.exports = FileSvc;