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
    baseUrl: baseUrl,
    banner:'',
    bind_goods:[],
    active: -1,
    id:"",
    steps: [
    ],
    showCommit: true,
    isReceved:false,
  },
  goToRight:function(){
    wx.navigateTo({
      url: '/pages/rights/rights?key='+this.data.id,
    })
  },
  goHome:function(){
    wx.reLaunch({
      url: '/pages/home/home',
    })
  },
  commit:function(){
    wx.request({
      url: baseUrl + '/tracings/' + this.data.id,
      method: 'put',
      data: {
        operation :'receive'
      },
      success: function (res) {
        if(res.data.code == 0){
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
    let id = options.id || "01ff3972349cc4ddd49e47dc36af04d2048c7b712d74eafb975225d36d235d6b85dea3810744a80e5b454c07d1b232bda844f540b9eaec933ee8459b82a3ad6ef8"
    this.data.id = id
    wx.request({
      url: baseUrl + '/tracings/' + id,
      success: res => {
        let records = res.data.data.data.records;
        let steps_temp = []
        let banner = ''
        for(let i=0;i<records.length;i++){
          const sender = records[i].sender 
          const name = sender[sender.role_type].name
          steps_temp[i] ={
            text: name,
            desc: util.convertUTCTimeToLocalTime(records[i].send_at),
          }
          if (i == records.length -1){
            banner = sender[sender.role_type].banner
          }
        }
        const owner = res.data.data.data.owner
        // const banner = owner[owner.role_type].banner
        this.setData({
          bind_goods: res.data.data.data.products,
          steps: steps_temp,
          banner:banner,
          id:id,
          showCommit: res.data.data.data.owner._id == userInfo.user_id ? true : false,
          isReceved: res.data.data.data.state == "RECEIVED"?true:false
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