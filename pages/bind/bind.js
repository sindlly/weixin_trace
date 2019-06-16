// pages/check/check.js
const app = getApp();
const baseUrl = app.globalData.HOST;
const userInfo = wx.getStorageSync('userInfo')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    baseUrl: baseUrl,
    switch_title: '发货至经销商',
    switch_checked: true,
    showPicker: false,
    columns: [],
    goods: [],
    isBind: false,
    bind_goods: [],
    showDialog: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  switchOnChange: function(e) {
    this.setData({
      switch_title: e.detail ? '发货至经销商' : '发货给消费者',
      switch_checked: e.detail
    })
  },
  openPicker: function() {
    this.setData({
      showPicker: true
    })
  },
  picked: function(event) {
    const {
      picker,
      value,
      index
    } = event.detail
    let goods_temp = this.data.goods
    goods_temp.push(value)
    this.setData({
      showPicker: false,
      goods: goods_temp

    })
  },
  onCancel: function() {
    this.setData({
      showPicker: false,
    })
  },
  deleteGoods: function(e) {
    let index = e.target.dataset.index
    let goods_temp = this.data.goods
    goods_temp.splice(index, 1)
    this.setData({
      goods: goods_temp
    })
  },
  gohome: function() {
    wx.reLaunch({
      url: '/pages/home/home',
    })
  },
  commit: function() {
    let _this = this
    let goods = this.data.goods
    let products = []
    for (let i = 0; i < goods.length; i++) {
      products[i] = goods[i].value
    }
    let commitData = {
      operation: 'bind',
      products: products,
    }
    wx.request({
      url: baseUrl + '/tracings/' + _this.data.id,
      method: 'put',
      data: commitData,
      success: function(res) {
        if (res.data.code == 0) {
          wx.showToast({
            title: '绑定成功',
            icon: 'success',
            duration: 2000,
            success: () => {
              wx.reLaunch({
                url: '/pages/home/home',
              })
            }
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000,
          })
        }

      }
    })
  },
  onLoad: function(options) {
    let id = options.id || '01422ec7950351540937c7b9876a22c3fe990bc489626e0ead1fefd85df0b9e63cdf94360e7d0d610664387615946e79746732f0ba3de5ab0f93efa45f02dcaada'
    this.setData({
      id: id
    })
    wx.request({
      url: baseUrl + '/tracings/' + id,
      success: res => {
        const isBind = res.data.data.data.state == "UNBIND" ? false : true;
        this.setData({
          isBind,
          bind_goods: res.data.data.data.products
        })
        if (isBind) {
          wx.showToast({
            title: '',
            icon: 'none',
            duration: 2000,
          })
        }
      }
    })
    wx.request({
      url: baseUrl + '/barcodes',
      success: res => {
        let temp = res.data.data.data
        let goods_temp = []
        for (let i = 0; i < temp.length; i++) {
          goods_temp[i] = {
            text: temp[i].name,
            value: temp[i]._id,
          }
        }
        this.setData({
          columns: goods_temp
        })
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