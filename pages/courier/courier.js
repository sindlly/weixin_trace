// pages/courier/courier.js
const app = getApp();
const baseUrl = app.globalData.HOST;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: baseUrl,
    id:'',
    scode:'',
    name: ''
  },
  getScode:function(){
    const _this = this;
    // 允许从相机和相册扫码
    wx.scanCode({
      success: (res) => {
        _this.setData({
          scode:res.result
        })
      }
    })
  },
  nameInput: function(event) {
    this.setData({name: event.detail})
  },
  scodeInput: function (event) {
    this.setData({ scode: event.detail })
  },
  commit: function() {
    const express = {}
    express.id = this.data.scode;
    express.name = this.data.name;
    wx.request({
      url: baseUrl + '/orders/' + this.data.id,
      method: 'PUT',
      data: {
        status: 'SHIPPED',
        express,
      },
      header: {
        'content-type': 'application/json',
        // 'access_token': $data.token,
      },
      success: function (res) {
        wx.navigateTo({
          url: '/pages/order_manage/order_manage?active=4',
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id
    let _this = this
    _this.data.id = id;
    
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