const Requester = require('./Requester');

class ApiService {

  constructor() {
    this.requester = new Requester(process.env.apiKey, process.env.apiUrl)
  }

  get currentUser() {
    return this.requester.makeRequest({url: '/users/current.json'});
  }

  timeEntries(config) {
    return this.requester.makeRequest({url: '/time_entries.json', params: config})
  }

  async getTodayEntries() {
    const today = {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1),
      day: new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate()
    };
    const res = await this.requester.makeRequest({url: '/time_entries.json', params: {
      spent_on: `${today.year}-${today.month}-${today.day}`,
      limit: 200
    }});

    let data = {
      low: {}
    };

    res.data.time_entries.map((item) => {
      let hours = data[item.user.name] ? data[item.user.name].time : 0;
      data[item.user.name] = {
        time: hours += item.hours
      }
    });

    for(let key in data) {
      if(key !== 'low' && data[key] && data[key].time < 8) {
        data.low[key] = { time: 0 };
        data.low[key].time = data[key].time;
        delete data[key];
      }
    }

    return data;
  }

}

module.exports = ApiService;