// pages/bigdata/bigdata.js
const app = getApp();
const baseUrl = app.globalData.HOST;
const userInfo = wx.getStorageSync('userInfo')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: baseUrl,
    count: 0,
    counterfeits: [],
    results: ['误把新包装当做假货', '其它']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 获假货
    wx.request({
      url: baseUrl + '/counterfeits?state=UNHANDLED',
      success: res => {
        const data = res.data.data
        this.setData({
          count: data.meta.count,
          counterfeits: data.data
        })
      }
    })
  },

  closeCase: function(e) {
    const {
      id
    } = e.target.dataset
    const {
      results
    } = this.data
    wx.showActionSheet({
      itemList: results,
      success(res) {
        wx.request({
          url: baseUrl + '/counterfeits/' + id,
          method: 'put',
          data: {
            state: 'RESOLVED',
            result: results[res.tapIndex]
          },
          success: function(res) {
            if (res.data.code === 0) {
              wx.showToast({
                title: '结案成功',
                icon: 'none',
                duration: 2000,
              })
              this.onLoad()
            } else {
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 2000
              })
            }
          },
          fail: function(error) {
            wx.showToast({
              title: error,
              icon: 'none',
              duration: 2000
            })
          }
        })
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})