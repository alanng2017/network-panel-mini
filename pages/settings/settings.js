Page({
  data: {
    apiHost: 'http://192.168.66.1',
    apiPath: '/cgi-bin/luci/nradio/status/runtime/wan,cpe,cpe_4,cpe_6,cpe1,cpe1_4,cpe1_6',
    cookie: 'sysauth=aba068e8249c4d1b8e13442f89ce43b7',
    refreshInterval: 5
  },

  onLoad() {
    const config = wx.getStorageSync('deviceConfig');
    if (config) {
      this.setData({
        apiHost: config.apiHost || this.data.apiHost,
        apiPath: config.apiPath || this.data.apiPath,
        cookie: config.cookie || this.data.cookie,
        refreshInterval: config.refreshInterval || 5
      });
    }
  },

  onApiHostChange(e) {
    this.setData({ apiHost: e.detail.value });
  },

  onApiPathChange(e) {
    this.setData({ apiPath: e.detail.value });
  },

  onCookieChange(e) {
    this.setData({ cookie: e.detail.value });
  },

  onIntervalChange(e) {
    this.setData({ refreshInterval: e.detail.value });
  },

  saveConfig() {
    wx.setStorageSync('deviceConfig', {
      apiHost: this.data.apiHost,
      apiPath: this.data.apiPath,
      cookie: this.data.cookie,
      refreshInterval: this.data.refreshInterval
    });
    wx.showModal({
      title: '已保存',
      content: '配置已保存，重启小程序后生效',
      showCancel: false
    });
  },

  testConnection() {
    wx.showLoading({ title: '测试中...' });
    const app = getApp();
    app.fetchStatus()
      .then((data) => {
        wx.hideLoading();
        wx.showModal({
          title: '连接成功',
          content: `设备型号: ${data.result.cpe[0].model}`,
          showCancel: false
        });
      })
      .catch((err) => {
        wx.hideLoading();
        wx.showModal({
          title: '连接失败',
          content: '请检查 IP 地址和 Cookie 是否正确',
          showCancel: false
        });
      });
  }
});