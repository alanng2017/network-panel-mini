const app = getApp();

Page({
  data: {
    devices: [],
    loading: true
  },

  onShow() {
    this.loadDevices();
  },

  loadDevices() {
    app.fetchStatus()
      .then((data) => {
        const clients = data.result.terminal_all.client || {};
        const list = Object.keys(clients).map(mac => {
          const item = clients[mac];
          return {
            mac: item.mac,
            ip: item.ipaddr.split(' ')[0],
            name: item.hostname || '未知设备',
            type: item.type === 'wireless' ? 'Wi-Fi' : '有线',
            rssi: item.rssi || '-',
            traffic: `${((item.rxbytes || 0) / 1024 / 1024).toFixed(1)} MB`
          };
        });

        this.setData({
          devices: list,
          loading: false
        });
      })
      .catch((err) => {
        this.setData({ loading: false });
        wx.showToast({ title: '加载失败', icon: 'none' });
      });
  }
});
