// pages/regest/regest.js
const app = getApp();
const baseUrl = app.globalData.HOST;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    business: {
      address: null,
      name: null,
      phone: null,
      contact: null,
    },
    inviter:'',
    imgSrc: null,
  },
  onChange: function(e) {
    let dataset = e.target.dataset
    this.data[dataset.obj][dataset.item] = e.detail
  },
  commit: function() {
    let _this = this
    if (_this.validate(this.data.business)) {
      wx.request({
        url: baseUrl + '/users',
        method: "POST",
        header: {
          'content-type': 'application/json'
        },
        data: {
          role_type: 'business',
          role_id: 30,
          business: _this.data.business,
          inviter: _this.data.inviter
        },
        success(res) {
          if (res.data.code == 0) {
            wx.showModal({
              title: '恭喜您',
              content: '注册成功，等待管理员审核',
              showCancel: false,
              success(res) {
                if (res.confirm) {
                  wx.reLaunch({
                    url: '/pages/home/home'
                  })
                }
              }
            })
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 1000
            })
          }
        }
      })
    }
  },
  //校验
  validate(data) {
    let flag = true
    //校验有空数据
    for (let i in data) {
      if (!data[i]) {
        flag = false
        wx.showToast({
          title: '请填写所有内容',
          icon: 'none',
          duration: 1000
        })
        break;
      }
    }
    return flag
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      inviter: options.invat_id
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