// pages/mySalesInfo/mySalesInfo.js
const app = getApp();
const baseUrl = app.globalData.HOST;
const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    salesman:{},
    updated_at:'',
    baseUrl: baseUrl,
    factoryNum:'',
    factories:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = wx.getStorageSync('userInfo').user_id
    wx.request({
      url: baseUrl+'/users/'+id+"/sales",
      success:res=>{
        this.setData({
          salesman:res.data.data.data.user.salesman,
          updated_at: util.convertUTCTimeToLocalTime(res.data.data.data.user.updated_at),
          factoryNum: res.data.data.data.factory
        })
      }
    })
    wx.request({
      url: baseUrl + '/users/' + id + "/factories",
      success: res => {
        this.setData({
          factories:res.data.data.data.users
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