// pages/regest/regest.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    courier: {
      company: null,
      name: null,
      phone: null,
      email: null,
      id_card: null,     
    },
    imgSrc: null,
  },
  uploadImg: function () {
    var _this = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        _this.data.courier.id_card = res.tempFilePaths[0]
        _this.setData({
          imgSrc: res.tempFilePaths[0],
        })
      }
    })
  },
  onChange: function (e) {
    // console.log(e)
    let dataset = e.target.dataset
    this.data[dataset.obj][dataset.item] = e.detail
  },
  commit: function () {
    console.log(this.data.courier)
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