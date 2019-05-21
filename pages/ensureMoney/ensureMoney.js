// pages/pay/pay.js
const app = getApp();
const baseUrl = app.globalData.HOST;
const userInfo = app.globalData.userInfo;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: baseUrl,
    id:'',
    status:null,
    imgSrc:'',
    trade:{
      sponsor:null,
      voucher:null,
      type:null,
      number:null
    },
  },

  commit: function () {
    let commit_data = {}
    //核收首付
    if (this.data.status !="ALL_PAYED"){
      commit_data={
        "status": "PAYMENT_CONFIRMED",
        "isFirstPaymentConfirmed":true
      }
    }else{
      commit_data = {
        "status": "PAYMENT_CONFIRMED",
        "isAllPaymentConfirmed": true
      } 
    }
    wx.request({
      url: baseUrl + '/orders/' + this.data.id,
      method: 'put',
      data: commit_data,
      success: function () {
        wx.navigateTo({
          url: '/pages/order_manage/order_manage?active=3',
        })
      }
    })
  },
  previewImage:function(){
    wx.previewImage({
      current: this.data.imgSrc, // 当前显示图片的http链接
      urls: [this.data.imgSrc] // 需要预览的图片http链接列表
    })
  },


  onLoad: function (options) {
    let id = options.id
    let _this = this
    _this.data.id = id;
    
    _this.data.trade.type = "ALL_PAYED"
    wx.request({
      url: baseUrl + '/orders/' + id + '?embed=platform',
      success: function (res) {
        let data = res.data.data.data
        _this.data.status = res.data.data.data.status
        _this.setData({
          goods: data, 
          imgSrc:baseUrl+'/files/'+data.trade[0].voucher
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