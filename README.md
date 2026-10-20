# 网络面板 - 随身WiFi管理小程序

基于微信小程序框架，用于管理 NU313-M2 (4G/5G CPE) 随身WiFi设备。

## 功能

### 1. 状态页
- 实时显示 CPU/内存/温度/运行时间
- 蜂窝信号强度 (RSRP/SINR/频段/网络模式)
- Wi-Fi SSID/密码/信道

### 2. 设备页
- 列出所有已连接终端（有线/无线）
- 显示设备名、IP、MAC、信号强度、流量

### 3. 锁频段/锁小区（高级功能）
- 查看当前锁定状态（LTE/NR 的 BAND/EARFCN/PCI）
- 锁定频段配置（频段锁定模式、5G 频段、自定义频率）
- 锁定 EARFCN 和 PCI
- 扫描邻区基站

### 4. 串号查看修正（高级功能）
- 查看 IMEI/IMSI/ICCID
- 修改 IMEI（支持 Luhn 校验）
- 一键复制串号

### 5. 设置页
- 配置 API 地址、Cookie、刷新间隔
- 测试连接

## 使用方法

1. 用微信开发者工具打开项目
2. 确保手机能访问到随身 WiFi 的管理后台 (192.168.66.1)
3. 在设置页配置 API 主机地址
4. 从浏览器登录路由器后复制 Cookie 粘贴到设置页
5. 运行小程序

## 项目结构

```
├── app.js                 # 全局配置和 API 封装
├── app.json               # 页面和 tabbar 配置
├── app.wxss               # 全局样式
├── project.config.json    # 微信开发者工具配置文件
├── README.md              # 使用说明与配置指南
└── pages/
    ├── index/             # 状态页
    │   ├── index.js
    │   ├── index.wxml
    │   └── index.wxss
    ├── devices/           # 设备页
    │   ├── devices.js
    │   ├── devices.wxml
    │   └── devices.wxss
    ├── lock/              # 锁频段页
    │   ├── lock.js
    │   ├── lock.wxml
    │   └── lock.wxss
    │   └── imei/          # 串号查看修正页
    │       ├── imei.js
    │       ├── imei.wxml
    │       └── imei.wxss
    └── settings/          # 设置页
        ├── settings.js
        ├── settings.wxml
        └── settings.wxss
```

## 注意事项

- 需要手机和随身 WiFi 在同一局域网内
- 使用 HTTPS 或 局域网 HTTP 需要在微信开发者工具中取消"不校验合法域名"选项
- 如果连接失败，检查：
  - API 主机地址是否正确
  - Cookie 是否过期 (需要重新登录)
  - 手机是否在同一网络段

## 高级功能说明

### 锁频段/锁小区
通过 `/cgi-bin/luci/nradio/cellular/cpelock/model/cpe` 接口可以锁定频段和小区，减少设备在不同基站间切换。

### 串号查看修正
通过 `/cgi-bin/luci/nradio/cellular/cpepin/model/cpe` 接口可以查看和修改 IMEI。修改 IMEI 需要确保新的 IMEI 符合 Luhn 校验算法。