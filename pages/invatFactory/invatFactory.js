// pages/invatFactory/invatFactory.js
const app = getApp();
const baseUrl = app.globalData.HOST;
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
  bindGetUserInfo: function (res) {
    let userInfo = res.detail.userInfo
    // wx.setStorageSync('userInfo',res.detail.userInfo)
    let _this = this
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: baseUrl + '/auth/login',
          method: "post",
          data: {
            "code": res.code
          },
          success: function (res) {
            let role_type = ''
            let user_id = ''
            if (res.data.data.data.isRegistered == false) {
              role_type = 4
            } else {
              role_type = res.data.data.data.user.role_type
              user_id = res.data.data.data.user._id
            }
            wx.setStorageSync('userInfo', Object.assign(userInfo, {
              role_type: role_type,
              user_id: user_id
            }))
            _this.jump()
          }
        })
      }
    })

  },
  jump: function () {
    wx.navigateTo({
      url: '/pages/regest/regest?invat_id=' + this.data.invat_id,
    })
  },
  backHome: function () {
    wx.reLaunch({
      url: '/pages/home/home',
    })
  },
  onLoad: function (options) {
    this.setData({
      invat_name: decodeURI(options.invat_name) || "溯源码",
      invat_id: options.invat_id || 0
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      path: "/pages/invatFactory/invatFactory?invat_id=" + this.data.invat_id + "&invat_name=" + this.data.invat_name
    }
  }
})