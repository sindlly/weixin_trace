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
  onLoad: function (options) {
    wx.showLoading()
    let type = options.type || "outer_code" //inner_code outer_code
    let id = options.id || '0110c64a7cb7f8048e6a1071095c3926d64209dfe2e600c021616b15aa5b7a088c385a526970c3910e249d847e61f90248935ca77aa733019dccf880b3adb97ed9'
    this.data.id = id
    wx.request({
      url: baseUrl + '/tracings/' + id,
      success:res=>{
        let data = res.data.data.data
        // 溯源袋内码
        if (type == "inner_code"){
          //都跳到绑定商品页，若已绑定，只显示列表，不能进行操作
            wx.reLaunch({
              url: '/pages/bind/bind?id=' + id,
            })
          
        }
        // 溯源码外袋
        if (type == "outer_code") {
          switch (data.state){
            case "UNBIND": //未绑定商品
                // todo 
                // 提示未绑定商品
                wx.hideLoading();
                wx.showToast({
                  title: '未绑定商品',
                  duration: 2000,
                  success:function(){
                    wx.reLaunch({
                      url: '/pages/home/home',
                    })
                  }
                })
                break;
            case "BIND": 
              //TODO
              wx.reLaunch({
                url: '/pages/send/send?id=' + id,
              })
              break;
            case "SEND": //经销商已发货
              //TODO
              wx.reLaunch({
                url: '/pages/check/check?id=' + id,
              })
              break;
            case "EXPRESSED": //已绑定快递信息
              //TODO
              wx.reLaunch({
                url: '/pages/send/send?id=' + id,
              })
              break;
            case "REVEIVED": //客户已收回
              //TODO
              break; 

          }
          
          if (data.steate == "UNBIND") {
            
          }else{

          }
        }
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