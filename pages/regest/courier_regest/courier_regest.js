// pages/regest/regest.js
const app = getApp();
const baseUrl = app.globalData.HOST;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    courier: {
      company: null,
      name: null,
      phone: null,
      email: null,
      employee_card: null,
    },
    imgSrc: null,
    errorMsg: {
      company: null,
      name: null,
      phone: null,
      email: null,
      employee_card: null,
    }
  },
  uploadImg: function() {
    var _this = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        _this.data.courier.employee_card = res.tempFilePaths[0]
        _this.setData({
          imgSrc: res.tempFilePaths[0],
        })
      }
    })
  },
  onChange: function(e) {
    let dataset = e.target.dataset
    this.data[dataset.obj][dataset.item] = e.detail.value
  },
  commit: function() {
    let _this = this
    _this.validate(this.data.courier)
    if (_this.validate(this.data.courier)) {
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
          _this.data.courier.employee_card = JSON.parse(res.data).data.data.id
          wx.request({
            url: baseUrl + '/users',
            method: "POST",
            header: {
              'content-type': 'application/json'
            },
            data: {
              role_type: 'courier',
              role_id: 50,
              courier: _this.data.courier
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
              } else if (res.data.code == 10004) {
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none',
                  duration: 2000,
                  success: function() {
                    setTimeout(() => {
                      wx.reLaunch({
                        url: '/pages/home/home'
                      })
                    }, 1000)
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