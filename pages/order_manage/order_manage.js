// pages/order_manage/order_manage.js
const app = getApp();
const baseUrl = app.globalData.HOST;
const userInfo = app.globalData.userInfo;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    all_goods: [{ tag: 1 }, { tag: 2 }, { tag: 3 }, { tag: 4 }, { tag: 1 }, { tag: 2 }, { tag: 3 }, { tag: 4 }],
    daibaojia_goods: [{ tag: 1 }, { tag: 1 }, { tag: 1 }, { tag: 1 }],
    daifukuan_goods: [{ tag: 2 }, { tag: 2 }, { tag: 2 }, { tag: 2 }],
    daifahuo_goods: [{ tag: 3 }, { tag: 3 }, { tag: 3 }, { tag: 3 }],
    yifahuo_goods: [{ tag: 4 }, { tag: 4 }, { tag: 4}, { tag: 4 }],
    active:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this
      this.setData({
        active:options.active||0
      }) 
    wx.request({
      url: baseUrl + '/orders',
      method: "get",
      header: {
        'content-type': 'application/json',
        // 'access_token': $data.token,
      },
      success: function (res) {
        let temp = res.data.data.data
        _this.setData({
          all_goods:temp
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