// pages/pay/pay.js
const app = getApp();
const baseUrl = app.globalData.HOST;
const userInfo = app.globalData.userInfo;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: baseUrl,
    id:'',
    imgSrc:'',
    trade:{
      sponsor:null,
      voucher:null,
      type:null,
      number:null
    },
  },

  commit: function () {
    let _this = this

  },

  onLoad: function (options) {
    let id = options.id
    let _this = this
    _this.data.id = id;
    _this.data.trade.type = "ALL_PAYED"
    wx.request({
      url: baseUrl + '/orders/' + id + '?embed=salesman',
      success: function (res) {
        let data = res.data.data.data
        _this.setData({
          goods: data, 
        })

      }
    })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})