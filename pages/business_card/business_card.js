// pages/business_card/business_card.js
const app = getApp();
const baseUrl = app.globalData.HOST;
const userInfo = wx.getStorageSync('userInfo')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgSrc: '',
    bannerId: '', // banner图地址
    baseUrl
  },

  uploadImg: function () {
    var _this = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        _this.data.imgSrc = res.tempFilePaths[0]
        _this.setData({
          imgSrc: res.tempFilePaths[0],
        })
      }
    })
  },

  commit: function () {
    let _this = this
    if (this.data.imgSrc) {
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
            url: baseUrl + '/users/' + userInfo.user_id,
            method: "put",
            header: {
              'content-type': 'application/json'
            },
            data: {
              operation: 'banner',
              banner: _this.data.bannerId
            },
            success(res) {
              if (res.data.code == 0) {
                wx.showModal({
                  title: '提示',
                  content: '广告图上传成功',
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
    } else {
      wx.showToast({
        title: '请选择您要上传的广告图',
        icon: 'none',
        duration: 1000
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.request({
      url: baseUrl + '/users/' + userInfo.user_id,
      success: res => {
        const {
          data
        } = res.data.data
        const roleType = data.role_type
        this.setData({
          bannerId: data[roleType].banner
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