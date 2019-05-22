// pages/home/home.js
const app = getApp();
const baseUrl = app.globalData.HOST;
const userInfo = wx.getStorageSync('userInfo')


Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    home_type: userInfo.role_type  //1显示商家首页，2显示平台账号首页，3显示销售首页，4显示无账号首页，5显示快递员首页
  },
  // 二维码扫描验货
  check: function () {
    var _this = this;
    // 允许从相机和相册扫码
    wx.scanCode({
      success: (res) => {
        
      }
    })
    },
  //发货  
  send: function () {
    var _this = this;
    // 允许从相机和相册扫码
    wx.scanCode({
      success: (res) => {
        wx.navigateTo({
          url: '/pages/send/send'
          
        })
      }
    })
  },
  //跳转到店铺
  jump:function(){
    wx.navigateTo({
      url: '/pages/business_card/business_card',
    })
  },
  //跳转到溯源大数据页
  goToBigData:function(){
    wx.navigateTo({
      url: '/pages/bigdata/bigdata',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    // 所以此处加入 callback 以防止这种情况
    let _this = this;
    app.userInfoReadyCallback = res => {
      this.setData({
        userInfo: res.userInfo,
      })
    }
    // 确认用户类型
    _this.setData({
      home_type: userInfo.role_type
    })
   
    // wx.request({
    //   url: baseUrl+'/users', // 仅为示例，并非真实的接口地址
    //   success(res) {
    //     _this.setData({
    //       home_type:4
    //     })
    //     console.log("dd")
    //   }
    // })
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