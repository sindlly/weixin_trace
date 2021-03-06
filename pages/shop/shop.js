// pages/shop/shop.js
const app = getApp();
const baseUrl = app.globalData.HOST;
Page({

  /**
   * 页面的初始数据
   */
  data: {
      baseUrl:baseUrl,
      goods:[
      ],
    imageURL:'../../../img/bigdata.png'

  },
  //购买商品
  buy:function(data){
    
    let id = data.target.dataset.id
    wx.navigateTo({
      // url: '/pages/order_manage/order_manage?active=2'
      url: '/pages/order/order?id='+id
    })
  },
  preview:function(data){
    var _this = this;
    wx.getImageInfo({
      src: data.currentTarget.dataset.url,
      success: function (res) {
      }
    })
  
    // let urls = []
    // urls[0] = data.currentTarget.dataset.url
    // wx.previewImage({
    //   current: data.currentTarget.dataset.url, //当前图片地址
    //   urls: urls
    // })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this
    //获取商品列表
    wx.request({
      url: baseUrl+'/commodities', 
      success(res) {
       _this.setData({
         goods:res.data.data.data
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