// pages/check/check.js
const app = getApp();
const baseUrl = app.globalData.HOST;
const util = require('../../utils/util.js')
const userInfo = wx.getStorageSync('userInfo')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    notice_text:'',
    baseUrl: baseUrl,
    banner: '',
    bind_goods: [],
    active: -1,
    id: '',
    key: '',
    steps: [],
    isOnwer:false,
    showCommit: true,
    isReceved: false,
    showBackHome:true
  },
  goToRight: function () {
    wx.navigateTo({
      url: '/pages/rights/rights?key=' + this.data.id + '&id=' + this.data.key,
    })
  },
  goHome: function () {
    wx.reLaunch({
      url: '/pages/home/home',
    })
  },
  commit: function () {
    wx.request({
      url: baseUrl + '/tracings/' + this.data.id,
      method: 'put',
      data: {
        operation: 'receive'
      },
      success: function (res) {
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
  onLoad: function (options) {
    let id = options.id || "01c825a971d647d89b05fd10d3f6090dca81ebd5125ea7167e6d9a39ceb1fd3e0a06dbc5b4e68b4c199fd48764e3a8d564abcf0e417d765f73f618e89f4042e4c2"
    this.data.id = id
    wx.request({
      url: baseUrl + '/tracings/' + id,
      success: res => {
        this.data.isOnwer = res.data.data.data.owner._id == wx.getStorageSync('userInfo').user_id ? true : false
        this.setData({
          key: res.data.data.data._id
        })
        let records = res.data.data.data.records;
        let steps_temp = []
        let banner = ''
        for (let i = 0; i < records.length; i++) {
          const sender = records[i].sender
          const name = sender[sender.role_type].name
          steps_temp[i] = {
            text: name,
            desc: util.convertUTCTimeToLocalTime(records[i].send_at),
          }
          if (i == records.length - 1) {
            banner = sender[sender.role_type].banner
          }
        }
        const owner = res.data.data.data.owner
        const state = res.data.data.data.state        
        let notice_text = ""
        if(state == "BIND"){
          notice_text="正品待售"
        }else if(state == "SEND"){
          if (records[records.length - 1].reciver_type =="consumer"){
            notice_text = "正品已出售时间:" + util.convertUTCTimeToLocalTime(records[records.length - 1].send_at)
          }else{
            notice_text = "正品待售"
          }
        } else if (state == "RECEIVED"){
          if (res.data.data.data.isEnd == true){
            notice_text = "正品签收时间:" + util.convertUTCTimeToLocalTime(records[records.length - 1].reciver_at)
          } else {
            notice_text = "正品待售"
          }
        }
        this.setData({
          bind_goods: res.data.data.data.products,
          steps: steps_temp,
          banner: banner,
          id: id,
          showCommit: res.data.data.data.owner._id == userInfo.user_id ? true : false,
          isReceved: state == "RECEIVED" ? true : false,
          notice_text: notice_text
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