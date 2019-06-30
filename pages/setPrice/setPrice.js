// pages/setPrice/setPrice.js
const app = getApp();
const baseUrl = app.globalData.HOST;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: "",
    remark: '',
    radio: "1",
    id: '',
    obj: {
      status: 'QUOTED'
    },
  },
  changeRadio: function(res) {
    this.setData({
      radio: res.detail
    })
  },
  onChange: function(e) {
    let dataset = e.target.dataset
    if (['stageProportion', 'commisionProportion'].includes(dataset.item)) {
      this.data[dataset.obj][dataset.item] = parseFloat(e.detail / 100)
    } else {
      this.data[dataset.obj][dataset.item] = parseFloat(e.detail)
    }
  },
  commit: function() {
    const {
      stageProportion,
      commisionProportion,
      price
    } = this.data.obj
    if (!stageProportion || stageProportion < 0 || stageProportion > 1) {
      wx.showToast({
        title: '首付比例需在0~100范围内',
        icon: 'none'
      })
      return
    }
    if (!commisionProportion || commisionProportion < 0 || commisionProportion > 1) {
      wx.showToast({
        title: '抽佣比例需在0~100范围内',
        icon: 'none'
      })
      return
    }
    if (!price || typeof price != 'number') {
      wx.showToast({
        title: '请填写报价',
        icon: 'none'
      })
      return
    }
    wx.request({
      url: baseUrl + '/orders/' + this.data.id,
      method: 'put',
      data: this.data.obj,
      success: function(res) {
        if (res.data.code === 0) {
          wx.navigateTo({
            url: '/pages/order_manage/order_manage?active=2',
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          });
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let id = options.id
    this.data.id = id
    let _this = this
    wx.request({
      url: baseUrl + '/orders/' + id + '?embed=salesman',
      success: function(res) {
        let data = res.data.data.data
        _this.setData({
          imgUrl: baseUrl + '/files/' + data.logo,
          remark: data.remarks
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