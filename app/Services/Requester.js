const axios = require('axios');

let instance = null;

class Requester {
  /**
   * Singleton constructor
   * @param apiKey
   * @param apiUrl
   * @returns {*}
   */
  constructor(apiKey, apiUrl) {
    if(!instance) {
      instance = this;
    }
    this.instance = axios.create({
      baseURL: apiUrl,
      timeout: 10000,
      headers: {'X-Redmine-API-Key': apiKey}
    });

    return instance;
  }

  /**
   * Request through axios
   * @param config
   * @returns {Promise.<*|AxiosPromise<any>>}
   */
  async makeRequest(config) {
    return this.instance.request(config);
  }
}

module.exports = Requester;