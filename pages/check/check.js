// pages/check/check.js
const app = getApp();
const baseUrl = app.globalData.HOST;
const util = require('../../utils/util.js')
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
      
    ]
  },
  commit:function(){
    wx.request({
      url: baseUrl + '/tracings/' + this.data.id,
      method: 'put',
      data: {
        operation :'receive'
      },
      success: function () {
        wx.reLaunch({
          url: '/pages/home/home',
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id || '0110c64a7cb7f8048e6a1071095c3926d64209dfe2e600c021616b15aa5b7a088c385a526970c3910e249d847e61f90248935ca77aa733019dccf880b3adb97ed9'
    this.data.id = id
    wx.request({
      url: baseUrl + '/tracings/' + id,
      success: res => {
        let records = res.data.data.data.records;
        let steps_temp = []
        for(let i=0;i<records.length;i++){
          const sender = records[i].sender 
          const name = sender[sender.role_type].name
          steps_temp[i] ={
            text: name,
            desc: util.convertUTCTimeToLocalTime(records[i].send_at),
          }
          // if (i == records.length -1){
          //   steps_temp[i+1] = {
          //     text: records[i].reciver,
          //   }
          // }
        }
        const owner = res.data.data.data.owner
        const banner = owner[owner.role_type].banner
        this.setData({
          bind_goods: res.data.data.data.products,
          steps: steps_temp,
          banner:banner,
          id:id
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