// pages/setPrice/setPrice.js
const app = getApp();
const baseUrl = app.globalData.HOST;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:"",
    remark:'',
    radio:"1",
    id:'',
    obj:{
      status:'QUOTED'
    },
  },
  changeRadio:function(res){
    this.setData({
      radio:res.detail
    })
  },
  onChange: function (e) {
    // console.log(e)
    let dataset = e.target.dataset
    this.data[dataset.obj][dataset.item] = parseFloat(e.detail)
  },
  commit: function(){
    wx.request({
      url: baseUrl + '/orders/' +this.data.id,
      method:'put',
      data:this.data.obj,
      success:function(){
        wx.navigateTo({
          url: '/pages/order_manage/order_manage?active=2',
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id
    this.data.id = id
    let _this = this
    wx.request({
      url: baseUrl + '/orders/' + id + '?embed=salesman',
      success: function (res) {
        let data = res.data.data.data

        _this.setData({
          imgUrl: baseUrl + '/files/'+data.logo,
          remark: data.remarks
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