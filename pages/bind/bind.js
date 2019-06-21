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
    const _this = this
    let id = options.id || '018d3dfe2f4ef80eef3e0ee813bfa8918550c2bb0fc09d74b5869151847c5369cb711b2e032d06290aea80fda3d4aebbeb0b9c199b5cf2b1b65a15dd4b6ca1aaac'
    _this.setData({
      id: id
    })
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.showLoading()
        wx.request({
          url: baseUrl + '/auth/login',
          method: "post",
          data: {
            "code": res.code
          },
          success: function(res) {
            wx.hideLoading()
            let role_type = ''
            let user_id = ''
            const result = res.data.data.data
            if (result.isRegistered == false) {
              role_type = 4
            } else {
              role_type = result.user.role_type
              user_id = result.user._id
            }
            const userInfo = {
              role_type: role_type,
              user_id: user_id
            }
            wx.setStorageSync('userInfo', userInfo)
            wx.request({
              url: baseUrl + '/tracings/' + id,
              success: res => {
                const result = res.data.data.data
                const isBind = result.state == "UNBIND" ? false : true;
                const hasBindRight = result.owner._id === userInfo.user_id
                _this.setData({
                  isBind,
                  bind_goods: result.products
                })
                if (!hasBindRight) {
                  wx.showToast({
                    title: '你不是我的主人，无法使用该内码',
                    icon: 'none',
                    duration: 2000,
                    success: () => {
                      setTimeout(() => {
                        wx.reLaunch({
                          url: '/pages/home/home',
                        })
                      }, 1000)
                    }
                  })
                } else {
                  if (isBind) {
                    wx.showToast({
                      title: '您已经绑定过商品，无法再次绑定',
                      icon: 'none',
                      duration: 2000,
                    })
                  }
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
                _this.setData({
                  columns: goods_temp
                })
                _this.openPicker()
              }
            })
          }
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