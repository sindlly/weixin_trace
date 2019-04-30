// pages/shop/shop.js
const app = getApp();
const baseUrl = app.globalData.HOST;
Page({

  /**
   * 页面的初始数据
   */
  data: {
      goods:[
        {
          name:"商品名",
          standard:"20cm*20cm",
          price:"20.00",
          act_price:'10.00',
        },
        {
          name: "商品名",
          standard: "20cm*20cm",
          price: "20.00",
          act_price: '10.00',
        }
      ],
    imageURL:'../../../img/bigdata.png'

  },
  //购买商品
  buy:function(){
    wx.navigateTo({
      url: '/pages/order_manage/order_manage?active=2'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取商品列表
    wx.request({
      url: baseUrl+'/commodities', 
      success(res) {
        console.log(res.data)
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