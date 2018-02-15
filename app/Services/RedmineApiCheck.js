const Requester = require('./Requester');
const Memberer = require('./Memberer');

class ApiService {

  constructor() {
    this.requesters = [];
    this.keys = [];
    this.memberer = new Memberer();

    for (let key in process.env) {
      if (key.match(/apiKey/g)) {
        this.keys.push(process.env[key]);
      }
    }

    for (let val of this.keys) {
      this.requesters.push(new Requester(val, process.env.apiUrl))
    }

  }

  async currentUsers() {
    let names = '';
    const data = [];
    this.requesters.forEach((el) => {
      data.push(el.makeRequest({ url: '/users/current.json' }));
    });

    const users = await Promise.all(data);
    users.forEach(item => names += names.length ? `, ${item.data.user.firstname}` : item.data.user.firstname);

    return names;
  }

  async getTodayEntries() {
    this.requests = [];
    this.res = [];
    const data = await this.memberer.getMembers();
    const date = new Date();
    data.low = {};
    const today = {
      year: date.getFullYear(),
      month: date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1),
      day: date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
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
      const ids = {};
      responses.forEach((item) => {
        for (const val of item.data.time_entries) {
          times.push(val);
        }
      });

      times = times.filter((item) => {
        if (ids[item.id]) {
          return false;
        }
        ids[item.id] = true;
        return true;

      });
      try {
        times.map((item) => {
          let hours = data[item.user.name] ? data[item.user.name].time : 0;
          data[item.user.name] = {
            time: hours + item.hours
          }
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