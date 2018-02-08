const fs = require('fs');

class FileSvc {
  getFileData(path) {
    return new Promise((resolve, reject) => {
      fs.readFile(path, 'utf-8', (err, data) => {
        if(err) reject(err);
        resolve(data);
      })
    })
  }

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