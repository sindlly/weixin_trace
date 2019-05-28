// pages/tracing/tracing.js
const app = getApp();
const baseUrl = app.globalData.HOST;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl,
    userList: [{
      state: ''
    }],
    currentUser: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const _this = this;
    wx.showLoading() // loading
    wx.request({
      url: baseUrl + '/users?state=unreview',
      success: res => {
        wx.hideLoading() // 隐藏loading 
        const { data } = res.data.data
        console.log(data)
        const convertedUser = [];
        data.forEach(function(item){
          const { state, last_login, role_type} = item
          const user_data = item[role_type]
          let desc = ''
          if (state === 'unreview') item.state = '未审核'
          if(role_type === 'business') {
            item.role_name = '经销商'
          } else if (role_type === 'platform') {
            item.role_name = '厂家'
          } else if (role_type === 'courier') {
            item.role_name = '快递'
          } else {
            item.role_name = '销售'
          }
          item.regTime = `${new Date(last_login).toLocaleString()}`
          item.desc = desc
          convertedUser.push(item)
        })
        console.log(convertedUser)
        _this.setData({ userList: convertedUser})
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