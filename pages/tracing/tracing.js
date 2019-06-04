// pages/tracing/tracing.js
const app = getApp();
const baseUrl = app.globalData.HOST;
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading()
    let type = options.type || "outer_code" //inner_code outer_code
    let id = options.id
    if(options.q){
      let q = decodeURI(options.q)
      type = q.split("?")[1].split("&")[0].split("=")[1]
      id = q.split("?")[1].split("&")[1].split("=")[1]
    }
    console.log(type)
    console.log("ssss")
    console.log(decodeURI(options.q))
    this.data.id = id
    wx.request({
      url: baseUrl + '/tracings/' + id,
      success: res => {
        wx.hideLoading()
        if (res.data.code === 0) {
          let data = res.data.data.data
          // 溯源袋内码
          if (type == "inner_code") {
            //都跳到绑定商品页，若已绑定，只显示列表，不能进行操作
            wx.reLaunch({
              url: '/pages/bind/bind?id=' + id,
            })
          }
          // 溯源码外袋
          else if(type == "outer_code") {
            switch (data.state) {
              case "UNBIND":
                // 提示未绑定商品
                wx.hideLoading();
                wx.showToast({
                  title: '该溯源码未绑定商品，无法进入溯源流程',
                  duration: 3000,
                  icon: 'none',
                  complete: function() {
                    setTimeout(() => {
                      wx.reLaunch({
                        url: '/pages/home/home',
                      })
                    }, 2000)
                  }
                })
                break;
              case "BIND":
                wx.reLaunch({
                  url: '/pages/send/send?id=' + id,
                })
                break;
              case "SEND": //经销商已发货
                wx.reLaunch({
                  url: '/pages/check/check?id=' + id,
                })
                break;
              case "EXPRESSED": //已绑定快递信息
                wx.reLaunch({
                  url: '/pages/send/send?id=' + id,
                })
                break;
              case "REVEIVED": //客户已收货
                wx.reLaunch({
                  url: '/pages/check/check?id=' + id,
                })
                break;
            }
          }
        } else {
          wx.showToast({
            title: res.data.msg,
            duration: 2000,
            icon: 'none'
          })
        }
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