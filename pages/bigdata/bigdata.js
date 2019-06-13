// pages/bigdata/bigdata.js
const app = getApp();
const baseUrl = app.globalData.HOST;
const userInfo = wx.getStorageSync('userInfo');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    mycode: {
      totalTracings: '',
      unUsedTracings: '',
      barcodes: '',
      role_type: userInfo.role_type
    },
    counterfeitsCount: 0
  },
  goToScode: function() {
    wx.navigateTo({
      url: '/pages/scode_manage/scode_manage'
    });
  },
  gotoMyInfo: function() {
    wx.navigateTo({
      url: '/pages/mySalesInfo/mySalesInfo'
    });
  },
  goToTracing: function() {
    wx.navigateTo({
      url: '/pages/bigdata/tracingManage/tracingManage'
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const userInfo = wx.getStorageSync('userInfo');
    wx.request({
      url: baseUrl + '/users/' + userInfo.user_id + '/statistics',
      success: res => {
        this.setData({
          mycode: res.data.data.data.data
        });
      }
    });

    // 获假货
    wx.request({
      url: baseUrl + '/counterfeits',
      success: res => {
        this.setData({
          counterfeitsCount: res.data.data.meta.count
        });
      }
    });
  },

  showCounterfeit: function() {
    wx.navigateTo({
      url: '/pages/bigdata/counterfeit/counterfeit'
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
});
