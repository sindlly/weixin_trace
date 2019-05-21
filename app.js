//app.js
import './miniprogram_npm/weapp-cookie/index'
// let cookie = cookies.set('uid', 100, { domain: '/' })
App({
  onLaunch: function () {
    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
   

    // 登录
    let _this = this
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        // console.log(res)
        wx.request({
          url: _this.globalData.ROOTPATH +'/auth/login',
          method:"post",
          data:{
            "code": res.code
          },
          success:function(res){
            let role_type = ''
            if(res.data.data.data.isRegistered == false){
              user_type = 4
            }
            else{
              role_type = res.data.data.data.user.role_type
            }
            let user_id = res.data.data.data.user._id
            // 获取用户信息
            wx.getSetting({
              success: res => {
                if (res.authSetting['scope.userInfo']) {
                  // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                  wx.getUserInfo({
                    success: res => {
                      // 可以将 res 发送给后台解码出 unionId
                      // if (!res.userInfo.user_id) res.userInfo.user_id = "5cc552a3db479568fc30f0c3"  //厂家用户
                      // if (!res.userInfo.user_id) res.userInfo.user_id = "5cd8dc23e3a2d04ec0911fdd"  //平台用户
                      _this.globalData.userInfo = res.userInfo
                      // _this.globalData.userInfo.role_type = role_type
                      wx.setStorageSync('userInfo', Object.assign(_this.globalData.userInfo, { role_type: role_type, user_id: user_id}))
                      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                      // 所以此处加入 callback 以防止这种情况
                      if (_this.userInfoReadyCallback) {
                        _this.userInfoReadyCallback(res)
                      }
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
  globalData: {
    userInfo: {
      user_id:'5cc552a3db479568fc30f0c3',
      user_type: 0
    },
    ROOTPATH: 'http://buildupstep.cn/api',
    HOST: 'http://buildupstep.cn/api',
    DEFAULT_IMG: '38ec2f40-f352-11e7-b5f3-c93673e5d7ba'
  }
})