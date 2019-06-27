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
    bind_tracing:[],
    showDialog: false,
    switch_title:'绑定商品',
    switch_checked:true,
    tracing_products:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  switchOnChange: function(e) {
    this.setData({
      switch_title: e.detail ? '绑定商品' : '绑定小溯源袋',
      switch_checked: e.detail,
      showPicker:false
    })
  },
  addScode:function(e){
    wx.scanCode({
      success: (res) => {
        let id = res.result.split('id=')[1]
        wx.request({
          url: baseUrl + '/tracings/' + id,
          success:res=>{
            let temp = res.data.data.data._id
            let ownerId = res.data.data.data.owner._id
            if (ownerId == userInfo.user_id){
              let arr = this.data.tracing_products
              console.log(arr.indexOf(temp))
              if (arr.length == 0 ||arr.indexOf(temp)==-1){
                arr.push(temp)
                this.setData({
                  tracing_products: arr
                })
              }else{
                wx.showToast({
                  title: '请勿重复绑定相同的小溯源码',
                  icon: 'none',
                  duration: 2000,
                })
                return
              }
              let _this = this
              wx.showModal({
                title: '提示',
                content: '添加成功',
                // showCancel: false,
                confirmText: '再次绑定',
                success(res) {
                  if (res.confirm) {
                    _this.addScode()
                  }
                }
              })
            }else{
              wx.showToast({
                title: '非自己的溯源码不能绑定',
                icon: 'none',
                duration: 2000,
              })
            }
            
          }
        })
        
      }
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
  deleteTracing: function (e) {
    let index = e.target.dataset.index
    let goods_temp = this.data.tracing_products
    goods_temp.splice(index, 1)
    this.setData({
      tracing_products: goods_temp
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
    let tracingData = {
      operation: 'bind',
      isFactoryTracing: true,
      tracing_products: _this.data.tracing_products
    }
    wx.request({
      url: baseUrl + '/tracings/' + _this.data.id,
      method: 'put',
      data: _this.data.switch_checked ? commitData : tracingData,
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
    let id = options.id || '01bc689ae6af0ac3856be4b048b39f52b2c5c9b5613432962b608051026f2918483b10eb97993fb66c320bdfc45f7c3ea43605d09e50ae3d0ea40153569b938c32'
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
                  isBind: isBind,
                  bind_goods: result.products,
                  bind_tracing: result.tracing_products
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
                if (!isBind) _this.openPicker()
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