// pages/invataFactory/invatFactory.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    invat_id: '',
    invat_name: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  jump: function () {
    wx.navigateTo({
      url: '/pages/regest/regest',
    })
  },
  onLoad: function (options) {
    this.setData({
      invat_name: decodeURI(options.invat_name) || "溯源码",
      invat_id: options.invat_id
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      path: "/pages/factory/factory?invat_id=" + this.data.invat_id + "&invat_name=" + this.data.invat_name
    }
  }
})