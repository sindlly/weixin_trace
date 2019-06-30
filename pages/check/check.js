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
    showDetail: false,
    hasRight: false,
    showDialog: false,
    firstGoods: {},
    goodsTotal: 0,
    disableSignButton: true
  },
  goToRight: function() {
    wx.navigateTo({
      url: '/pages/rights/rights?key=' + this.data.id + '&id=' + this.data.key,
    })
  },
  onClose: function(event) {
    if (event.detail !== 'confirm') {
      wx.showToast({
        title: '未授权获取手机号，无法查看溯源详情',
        icon: 'none',
        duration: 2000,
        success: function() {
          setTimeout(() => {
            wx.navigateTo({
              url: '/pages/home/home',
            })
          }, 2000)
        }
      })
    }
  },
  goHome: function() {
    wx.reLaunch({
      url: '/pages/home/home',
    })
  },
  goIntro: function() {
    wx.navigateTo({
      url: "/pages/intro/intro",
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
  getPhoneNumber: function(res) {
    const _this = this;
    const {
      encryptedData,
      iv
    } = res.detail
    wx.request({
      url: baseUrl + '/mini_program/user_info/phone',
      method: "post",
      data: {
        encryptedData,
        iv
      },
      success: function(res) {
        wx.reLaunch({
          url: `/pages/check/check?id=${_this.data.id}`,
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let id = options.id || "0156239c0e71cdc922f1377521278ee0d58e6ab4847d53d698c0ec51811dabd2e468fe0fbf50c2fa3b6135ca950783da29e0f5186465d477c9670b139cdc9ab004"
    this.data.id = id
    const _this = this
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
              role_type = 4,
              user_id = result.user._id
            } else {
              role_type = result.user.role_type
              user_id = result.user._id
            }
            const userInfo = {
              role_type: role_type,
              user_id: user_id,
              wechat_phone: result.user.wechat_phone
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
                // if (recordsLength === 0 || ['BIND', 'UNBIND'].includes(result.state)) {
                //   wx.showToast({
                //     title: '未发货，无法查看溯源码详情',
                //     icon: 'none',
                //     duration: 3000
                //   })
                //   return
                // } else {
                  _this.setData({
                    showDetail: true
                  })
                  wx.showToast({
                    title: '主人好，请鉴',
                    icon: 'none',
                    duration: 3000
                  })
                // }
                const latestRecord = records.slice(recordsLength - 1, recordsLength)[0] || {sender: {}}
                let hasCommitRight = true
                let disableSignButton = true
                if (latestRecord & latestRecord.reciver_type & latestRecord.reciver_type === 'business') {
                  hasCommitRight = latestRecord.reciver === userInfo.user_id
                  disableSignButton = false
                } else {
                  // 若为消费者，则判断是否需要获取手机号
                  if (latestRecord & latestRecord.reciver_phone) {
                    // 指定了收货人电话
                    if (userInfo.wechat_phone) {
                      hasCommitRight = latestRecord.reciver_phone === userInfo.wechat_phone
                      disableSignButton = !hasCommitRight
                    } else {
                      _this.setData({
                        showDialog: true
                      })
                    }
                  } else {
                    hasCommitRight = latestRecord & latestRecord.sender !== userInfo.user_id
                    disableSignButton = false
                  }
                }
                let steps_temp = []
                const owner = result.owner
                let banner = owner[owner.role_type].banner
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
                const state = result.state
                let notice_text = ""
                if (latestRecord.sender & latestRecord.sender._id === userInfo.user_id & state === 'SEND') {
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
                  if (owner._id === userInfo.user_id) _this.setData({
                    hasRight: true
                  })
                  if (res.data.data.data.isEnd == true) {
                    notice_text = "正品在:" + util.getHours(latestRecord.reciver_at) + "小时前被签收"
                  } else {
                    notice_text = "正品待售"
                  }
                }
                _this.setData({
                  bind_goods: result.products,
                  firstGoods: result.products[0],
                  goodsTotal: result.products.length,
                  steps: steps_temp,
                  banner: baseUrl + "/files/" + banner,
                  id,
                  disableSignButton,
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