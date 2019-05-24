// pages/home/home.js
const app = getApp();
const baseUrl = app.globalData.HOST;
const userInfo = wx.getStorageSync('userInfo')


Page({
  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    home_type: userInfo.role_type  //1显示商家首页，2显示平台账号首页，3显示销售首页，4显示无账号首页，5显示快递员首页
  },
  bindGetUserInfo:function(res){
    console.log(res)
    wx.setStorageSync('userInfo',res.detail.userInfo)
    let _this = this
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        // console.log(res)
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
            }
            else {
              role_type = res.data.data.data.user.role_type
              user_id = res.data.data.data.user._id
            }

            // 获取用户信息
            wx.getSetting({
              success: res => {
                if (res.authSetting['scope.userInfo']) {

                  // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                  wx.getUserInfo({
                    success: res => {
                      // 可以将 res 发送给后台解码出 unionId
                      
                      // _this.globalData.userInfo = res.userInfo
                      // _this.globalData.userInfo.role_type = role_type
                      wx.setStorageSync('userInfo', Object.assign(res.userInfo, { role_type: role_type, user_id: user_id }))
                      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                      // 所以此处加入 callback 以防止这种情况
                      if (_this.userInfoReadyCallback) {
                        _this.userInfoReadyCallback(res)
                      }
                      wx.reLaunch({
                        url: '/pages/home/home',
                      })
                    }
                  })
                }
              }
            })
          }
        })
      }
    })
    
  },
 // 二维码扫描验货
  check: function () {
    var _this = this;
    // 允许从相机和相册扫码
    wx.scanCode({
      success: (res) => {
        console.log(res)
        wx.navigateTo({
          url: '/pages/check/check',
        })
      }
    })
    },
  //发货  
  send: function () {
    var _this = this;
    // 允许从相机和相册扫码
    wx.scanCode({
      success: (res) => {
        wx.navigateTo({
          url: '/pages/send/send'
          
        })
      }
    })
  },
  //跳转到店铺
  jump:function(){
    wx.navigateTo({
      url: '/pages/business_card/business_card',
    })
  },
  //跳转到溯源大数据页
  goToBigData:function(){
    wx.navigateTo({
      url: '/pages/bigdata/bigdata',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    // 所以此处加入 callback 以防止这种情况
    let _this = this;
    app.userInfoReadyCallback = res => {
      console.log(res)
      this.setData({
        userInfo: res,
      })
      // 确认用户类型
      _this.setData({
        home_type: res.role_type || 4
      })
    }
    // 确认用户类型
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo){
      _this.setData({
        home_type: userInfo.role_type || 4,
        canIUse:false
      })
    }
    
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