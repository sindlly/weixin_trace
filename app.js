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
        wx.request({
          url: _this.globalData.ROOTPATH +'/auth/login',
          method:"post",
          data:{
            "code": res.code
          },
          success:function(res){
            let role_type = ''
            let user_id = ''
            const respData = res.data.data.data
            console.log(res)
            if (respData.isRegistered == false){
              role_type = 4
            } else{
              role_type = respData.user.role_type
              user_id = respData.user.user_id
            }
            // 获取用户信息
            wx.getSetting({
              success: res => {
                if (res.authSetting['scope.userInfo']) {
                  // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                  wx.getUserInfo({
                    success: res => {
                      _this.globalData.userInfo = res.userInfo
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
      role_type: 0
    },
    ROOTPATH: 'https://buildupstep.cn/api',
    HOST: 'https://buildupstep.cn/api',
    DEFAULT_IMG: '38ec2f40-f352-11e7-b5f3-c93673e5d7ba'
  }
})