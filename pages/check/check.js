// pages/check/check.js
const app = getApp();
const baseUrl = app.globalData.HOST;
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    notice_text: '',
    baseUrl: baseUrl,
    banner: '',
    bind_goods: [],
    active: -1,
    id: '',
    key: '',
    steps: [],
    isOnwer: false,
    showCommit: false,
    isReceved: false,
    showBackHome: true,
    hasReseverInfo: false,
  },
  goToRight: function() {
    wx.navigateTo({
      url: '/pages/rights/rights?key=' + this.data.id + '&id=' + this.data.key,
    })
  },
  goHome: function() {
    wx.reLaunch({
      url: '/pages/home/home',
    })
  },
  commit: function() {
    wx.request({
      url: baseUrl + '/tracings/' + this.data.id,
      method: 'put',
      data: {
        operation: 'receive'
      },
      success: function(res) {
        if (res.data.code == 0) {
          wx.showToast({
            title: '确认成功',
            icon: 'success',
            duration: 2000,
            success: () => {
              wx.reLaunch({
                url: '/pages/home/home',
              })
            }
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let id = options.id || "015ceda323bfab56cdcdc640d69b7b31f164e65881d0f4291666b7d01744e9020e139ac1c08fbb152babcb966ba02b43d3bca2ec3e7d9daec220b6942183d38a01"
    this.data.id = id
    let _this = this
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.showLoading()
        wx.request({
          url: baseUrl + '/auth/login',
          method: "post",
          data: {
            "code": res.code
          },
          success: function(res) {
            let role_type = ''
            let user_id = ''
            const result = res.data.data.data
            if (result.isRegistered == false) {
              role_type = 4
            } else {
              role_type = result.user.role_type
              user_id = result.user._id
            }
            const userInfo = {
              role_type: role_type,
              user_id: user_id
            }
            wx.setStorageSync('userInfo', userInfo)
            wx.request({
              url: baseUrl + '/tracings/' + id,
              success: res => {
                wx.hideLoading()
                const result = res.data.data.data
                _this.data.isOnwer = result.owner._id == userInfo.user_id ? true : false
                _this.setData({
                  key: result._id
                })
                let records = result.records;
                const recordsLength = records.length
                const latestRecord = records.slice(recordsLength - 1, recordsLength)[0]
                let hasCommitRight = true // 如果收货人为商家，则验证是否为
                if (latestRecord.reciver_type === 'business') {
                  hasCommitRight = latestRecord.reciver === userInfo.user_id
                }
                let steps_temp = []
                let banner = ''
                for (let i = 0; i < records.length; i++) {
                  const sender = records[i].sender
                  const name = sender[sender.role_type].name
                  steps_temp[i] = {
                    text: records[i].express_name || name,
                    desc: records[i].express_no || util.convertUTCTimeToLocalTime(records[i].send_at),
                  }
                  if (i == records.length - 1) {
                    banner = sender[sender.role_type].banner
                    _this.setData({
                      hasReseverInfo: records[i].reciver_name ? true : false
                    })
                  }
                }
                const owner = result.owner
                const state = result.state
                let notice_text = ""
                if (latestRecord.sender._id === userInfo.user_id & state === 'SEND') {
                  wx.showToast({
                    title: '您已发货，只能查看溯源码详情',
                    icon: 'none',
                    duration: 3000
                  })
                }
                if (state == "BIND") {
                  notice_text = "正品待售"
                } else if (state == "SEND") {
                  if (latestRecord.reciver_type == "consumer") {
                    notice_text = "正品在" + util.getHours(latestRecord.send_at) + "小时前被出售"
                  } else {
                    notice_text = "正品待售"
                  }
                } else if (state == "RECEIVED") {
                  if (res.data.data.data.isEnd == true) {
                    notice_text = "正品在:" + util.getHours(latestRecord.reciver_at) + "小时前被签收"
                  } else {
                    notice_text = "正品待售"
                  }
                }
                _this.setData({
                  bind_goods: result.products,
                  steps: steps_temp,
                  banner: banner,
                  id: id,
                  showCommit: ["SEND", "EXPRESSED"].includes(state) && hasCommitRight ? true : false,
                  isReceved: state == "RECEIVED" ? true : false,
                  notice_text: notice_text,
                })
              },
              fail: () => {
                wx.hideLoading()
              }
            })
          }
        })
      }
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

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

  }
})