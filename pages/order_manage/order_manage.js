// pages/order_manage/order_manage.js
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
      this.setData({
        active:options.active
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