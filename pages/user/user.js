// pages/user/user.js
const app = getApp();
const baseUrl = app.globalData.HOST;
import Dialog from '../../miniprogram_npm/vant-weapp/dialog/dialog';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl,
    userList: [],
    currentUser: {}
  },

  commitVerify: function (res) {
    const {
      id,
      dataset
    } = res.target
    Dialog.confirm({
      title: '用户审核',
      message: `${dataset.state === 'rejected' ? '确认拒绝该用户的审核？' : '确认通过该用户的审核？'}`
    }).then(() => {
      wx.showLoading()
      wx.request({
        url: `${baseUrl}/users/${id}`,
        method: 'PUT',
        data: {
          state: dataset.state,
          operation: 'state'
        },
        header: {
          'content-type': 'application/json',
        },
        success: res => {
          wx.hideLoading()
          this.onLoad()
        },
        error: error => {
          wx.hideLoading()
        }
      })
    }).catch(() => {
      return
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const _this = this;
    wx.showLoading()
    wx.request({
      url: baseUrl + '/users?state=unreview',
      success: res => {
        wx.hideLoading()
        const {
          data
        } = res.data.data
        const convertedUser = [];
        data.forEach(function (item) {
          const {
            state,
            last_login,
            role_type
          } = item
          const user_data = item[role_type]
          let desc = ''
          if (state === 'unreview') item.state = '未审核'
          if (role_type === 'business') {
            item.role_name = '经销商'
          } else if (role_type === 'factory') {
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
        _this.setData({
          userList: convertedUser
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