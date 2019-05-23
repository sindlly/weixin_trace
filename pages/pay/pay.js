// pages/pay/pay.js
const app = getApp();
const baseUrl = app.globalData.HOST;
const userInfo = app.globalData.userInfo;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: baseUrl,
    id:'',
    imgSrc:'',
    trade:{
      sponsor:null,
      voucher:null,
      type:null,
      number:null
    },
    status: '', // FIRST_PAYED 首付已付
  },

  onChange: function (e) {
    let dataset = e.target.dataset
    this.data[dataset.obj][dataset.item] = e.detail
  },
  uploadImg: function () {
    var _this = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        _this.data.trade.voucher = res.tempFilePaths[0]
        _this.setData({
          imgSrc: res.tempFilePaths[0],
        })
      }
    })
  },
  commit: function () {
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
          _this.data.trade.voucher = JSON.parse(res.data).data.data.id

          wx.request({
            url: baseUrl + '/orders/' + _this.data.id,
            method: "put",
            header: {
              'content-type': 'application/json'
            },
            data: {
              status: _this.data.trade.type == "ALL_PAYED" ? "ALL_PAYED" :"FIRST_PAYED",
              trade:[_this.data.trade]
              
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
              }
              else {
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none',
                  duration: 1000
                })
              }
            },
            catch(res){
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
  //校验
  validate(data) {
    let flag = true
    //校验有空数据
    // debugger;
    for (let i in data) {
      console.log(i+":"+data[i])
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
  onLoad: function (options) {
    let id = options.id
    let _this = this
    _this.data.id = id;
    wx.request({
      url: baseUrl + '/orders/' + id + '?embed=salesman',
      success: function (res) {
        let data = res.data.data.data
        _this.data.status = res.data.data.data.status
        if (_this.data.status == "FIRST_PAYED") {
          wx.setNavigationBarTitle({
            title: '尾款明细'
          })
        } else {
          wx.setNavigationBarTitle({
            title: '付款明细'
          })
        }
        _this.data.trade.type = data.isStagePay ?"FIRST_PAYED":"ALL_PAYED"  //是否是定制商品，定制商品需首付，一般商品付全款
        _this.setData({
          goods: data,
          status: res.data.data.data.status
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