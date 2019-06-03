const app = getApp();
const baseUrl = app.globalData.HOST;
const userInfo = wx.getStorageSync('userInfo');

Page({
  data: {
    commodity: null,
    commodityId: '',
    count: 1,
    totalPrice: 0,
    disabled: true,
    $root: app.globalData.ROOTPATH,
    DEFALUT_IMG: app.globalData.DEFALUT_IMG,
    token: '',
    goods_detail: {},
    baseUrl: baseUrl,
    product: '',
    width: '',
    height: '',
    length: '',
    thick: '',
    selectedFactory: '',
    factories: [],
    selectFactories: [],
    logo: null,
    index: undefined
  },

  validate(data) {
    let flag = true
    for (let i in data) {
      if (!data[i]) {
        flag = false
        wx.showToast({
          title: '请填写所有内容',
          icon: 'none',
          duration: 1000
        })
        break;
      } else {
        if (i === 'remarks') {
          this.validate(data[i])
        }
      }
    }
    return flag
  },

  countMinus: function() {
    if (this.data.count > 1) this.setData({
      count: parseInt(this.data.count) - 1
    })
    else this.setData({
      disabled: true,
    })
  },

  countAdd: function() {
    this.setData({
      count: parseInt(this.data.count) + 1,
      disabled: false
    })
    console.log(this.data)
  },

  // 商品信息
  onProductChange: function(e) {
    this.data.product = e.detail
  },
  onLengthChange: function(e) {
    this.data.length = e.detail
  },
  onWidthChange: function(e) {
    this.data.width = e.detail
  },
  onHeightChange: function(e) {
    this.data.height = e.detail
  },
  onThickChange: function(e) {
    this.data.thick = e.detail
  },

  uploadImg: function() {
    var _this = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        _this.setData({
          imgSrc: res.tempFilePaths[0],
        })
      }
    })
  },
  bindInput: function(e) {
    this.setData({
      count: e.detail.value
    })
  },
  pickerChange: function(e) {
    const selectedFactory = this.data.factories[e.detail.value]._id
    this.setData({
      selectedFactory,
      index: e.detail.value
    })
  },
  submitOrder: function() {
    let _this = this;
    wx.showLoading()
    if (_this.data.goods_detail.isCustom) {
      if (!this.data.imgSrc) {
        wx.showToast({
          title: '请上传logo',
          icon: 'none',
          duration: 1000
        })
        return
      }
      wx.uploadFile({
        url: baseUrl + '/files',
        method: "POST",
        filePath: _this.data.imgSrc,
        name: "files",
        header: {
          'content-type': 'application/json'
        },
        success(res) {
          _this.data.logo = JSON.parse(res.data).data.data.id
          let subData = {
            commodity: _this.data.commodityId,
            count: parseInt(_this.data.count),
            buyer: _this.data.selectedFactory,
            remarks: {
              product: _this.data.product,
              width: _this.data.width,
              height: _this.data.height,
              length: _this.data.length,
              thick: _this.data.thick,
            },
            logo: _this.data.logo,
          }
          console.log(subData)
          if (_this.validate(subData)) {
            wx.request({
              url: baseUrl + '/orders',
              method: "post",
              data: subData,
              header: {
                'content-type': 'application/json',
              },
              success: function(res) {
                wx.hideLoading()
                console.log(res)
                if (res.data.code === 0) {
                  wx.showToast({
                    title: '订单生成成功',
                    icon: 'none',
                    duration: 2000,
                    success: function() {
                      setTimeout(() => {
                        wx.navigateTo({
                          url: '/pages/order_manage/order_manage'
                        })
                      }, 1000)
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
          } else {
            wx.hideLoading()
          }
        }
      })
    } else {
      let subData = {
        commodity: _this.data.commodityId,
        count: _this.data.count,
        buyer: userInfo.user_id,
      }
      wx.request({
        url: baseUrl + '/orders',
        method: "post",
        data: subData,
        header: {
          'content-type': 'application/json',
        },
        success: function(res) {
          wx.navigateTo({
            url: '/pages/order_manage/order_manage'
          })
        }
      })
    }
  },

  onLoad: function(options) {
    const id = options.id
    const _this = this
    _this.setData({
      commodityId: id
    })
    //获取商品信息
    wx.request({
      url: baseUrl + '/commodities/' + id,
      method: "GET",
      header: {
        'content-type': 'application/json',
      },
      success: function(res) {
        let temp = res.data.data.data
        _this.setData({
          goods_detail: temp
        })
      }
    })
    // 获取被该用户邀请注册的
    wx.request({
      url: baseUrl + '/users/' + userInfo.user_id + '/factories',
      method: "GET",
      header: {
        'content-type': 'application/json',
      },
      success: function(res) {
        const {
          users
        } = res.data.data.data
        const selectFactories = users.map(item => {
          return item.factory.name
        })
        _this.setData({
          factories: users,
          selectFactories
        })
      }
    })
  },

  onPullDownRefresh: function() {
    // const userInfo = wx.getStorageSync('user_info');
    // const _this = this;

    // _this.setData({
    //   userInfo
    // })
    // wx.stopPullDownRefresh();
  }
})