// pages/business_card/business_card.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgSrc: '',
    bannerId: '' // banner图地址
  },

  uploadImg: function() {
    var _this = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        _this.data.imgSrc = res.tempFilePaths[0]
        _this.setData({
          imgSrc: res.tempFilePaths[0],
        })
      }
    })
  },

  commit: function() {
    let _this = this
    // _this.validate(this.data.trade)
    if (_this.validate(this.data.trade)) {
      //先上传图片数据
      wx.uploadFile({
        url: baseUrl + '/files',
        method: "POST",
        filePath: _this.data.imgSrc,
        name: "files",
        header: {
          'content-type': 'application/json'
        },
        success(res) {
          _this.data.bannerId = JSON.parse(res.data).data.data.id
          wx.request({
            url: baseUrl + '/users/' + _this.data.id,
            method: "put",
            header: {
              'content-type': 'application/json'
            },
            data: {
              status: _this.data.trade.type == "ALL_PAYED" ? "ALL_PAYED" : "FIRST_PAYED",
              trade: [_this.data.trade]

            },
            success(res) {
              if (res.data.code == 0) {
                wx.showModal({
                  title: '提示',
                  content: '提交成功，等待审查',
                  showCancel: false,
                  success(res) {
                    if (res.confirm) {
                      wx.redirectTo({
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
            },
            catch (res) {
              wx.showToast({
                title: res.msg,
                icon: 'none',
                duration: 1000
              })
            }
          })
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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