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
    hasMoreList: true,
    paginationPars: {
      limit: 10, offset: 0, sortByState: false, sort: '-created_at',
      embed: 'product,reciver,sender'
    },
    // results: ['误把新包装当做假货', '其它']
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
        {limit, offset, sortByState, sort, embed} = paginationPars;
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
        if (item.products.length === 0) {
          item.logo = '../../../img/default_logo.png';
        }
        item.lastRecord = {};
        if (item.records.length > 0) {
          item.lastRecord = item.records.slice(-1)[0];
          let send_time = new Date(item.lastRecord.send_at),
              year = send_time.getFullYear(),
              month = send_time.getMonth() + 1,
              day = send_time.getDate(),
              hour = send_time.getHours(),
              minute = send_time.getMinutes();
          hour = hour > 9 ? hour : '0' + hour;
          minute = minute > 9 ? minute : '0' + minute;
          item.lastRecord.send_at_display = `${year}/${month}/${day} ${hour}:${minute}`;
        }
        item.lastRecord.is_business = item.lastRecord.reciver_type === 'business';
        return item;
      });
    }
    wx.request({
      url: `${baseUrl}/tracings?owner=${user_id}&limit=${limit}&offset=${offset}&sortByState=${sortByState}&sort=${sort}&embed=${embed}`,
      success: res => {
        console.log(res);
        let {count} = res.data.data.meta;
        const data = format(res.data.data.data);
        this.data.hasMoreList = limit + offset < count;
        let newPaginationPars = Object.assign(
            {}, paginationPars, {offset: offset + limit}
        );
        this.setData({
          tracingList: [...tracingList, ...data],
          paginationPars: newPaginationPars
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
    if (this.data.hasMoreList) {
      this.getTracingsData();
    } else {
      console.log('没有更多');
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  }
});
