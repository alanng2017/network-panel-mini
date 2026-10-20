const app = getApp();

Page({
  data: {
    global: null,
    cpe: null,
    wlan: null,
    wans: [],
    signalLevel: '',
    signalLabel: '',
    uptime: '-',
    loading: true
  },

  onShow() {
    this.loadData();
    // 每5秒自动刷新
    if (this.timer) clearInterval(this.timer);
    this.timer = setInterval(() => this.loadData(), 5000);
  },

  onHide() {
    if (this.timer) clearInterval(this.timer);
  },

  onUnload() {
    if (this.timer) clearInterval(this.timer);
  },

  loadData() {
    app.fetchStatus()
      .then((data) => {
        const r = data.result;
        const cpe = r.cpe[0];
        const wlan = r.wlan.radio[0];
        const sig = app.signalLevel(cpe.rsrp);

        this.setData({
          global: r.global,
          cpe,
          wlan,
          wans: r.wans,
          signalLevel: sig.level,
          signalLabel: sig.label,
          uptime: app.formatUptime(r.global.uptime),
          loading: false
        });
      })
      .catch((err) => {
        console.error('加载失败:', err);
        this.setData({ loading: false });
        wx.showToast({ title: '连接失败，请检查网络', icon: 'none' });
      });
  },

  copySSID() {
    wx.setClipboardData({ data: this.data.wlan.ssid, showToast: true });
  },

  copyKey() {
    wx.setClipboardData({ data: this.data.wlan.key, showToast: true });
  }
});
