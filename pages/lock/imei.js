const app = getApp();

Page({
  data: {
    imei: '',
    imsi: '',
    iccid: '',
    currentImei: '',
    newImei: '',
    pinMode: 'query',
    pin: '',
    puctr: '',
    newPin: '',
    loading: true
  },

  onShow() {
    this.loadImei();
  },

  loadImei() {
    const config = wx.getStorageSync('deviceConfig');
    const host = config?.apiHost || app.data.apiHost;
    const cookie = config?.cookie || app.data.cookie;

    // 从 runtime 接口拿完整串号信息
    wx.request({
      url: host + (config?.apiPath || app.data.apiPath),
      header: { 'Cookie': cookie },
      success: (res) => {
        if (res.data && res.data.result && res.data.result.cpe && res.data.result.cpe[0]) {
          const cpe = res.data.result.cpe[0];
          this.setData({
            imei: cpe.imei || '',
            imsi: cpe.imsi || '',
            iccid: cpe.iccid || '',
            currentImei: cpe.imei || '',
            newImei: cpe.imei || '',
            loading: false
          });
        } else {
          this.setData({ loading: false });
        }
      },
      fail: () => {
        this.setData({ loading: false });
        wx.showToast({ title: '获取失败', icon: 'none' });
      }
    });
  },

  onNewImeiChange(e) {
    this.setData({ newImei: e.detail.value });
  },

  onPinChange(e) {
    this.setData({ pin: e.detail.value });
  },

  onNewPinChange(e) {
    this.setData({ newPin: e.detail.value });
  },

  copyField(e) {
    const field = e.currentTarget.dataset.field;
    const value = this.data[field];
    wx.setClipboardData({ data: value || '', showToast: true });
  },

  // IMEI 校验（Luhn 算法）
  validImei() {
    const imei = this.data.newImei;
    if (imei.length !== 15 || !/^\d+$/.test(imei)) return false;
    let sum = 0;
    for (let i = 0; i < 14; i++) {
      let d = imei[13 - i] - '0';
      if (i % 2 === 1) {
        d *= 2;
        if (d > 9) d -= 9;
      }
      sum += d;
    }
    return (sum + (imei[14] - '0')) % 10 === 0;
  },

  // 查询当前 IMEI/PIN 状态
  queryImei() {
    const config = wx.getStorageSync('deviceConfig');
    const host = config?.apiHost || app.data.apiHost;
    const cookie = config?.cookie || app.data.cookie;

    wx.showLoading({ title: '查询中...' });
    wx.request({
      url: host + '/cgi-bin/luci/nradio/cellular/cpestatus/earfcn?sim=1',
      header: { 'Cookie': cookie },
      success: () => {
        // 实际 IMEI 查询走 runtime 接口，这里刷新
        wx.hideLoading();
        this.loadImei();
        wx.showToast({ title: '已刷新', icon: 'success' });
      },
      fail: () => {
        wx.hideLoading();
        wx.showModal({ title: '查询失败', content: '请检查连接', showCancel: false });
      }
    });
  },

  // 修改 IMEI
  changeImei() {
    const newImei = this.data.newImei;
    if (!this.validImei()) {
      wx.showModal({
        title: 'IMEI 格式错误',
        content: 'IMEI 必须是 15 位数字且通过 Luhn 校验',
        showCancel: false
      });
      return;
    }

    const config = wx.getStorageSync('deviceConfig');
    const host = config?.apiHost || app.data.apiHost;
    const cookie = config?.cookie || app.data.cookie;

    wx.showModal({
      title: '确认修改 IMEI',
      content: `确定将 IMEI 修改为 ${newImei} 吗？\n(需要重启 modem 生效)`,
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({ title: '修改中...' });
          wx.request({
            url: host + '/cgi-bin/luci/nradio/cellular/cpepin/model/cpe',
            method: 'POST',
            header: { 'Cookie': cookie },
            data: {
              'token': '4bebb4322b3b4cfa68712eea9950186b',
              'cbi.apply': '1',
              'cbid.cpecfg.cpesim1.imei': newImei
            },
            success: () => {
              wx.hideLoading();
              wx.showModal({
                title: '已提交',
                content: 'IMEI 已提交，重启 modem 后生效',
                showCancel: false
              });
            },
            fail: () => {
              wx.hideLoading();
              wx.showModal({
                title: '修改失败',
                content: '请检查网络连接',
                showCancel: false
              });
            }
          });
        }
      }
    });
  }
});
