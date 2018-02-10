const Requester = require('./Requester');
const Memberer = require('./Memberer');

class ApiService {

  constructor() {
    this.requesters = [];
    this.keys = [];

    for(let key in process.env) {
      if(key.match(/apiKey/g)) {
        this.keys.push(process.env[key]);
      }
    }

    for(let val of this.keys) {
      this.requesters.push(new Requester(val, process.env.apiUrl))
    }

  }

  async currentUsers() {
    let names = '';
    const data = [];
    this.requesters.forEach((el) => {
      data.push(el.makeRequest({url: '/users/current.json'}));
    });

    const users = await Promise.all(data);
    users.forEach(item => names += names.length ? `, ${item.data.user.firstname}` : item.data.user.firstname);

    return names;
  }

  async getTodayEntries() {
    this.requests = [];
    this.res = [];
    const data = await Memberer.getMembers();
    data.low = {};
    const today = {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1),
      day: new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate()
    };

    this.requesters.forEach((el) => {
      let req = el.makeRequest({
        url: '/time_entries.json', params: {
          spent_on: `${today.year}-${today.month}-${today.day}`,
          limit: 100
        }
      });
      this.requests.push(req);
    });
    return Promise.all(this.requests).then((responses) => {
      let times = [];
      responses.forEach(item => times.push(item.data.time_entries));
      try {
        times.forEach((item) => {
          item.map((item) => {
            let hours = data[item.user.name] ? data[item.user.name].time : 0;
            data[item.user.name] = {
              time: hours += item.hours
            }
          });
        });

        for (let key in data) {
          if (key !== 'low' && data[key] && data[key].time < 8) {
            data.low[key] = { time: 0 };
            data.low[key].time = data[key].time;
            delete data[key];
          }
        }
      } catch (err) {
        console.log(err);
      }

      return data;
    });

  }

}

module.exports = ApiService;