// pages/regest/regest.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      business:{
       name:null,
       public_account:null,
       email:null,
       contact:null,
       phone:null,
       license:null,
       receiving_info:{
        name:null,
        phone:null,
        address:null
       },
      },
    imgSrc:null
  },
  uploadImg: function () {
    var _this = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        _this.data.business.license = res.tempFilePaths[0]
        _this.setData({
          imgSrc : res.tempFilePaths[0]
        })
      }
    })
  },
  onChange:function(e){
    // console.log(e)
    let dataset = e.target.dataset
    this.data[dataset.obj][dataset.item] = e.detail
  },
  onChange2:function(e){
    let temp = e.target.dataset.obj
    let dataset = temp.split(".")
    this.data[dataset[0]][dataset[1]][dataset[2]] = e.detail
  },
  commit:function(){
    console.log(this.data.business)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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