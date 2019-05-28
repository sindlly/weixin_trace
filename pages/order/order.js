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
    goods_detail:{},
    baseUrl: baseUrl,
    remark:null,
    logo:null
  },

  countMinus: function () {
    if (this.data.count > 1) this.setData({
      count: this.data.count - 1
    })
    else this.setData({
      disabled: true,
    })
  },

  countAdd: function () {
    this.setData({
      count: this.data.count + 1,
      disabled: false
    })
  },
  onChange: function (e) {
    let dataset = e.target.dataset
    this.remark = e.detail.value
  },
  uploadImg: function () {
    var _this = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        _this.setData({
          imgSrc: res.tempFilePaths[0],
        })
      }
    })
  },
  submitOrder: function () {
    let _this = this;
    wx.showToast({
      title: '',
      mask: true,
      icon: 'loading'
    })
    
    if (_this.data.goods_detail.isCustom){
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
            remarks: _this.remark,
            logo: _this.logo,
          }
          wx.request({
            url: baseUrl + '/orders',
            method: "post",
            data: subData,
            header: {
              'content-type': 'application/json',
              // 'access_token': $data.token,
            },
            success: function (res) {
              wx.navigateTo({
                url: '/pages/order_manage/order_manage'
                // url: '/pages/order_manage/order_manage?active=2'
                // url: '/pages/order/order'
              })
            }
          })
        }
      })
    }else{
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
          // 'access_token': $data.token,
        },
        success: function (res) {
          wx.navigateTo({
            url: '/pages/order_manage/order_manage'
            // url: '/pages/order_manage/order_manage?active=2'
            // url: '/pages/order/order'
          })
        }
      })
    }
    
    
    
  },

  onLoad: function (options) {
    const id = options.id
    const _this = this
    _this.setData({
      commodityId:id
    })
    // 设置用户信息及token
    // _this.setData({
    //   userInfo,
    //   token
    // })

    wx.request({
      url: baseUrl+'/commodities/'+id,
      method: "GET",
      header: {
        'content-type': 'application/json',
        // 'access_token': $data.token,
      },
      success: function (res) {
        let temp = res.data.data.data
        _this.setData({
          goods_detail:temp
        })
      }
    })
  },

  onPullDownRefresh: function () {
    // const userInfo = wx.getStorageSync('user_info');
    // const _this = this;

    // _this.setData({
    //   userInfo
    // })
    // wx.stopPullDownRefresh();
  }
})