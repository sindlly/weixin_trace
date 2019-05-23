// pages/scode_manage/scode_manage.js
const app = getApp();
const baseUrl = app.globalData.HOST;
const userInfo = wx.getStorageSync('userInfo')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: baseUrl,
    barcodes:[],
    num:''
  },

  goToAddScode(){
    wx.navigateTo({
      url: '/pages/scode_manage/add_scode/add_scode',
    })
  },
  edit:function(e){
    console.log(e)
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/scode_manage/add_scode/add_scode?id='+id,
    })
  },
  /*
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this
    //获取绑定商品列表
    wx.request({
      url: baseUrl + '/barcodes',
      success:function(res){
        _this.setData({
          barcodes:res.data.data.data,
          num: res.data.data.meta.count
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