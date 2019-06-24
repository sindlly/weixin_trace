// pages/tracing/tracing.js
const app = getApp();
const baseUrl = app.globalData.HOST;
Page({

  /**
   * 页面的初始数据
   */
  data: {
      isOwner:false   //是否是自己的溯源码
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading()
    let _this = this
    let type = options.type || "inner_code" //inner_code outer_code
    let id = options.id ||"01e334c66086b1bb76ae31fd099207113d74a6f2a1d82eadab492fe7a87b2ed89904b9897c23aaad7b365295400396f1fedb87e6e215d70ecec3721e9ac083f931"
    if(options.q){
      let q = decodeURIComponent(options.q)
      type = q.split("?")[1].split("&")[0].split("=")[1]
      id = q.split("?")[1].split("&")[1].split("=")[1]
    }
  
    this.data.id = id
    wx.request({
      url: baseUrl + '/tracings/' + id,
      success: res => {
        wx.hideLoading()
        if (res.data.code === 0) {
          let data = res.data.data.data
          _this.data.isOwner = data.owner._id == wx.getStorageSync('userInfo').user_id?true:false
          debugger
          // 溯源袋内码
          if (type == "inner_code") {
            //都跳到绑定商品页，若已绑定，只显示列表，不能进行操作
            if (_this.data.isOwner){
              wx.reLaunch({
                url: '/pages/bind/bind?id=' + id,
              })
            }else{
              wx.showToast({
                title: '非自己的溯源码，不能进行绑定操作',
                duration: 3000,
                icon: 'none',
                complete: function () {
                  setTimeout(() => {
                    wx.reLaunch({
                      url: '/pages/home/home',
                    })
                  }, 2000)
                }
              })
            }
            
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
              //自己跳到发送页，其他人跳到check页
              if(_this.data.isOwner){
                wx.reLaunch({
                  url: '/pages/send/send?id=' + id,
                })
              }else{
                wx.reLaunch({
                  url: '/pages/check/check?id=' + id,
                })
              } 
                break;
              case "SEND": //经销商已发货
                if (wx.getStorageSync("userInfo").role_type == "courier"){
                  wx.reLaunch({
                    url: '/pages/send/send?id=' + id,
                  })
                }else{
                  wx.reLaunch({
                    url: '/pages/check/check?id=' + id,
                  })
                }
                
                break;
              case "EXPRESSED": //已绑定快递信息
                wx.reLaunch({
                  url: '/pages/check/check?id=' + id,
                })
                break;
              case "RECEIVED": //客户已收货
                //如果是经销商，则跳到send页
                if(wx.getStorageSync("userInfo").role_type=="business"){
                  wx.reLaunch({
                    url: '/pages/send/send?id=' + id,
                  })
                }else{
                  wx.reLaunch({
                    url: '/pages/check/check?id=' + id,
                  })
                }
                break;
            }
          }
        } else {
          wx.showToast({
            title: res.data.msg,
            duration: 3000,
            icon: 'none',
            success:function(){
              wx.reLaunch({
                url: '/pages/home/home',
              })
            }
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