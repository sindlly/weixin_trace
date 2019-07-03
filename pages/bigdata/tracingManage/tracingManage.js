// pages/bigdata/bigdata.js
const app = getApp();
const baseUrl = app.globalData.HOST;
const userInfo = wx.getStorageSync('userInfo');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    baseUrl: baseUrl,
    // count: 0,
    // counterfeits: [],
    statistics: {},
    tracingList: [],
    paginationPars: {limit: 10, offset: 0, sortByState: false, sort: '-created_at'},
    results: ['误把新包装当做假货', '其它']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const userInfo = wx.getStorageSync('userInfo');
    console.log(userInfo);
    this.setData({userInfo: userInfo});
    this.getStatisticsData();
    this.getTracingsData();
  },

  /**
   * 获取溯源码使用情况的接口
   */
  getStatisticsData: function () {
    const {baseUrl, userInfo} = this.data,
        {user_id} = userInfo;
    wx.request({
      url: `${baseUrl}/users/${user_id}/statistics`,
      success: res => {
        console.log('getStatisticsData');
        console.log(res);
        const data = res.data.data.data.data;
        this.setData({statistics: data});
      }
    });
  },

  /**
   * 获取溯源码列表的接口
   */
  getTracingsData: function () {
    const {baseUrl, userInfo, tracingList, paginationPars} = this.data,
        {user_id} = userInfo,
        {limit, offset, sortByState, sort} = paginationPars;
    const format = data => {
      return data.map(item => {
        if (item.state === 'BIND') {
          item.state_display = '已绑定';
        } else if (item.state === 'RECEIVED') {
          item.state_display = '已签收';
        } else {
          // SEND EXPRESSED
          item.state_display = '已发货';
        }
        item.lastRecord = {};
        if (item.records.length > 0) {
          item.lastRecord = item.records.slice(-1);
          let send_time = new Date(item.send_at),
              year = send_time.getFullYear(),
              month = send_time.getMonth() + 1,
              day = send_time.getDate(),
              hour = send_time.getHours(),
              minute = send_time.getMinutes();
          hour = hour > 9 ? hour : '0' + hour;
          minute = minute > 9 ? minute : '0' + minute;
          item.lastRecord.send_at_display = `${year}/${month}/${day} ${hour}:${minute}`;
        }
        return item;
      });
    }
    wx.request({
      url: `${baseUrl}/tracings?owner=${user_id}&limit=${limit}&offset=${offset}&sortByState=${sortByState}&sort=${sort}`,
      success: res => {
        console.log('getTracingsData');
        console.log(res);
        const data = format(res.data.data.data);
        this.setData({
          tracingList: [...tracingList, ...data]
        });
      }
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getTracingsData();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  }
});
