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
    remarks: {
      product: '',
      width: '',
      height: '',
      length: '',
      thick: '',
    },
    factories: [],
    selectFactories: [], 
    logo: null
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
  onChange: function(e) {
    let dataset = e.target.dataset
    this.remarks = e.detail.value
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
    console.log(this.data)
  },
  submitOrder: function() {
    let _this = this;
    wx.showToast({
      title: '',
      mask: true,
      icon: 'loading'
    })

    if (_this.data.goods_detail.isCustom) {
      wx.uploadFile({
        url: baseUrl + '/files',
        method: "POST",
        filePath: _this.data.imgSrc,
        name: "files",
        header: {
          'content-type': 'application/json'
        },
        success(res) {
          _this.logo = JSON.parse(res.data).data.data.id
          let subData = {
            commodity: _this.data.commodityId,
            count: _this.data.count,
            buyer: userInfo.user_id,
            remarks: _this.remarks,
            logo: _this.logo,
          }
          wx.request({
            url: baseUrl + '/orders',
            method: "post",
            data: subData,
            header: {
              'content-type': 'application/json',
            },
            success: function(res) {
              wx.reLaunch({
                url: '/pages/order_manage/order_manage'
              })
            }
          })
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
          wx.reLaunch({
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
        const {users} = res.data.data.data
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