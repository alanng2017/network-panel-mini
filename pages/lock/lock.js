const app = getApp();

Page({
  data: {
    lockConfig: {
      earfreq_mode: 'auto',
      band5: '5',
      custom_freq: '',
      custom_earfcn4: '',
      custom_earfcn5: '',
      earfcn4: '',
      earfcn5: '',
      earfcn4_mode: 'auto',
      earfcn5_mode: 'auto',
      pci4: '',
      pci5: ''
    },
    currentStatus: null,
    loading: true
  },

  onShow() {
    this.loadCurrentStatus();
  },

  loadCurrentStatus() {
    const cookie = wx.getStorageSync('deviceConfig')?.cookie || app.data.cookie;
    wx.request({
      url: 'http://192.168.66.1/cgi-bin/luci/nradio/cellular/cpestatus/earfcn?sim=1',
      header: { 'Cookie': cookie },
      success: (res) => {
        if (res.data && res.data.result) {
          this.setData({ currentStatus: res.data.result, loading: false });
        }
      },
      fail: () => {
        this.setData({ loading: false });
        wx.showToast({ title: '获取状态失败', icon: 'none' });
      }
    });
  },

  onEarfreqModeChange(e) {
    this.setData({ 'lockConfig.earfreq_mode': e.detail.value });
  },

  onBand5Change(e) {
    this.setData({ 'lockConfig.band5': e.detail.value });
  },

  onCustomFreqChange(e) {
    this.setData({ 'lockConfig.custom_freq': e.detail.value });
  },

  onEarfcn4Change(e) {
    this.setData({ 'lockConfig.earfcn4': e.detail.value });
  },

  onEarfcn5Change(e) {
    this.setData({ 'lockConfig.earfcn5': e.detail.value });
  },

  onEarfcn4ModeChange(e) {
    this.setData({ 'lockConfig.earfcn4_mode': e.detail.value });
  },

  onEarfcn5ModeChange(e) {
    this.setData({ 'lockConfig.earfcn5_mode': e.detail.value });
  },

  onPci4Change(e) {
    this.setData({ 'lockConfig.pci4': e.detail.value });
  },

  onPci5Change(e) {
    this.setData({ 'lockConfig.pci5': e.detail.value });
  },

  applyLock() {
    const cookie = wx.getStorageSync('deviceConfig')?.cookie || app.data.cookie;
    const data = this.data.lockConfig;
    
    wx.showLoading({ title: '应用中...' });
    wx.request({
      url: 'http://192.168.66.1/cgi-bin/luci/nradio/cellular/cpelock/model/cpe',
      method: 'POST',
      header: { 'Cookie': cookie },
      data: {
        'token': '4bebb4322b3b4cfa68712eea9950186b',
        'cbi.apply': '1',
        'cbid.cpecfg.cpesim1.earfreq_mode': data.earfreq_mode,
        'cbid.cpecfg.cpesim1.band5': data.band5,
        'cbid.cpecfg.cpesim1.custom_freq': data.custom_freq,
        'cbid.cpecfg.cpesim1.custom_earfcn4': data.custom_earfcn4,
        'cbid.cpecfg.cpesim1.custom_earfcn5': data.custom_earfcn5,
        'cbid.cpecfg.cpesim1.earfcn4': data.earfcn4,
        'cbid.cpecfg.cpesim1.earfcn5': data.earfcn5,
        'cbid.cpecfg.cpesim1.earfcn4_mode': data.earfcn4_mode,
        'cbid.cpecfg.cpesim1.earfcn5_mode': data.earfcn5_mode,
        'cbid.cpecfg.cpesim1.pci4': data.pci4,
        'cbid.cpecfg.cpesim1.pci5': data.pci5
      },
      success: () => {
        wx.hideLoading();
        wx.showModal({
          title: '已应用',
          content: '锁频段配置已生效，请查看状态确认',
          showCancel: false
        });
        this.loadCurrentStatus();
      },
      fail: () => {
        wx.hideLoading();
        wx.showModal({
          title: '应用失败',
          content: '请检查网络连接',
          showCancel: false
        });
      }
    });
  },

  scanCell() {
    const cookie = wx.getStorageSync('deviceConfig')?.cookie || app.data.cookie;
    wx.showLoading({ title: '扫描中...' });
    
    // 触发扫描
    wx.request({
      url: 'http://192.168.66.1/cgi-bin/luci/nradio/cellular/cpescan/scan_check',
      header: { 'Cookie': cookie },
      success: () => {
        // 等待2秒后获取扫描结果
        setTimeout(() => {
          wx.request({
            url: 'http://192.168.66.1/cgi-bin/luci/nradio/cellular/cpescan/scaninfo',
            header: { 'Cookie': cookie },
            success: (res) => {
              wx.hideLoading();
              if (res.data && res.data.result && res.data.result.neighbour) {
                wx.showModal({
                  title: '扫描完成',
                  content: `发现 ${res.data.result.neighbour.length} 个邻区`,
                  showCancel: false
                });
              } else {
                wx.showModal({
                  title: '扫描完成',
                  content: '未发现邻区',
                  showCancel: false
                });
              }
            },
            fail: () => {
              wx.hideLoading();
              wx.showModal({
                title: '获取结果失败',
                content: '请稍后重试',
                showCancel: false
              });
            }
          });
        }, 2000);
      },
      fail: () => {
        wx.hideLoading();
        wx.showModal({
          title: '扫描失败',
          content: '请检查网络连接',
          showCancel: false
        });
      }
    });
  }
});