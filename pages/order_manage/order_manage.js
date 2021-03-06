// pages/order_manage/order_manage.js
const app = getApp();
const baseUrl = app.globalData.HOST;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    all_goods: [],
    daibaojia_goods: [],
    daifukuan_goods: [],
    daifahuo_goods: [],
    yifahuo_goods: [],
    active: 0,
    title: ["全部", "待报价", "待付款", "待发货", "已发货"],
    userInfo: wx.getStorageSync('userInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function(options) {
    const userInfo = wx.getStorageSync('userInfo')
    this.setData({
      active: options.active || 0,
      userInfo,
      role_type: userInfo.role_type
    })
    this.getData()
  },

  getData: function(callback) {
    const _this = this
    wx.request({
      url: baseUrl + '/orders?embed=category',
      method: "get",
      header: {
        'content-type': 'application/json',
      },
      success: function(res) {
        // 厂家：全部、待报价、待付款、待发货、已发货
        // 平台：全部、待报价、待核收、待发货、已发货
        // 销售：全部、待报价、待付款、待发货、已发货
        let all = res.data.data.data.all
        let unQuoted = res.data.data.data.unQuoted
        let unSent = res.data.data.data.unSent
        let unReceived = res.data.data.data.unReceived
        let unPaid = res.data.data.data.unPaid // 厂家 销售  待付款（销售只是看看）
        let unCheck = res.data.data.data.unCheck //平台  待核收
        let unPaidOrUnCheck = unPaid
        if (_this.data.userInfo.role_type == "platform") {
          _this.setData({
            title: ["全部", "待报价", "待核收", "待发货", "已发货"]
          })
          unPaidOrUnCheck = unCheck
        }
        _this.setData({
          all_goods: all,
          daibaojia_goods: unQuoted,
          daifukuan_goods: unPaidOrUnCheck,
          daifahuo_goods: unSent,
          yifahuo_goods: unReceived
        })
        if (callback && typeof callback === 'function') callback()
      }
    })
  },

  onPullDownRefresh: function() {
    wx.showNavigationBarLoading()
    this.getData(() => {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
})