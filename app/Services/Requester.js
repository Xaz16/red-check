const axios = require('axios');

class Requester {
  /**
   * Creating own instance of axios
   * @param apiKey
   * @param apiUrl
   * @returns {*}
   */
  constructor(apiKey, apiUrl) {
    this.instance = axios.create({
      baseURL: apiUrl,
      timeout: 10000,
      headers: {'X-Redmine-API-Key': apiKey}
    });
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