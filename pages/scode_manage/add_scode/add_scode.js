// pages/scode_manage/add_scode/add_scode.js
const app = getApp();
const baseUrl = app.globalData.HOST;
const userInfo = wx.getStorageSync('userInfo')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scode:{},
    scodes:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onChange: function (e) {
    console.log(e)
    let dataset = e.target.dataset
    this.data[dataset.obj][dataset.item] = e.detail.value
  },
  getScode: function () {
    const _this = this;
    // 允许从相机和相册扫码
    wx.scanCode({
      success: (res) => {
        console.log(res)
        _this.setData({
          scodes: res.result
        })
      }
    })
  },
  commit:function(){
    let initData = this.data.scode
    initData.attributes=[{
      name: initData.attributes_name,
      value: initData.attributes_value
    }]
    delete initData.attributes_name
    delete initData.attributes_value
    wx.request({
      url: baseUrl +'/barcodes',
      method:"post",
      data: initData,
      success:function(res){

      }
    })
  },
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