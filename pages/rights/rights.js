// pages/home/home.js
const app = getApp();
const baseUrl = app.globalData.HOST;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    steps: [
      {
        text: '第一步',
        desc: '上传购买订单照片+商品实物照片'
      },
      {
        text: '第二步',
        desc: '描述商品造假鉴定过程',
      }
    ],
    imgSrc: null
  },
  // 二维码扫描
  getScancode: function () {
    var _this = this;
    // 允许从相机和相册扫码
    wx.scanCode({
      success: (res) => {
        
      }
    })
    },
  uploadImg: function () {
    var _this = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        _this.setData({
          imgSrc: res.tempFilePaths[0],
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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