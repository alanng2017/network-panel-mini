App({
  data: {
    // API 配置
    apiHost: 'http://192.168.66.1',
    apiPath: '/cgi-bin/luci/nradio/status/runtime/wan,cpe,cpe_4,cpe_6,cpe1,cpe1_4,cpe1_6',
    cookie: 'sysauth=aba068e8249c4d1b8e13442f89ce43b7',
    loggedIn: false
  },

  onLaunch() {
    // 检查本地存储的设备配置
    const config = wx.getStorageSync('deviceConfig');
    if (config) {
      this.data.apiHost = config.apiHost || this.data.apiHost;
      this.data.apiPath = config.apiPath || this.data.apiPath;
      this.data.cookie = config.cookie || this.data.cookie;
    }
  },

  // 通用 API 请求方法
  fetchStatus() {
    return new Promise((resolve, reject) => {
      const url = this.data.apiHost + this.data.apiPath;
      wx.request({
        url,
        header: {
          'Cookie': this.data.cookie,
          'Content-Type': 'application/json'
        },
        success: (res) => {
          if (res.statusCode === 200) {
            this.data.loggedIn = true;
            resolve(res.data);
          } else {
            this.data.loggedIn = false;
            reject(new Error('HTTP ' + res.statusCode));
          }
        },
        fail: (err) => {
          this.data.loggedIn = false;
          reject(err);
        }
      });
    });
  },

  // 格式化运行时间
  formatUptime(seconds) {
    if (!seconds) return '-';
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (d > 0) return `${d}天${h}时`;
    if (h > 0) return `${h}时${m}分`;
    return `${m}分`;
  },

  // 信号强度分级
  signalLevel(rsrp) {
    if (rsrp > -80) return { level: 'good', label: '强' };
    if (rsrp > -95) return { level: 'medium', label: '中' };
    return { level: 'weak', label: '弱' };
  }
});
