// pages/invatSalesman/invatSalesman.js
const app = getApp();
const baseUrl = app.globalData.HOST;
Page({

  /**
   * 页面的初始数据
   */
  data: {

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
      url: '/pages/regest/regest',
    })
  },
  jump:function(){
    wx.navigateTo({
      url: '/pages/regest/partner_regest/partner_regest',
    })
  },
  backHome:function(){
    wx.reLaunch({
      url: '/pages/home/home',
    })
  },
  onLoad: function (options) {

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